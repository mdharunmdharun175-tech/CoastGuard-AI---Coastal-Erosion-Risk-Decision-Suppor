export type RiskLevel = "Low" | "Medium" | "High" | "Very High";

export interface FactorContribution {
  factor: string;
  displayName: string;
  shap_value: number;
  percentage_contribution: number;
  impact_direction: "Increases Risk" | "Decreases Risk";
  observed_value: any;
}

export interface MitigationAction {
  priority: number;
  category: string;
  title: string;
  description: string;
  triggered_by_factor: string;
  estimated_cost_tier: "$" | "$$" | "$$$" | "$$$$";
  time_horizon: string;
  expected_risk_reduction_pct: number;
  impact_metric?: string;
}

export interface MitigationPlan {
  primary_threat: string;
  risk_level: RiskLevel;
  recommended_actions: MitigationAction[];
  decision_rationale: string;
}

export interface HistoricalSurveyPoint {
  year: number;
  date: string;
  shoreline_displacement_m: number; // Cumulative displacement from 2018 baseline (m)
  annual_retreat_rate_m_yr: number; // m/year
  beach_width_m: number; // dry berm width (m)
  dune_crest_elevation_m: number; // m above MSL
  volumetric_loss_m3_m: number; // cumulative sand loss m3/m
  survey_method: "RTK-DGPS GNSS" | "UAV Airborne LiDAR" | "Sentinel-2 Multi-Spectral" | "Airborne Topo-Bathymetric LiDAR";
  notes?: string;
}

export interface HistoricalStormEvent {
  id: string;
  name: string;
  date: string;
  season: string;
  peak_hs_m: number; // Significant wave height (m)
  peak_wave_energy_kw_m: number; // kW/m
  peak_surge_m: number; // Storm surge height (m)
  max_wind_speed_kmh: number;
  scarp_retreat_recorded_m: number; // Scarp erosion (m)
  volumetric_loss_m3_m: number; // Sand loss (m3/m)
  impact_summary: string;
  emergency_action_taken: string;
}

export interface HourlyWeatherPredictionPoint {
  hour_offset: number;
  time_label: string; // e.g. "Now", "+6h", "+12h", "+24h", "+48h", "+72h"
  timestamp: string;
  wave_height_hs_m: number;
  wave_period_tp_s: number;
  wave_energy_flux_kw_m: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  storm_surge_m: number;
  barometric_pressure_hpa: number;
  predicted_erosion_risk_pct: number;
  hazard_alert_level: "Normal" | "Elevated" | "Severe Surge" | "Critical Scarp Breach";
}

export interface CoastalTransect {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  slope: number; // %
  storm_count: number; // events
  storm_energy: number; // kW/m
  depth_of_closure: number; // meters
  geomorphology: "sandy" | "gravel" | "dune" | "riverbank" | "defence structure";
  longshore_direction: "convergent" | "transitional" | "divergent";
  historical_trend: string;
  urban_density: string;
  
  // Model outputs
  probability: number;
  susceptibility_index: number; // 0-100%
  risk_class: RiskLevel;
  base_value: number;
  shap_values: Record<string, number>;
  top_contributing_factors: FactorContribution[];
  confidence_interval: [number, number];
  mitigation: MitigationPlan;

  // Previous Historical Records & Storm Timeline
  historical_surveys?: HistoricalSurveyPoint[];
  historical_storms?: HistoricalStormEvent[];
}

export interface ModelBenchmark {
  model: string;
  family: string;
  calibration_auc: number;
  validation_auc: number;
  accuracy: number;
  sensitivity: number;
  specificity: number;
  f1_score: number;
  interpretability_method: string;
  novelty_rank: string;
  pros: string;
  cons: string;
}

export interface BenchmarkData {
  study_context: string;
  reference_paper: string;
  calibration_split: string;
  comparison_table: ModelBenchmark[];
  roc_curve_data: Array<{
    fpr: number;
    mars_tpr: number;
    rf_tpr: number;
    xgb_tpr: number;
  }>;
  confusion_matrices: {
    mars: { tp: number; fp: number; tn: number; fn: number; total: number };
    random_forest: { tp: number; fp: number; tn: number; fn: number; total: number };
    xgboost: { tp: number; fp: number; tn: number; fn: number; total: number };
  };
}

export interface LiveMarineWeather {
  timestamp: string;
  latitude: number;
  longitude: number;
  wave_height_m: number; // Significant wave height Hs
  wave_period_s: number; // Peak wave period Tp
  wave_direction_deg: number;
  wind_wave_height_m: number;
  swell_wave_height_m: number;
  calculated_energy_flux: number; // kW/m
  wind_speed_kmh: number;
  wind_gusts_kmh: number;
  wind_direction_deg: number;
  sea_level_pressure_hpa: number;
  sea_surface_temp_c: number;
  source: "Open-Meteo Marine Global & ECMWF WAM" | "Simulated Ocean Buoy";
  is_live: boolean;
}

export interface SatelliteRecentOverpass {
  date: string;
  satellite: string;
  ndvi: number;
  ndwi: number;
  mndwi: number;
  shoreline_shift_m: number;
  cloud_pct: number;
  quality_score: number;
  status: string;
}

export interface SatelliteTelemetry {
  satellite: "Sentinel-2 MSI (Optical)" | "Sentinel-1 C-SAR (Radar)" | "Copernicus Sentinel-3 (Altimetry)" | "Landsat 9 OLI-2";
  pass_status: "Active Tracking" | "Descending Pass in 4h" | "Ascending Orbit Complete";
  sensor_mode: string;
  resolution_gsd: string;
  coastal_ndwi_index: number; // Normalized Difference Water Index (-1 to +1)
  sar_coherence_index: number; // 0 to 1
  surface_backscatter_db: number;
  cloud_cover_pct: number;
  last_overpass_time: string;
  detected_shoreline_shift_m: number;
  spectral_bands: string;
  
  // Optical Vegetation & Water Indices
  ndvi?: number; // Normalized Difference Vegetation Index (-1 to 1)
  ndvi_status?: "Dense Dune Canopy" | "Moderate Dune Shrub" | "Sparse / Degraded Foredune" | "Barren Sand";
  ndwi?: number;
  mndwi?: number; // Modified NDWI (Xu)
  awei?: number; // Automated Water Extraction Index
  coastal_vegetation_health_score?: number; // 0-100%
  
  // Shoreline & Morphology Indices
  waterline_position_m?: number;
  dune_scarp_setback_m?: number;
  swash_saturation_index?: number; // 0-1 (intertidal wetness)
  radar_roughness_status?: "Smooth Wet Sand" | "Rugged Pebble / Riprap" | "Foredune Scarp" | "Turbulent Surf Zone" | "Foredune Scarp / Breached Crest" | "Stable Riprap / Consolidated Dune" | "Turbulent Surf & Pebble Beach";
  
  // Recent Overpass Time-Series
  recent_overpasses?: SatelliteRecentOverpass[];
}

export interface SatelliteTelemetryIndicators extends SatelliteTelemetry {
  transect_id: string;
  zone_name: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export interface DisasterForecastDay {
  day_offset: 1 | 2 | 3; // Day 1 (T-72h), Day 2 (T-48h), Day 3 (T-24h to T-0)
  target_date: string;
  hour_label: string; // e.g. "T-72h Warning", "T-48h Peak Surge", "T-24h Scarp Attack"
  wave_energy_forecast_kw_m: number;
  peak_wave_height_m: number;
  storm_surge_meters: number;
  wind_speed_kmh: number;
  disaster_probability: number; // %
  hazard_phase: "Impending Wave Surge" | "Critical Overwash & Breach" | "Post-Storm Scarp Failure";
  evacuation_status: "Advisory" | "Mandatory Exclusion" | "Restricted Re-Entry";
}

export interface DisasterAlert {
  id: string;
  severity: "CRITICAL" | "HIGH WARNING" | "WATCH";
  disaster_type: "Extreme Storm Surge & Dune Breach" | "Severe Nor'easter / Bora Wave Attack" | "Catastrophic Cliff Scarp Failure";
  headline: string;
  description: string;
  time_window: string; // e.g. "Next 72 Hours (T-72h Early Warning)"
  earliest_impact_hours: number; // e.g. 36
  peak_surge_time: string;
  affected_transect_ids: string[];
  affected_zone_names: string[];
  forecast_3day: DisasterForecastDay[];
  peak_wave_energy: number; // kW/m
  peak_wave_height: number; // m
  estimated_shoreline_loss_meters: number;
  evacuation_protocol: string[];
  broadcast_sent: boolean;
  broadcast_timestamp?: string;
  recipients_count?: number;
}

export interface DatasetImageItem {
  id: string;
  folder: "01_Sentinel-2_Multispectral" | "02_Sentinel-1_SAR_Radar" | "03_UAV_Drone_LiDAR_DEM" | "04_Field_Transect_Photos";
  filename: string;
  title: string;
  location: string;
  region: string;
  coordinates: [number, number];
  captureDate: string;
  sensor: string;
  resolution: string;
  band_composite?: string;
  erosion_hazard_label: RiskLevel;
  description: string;
  image_url: string;
  tags: string[];
  transect_id_ref?: string;
}

// 2D Cross-Shore Beach Profile & Scarp Simulation
export interface BeachProfileConfig {
  duneCrestHeightM: number; // e.g. 5.5m
  bermWidthM: number; // e.g. 30m
  beachSlopePct: number; // e.g. 6.5%
  grainSizeD50Mm: number; // e.g. 0.35mm
  tideLevelM: number; // High tide e.g. 1.2m
  stormSurgeM: number; // Storm surge e.g. 1.8m
  waveHeightHsM: number; // Wave height e.g. 4.2m
  wavePeriodTpS: number; // Wave period e.g. 9.5s
  seaLevelRiseM: number; // SLR scenario e.g. 0.0m to 1.5m
  depthOfClosureM: number; // e.g. 7.5m
  mitigationType: "none" | "geotextile_dune_core" | "submerged_artificial_reef" | "sand_nourishment_berm" | "rock_revetment";
}

export interface BeachProfileSimulationResult {
  waveBreakingDistM: number;
  totalWaterLevelM: number; // Surge + Tide + Wave Runup R2%
  duneScarpRetreatM: number;
  volumetricErosionM3PerM: number;
  overwashRisk: "Safe" | "Toe Erosion" | "Scarp Collapse" | "Catastrophic Breach";
  energyDissipationPct: number;
  scarpUnderminingRiskPct: number;
  mitigationBenefitSummary: string;
}

// Autonomous Coastal Drone LiDAR Mission Planning
export interface DroneFlightMission {
  id: string;
  missionName: string;
  targetTransectId: string;
  flightAltitudeM: number; // 40m - 120m
  groundSamplingDistanceCm: number; // e.g. 1.5 cm/px
  flightSpeedMs: number; // e.g. 8 m/s
  forwardOverlapPct: number; // e.g. 80%
  sideOverlapPct: number; // e.g. 75%
  lidarPulseRateKhz: number; // e.g. 300 kHz
  estimatedFlightTimeMin: number;
  batterySwapsNeeded: number;
  totalSurveyAreaHectares: number;
  pointCloudDensityPtsM2: number;
  detectedVolumetricChangeM3: number; // e.g. -1420 m3
  waypointsCount: number;
  status: "Ready for Dispatch" | "In Flight Surveying" | "Processing DEM Point Cloud" | "Survey Complete";
}

export interface LidarElevationProfilePoint {
  crossShoreDistanceM: number;
  preStormBaselineElevationM: number;
  postStormSurveyElevationM: number;
  differenceZCm: number;
  classification: "Dune Crest" | "Foredune Scarp" | "Berm" | "Intertidal" | "Submerged Bar";
}

// CAP (Common Alerting Protocol) Civil Broadcast Format
export interface CapBroadcastAlert {
  identifier: string;
  sender: string;
  sentTime: string;
  status: "Actual" | "Exercise" | "Test";
  msgType: "Alert" | "Update" | "Cancel";
  scope: "Public" | "Restricted";
  category: "Geo" | "Met" | "Safety";
  event: string;
  urgency: "Immediate" | "Expected" | "Future";
  severity: "Extreme" | "Severe" | "Moderate";
  certainty: "Observed" | "Likely" | "Possible";
  language: "en-US" | "it-IT" | "es-ES" | "fr-FR" | "de-DE";
  headline: string;
  description: string;
  instruction: string;
  areaDesc: string;
  polygonCoordinates: [number, number][];
}

// Rainfall to Sea Level Increase & Soil Moisture Tsunami Alert System
export type TsunamiAlertLevel = "NORMAL" | "ADVISORY" | "WARNING" | "CRITICAL_TSUNAMI_EVACUATION";

export interface HistoricalRainfallSoilEvent {
  id: string;
  eventName: string;
  date: string;
  cumulativeRainfall24hMm: number;
  peakRainRateMmHr: number;
  antecedentSoilMoisturePct: number; // Volumetric Saturation %
  poreWaterPressureKPa: number;
  seaLevelIncreaseM: number; // Pluvial + Surge + Barometric
  tsunamiType: "Meteotsunami" | "Landslide-Induced Tsunami" | "Compound Pluvial Surge" | "None";
  observedTsunamiHeightM: number;
  slopeFailureVolumeM3: number;
  alertIssued: TsunamiAlertLevel;
  impactNotes: string;
}

export interface RainfallSeaLevelConfig {
  rainfall24hMm: number; // 0 - 350 mm
  rainIntensityMmHr: number; // 0 - 90 mm/hr
  soilMoisturePct: number; // 15% - 100%
  catchmentAreaKm2: number; // 10 - 250 km2
  estuaryWidthM: number; // 20 - 200 m
  soilType: "coastal_sand_dune" | "coastal_cliff_marl" | "clayey_silt_alluvium" | "permeable_gravel";
  tideStageM: number; // -0.8m to +1.2m
  surfacePressureHpa: number; // 980 - 1025 hPa
  onshoreWindKmh: number; // 0 - 120 km/h
}

export interface SoilMoistureAnalysis {
  volumetricWaterContent: number; // m3/m3
  saturationDegreePct: number; // %
  poreWaterPressureKPa: number; // kPa
  effectiveShearStressKPa: number; // kPa
  factorOfSafety: number; // FS (<1.0 = slope failure)
  liquefactionRisk: "Low / Drained" | "Moderate" | "High Pore Pressure" | "Critical Liquefaction";
  cliffLandslideProbabilityPct: number; // %
  estimatedDisplacedSlideVolumeM3: number; // m3
}

export interface RainfallSeaLevelResult {
  pluvialRunoffIncreaseM: number;
  barometricIncreaseM: number;
  windSetupM: number;
  waveSetupM: number;
  totalSeaLevelIncreaseM: number; // Sum of surges
  totalWaterLevelWithTideM: number; // Including tide datum
  compoundInundationExtentM: number; // Inland reach (meters)
}

export interface TsunamiAlertEvaluation {
  alertLevel: TsunamiAlertLevel;
  headline: string;
  summary: string;
  tsunamiMechanism: "None" | "Meteotsunami (Atmospheric Gravity Wave Resonance)" | "Subaerial / Submarine Landslide Tsunami" | "Combined Pluvial-Meteotsunami Surge";
  potentialTsunamiWaveHeightM: number; // Estimated impulse or seiche wave amplitude
  estimatedArrivalTimeMin: number; // Minutes from trigger
  evacuationDistanceM: number; // Required exclusion perimeter inland
  recommendedActions: string[];
  capAlertPayload: Partial<CapBroadcastAlert>;
}
