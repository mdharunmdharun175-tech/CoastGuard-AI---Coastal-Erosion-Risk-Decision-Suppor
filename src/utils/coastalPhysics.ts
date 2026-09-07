import { BeachProfileConfig, BeachProfileSimulationResult, LidarElevationProfilePoint } from "../types";

// Calculate deepwater wavelength L0 = (g * Tp^2) / (2 * pi) ~= 1.56 * Tp^2
export function calculateDeepwaterWavelength(tp: number): number {
  return 1.5613 * Math.pow(Math.max(1, tp), 2);
}

// Dean's Sediment Scale Parameter A as function of grain size D50 in mm
export function calculateDeanScaleParameter(d50Mm: number): number {
  // Empirical approximation: A ~= 0.063 * (d50)^0.46 (approx for sand 0.1mm - 2.0mm)
  return 0.063 * Math.pow(Math.max(0.1, d50Mm), 0.46) + 0.07;
}

// Stockdon et al. (2006) Wave Runup R2%
export function calculateStockdonRunup(
  waveHeightHs: number,
  wavePeriodTp: number,
  beachSlopePct: number
): number {
  const betaF = Math.max(0.01, beachSlopePct / 100);
  const L0 = calculateDeepwaterWavelength(wavePeriodTp);
  const H0 = Math.max(0.2, waveHeightHs);

  const setup = 0.35 * betaF * Math.sqrt(H0 * L0);
  const swash = Math.sqrt(H0 * L0 * (0.563 * Math.pow(betaF, 2) + 0.004)) / 2;
  const R2 = 1.1 * (setup + swash);
  return Math.round(R2 * 100) / 100;
}

// Simulates 2D Beach Cross-Shore Profile Elevation Points
export function generateCrossShoreProfilePoints(
  config: BeachProfileConfig
): Array<{ x: number; baselineElevation: number; postStormElevation: number; waterLevel: number }> {
  const points: Array<{ x: number; baselineElevation: number; postStormElevation: number; waterLevel: number }> = [];
  const A = calculateDeanScaleParameter(config.grainSizeD50Mm);
  const beta = config.beachSlopePct / 100;

  // Runup and Total Water Level
  const runup = calculateStockdonRunup(config.waveHeightHsM, config.wavePeriodTpS, config.beachSlopePct);
  const totalWaterLevel = config.tideLevelM + config.stormSurgeM + config.seaLevelRiseM + runup * 0.8;

  // Mitigation damping factor
  let mitigationDamping = 1.0;
  if (config.mitigationType === "submerged_artificial_reef") mitigationDamping = 0.52;
  if (config.mitigationType === "geotextile_dune_core") mitigationDamping = 0.65;
  if (config.mitigationType === "rock_revetment") mitigationDamping = 0.40;
  if (config.mitigationType === "sand_nourishment_berm") mitigationDamping = 0.70;

  // Cross-shore distance from -20m (Hinterland) to +150m (Offshore Depth of Closure)
  for (let x = -20; x <= 160; x += 2) {
    let baseZ = 0;
    let postZ = 0;

    // Region 1: Hinterland & Dune Crest (x = -20 to 0)
    if (x <= 0) {
      baseZ = config.duneCrestHeightM + (x * 0.05); // slight rise/flat
      postZ = baseZ;
      if (totalWaterLevel > config.duneCrestHeightM * 0.75) {
        // Dune crest lowering/scarping
        const scarpLoss = Math.min(1.8, (totalWaterLevel - config.duneCrestHeightM * 0.75) * 0.9 * mitigationDamping);
        postZ = baseZ - scarpLoss;
      }
    } 
    // Region 2: Foredune Seaward Face (x = 0 to 15)
    else if (x <= 15) {
      const duneFaceSlope = (config.duneCrestHeightM - 2.5) / 15;
      baseZ = config.duneCrestHeightM - (x * duneFaceSlope);

      // Scarping attack under storm water levels
      if (totalWaterLevel > 2.0) {
        const scarpCut = Math.min(2.5, (totalWaterLevel - 1.8) * 1.1 * mitigationDamping);
        postZ = Math.max(0.5, baseZ - scarpCut);
      } else {
        postZ = baseZ;
      }
    } 
    // Region 3: Subaerial Berm & Dry Beach (x = 15 to 15 + bermWidth)
    else if (x <= 15 + config.bermWidthM) {
      const bermDist = x - 15;
      baseZ = 2.5 - (bermDist * (beta * 0.5));

      // Berm cut & offshore transport
      const stormErosion = Math.min(1.6, (config.waveHeightHsM * 0.4) * mitigationDamping);
      postZ = baseZ - stormErosion;
    } 
    // Region 4: Intertidal & Offshore Bathymetry (Dean's Equilibrium y = A * x^2/3)
    else {
      const offshoreDist = x - (15 + config.bermWidthM);
      const waterDepth = A * Math.pow(Math.max(0.5, offshoreDist), 0.666);
      baseZ = 0.5 - waterDepth;

      // Bar formation offshore (sand deposition bar at wave breaking zone)
      const isBreakingZone = offshoreDist >= 30 && offshoreDist <= 65;
      const barDeposit = isBreakingZone ? (0.85 * mitigationDamping) : -0.2;
      postZ = Math.min(config.depthOfClosureM, baseZ + barDeposit);
    }

    // Still Water Level at distance x
    const swl = config.tideLevelM + config.stormSurgeM + config.seaLevelRiseM;
    points.push({
      x,
      baselineElevation: Math.round(baseZ * 100) / 100,
      postStormElevation: Math.round(postZ * 100) / 100,
      waterLevel: Math.round(swl * 100) / 100
    });
  }

  return points;
}

// Compute comprehensive simulation metrics
export function simulateBeachProfilePhysics(config: BeachProfileConfig): BeachProfileSimulationResult {
  const runup = calculateStockdonRunup(config.waveHeightHsM, config.wavePeriodTpS, config.beachSlopePct);
  const totalWaterLevel = config.tideLevelM + config.stormSurgeM + config.seaLevelRiseM + runup;

  // Wave breaking location estimation: depth db ~= Hs / 0.78
  const breakingDepth = config.waveHeightHsM / 0.78;
  const A = calculateDeanScaleParameter(config.grainSizeD50Mm);
  const waveBreakingDistM = Math.round(Math.pow(breakingDepth / A, 1.5) + config.bermWidthM);

  // Scarp Retreat & Volumetric Erosion calculation
  let mitigationEfficiency = 0;
  let mitigationSummary = "No active coastal defense deployed. Dune face vulnerable to direct orbital wave impact.";
  
  if (config.mitigationType === "geotextile_dune_core") {
    mitigationEfficiency = 0.55;
    mitigationSummary = "Geotextile sand-filled tube core anchors the dune toe, preventing catastrophic slip failure and reducing retreat by 55%.";
  } else if (config.mitigationType === "submerged_artificial_reef") {
    mitigationEfficiency = 0.62;
    mitigationSummary = "Submerged modular rock reef triggers premature offshore wave breaking, dissipating 62% of cyclonic wave energy.";
  } else if (config.mitigationType === "sand_nourishment_berm") {
    mitigationEfficiency = 0.45;
    mitigationSummary = "Sacrificial widened sand berm (+25m) absorbs initial storm runup, protecting the structural dune toe from notch formation.";
  } else if (config.mitigationType === "rock_revetment") {
    mitigationEfficiency = 0.75;
    mitigationSummary = "Engineered basalt rock armor revetment absorbs wave reflection forces, securing the bluff toe with 75% scarp arrest.";
  }

  // Base scarp retreat without defense
  const excessSurge = Math.max(0, totalWaterLevel - 2.8);
  const rawRetreat = excessSurge * 2.2 + (config.waveHeightHsM * 0.65);
  const duneScarpRetreatM = Math.round(rawRetreat * (1 - mitigationEfficiency) * 10) / 10;

  // Volumetric sand loss in m3 per meter of shoreline
  const rawVolume = (duneScarpRetreatM * (config.duneCrestHeightM + config.depthOfClosureM) * 0.45);
  const volumetricErosionM3PerM = Math.round(rawVolume * 10) / 10;

  // Overwash classification
  let overwashRisk: BeachProfileSimulationResult["overwashRisk"] = "Safe";
  if (totalWaterLevel > config.duneCrestHeightM) {
    overwashRisk = "Catastrophic Breach";
  } else if (totalWaterLevel > config.duneCrestHeightM * 0.85) {
    overwashRisk = "Scarp Collapse";
  } else if (totalWaterLevel > 2.8) {
    overwashRisk = "Toe Erosion";
  }

  const energyDissipationPct = Math.round((mitigationEfficiency * 85) + 15);
  const scarpUnderminingRiskPct = Math.min(99, Math.round((duneScarpRetreatM / 6.0) * 100));

  return {
    waveBreakingDistM,
    totalWaterLevelM: Math.round(totalWaterLevel * 100) / 100,
    duneScarpRetreatM,
    volumetricErosionM3PerM,
    overwashRisk,
    energyDissipationPct,
    scarpUnderminingRiskPct,
    mitigationBenefitSummary: mitigationSummary
  };
}

// Generate LiDAR Elevation Point Cloud Simulation Data
export function generateLidarTransectProfile(transectId: string): LidarElevationProfilePoint[] {
  const points: LidarElevationProfilePoint[] = [];
  const isHighErosion = transectId === "TRX-101" || transectId === "TRX-104" || transectId === "TRX-108";

  for (let x = 0; x <= 100; x += 2.5) {
    let baseZ = 0;
    let postZ = 0;
    let classification: LidarElevationProfilePoint["classification"] = "Berm";

    if (x <= 15) {
      baseZ = 6.2 - (x * 0.18);
      postZ = isHighErosion ? baseZ - 1.4 : baseZ - 0.2;
      classification = x <= 5 ? "Dune Crest" : "Foredune Scarp";
    } else if (x <= 45) {
      baseZ = 3.5 - ((x - 15) * 0.06);
      postZ = isHighErosion ? baseZ - 0.95 : baseZ - 0.15;
      classification = "Berm";
    } else if (x <= 75) {
      baseZ = 1.7 - ((x - 45) * 0.05);
      postZ = isHighErosion ? baseZ - 0.70 : baseZ - 0.10;
      classification = "Intertidal";
    } else {
      baseZ = 0.2 - ((x - 75) * 0.08);
      postZ = isHighErosion ? baseZ + 0.45 : baseZ; // sand deposited offshore
      classification = "Submerged Bar";
    }

    const diffCm = Math.round((postZ - baseZ) * 100);
    points.push({
      crossShoreDistanceM: x,
      preStormBaselineElevationM: Math.round(baseZ * 100) / 100,
      postStormSurveyElevationM: Math.round(postZ * 100) / 100,
      differenceZCm: diffCm,
      classification
    });
  }

  return points;
}
