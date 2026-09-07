import { CoastalTransect } from "../types";

export const FALLBACK_TRANSECTS: CoastalTransect[] = [
  {
    "id": "TRX-101",
    "name": "Costa dei Trabocchi - Punta Aderci",
    "region": "Adriatic Central (Abruzzo, Italy)",
    "coordinates": [
      42.1855,
      14.6865
    ],
    "slope": 8.4,
    "storm_count": 22,
    "storm_energy": 310.5,
    "depth_of_closure": 6.8,
    "geomorphology": "dune",
    "longshore_direction": "divergent",
    "historical_trend": "Retreating (-1.8 m/yr)",
    "urban_density": "Protected Reserve / Scenic Trail",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 42.5,
        "dune_crest_elevation_m": 6.2,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -3.6,
        "annual_retreat_rate_m_yr": -1.7,
        "beach_width_m": 38.8,
        "dune_crest_elevation_m": 5.9,
        "volumetric_loss_m3_m": 52.2,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -7.2,
        "annual_retreat_rate_m_yr": -1.9,
        "beach_width_m": 35.1,
        "dune_crest_elevation_m": 5.6,
        "volumetric_loss_m3_m": 109.4,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -10.8,
        "annual_retreat_rate_m_yr": -2.1,
        "beach_width_m": 31.4,
        "dune_crest_elevation_m": 5.2,
        "volumetric_loss_m3_m": 181.4,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -12.6,
        "annual_retreat_rate_m_yr": -2,
        "beach_width_m": 29.8,
        "dune_crest_elevation_m": 5,
        "volumetric_loss_m3_m": 220.5,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -14.4,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 27.9,
        "dune_crest_elevation_m": 4.8,
        "volumetric_loss_m3_m": 262.1,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-101-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 373,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -2.2,
        "volumetric_loss_m3_m": -32.5,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-101-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 295,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -1.4,
        "volumetric_loss_m3_m": -18.2,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-101-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 435,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -3.8,
        "volumetric_loss_m3_m": -48,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-101-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 273,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -1.1,
        "volumetric_loss_m3_m": -14,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.927,
    "susceptibility_index": 92.7,
    "risk_class": "Very High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 0.915,
      "storm_count": 0.677,
      "slope": 0.56,
      "depth_of_closure": 0.244,
      "geomorphology": 0.374,
      "longshore_direction": 0.198
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 0.915,
        "percentage_contribution": 30.8,
        "impact_direction": "Increases Risk",
        "observed_value": 310.5
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 0.677,
        "percentage_contribution": 22.8,
        "impact_direction": "Increases Risk",
        "observed_value": 22
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.56,
        "percentage_contribution": 18.9,
        "impact_direction": "Increases Risk",
        "observed_value": 8.4
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": 0.374,
        "percentage_contribution": 12.6,
        "impact_direction": "Increases Risk",
        "observed_value": "dune"
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.244,
        "percentage_contribution": 8.2,
        "impact_direction": "Increases Risk",
        "observed_value": 6.8
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.198,
        "percentage_contribution": 6.7,
        "impact_direction": "Increases Risk",
        "observed_value": "divergent"
      }
    ],
    "confidence_interval": [
      0.889,
      0.965
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Very High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Beach Profile Engineering",
          "title": "Beach Slope Regrading & Living Shoreline Root Reinforcement",
          "description": "Regrade over-steepened beach profiles to a stable 1:25 dissipative gradient and anchor the upper berm with halophyte root systems to resist scarp slumping.",
          "triggered_by_factor": "Over-steepened Cross-Shore Slope",
          "estimated_cost_tier": "$$",
          "time_horizon": "Immediate (1-3 months)",
          "expected_risk_reduction_pct": 26,
          "impact_metric": "Restores Dissipative Profile"
        },
        {
          "priority": 3,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 4,
          "category": "Sediment Management",
          "title": "Littoral Sand Bypassing & Nourishment Feeder Berm",
          "description": "Inject 25,000 m³/yr of compatible coarse sand onto the updrift feeder berm to feed the divergent littoral drift and counteract downdrift sediment starvation.",
          "triggered_by_factor": "Divergent Longshore Sediment Deficit",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Continuous / Annual",
          "expected_risk_reduction_pct": 30,
          "impact_metric": "Compensates Drift Starvation"
        },
        {
          "priority": 5,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 6,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Very High susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +0.915). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-102",
    "name": "San Vito Chietino Littoral",
    "region": "Adriatic Central (Abruzzo, Italy)",
    "coordinates": [
      42.298,
      14.444
    ],
    "slope": 5.2,
    "storm_count": 14,
    "storm_energy": 195,
    "depth_of_closure": 9.4,
    "geomorphology": "sandy",
    "longshore_direction": "transitional",
    "historical_trend": "Moderate Erosion (-0.6 m/yr)",
    "urban_density": "Boardwalk & Tourism Strip",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -0.6,
        "beach_width_m": 55,
        "dune_crest_elevation_m": 7.8,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -1.2,
        "annual_retreat_rate_m_yr": -0.6,
        "beach_width_m": 56.2,
        "dune_crest_elevation_m": 7.9,
        "volumetric_loss_m3_m": 17.4,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -2.4,
        "annual_retreat_rate_m_yr": -0.6,
        "beach_width_m": 57.5,
        "dune_crest_elevation_m": 8.1,
        "volumetric_loss_m3_m": 36.5,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -3.6,
        "annual_retreat_rate_m_yr": -0.7,
        "beach_width_m": 58.8,
        "dune_crest_elevation_m": 8.2,
        "volumetric_loss_m3_m": 60.5,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -4.2,
        "annual_retreat_rate_m_yr": -0.7,
        "beach_width_m": 59.4,
        "dune_crest_elevation_m": 8.3,
        "volumetric_loss_m3_m": 73.5,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -4.8,
        "annual_retreat_rate_m_yr": -0.6,
        "beach_width_m": 60.2,
        "dune_crest_elevation_m": 8.4,
        "volumetric_loss_m3_m": 87.4,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-102-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 234,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -0.5,
        "volumetric_loss_m3_m": -8,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-102-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 185,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -0.3,
        "volumetric_loss_m3_m": -4.5,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-102-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 273,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -0.8,
        "volumetric_loss_m3_m": -11.2,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-102-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 172,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -0.2,
        "volumetric_loss_m3_m": -3,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.552,
    "susceptibility_index": 55.2,
    "risk_class": "High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 0.092,
      "storm_count": 0.135,
      "slope": 0.083,
      "depth_of_closure": 0.046,
      "geomorphology": 0.252,
      "longshore_direction": 0.021
    },
    "top_contributing_factors": [
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": 0.252,
        "percentage_contribution": 40.1,
        "impact_direction": "Increases Risk",
        "observed_value": "sandy"
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 0.135,
        "percentage_contribution": 21.5,
        "impact_direction": "Increases Risk",
        "observed_value": 14
      },
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 0.092,
        "percentage_contribution": 14.6,
        "impact_direction": "Increases Risk",
        "observed_value": 195
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.083,
        "percentage_contribution": 13.2,
        "impact_direction": "Increases Risk",
        "observed_value": 5.2
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.046,
        "percentage_contribution": 7.3,
        "impact_direction": "Increases Risk",
        "observed_value": 9.4
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.021,
        "percentage_contribution": 3.3,
        "impact_direction": "Increases Risk",
        "observed_value": "transitional"
      }
    ],
    "confidence_interval": [
      0.514,
      0.59
    ],
    "mitigation": {
      "primary_threat": "Unconsolidated Dune Composition",
      "risk_level": "High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 3,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that High susceptibility is predominantly driven by Unconsolidated Dune Composition (SHAP attribution +0.252). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-103",
    "name": "Pescara River Mouth Barrier",
    "region": "Adriatic North (Abruzzo, Italy)",
    "coordinates": [
      42.468,
      14.225
    ],
    "slope": 3.1,
    "storm_count": 9,
    "storm_energy": 145,
    "depth_of_closure": 12.8,
    "geomorphology": "defence structure",
    "longshore_direction": "convergent",
    "historical_trend": "Accreting (+0.9 m/yr)",
    "urban_density": "Port & Marina Infrastructure",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 55,
        "dune_crest_elevation_m": 7.8,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": 1.4,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 56.2,
        "dune_crest_elevation_m": 7.9,
        "volumetric_loss_m3_m": 20.3,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": 2.8,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 57.5,
        "dune_crest_elevation_m": 8.1,
        "volumetric_loss_m3_m": 42.6,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": 4.2,
        "annual_retreat_rate_m_yr": 0.8,
        "beach_width_m": 58.8,
        "dune_crest_elevation_m": 8.2,
        "volumetric_loss_m3_m": 70.6,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": 4.9,
        "annual_retreat_rate_m_yr": 0.8,
        "beach_width_m": 59.4,
        "dune_crest_elevation_m": 8.3,
        "volumetric_loss_m3_m": 85.7,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": 5.6,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 60.2,
        "dune_crest_elevation_m": 8.4,
        "volumetric_loss_m3_m": 101.9,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-103-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 174,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -0.5,
        "volumetric_loss_m3_m": -8,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-103-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 138,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -0.3,
        "volumetric_loss_m3_m": -4.5,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-103-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 203,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -0.8,
        "volumetric_loss_m3_m": -11.2,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-103-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 128,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -0.2,
        "volumetric_loss_m3_m": -3,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.149,
    "susceptibility_index": 14.9,
    "risk_class": "Low",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": -0.214,
      "storm_count": -0.203,
      "slope": -0.166,
      "depth_of_closure": -0.214,
      "geomorphology": -0.36,
      "longshore_direction": -0.166
    },
    "top_contributing_factors": [
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": -0.36,
        "percentage_contribution": 27.2,
        "impact_direction": "Decreases Risk",
        "observed_value": "defence structure"
      },
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": -0.214,
        "percentage_contribution": 16.2,
        "impact_direction": "Decreases Risk",
        "observed_value": 145
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": -0.214,
        "percentage_contribution": 16.2,
        "impact_direction": "Decreases Risk",
        "observed_value": 12.8
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": -0.203,
        "percentage_contribution": 15.3,
        "impact_direction": "Decreases Risk",
        "observed_value": 9
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": -0.166,
        "percentage_contribution": 12.5,
        "impact_direction": "Decreases Risk",
        "observed_value": 3.1
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": -0.166,
        "percentage_contribution": 12.5,
        "impact_direction": "Decreases Risk",
        "observed_value": "convergent"
      }
    ],
    "confidence_interval": [
      0.111,
      0.187
    ],
    "mitigation": {
      "primary_threat": "Unconsolidated Dune Composition",
      "risk_level": "Low",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 3,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Low susceptibility is predominantly driven by Unconsolidated Dune Composition (SHAP attribution +0.360). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-104",
    "name": "Ortona Cliff & Pebble Spit",
    "region": "Adriatic Central (Abruzzo, Italy)",
    "coordinates": [
      42.355,
      14.402
    ],
    "slope": 9.8,
    "storm_count": 26,
    "storm_energy": 365,
    "depth_of_closure": 5.9,
    "geomorphology": "dune",
    "longshore_direction": "divergent",
    "historical_trend": "Rapid Cliff Slumping (-2.4 m/yr)",
    "urban_density": "Coastal Railway Line",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -2.4,
        "beach_width_m": 42.5,
        "dune_crest_elevation_m": 6.2,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -4.8,
        "annual_retreat_rate_m_yr": -2.3,
        "beach_width_m": 38.8,
        "dune_crest_elevation_m": 5.9,
        "volumetric_loss_m3_m": 69.6,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -9.6,
        "annual_retreat_rate_m_yr": -2.5,
        "beach_width_m": 35.1,
        "dune_crest_elevation_m": 5.6,
        "volumetric_loss_m3_m": 145.9,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -14.4,
        "annual_retreat_rate_m_yr": -2.8,
        "beach_width_m": 31.4,
        "dune_crest_elevation_m": 5.2,
        "volumetric_loss_m3_m": 241.9,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -16.8,
        "annual_retreat_rate_m_yr": -2.6,
        "beach_width_m": 29.8,
        "dune_crest_elevation_m": 5,
        "volumetric_loss_m3_m": 294,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -19.2,
        "annual_retreat_rate_m_yr": -2.4,
        "beach_width_m": 27.9,
        "dune_crest_elevation_m": 4.8,
        "volumetric_loss_m3_m": 349.4,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-104-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 438,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -2.2,
        "volumetric_loss_m3_m": -32.5,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-104-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 347,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -1.4,
        "volumetric_loss_m3_m": -18.2,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-104-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 511,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -3.8,
        "volumetric_loss_m3_m": -48,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-104-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 321,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -1.1,
        "volumetric_loss_m3_m": -14,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.972,
    "susceptibility_index": 97.2,
    "risk_class": "Very High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 1.336,
      "storm_count": 0.948,
      "slope": 0.799,
      "depth_of_closure": 0.313,
      "geomorphology": 0.374,
      "longshore_direction": 0.198
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 1.336,
        "percentage_contribution": 33.7,
        "impact_direction": "Increases Risk",
        "observed_value": 365
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 0.948,
        "percentage_contribution": 23.9,
        "impact_direction": "Increases Risk",
        "observed_value": 26
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.799,
        "percentage_contribution": 20.1,
        "impact_direction": "Increases Risk",
        "observed_value": 9.8
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": 0.374,
        "percentage_contribution": 9.4,
        "impact_direction": "Increases Risk",
        "observed_value": "dune"
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.313,
        "percentage_contribution": 7.9,
        "impact_direction": "Increases Risk",
        "observed_value": 5.9
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.198,
        "percentage_contribution": 5,
        "impact_direction": "Increases Risk",
        "observed_value": "divergent"
      }
    ],
    "confidence_interval": [
      0.934,
      0.99
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Very High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Beach Profile Engineering",
          "title": "Beach Slope Regrading & Living Shoreline Root Reinforcement",
          "description": "Regrade over-steepened beach profiles to a stable 1:25 dissipative gradient and anchor the upper berm with halophyte root systems to resist scarp slumping.",
          "triggered_by_factor": "Over-steepened Cross-Shore Slope",
          "estimated_cost_tier": "$$",
          "time_horizon": "Immediate (1-3 months)",
          "expected_risk_reduction_pct": 26,
          "impact_metric": "Restores Dissipative Profile"
        },
        {
          "priority": 3,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 4,
          "category": "Sediment Management",
          "title": "Littoral Sand Bypassing & Nourishment Feeder Berm",
          "description": "Inject 25,000 m³/yr of compatible coarse sand onto the updrift feeder berm to feed the divergent littoral drift and counteract downdrift sediment starvation.",
          "triggered_by_factor": "Divergent Longshore Sediment Deficit",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Continuous / Annual",
          "expected_risk_reduction_pct": 30,
          "impact_metric": "Compensates Drift Starvation"
        },
        {
          "priority": 5,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 6,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Very High susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +1.336). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-105",
    "name": "Vasto Marina Sand Spit",
    "region": "Adriatic South (Abruzzo, Italy)",
    "coordinates": [
      42.112,
      14.718
    ],
    "slope": 2.8,
    "storm_count": 8,
    "storm_energy": 120,
    "depth_of_closure": 14.2,
    "geomorphology": "gravel",
    "longshore_direction": "convergent",
    "historical_trend": "Stable (+0.2 m/yr)",
    "urban_density": "Resort Beach Zone",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 55,
        "dune_crest_elevation_m": 7.8,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": 1.4,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 56.2,
        "dune_crest_elevation_m": 7.9,
        "volumetric_loss_m3_m": 20.3,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": 2.8,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 57.5,
        "dune_crest_elevation_m": 8.1,
        "volumetric_loss_m3_m": 42.6,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": 4.2,
        "annual_retreat_rate_m_yr": 0.8,
        "beach_width_m": 58.8,
        "dune_crest_elevation_m": 8.2,
        "volumetric_loss_m3_m": 70.6,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": 4.9,
        "annual_retreat_rate_m_yr": 0.8,
        "beach_width_m": 59.4,
        "dune_crest_elevation_m": 8.3,
        "volumetric_loss_m3_m": 85.7,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": 5.6,
        "annual_retreat_rate_m_yr": 0.7,
        "beach_width_m": 60.2,
        "dune_crest_elevation_m": 8.4,
        "volumetric_loss_m3_m": 101.9,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-105-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 144,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -0.5,
        "volumetric_loss_m3_m": -8,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-105-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 114,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -0.3,
        "volumetric_loss_m3_m": -4.5,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-105-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 168,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -0.8,
        "volumetric_loss_m3_m": -11.2,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-105-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 106,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -0.2,
        "volumetric_loss_m3_m": -3,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.13,
    "susceptibility_index": 13,
    "risk_class": "Low",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": -0.366,
      "storm_count": -0.271,
      "slope": -0.202,
      "depth_of_closure": -0.321,
      "geomorphology": -0.158,
      "longshore_direction": -0.166
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": -0.366,
        "percentage_contribution": 24.7,
        "impact_direction": "Decreases Risk",
        "observed_value": 120
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": -0.321,
        "percentage_contribution": 21.6,
        "impact_direction": "Decreases Risk",
        "observed_value": 14.2
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": -0.271,
        "percentage_contribution": 18.3,
        "impact_direction": "Decreases Risk",
        "observed_value": 8
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": -0.202,
        "percentage_contribution": 13.6,
        "impact_direction": "Decreases Risk",
        "observed_value": 2.8
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": -0.166,
        "percentage_contribution": 11.2,
        "impact_direction": "Decreases Risk",
        "observed_value": "convergent"
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": -0.158,
        "percentage_contribution": 10.6,
        "impact_direction": "Decreases Risk",
        "observed_value": "gravel"
      }
    ],
    "confidence_interval": [
      0.092,
      0.168
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Low",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 3,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Low susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +0.366). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-106",
    "name": "Baia Domizia Dune Front",
    "region": "Tyrrhenian Basin (Campania, Italy)",
    "coordinates": [
      41.215,
      13.882
    ],
    "slope": 7.2,
    "storm_count": 19,
    "storm_energy": 285,
    "depth_of_closure": 7.5,
    "geomorphology": "dune",
    "longshore_direction": "divergent",
    "historical_trend": "Severe Dune Breaching (-1.5 m/yr)",
    "urban_density": "Holiday Bungalows & Pine Grove",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 42.5,
        "dune_crest_elevation_m": 6.2,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -3.6,
        "annual_retreat_rate_m_yr": -1.7,
        "beach_width_m": 38.8,
        "dune_crest_elevation_m": 5.9,
        "volumetric_loss_m3_m": 52.2,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -7.2,
        "annual_retreat_rate_m_yr": -1.9,
        "beach_width_m": 35.1,
        "dune_crest_elevation_m": 5.6,
        "volumetric_loss_m3_m": 109.4,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -10.8,
        "annual_retreat_rate_m_yr": -2.1,
        "beach_width_m": 31.4,
        "dune_crest_elevation_m": 5.2,
        "volumetric_loss_m3_m": 181.4,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -12.6,
        "annual_retreat_rate_m_yr": -2,
        "beach_width_m": 29.8,
        "dune_crest_elevation_m": 5,
        "volumetric_loss_m3_m": 220.5,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -14.4,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 27.9,
        "dune_crest_elevation_m": 4.8,
        "volumetric_loss_m3_m": 262.1,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-106-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 342,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -2.2,
        "volumetric_loss_m3_m": -32.5,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-106-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 271,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -1.4,
        "volumetric_loss_m3_m": -18.2,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-106-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 399,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -3.8,
        "volumetric_loss_m3_m": -48,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-106-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 251,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -1.1,
        "volumetric_loss_m3_m": -14,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.87,
    "susceptibility_index": 87,
    "risk_class": "Very High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 0.708,
      "storm_count": 0.474,
      "slope": 0.376,
      "depth_of_closure": 0.191,
      "geomorphology": 0.374,
      "longshore_direction": 0.198
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 0.708,
        "percentage_contribution": 30.5,
        "impact_direction": "Increases Risk",
        "observed_value": 285
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 0.474,
        "percentage_contribution": 20.4,
        "impact_direction": "Increases Risk",
        "observed_value": 19
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.376,
        "percentage_contribution": 16.2,
        "impact_direction": "Increases Risk",
        "observed_value": 7.2
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": 0.374,
        "percentage_contribution": 16.1,
        "impact_direction": "Increases Risk",
        "observed_value": "dune"
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.198,
        "percentage_contribution": 8.5,
        "impact_direction": "Increases Risk",
        "observed_value": "divergent"
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.191,
        "percentage_contribution": 8.2,
        "impact_direction": "Increases Risk",
        "observed_value": 7.5
      }
    ],
    "confidence_interval": [
      0.832,
      0.908
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Very High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Beach Profile Engineering",
          "title": "Beach Slope Regrading & Living Shoreline Root Reinforcement",
          "description": "Regrade over-steepened beach profiles to a stable 1:25 dissipative gradient and anchor the upper berm with halophyte root systems to resist scarp slumping.",
          "triggered_by_factor": "Over-steepened Cross-Shore Slope",
          "estimated_cost_tier": "$$",
          "time_horizon": "Immediate (1-3 months)",
          "expected_risk_reduction_pct": 26,
          "impact_metric": "Restores Dissipative Profile"
        },
        {
          "priority": 3,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 4,
          "category": "Sediment Management",
          "title": "Littoral Sand Bypassing & Nourishment Feeder Berm",
          "description": "Inject 25,000 m³/yr of compatible coarse sand onto the updrift feeder berm to feed the divergent littoral drift and counteract downdrift sediment starvation.",
          "triggered_by_factor": "Divergent Longshore Sediment Deficit",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Continuous / Annual",
          "expected_risk_reduction_pct": 30,
          "impact_metric": "Compensates Drift Starvation"
        },
        {
          "priority": 5,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 6,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Very High susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +0.708). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-107",
    "name": "Cinque Terre Pocket Beach",
    "region": "Ligurian Coast (Liguria, Italy)",
    "coordinates": [
      44.135,
      9.684
    ],
    "slope": 11.2,
    "storm_count": 21,
    "storm_energy": 340,
    "depth_of_closure": 6.2,
    "geomorphology": "gravel",
    "longshore_direction": "transitional",
    "historical_trend": "Episodic Washout (-1.1 m/yr)",
    "urban_density": "UNESCO Heritage Village",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 42.5,
        "dune_crest_elevation_m": 6.2,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -3.6,
        "annual_retreat_rate_m_yr": -1.7,
        "beach_width_m": 38.8,
        "dune_crest_elevation_m": 5.9,
        "volumetric_loss_m3_m": 52.2,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -7.2,
        "annual_retreat_rate_m_yr": -1.9,
        "beach_width_m": 35.1,
        "dune_crest_elevation_m": 5.6,
        "volumetric_loss_m3_m": 109.4,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -10.8,
        "annual_retreat_rate_m_yr": -2.1,
        "beach_width_m": 31.4,
        "dune_crest_elevation_m": 5.2,
        "volumetric_loss_m3_m": 181.4,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -12.6,
        "annual_retreat_rate_m_yr": -2,
        "beach_width_m": 29.8,
        "dune_crest_elevation_m": 5,
        "volumetric_loss_m3_m": 220.5,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -14.4,
        "annual_retreat_rate_m_yr": -1.8,
        "beach_width_m": 27.9,
        "dune_crest_elevation_m": 4.8,
        "volumetric_loss_m3_m": 262.1,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-107-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 408,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -2.2,
        "volumetric_loss_m3_m": -32.5,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-107-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 323,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -1.4,
        "volumetric_loss_m3_m": -18.2,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-107-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 476,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -3.8,
        "volumetric_loss_m3_m": -48,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-107-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 299,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -1.1,
        "volumetric_loss_m3_m": -14,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.926,
    "susceptibility_index": 92.6,
    "risk_class": "Very High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 1.205,
      "storm_count": 0.609,
      "slope": 0.982,
      "depth_of_closure": 0.29,
      "geomorphology": -0.158,
      "longshore_direction": 0.021
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 1.205,
        "percentage_contribution": 36.9,
        "impact_direction": "Increases Risk",
        "observed_value": 340
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.982,
        "percentage_contribution": 30.1,
        "impact_direction": "Increases Risk",
        "observed_value": 11.2
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 0.609,
        "percentage_contribution": 18.7,
        "impact_direction": "Increases Risk",
        "observed_value": 21
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.29,
        "percentage_contribution": 8.9,
        "impact_direction": "Increases Risk",
        "observed_value": 6.2
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": -0.158,
        "percentage_contribution": 4.8,
        "impact_direction": "Decreases Risk",
        "observed_value": "gravel"
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.021,
        "percentage_contribution": 0.6,
        "impact_direction": "Increases Risk",
        "observed_value": "transitional"
      }
    ],
    "confidence_interval": [
      0.888,
      0.964
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Very High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Beach Profile Engineering",
          "title": "Beach Slope Regrading & Living Shoreline Root Reinforcement",
          "description": "Regrade over-steepened beach profiles to a stable 1:25 dissipative gradient and anchor the upper berm with halophyte root systems to resist scarp slumping.",
          "triggered_by_factor": "Over-steepened Cross-Shore Slope",
          "estimated_cost_tier": "$$",
          "time_horizon": "Immediate (1-3 months)",
          "expected_risk_reduction_pct": 26,
          "impact_metric": "Restores Dissipative Profile"
        },
        {
          "priority": 3,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 4,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Very High susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +1.205). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  },
  {
    "id": "TRX-108",
    "name": "Outer Banks Cape Hatteras",
    "region": "Atlantic Seaboard (North Carolina, USA)",
    "coordinates": [
      35.245,
      -75.525
    ],
    "slope": 8.9,
    "storm_count": 28,
    "storm_energy": 410,
    "depth_of_closure": 5.4,
    "geomorphology": "dune",
    "longshore_direction": "divergent",
    "historical_trend": "Critical Overwash (-3.2 m/yr)",
    "urban_density": "National Seashore & Highway 12",
    "historical_surveys": [
      {
        "year": 2018,
        "date": "2018-05-14",
        "shoreline_displacement_m": 0,
        "annual_retreat_rate_m_yr": -3.2,
        "beach_width_m": 42.5,
        "dune_crest_elevation_m": 6.2,
        "volumetric_loss_m3_m": 0,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Baseline GPS regional geodetic survey."
      },
      {
        "year": 2020,
        "date": "2020-09-22",
        "shoreline_displacement_m": -6.4,
        "annual_retreat_rate_m_yr": -3,
        "beach_width_m": 38.8,
        "dune_crest_elevation_m": 5.9,
        "volumetric_loss_m3_m": 92.8,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "Post-winter season UAV drone photogrammetry."
      },
      {
        "year": 2022,
        "date": "2022-06-18",
        "shoreline_displacement_m": -12.8,
        "annual_retreat_rate_m_yr": -3.4,
        "beach_width_m": 35.1,
        "dune_crest_elevation_m": 5.6,
        "volumetric_loss_m3_m": 194.6,
        "survey_method": "Airborne Topo-Bathymetric LiDAR",
        "notes": "Copernicus coastal DEM LiDAR flight campaign."
      },
      {
        "year": 2024,
        "date": "2024-10-05",
        "shoreline_displacement_m": -19.2,
        "annual_retreat_rate_m_yr": -3.7,
        "beach_width_m": 31.4,
        "dune_crest_elevation_m": 5.2,
        "volumetric_loss_m3_m": 322.6,
        "survey_method": "Sentinel-2 Multi-Spectral",
        "notes": "Post-Cyclone Boris automated satellite sub-pixel edge extraction."
      },
      {
        "year": 2025,
        "date": "2025-11-12",
        "shoreline_displacement_m": -22.4,
        "annual_retreat_rate_m_yr": -3.5,
        "beach_width_m": 29.8,
        "dune_crest_elevation_m": 5,
        "volumetric_loss_m3_m": 392,
        "survey_method": "UAV Airborne LiDAR",
        "notes": "High-density 300 kHz drone LiDAR point cloud."
      },
      {
        "year": 2026,
        "date": "2026-06-30",
        "shoreline_displacement_m": -25.6,
        "annual_retreat_rate_m_yr": -3.2,
        "beach_width_m": 27.9,
        "dune_crest_elevation_m": 4.8,
        "volumetric_loss_m3_m": 465.9,
        "survey_method": "RTK-DGPS GNSS",
        "notes": "Current calibrated geodetic benchmark survey."
      }
    ],
    "historical_storms": [
      {
        "id": "STM-TRX-108-01",
        "name": "Storm Vaia & Adriatic Surge",
        "date": "2018-10-29",
        "season": "Autumn 2018",
        "peak_hs_m": 4.8,
        "peak_wave_energy_kw_m": 492,
        "peak_surge_m": 1.45,
        "max_wind_speed_kmh": 110,
        "scarp_retreat_recorded_m": -2.2,
        "volumetric_loss_m3_m": -32.5,
        "impact_summary": "Severe southerly Scirocco gale causing prolonged wave setup and foredune scarp undercutting.",
        "emergency_action_taken": "Emergency rock rip-rap dumping and beach closure."
      },
      {
        "id": "STM-TRX-108-02",
        "name": "Winter Bora Deep Cyclonic Low",
        "date": "2021-01-23",
        "season": "Winter 2021",
        "peak_hs_m": 3.9,
        "peak_wave_energy_kw_m": 390,
        "peak_surge_m": 0.95,
        "max_wind_speed_kmh": 85,
        "scarp_retreat_recorded_m": -1.4,
        "volumetric_loss_m3_m": -18.2,
        "impact_summary": "North-easterly Bora wind swell attacking upper beach berm with sustained 7-second wave periods.",
        "emergency_action_taken": "Temporary sand berm scraping and drainage diversion."
      },
      {
        "id": "STM-TRX-108-03",
        "name": "Cyclone Boris Extreme Surge",
        "date": "2024-09-17",
        "season": "Late Summer 2024",
        "peak_hs_m": 5.4,
        "peak_wave_energy_kw_m": 574,
        "peak_surge_m": 1.75,
        "max_wind_speed_kmh": 125,
        "scarp_retreat_recorded_m": -3.8,
        "volumetric_loss_m3_m": -48,
        "impact_summary": "Record-breaking Mediterranean cyclone with catastrophic wave runup and widespread boardwalk overwash.",
        "emergency_action_taken": "Civil Protection Level 3 alert, geotextile tube emergency deployment, coastal road evacuated."
      },
      {
        "id": "STM-TRX-108-04",
        "name": "Adriatic Spring Gale Surge",
        "date": "2025-04-11",
        "season": "Spring 2025",
        "peak_hs_m": 3.6,
        "peak_wave_energy_kw_m": 361,
        "peak_surge_m": 0.8,
        "max_wind_speed_kmh": 78,
        "scarp_retreat_recorded_m": -1.1,
        "volumetric_loss_m3_m": -14,
        "impact_summary": "Spring tide coupled with localized gale resulting in minor toe scarp slumping.",
        "emergency_action_taken": "Post-storm LiDAR UAV survey and dune revegetation fencing."
      }
    ],
    "probability": 0.98,
    "susceptibility_index": 98,
    "risk_class": "Very High",
    "base_value": -0.42,
    "shap_values": {
      "storm_energy": 1.618,
      "storm_count": 1.083,
      "slope": 0.697,
      "depth_of_closure": 0.351,
      "geomorphology": 0.374,
      "longshore_direction": 0.198
    },
    "top_contributing_factors": [
      {
        "factor": "storm_energy",
        "displayName": "Storm Wave Energy Flux (kW/m)",
        "shap_value": 1.618,
        "percentage_contribution": 37.4,
        "impact_direction": "Increases Risk",
        "observed_value": 410
      },
      {
        "factor": "storm_count",
        "displayName": "Storm Recurrence Frequency",
        "shap_value": 1.083,
        "percentage_contribution": 25.1,
        "impact_direction": "Increases Risk",
        "observed_value": 28
      },
      {
        "factor": "slope",
        "displayName": "Beach & Cliff Slope (%)",
        "shap_value": 0.697,
        "percentage_contribution": 16.1,
        "impact_direction": "Increases Risk",
        "observed_value": 8.9
      },
      {
        "factor": "geomorphology",
        "displayName": "Substrate Geomorphology",
        "shap_value": 0.374,
        "percentage_contribution": 8.7,
        "impact_direction": "Increases Risk",
        "observed_value": "dune"
      },
      {
        "factor": "depth_of_closure",
        "displayName": "Depth of Closure (m)",
        "shap_value": 0.351,
        "percentage_contribution": 8.1,
        "impact_direction": "Increases Risk",
        "observed_value": 5.4
      },
      {
        "factor": "longshore_direction",
        "displayName": "Longshore Drift Balance",
        "shap_value": 0.198,
        "percentage_contribution": 4.6,
        "impact_direction": "Increases Risk",
        "observed_value": "divergent"
      }
    ],
    "confidence_interval": [
      0.942,
      0.99
    ],
    "mitigation": {
      "primary_threat": "Severe Wave Energy Flux",
      "risk_level": "Very High",
      "recommended_actions": [
        {
          "priority": 1,
          "category": "Nature-Based & Hybrid Infrastructure",
          "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          "description": "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45% without disrupting littoral aesthetics.",
          "triggered_by_factor": "Elevated Storm Wave Energy Flux",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Medium-Term (6-14 months)",
          "expected_risk_reduction_pct": 38.5,
          "impact_metric": "-42% Peak Wave Impact"
        },
        {
          "priority": 2,
          "category": "Beach Profile Engineering",
          "title": "Beach Slope Regrading & Living Shoreline Root Reinforcement",
          "description": "Regrade over-steepened beach profiles to a stable 1:25 dissipative gradient and anchor the upper berm with halophyte root systems to resist scarp slumping.",
          "triggered_by_factor": "Over-steepened Cross-Shore Slope",
          "estimated_cost_tier": "$$",
          "time_horizon": "Immediate (1-3 months)",
          "expected_risk_reduction_pct": 26,
          "impact_metric": "Restores Dissipative Profile"
        },
        {
          "priority": 3,
          "category": "Ecological Restoration",
          "title": "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          "description": "Restore degraded primary foredune buffers using sand-trapping brushwood fences and native Ammophila arenaria vegetation to trap aeolian sand and create a natural storm barrier.",
          "triggered_by_factor": "Erodible Dune / Sandy Substrate",
          "estimated_cost_tier": "$$",
          "time_horizon": "Seasonal (3-6 months)",
          "expected_risk_reduction_pct": 32,
          "impact_metric": "+3.5m Foredune Elevation Buffer"
        },
        {
          "priority": 4,
          "category": "Sediment Management",
          "title": "Littoral Sand Bypassing & Nourishment Feeder Berm",
          "description": "Inject 25,000 m³/yr of compatible coarse sand onto the updrift feeder berm to feed the divergent littoral drift and counteract downdrift sediment starvation.",
          "triggered_by_factor": "Divergent Longshore Sediment Deficit",
          "estimated_cost_tier": "$$$",
          "time_horizon": "Continuous / Annual",
          "expected_risk_reduction_pct": 30,
          "impact_metric": "Compensates Drift Starvation"
        },
        {
          "priority": 5,
          "category": "Monitoring & Early Warning",
          "title": "Sentinel-1/2 SAR & Drone LiDAR Erosion Early Warning Protocol",
          "description": "Institute automated fortnightly satellite InSAR coherence and UAV LiDAR monitoring to trigger rapid emergency nourishment whenever the buffer drops below threshold.",
          "triggered_by_factor": "High Storm Recurrence Frequency",
          "estimated_cost_tier": "$",
          "time_horizon": "Immediate (< 1 month)",
          "expected_risk_reduction_pct": 15,
          "impact_metric": "24/7 Sub-centimeter Shoreline Tracking"
        },
        {
          "priority": 6,
          "category": "Spatial Policy & Managed Realignment",
          "title": "Coastal Hazard Setback Corridor (100m Zone)",
          "description": "Enact a non-structural statutory buffer prohibiting fixed development within 100 meters of the active shoreline, allowing dynamic natural beach migration.",
          "triggered_by_factor": "Constrained Active Depth of Closure",
          "estimated_cost_tier": "$",
          "time_horizon": "Policy / Long-Term",
          "expected_risk_reduction_pct": 45,
          "impact_metric": "Zero Asset Exposure"
        }
      ],
      "decision_rationale": "Machine learning inference and TreeSHAP attribution indicate that Very High susceptibility is predominantly driven by Severe Wave Energy Flux (SHAP attribution +1.618). Implementing Submerged Multi-Purpose Artificial Reef & Oyster Sill is projected to yield an estimated 38.5% reduction in cross-shore erosion vulnerability."
    }
  }
];
