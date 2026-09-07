import { CoastalTransect, HistoricalSurveyPoint, SatelliteTelemetry } from "../types";

export type ProjectionScenario = "baseline" | "storm_surge" | "nourishment";

export interface ProjectedSurveyPoint {
  monthOffset: number; // 1 to 6
  label: string; // e.g. "+1 Mo (Jul 2026)"
  date: string; // "2026-07-31"
  parsedDate: Date;
  val: number; // Selected metric value
  lowerCI: number; // 95% Confidence interval lower bound
  upperCI: number; // 95% Confidence interval upper bound
  shoreline_displacement_m: number;
  annual_retreat_rate_m_yr: number;
  beach_width_m: number;
  dune_crest_elevation_m: number;
  volumetric_loss_m3_m: number;
  satelliteMultiplier: number;
  uncertaintyBandWidth: number;
  isProjected: true;
}

export interface SatelliteProjectionSummary {
  accelerationMultiplier: number;
  sixMonthDisplacementDelta: number; // Net change over the 6 months (m)
  sixMonthFinalDisplacement: number; // Final projected displacement at Month 6
  sixMonthFinalBeachWidth: number;
  sixMonthFinalVolumetricLoss: number;
  scenario: ProjectionScenario;
  primaryDriver: string;
  ndwi: number;
  ndvi: number;
  sarCoherence: number;
  detectedShift: number;
  satelliteSensor: string;
  overpassTime: string;
}

/**
 * Calculates satellite-informed acceleration/deceleration factor
 * based on Sentinel-2 optical water/vegetation indices and Sentinel-1 SAR coherence.
 */
export function calculateSatelliteModulation(
  telemetry: SatelliteTelemetry,
  scenario: ProjectionScenario = "baseline"
): {
  multiplier: number;
  ndwiEffect: number;
  ndviEffect: number;
  sarEffect: number;
  primaryDriver: string;
} {
  const ndwi = telemetry.coastal_ndwi_index ?? telemetry.ndwi ?? 0.5;
  const ndvi = telemetry.ndvi ?? 0.4;
  const sar = telemetry.sar_coherence_index ?? 0.6;
  const shift = telemetry.detected_shoreline_shift_m ?? -1.5;

  // NDWI Effect: Values > 0.4 indicate elevated swash saturation and wave runup
  // Higher water saturation weakens matrix suction in unsaturated sand
  const ndwiEffect = Math.max(-0.2, Math.min(0.5, (ndwi - 0.42) * 0.9));

  // NDVI Effect: Lower vegetation (<0.40) indicates compromised foredune root networks
  // Dense dune grass reduces retreat; degraded canopy increases susceptibility
  const ndviEffect = Math.max(-0.25, Math.min(0.45, (0.45 - ndvi) * 0.8));

  // SAR Coherence Effect: Coherence < 0.50 flags active ground displacement and scarp slumping
  const sarEffect = Math.max(-0.15, Math.min(0.4, (0.65 - sar) * 0.7));

  // Scenario Adjustments
  let scenarioMod = 1.0;
  if (scenario === "storm_surge") {
    scenarioMod = 1.45; // Impending seasonal cyclonic low pressure & gale runup
  } else if (scenario === "nourishment") {
    scenarioMod = 0.45; // Mitigated: Sand nourishment / dune fencing stabilization
  }

  const rawMultiplier = (1.0 + ndwiEffect + ndviEffect + sarEffect) * scenarioMod;
  const multiplier = Math.round(Math.max(0.3, Math.min(2.4, rawMultiplier)) * 100) / 100;

  // Determine the primary driving satellite factor
  let primaryDriver = "Balanced multi-spectral baseline";
  if (scenario === "storm_surge") {
    primaryDriver = "Storm Surge Coupling (+45% wave flux override)";
  } else if (scenario === "nourishment") {
    primaryDriver = "Active Dune Nourishment Buffer (-55% retreat damping)";
  } else if (ndwiEffect > ndviEffect && ndwiEffect > sarEffect) {
    primaryDriver = `High Swash Saturation (NDWI ${ndwi.toFixed(2)})`;
  } else if (ndviEffect > sarEffect) {
    primaryDriver = `Foredune Canopy Degradation (NDVI ${ndvi.toFixed(2)})`;
  } else if (sarEffect > 0.1) {
    primaryDriver = `Radar Coherence Loss / Scarp Slumping (SAR ${sar.toFixed(2)})`;
  } else if (Math.abs(shift) > 2.0) {
    primaryDriver = `Recent Sentinel-2 Waterline Shift (${shift.toFixed(1)}m)`;
  }

  return {
    multiplier,
    ndwiEffect: Math.round(ndwiEffect * 100) / 100,
    ndviEffect: Math.round(ndviEffect * 100) / 100,
    sarEffect: Math.round(sarEffect * 100) / 100,
    primaryDriver
  };
}

/**
 * Generates 6 monthly projected survey epochs extending from the latest calibrated survey point.
 */
export function generateSixMonthSatelliteProjection(
  lastSurvey: HistoricalSurveyPoint,
  regressionSlope: number, // Historical LRR rate (m/yr, typically negative for erosion)
  telemetry: SatelliteTelemetry,
  selectedMetric: "shoreline_displacement_m" | "beach_width_m" | "volumetric_loss_m3_m" | "annual_retreat_rate_m_yr" | "dune_crest_elevation_m",
  scenario: ProjectionScenario = "baseline"
): ProjectedSurveyPoint[] {
  const { multiplier } = calculateSatelliteModulation(telemetry, scenario);

  const baseDate = new Date(lastSurvey.date);
  // Ensure valid date
  const startTime = isNaN(baseDate.getTime()) ? new Date("2026-06-30").getTime() : baseDate.getTime();

  // Effective annualized retreat rate factoring in satellite acceleration
  // Note: if slope is 0 or positive, calibrate based on detected satellite shift
  const calibratedAnnualRate = regressionSlope !== 0 
    ? regressionSlope * multiplier 
    : (telemetry.detected_shoreline_shift_m || -1.5) * multiplier;

  const results: ProjectedSurveyPoint[] = [];

  for (let m = 1; m <= 6; m++) {
    // Increment ~30.5 days per month
    const targetTime = startTime + m * (30.4375 * 24 * 3600 * 1000);
    const targetDate = new Date(targetTime);
    const dateStr = targetDate.toISOString().split("T")[0];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthLabel = `+${m} Mo (${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()})`;

    // Fraction of year elapsed
    const dtYears = m / 12.0;

    // Cumulative displacement projection
    // Incorporates seasonal autumn/winter wave swell weighting for months 3-6
    const seasonalWaveWeight = (m >= 3 && m <= 5) ? 1.15 : 1.0;
    const deltaDisplacement = Math.round(calibratedAnnualRate * dtYears * seasonalWaveWeight * 10) / 10;
    const projDisplacement = Math.round((lastSurvey.shoreline_displacement_m + deltaDisplacement) * 10) / 10;

    // Beach width projection
    const projWidth = Math.max(
      6.0,
      Math.round((lastSurvey.beach_width_m + (deltaDisplacement * 0.85)) * 10) / 10
    );

    // Volumetric loss projection (m3 per linear meter)
    const deltaVolLoss = Math.round(Math.abs(deltaDisplacement) * 15.8 * 10) / 10;
    const projVolLoss = Math.round((lastSurvey.volumetric_loss_m3_m + deltaVolLoss) * 10) / 10;

    // Dune crest elevation projection
    const projDune = Math.max(
      1.8,
      Math.round((lastSurvey.dune_crest_elevation_m + (deltaDisplacement * 0.10)) * 10) / 10
    );

    // Annualized instantaneous rate
    const projAnnualRate = Math.round(calibratedAnnualRate * 10) / 10;

    // Determine current metric value
    let val = projDisplacement;
    if (selectedMetric === "beach_width_m") val = projWidth;
    else if (selectedMetric === "volumetric_loss_m3_m") val = projVolLoss;
    else if (selectedMetric === "annual_retreat_rate_m_yr") val = projAnnualRate;
    else if (selectedMetric === "dune_crest_elevation_m") val = projDune;

    // Expanding 95% Confidence Interval with forecast lead time (months)
    // Uncertainty grows as a square root / linear dispersion function
    const baseUncertainty = selectedMetric === "volumetric_loss_m3_m" ? 4.5 : 0.35;
    const monthlyDispersion = selectedMetric === "volumetric_loss_m3_m" ? 2.8 : 0.18;
    const uncertaintyBandWidth = Math.round((baseUncertainty + monthlyDispersion * Math.sqrt(m)) * 10) / 10;

    const lowerCI = Math.round((val - uncertaintyBandWidth) * 10) / 10;
    const upperCI = Math.round((val + uncertaintyBandWidth) * 10) / 10;

    results.push({
      monthOffset: m,
      label: monthLabel,
      date: dateStr,
      parsedDate: targetDate,
      val,
      lowerCI,
      upperCI,
      shoreline_displacement_m: projDisplacement,
      annual_retreat_rate_m_yr: projAnnualRate,
      beach_width_m: projWidth,
      dune_crest_elevation_m: projDune,
      volumetric_loss_m3_m: projVolLoss,
      satelliteMultiplier: multiplier,
      uncertaintyBandWidth,
      isProjected: true
    });
  }

  return results;
}

/**
 * Builds a high-level summary of the 6-month satellite projection for quick KPI cards.
 */
export function buildSatelliteProjectionSummary(
  lastSurvey: HistoricalSurveyPoint,
  projectedPoints: ProjectedSurveyPoint[],
  telemetry: SatelliteTelemetry,
  scenario: ProjectionScenario = "baseline"
): SatelliteProjectionSummary {
  const { multiplier, primaryDriver } = calculateSatelliteModulation(telemetry, scenario);
  const endPoint = projectedPoints[projectedPoints.length - 1];

  const deltaDisp = endPoint 
    ? Math.round((endPoint.shoreline_displacement_m - lastSurvey.shoreline_displacement_m) * 10) / 10
    : -0.7;

  return {
    accelerationMultiplier: multiplier,
    sixMonthDisplacementDelta: deltaDisp,
    sixMonthFinalDisplacement: endPoint ? endPoint.shoreline_displacement_m : -6.2,
    sixMonthFinalBeachWidth: endPoint ? endPoint.beach_width_m : 24.5,
    sixMonthFinalVolumetricLoss: endPoint ? endPoint.volumetric_loss_m3_m : 85.0,
    scenario,
    primaryDriver,
    ndwi: telemetry.coastal_ndwi_index ?? telemetry.ndwi ?? 0.52,
    ndvi: telemetry.ndvi ?? 0.38,
    sarCoherence: telemetry.sar_coherence_index ?? 0.55,
    detectedShift: telemetry.detected_shoreline_shift_m ?? -1.8,
    satelliteSensor: telemetry.satellite || "Sentinel-2 MSI",
    overpassTime: telemetry.last_overpass_time || "2.3 hours ago"
  };
}
