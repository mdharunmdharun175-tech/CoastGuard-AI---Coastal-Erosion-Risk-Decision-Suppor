import { CoastalTransect } from "../types";

export const FULL_COASTAL_DATASET: CoastalTransect[] = [
  {
    id: "TRX-101",
    name: "Costa dei Trabocchi - Punta Aderci",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.1855, 14.6865],
    slope: 8.4,
    storm_count: 22,
    storm_energy: 310.5,
    depth_of_closure: 6.8,
    geomorphology: "dune",
    longshore_direction: "divergent",
    historical_trend: "Retreating (-1.8 m/yr)",
    urban_density: "Protected Reserve / Scenic Trail",
    probability: 0.884,
    susceptibility_index: 88.4,
    risk_class: "Very High",
    base_value: -0.42,
    shap_values: {
      storm_energy: 0.798,
      slope: 0.463,
      geomorphology: 0.374,
      storm_count: 0.380,
      depth_of_closure: 0.244,
      longshore_direction: 0.198
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 0.798, percentage_contribution: 32.5, impact_direction: "Increases Risk", observed_value: 310.5 },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.463, percentage_contribution: 18.8, impact_direction: "Increases Risk", observed_value: 8.4 },
      { factor: "storm_count", displayName: "Storm Recurrence Frequency", shap_value: 0.380, percentage_contribution: 15.5, impact_direction: "Increases Risk", observed_value: 22 },
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: 0.374, percentage_contribution: 15.2, impact_direction: "Increases Risk", observed_value: "dune" },
      { factor: "depth_of_closure", displayName: "Depth of Closure (m)", shap_value: 0.244, percentage_contribution: 9.9, impact_direction: "Increases Risk", observed_value: 6.8 },
      { factor: "longshore_direction", displayName: "Longshore Drift Balance", shap_value: 0.198, percentage_contribution: 8.1, impact_direction: "Increases Risk", observed_value: "divergent" }
    ],
    confidence_interval: [0.846, 0.922],
    mitigation: {
      primary_threat: "Severe Wave Energy Flux",
      risk_level: "Very High",
      decision_rationale: "Model shows extreme wave energy and high slope causing scarp retreat.",
      recommended_actions: [
        {
          priority: 1,
          category: "Nature-Based & Hybrid Infrastructure",
          title: "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          description: "Deploy low-crested submerged geotextile or oyster-seeded rock reefs 150m seaward to attenuate incident wave power by 35-45%.",
          triggered_by_factor: "Elevated Storm Wave Energy Flux",
          estimated_cost_tier: "$$$",
          time_horizon: "Medium-Term (6-14 months)",
          expected_risk_reduction_pct: 38.5,
          impact_metric: "-42% Peak Wave Impact"
        }
      ]
    }
  },
  {
    id: "TRX-102",
    name: "San Vito Chietino Littoral",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.2980, 14.4440],
    slope: 5.2,
    storm_count: 14,
    storm_energy: 195.0,
    depth_of_closure: 9.4,
    geomorphology: "sandy",
    longshore_direction: "transitional",
    historical_trend: "Moderate Erosion (-0.6 m/yr)",
    urban_density: "Boardwalk & Tourism Strip",
    probability: 0.542,
    susceptibility_index: 54.2,
    risk_class: "Medium",
    base_value: -0.42,
    shap_values: {
      storm_energy: 0.092,
      slope: 0.083,
      geomorphology: 0.252,
      storm_count: 0.051,
      depth_of_closure: 0.046,
      longshore_direction: 0.021
    },
    top_contributing_factors: [
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: 0.252, percentage_contribution: 46.2, impact_direction: "Increases Risk", observed_value: "sandy" },
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 0.092, percentage_contribution: 16.9, impact_direction: "Increases Risk", observed_value: 195.0 },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.083, percentage_contribution: 15.2, impact_direction: "Increases Risk", observed_value: 5.2 }
    ],
    confidence_interval: [0.504, 0.580],
    mitigation: {
      primary_threat: "Sandy Beach Abrasion",
      risk_level: "Medium",
      decision_rationale: "Balanced littoral drift with sandy substrate requires periodic nourishment.",
      recommended_actions: [
        {
          priority: 1,
          category: "Ecological Restoration",
          title: "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          description: "Restore degraded primary foredune buffers using sand-trapping brushwood fences.",
          triggered_by_factor: "Erodible Sandy Substrate",
          estimated_cost_tier: "$$",
          time_horizon: "Seasonal (3-6 months)",
          expected_risk_reduction_pct: 32.0,
          impact_metric: "+3.5m Elevation Buffer"
        }
      ]
    }
  },
  {
    id: "TRX-103",
    name: "Pescara River Mouth Barrier",
    region: "Adriatic North (Abruzzo, Italy)",
    coordinates: [42.4680, 14.2250],
    slope: 3.1,
    storm_count: 9,
    storm_energy: 145.0,
    depth_of_closure: 12.8,
    geomorphology: "defence structure",
    longshore_direction: "convergent",
    historical_trend: "Accreting (+0.9 m/yr)",
    urban_density: "Port & Marina Infrastructure",
    probability: 0.185,
    susceptibility_index: 18.5,
    risk_class: "Low",
    base_value: -0.42,
    shap_values: {
      geomorphology: -0.360,
      longshore_direction: -0.166,
      slope: -0.166,
      depth_of_closure: -0.213,
      storm_energy: -0.214,
      storm_count: -0.203
    },
    top_contributing_factors: [
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: -0.360, percentage_contribution: 27.2, impact_direction: "Decreases Risk", observed_value: "defence structure" },
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: -0.214, percentage_contribution: 16.2, impact_direction: "Decreases Risk", observed_value: 145.0 },
      { factor: "depth_of_closure", displayName: "Depth of Closure (m)", shap_value: -0.213, percentage_contribution: 16.1, impact_direction: "Decreases Risk", observed_value: 12.8 }
    ],
    confidence_interval: [0.147, 0.223],
    mitigation: {
      primary_threat: "Sediment Siltation",
      risk_level: "Low",
      decision_rationale: "Accreting conditions protected by seawall structures.",
      recommended_actions: [
        {
          priority: 1,
          category: "Routine Stewardship",
          title: "Baseline Environmental Profiling & Bi-Annual Surveys",
          description: "Maintain standard GPS transect surveys. Currently within stable equilibrium.",
          triggered_by_factor: "Stable sediment budget",
          estimated_cost_tier: "$",
          time_horizon: "Ongoing",
          expected_risk_reduction_pct: 10.0,
          impact_metric: "Equilibrium Maintained"
        }
      ]
    }
  },
  {
    id: "TRX-104",
    name: "Ortona Cliff & Pebble Spit",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.3550, 14.4020],
    slope: 9.8,
    storm_count: 26,
    storm_energy: 365.0,
    depth_of_closure: 5.9,
    geomorphology: "dune",
    longshore_direction: "divergent",
    historical_trend: "Rapid Cliff Slumping (-2.4 m/yr)",
    urban_density: "Coastal Railway Line",
    probability: 0.942,
    susceptibility_index: 94.2,
    risk_class: "Very High",
    base_value: -0.42,
    shap_values: {
      storm_energy: 1.130,
      slope: 0.629,
      storm_count: 0.612,
      geomorphology: 0.374,
      depth_of_closure: 0.312,
      longshore_direction: 0.198
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 1.130, percentage_contribution: 34.7, impact_direction: "Increases Risk", observed_value: 365.0 },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.629, percentage_contribution: 19.3, impact_direction: "Increases Risk", observed_value: 9.8 },
      { factor: "storm_count", displayName: "Storm Recurrence Frequency", shap_value: 0.612, percentage_contribution: 18.8, impact_direction: "Increases Risk", observed_value: 26 }
    ],
    confidence_interval: [0.904, 0.980],
    mitigation: {
      primary_threat: "Extreme Cliff Slumping & Storm Wave Attack",
      risk_level: "Very High",
      decision_rationale: "Imminent danger to railway corridor from cliff scarp erosion.",
      recommended_actions: [
        {
          priority: 1,
          category: "Nature-Based & Hybrid Infrastructure",
          title: "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
          description: "Deploy low-crested submerged geotextile rock reefs 150m seaward to attenuate peak wave energy.",
          triggered_by_factor: "Critical Storm Wave Energy (365 kW/m)",
          estimated_cost_tier: "$$$",
          time_horizon: "Immediate (1-3 months)",
          expected_risk_reduction_pct: 42.0,
          impact_metric: "-48% Wave Impact on Toe"
        }
      ]
    }
  },
  {
    id: "TRX-105",
    name: "Vasto Marina Sand Spit",
    region: "Adriatic South (Abruzzo, Italy)",
    coordinates: [42.1120, 14.7180],
    slope: 2.8,
    storm_count: 8,
    storm_energy: 120.0,
    depth_of_closure: 14.2,
    geomorphology: "gravel",
    longshore_direction: "convergent",
    historical_trend: "Stable (+0.2 m/yr)",
    urban_density: "Resort Beach Zone",
    probability: 0.162,
    susceptibility_index: 16.2,
    risk_class: "Low",
    base_value: -0.42,
    shap_values: {
      geomorphology: -0.158,
      longshore_direction: -0.166,
      slope: -0.201,
      depth_of_closure: -0.320,
      storm_energy: -0.366,
      storm_count: -0.271
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: -0.366, percentage_contribution: 24.7, impact_direction: "Decreases Risk", observed_value: 120.0 },
      { factor: "depth_of_closure", displayName: "Depth of Closure (m)", shap_value: -0.320, percentage_contribution: 21.6, impact_direction: "Decreases Risk", observed_value: 14.2 }
    ],
    confidence_interval: [0.124, 0.200],
    mitigation: {
      primary_threat: "Stable Wave Climate",
      risk_level: "Low",
      decision_rationale: "Broad dissipative profile with gravel armor.",
      recommended_actions: [
        {
          priority: 1,
          category: "Routine Stewardship",
          title: "Baseline Environmental Profiling",
          description: "Maintain regular GPS monitoring of shoreline contour.",
          triggered_by_factor: "Equilibrium state",
          estimated_cost_tier: "$",
          time_horizon: "Ongoing",
          expected_risk_reduction_pct: 10.0,
          impact_metric: "Stable Baseline"
        }
      ]
    }
  },
  {
    id: "TRX-106",
    name: "Baia Domizia Dune Front",
    region: "Tyrrhenian Basin (Campania, Italy)",
    coordinates: [41.2150, 13.8820],
    slope: 7.2,
    storm_count: 19,
    storm_energy: 285.0,
    depth_of_closure: 7.5,
    geomorphology: "dune",
    longshore_direction: "divergent",
    historical_trend: "Severe Dune Breaching (-1.5 m/yr)",
    urban_density: "Holiday Bungalows & Pine Grove",
    probability: 0.812,
    susceptibility_index: 81.2,
    risk_class: "Very High",
    base_value: -0.42,
    shap_values: {
      storm_energy: 0.641,
      slope: 0.320,
      storm_count: 0.274,
      geomorphology: 0.374,
      depth_of_closure: 0.190,
      longshore_direction: 0.198
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 0.641, percentage_contribution: 32.1, impact_direction: "Increases Risk", observed_value: 285.0 },
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: 0.374, percentage_contribution: 18.7, impact_direction: "Increases Risk", observed_value: "dune" },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.320, percentage_contribution: 16.0, impact_direction: "Increases Risk", observed_value: 7.2 }
    ],
    confidence_interval: [0.774, 0.850],
    mitigation: {
      primary_threat: "Dune Breach & Inundation",
      risk_level: "Very High",
      decision_rationale: "Vulnerable holiday structures on top of degrading foredune.",
      recommended_actions: [
        {
          priority: 1,
          category: "Ecological Restoration",
          title: "Foredune Core Nourishment & Marram Grass (Ammophila) Planting",
          description: "Install sand fencing and restore 4m crest buffer.",
          triggered_by_factor: "Dune Crest Degradation",
          estimated_cost_tier: "$$",
          time_horizon: "Seasonal (3-6 months)",
          expected_risk_reduction_pct: 35.0,
          impact_metric: "+4.0m Dune Protection"
        }
      ]
    }
  },
  {
    id: "TRX-107",
    name: "Cinque Terre Pocket Beach",
    region: "Ligurian Coast (Liguria, Italy)",
    coordinates: [44.1350, 9.6840],
    slope: 11.2,
    storm_count: 21,
    storm_energy: 340.0,
    depth_of_closure: 6.2,
    geomorphology: "gravel",
    longshore_direction: "transitional",
    historical_trend: "Episodic Washout (-1.1 m/yr)",
    urban_density: "UNESCO Heritage Village",
    probability: 0.768,
    susceptibility_index: 76.8,
    risk_class: "Very High",
    base_value: -0.42,
    shap_values: {
      slope: 0.795,
      storm_energy: 0.976,
      storm_count: 0.342,
      geomorphology: -0.158,
      depth_of_closure: 0.289,
      longshore_direction: 0.021
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 0.976, percentage_contribution: 43.1, impact_direction: "Increases Risk", observed_value: 340.0 },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.795, percentage_contribution: 35.1, impact_direction: "Increases Risk", observed_value: 11.2 }
    ],
    confidence_interval: [0.730, 0.806],
    mitigation: {
      primary_threat: "Steep Pocket Beach Runup",
      risk_level: "Very High",
      decision_rationale: "Pocket cove with steep slope amplifies wave reflectiveness.",
      recommended_actions: [
        {
          priority: 1,
          category: "Beach Profile Engineering",
          title: "Beach Slope Regrading & Coarse Gravel Replenishment",
          description: "Stabilize toe using coarse cobbles and dissipative stepping.",
          triggered_by_factor: "Extreme Slope (11.2%)",
          estimated_cost_tier: "$$",
          time_horizon: "Immediate (1-3 months)",
          expected_risk_reduction_pct: 28.0,
          impact_metric: "Dissipative Stepped Slope"
        }
      ]
    }
  },
  {
    id: "TRX-108",
    name: "Outer Banks Cape Hatteras",
    region: "Atlantic Seaboard (North Carolina, USA)",
    coordinates: [35.2450, -75.5250],
    slope: 8.9,
    storm_count: 28,
    storm_energy: 410.0,
    depth_of_closure: 5.4,
    geomorphology: "dune",
    longshore_direction: "divergent",
    historical_trend: "Critical Overwash (-3.2 m/yr)",
    urban_density: "National Seashore & Highway 12",
    probability: 0.965,
    susceptibility_index: 96.5,
    risk_class: "Very High",
    base_value: -0.42,
    shap_values: {
      storm_energy: 1.405,
      storm_count: 0.748,
      slope: 0.522,
      depth_of_closure: 0.351,
      geomorphology: 0.374,
      longshore_direction: 0.198
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 1.405, percentage_contribution: 39.0, impact_direction: "Increases Risk", observed_value: 410.0 },
      { factor: "storm_count", displayName: "Storm Recurrence Frequency", shap_value: 0.748, percentage_contribution: 20.8, impact_direction: "Increases Risk", observed_value: 28 }
    ],
    confidence_interval: [0.927, 0.990],
    mitigation: {
      primary_threat: "Catastrophic Barrier Island Overwash",
      risk_level: "Very High",
      decision_rationale: "Nor'easters and hurricanes threaten critical coastal highway.",
      recommended_actions: [
        {
          priority: 1,
          category: "Spatial Policy & Managed Realignment",
          title: "Elevated Causeway Bridge & Dynamic Dune Sanctuary",
          description: "Elevate infrastructure while allowing natural overwash migration.",
          triggered_by_factor: "Extreme Storm Attack (410 kW/m)",
          estimated_cost_tier: "$$$$",
          time_horizon: "Long-Term (2-3 years)",
          expected_risk_reduction_pct: 45.0,
          impact_metric: "Eliminates Highway Severance"
        }
      ]
    }
  },
  {
    id: "TRX-109",
    name: "Fossacesia Marina Trabocco Cove",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.2450, 14.5020],
    slope: 4.1,
    storm_count: 11,
    storm_energy: 165.0,
    depth_of_closure: 10.8,
    geomorphology: "gravel",
    longshore_direction: "transitional",
    historical_trend: "Minor Fluctuations (-0.2 m/yr)",
    urban_density: "Trabocchi Heritage & Bike Path",
    probability: 0.284,
    susceptibility_index: 28.4,
    risk_class: "Low",
    base_value: -0.42,
    shap_values: {
      geomorphology: -0.158,
      slope: -0.047,
      storm_energy: -0.091,
      storm_count: -0.068,
      depth_of_closure: -0.061,
      longshore_direction: 0.021
    },
    top_contributing_factors: [
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: -0.158, percentage_contribution: 35.4, impact_direction: "Decreases Risk", observed_value: "gravel" },
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: -0.091, percentage_contribution: 20.4, impact_direction: "Decreases Risk", observed_value: 165.0 }
    ],
    confidence_interval: [0.246, 0.322],
    mitigation: {
      primary_threat: "Heritage Timber Pile Scouring",
      risk_level: "Low",
      decision_rationale: "Stable gravel beach protects cultural structures.",
      recommended_actions: [
        {
          priority: 1,
          category: "Routine Stewardship",
          title: "Periodic Hydrographic Sonar Check",
          description: "Monitor subsea pile anchors around wooden Trabocchi platforms.",
          triggered_by_factor: "Heritage conservation",
          estimated_cost_tier: "$",
          time_horizon: "Ongoing",
          expected_risk_reduction_pct: 12.0,
          impact_metric: "Subsea Anchor Integrity"
        }
      ]
    }
  },
  {
    id: "TRX-110",
    name: "Francavilla al Mare Sand Spit",
    region: "Adriatic North (Abruzzo, Italy)",
    coordinates: [42.4180, 14.2950],
    slope: 6.4,
    storm_count: 17,
    storm_energy: 240.0,
    depth_of_closure: 8.1,
    geomorphology: "sandy",
    longshore_direction: "divergent",
    historical_trend: "Moderate Retreat (-1.1 m/yr)",
    urban_density: "Dense Urban Beachfront",
    probability: 0.698,
    susceptibility_index: 69.8,
    risk_class: "High",
    base_value: -0.42,
    shap_values: {
      storm_energy: 0.366,
      slope: 0.225,
      geomorphology: 0.252,
      storm_count: 0.170,
      longshore_direction: 0.198,
      depth_of_closure: 0.145
    },
    top_contributing_factors: [
      { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: 0.366, percentage_contribution: 26.9, impact_direction: "Increases Risk", observed_value: 240.0 },
      { factor: "geomorphology", displayName: "Substrate Geomorphology", shap_value: 0.252, percentage_contribution: 18.6, impact_direction: "Increases Risk", observed_value: "sandy" },
      { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: 0.225, percentage_contribution: 16.6, impact_direction: "Increases Risk", observed_value: 6.4 }
    ],
    confidence_interval: [0.660, 0.736],
    mitigation: {
      primary_threat: "Urban Beachfront Scouring",
      risk_level: "High",
      decision_rationale: "Dense tourism facilities require continuous beach nourishment.",
      recommended_actions: [
        {
          priority: 1,
          category: "Sediment Management",
          title: "Littoral Sand Bypassing & Nourishment Feeder Berm",
          description: "Inject 30,000 m3/yr coarse sand updrift to feed divergent drift.",
          triggered_by_factor: "Divergent Drift Deficit",
          estimated_cost_tier: "$$$",
          time_horizon: "Annual",
          expected_risk_reduction_pct: 30.0,
          impact_metric: "+15m Beach Width Buffer"
        }
      ]
    }
  }
];

// Utility: Generate Full Raw CSV String from Dataset
export function generateDatasetCSV(transects: CoastalTransect[] = FULL_COASTAL_DATASET): string {
  const headers = [
    "transect_id",
    "name",
    "region",
    "latitude",
    "longitude",
    "slope_pct",
    "storm_count_yr",
    "storm_energy_kw_m",
    "depth_of_closure_m",
    "geomorphology",
    "longshore_drift",
    "historical_trend",
    "urban_density",
    "susceptibility_probability",
    "risk_class",
    "primary_driver",
    "top_shap_value"
  ];

  const rows = transects.map((t) => [
    t.id,
    `"${t.name.replace(/"/g, '""')}"`,
    `"${t.region.replace(/"/g, '""')}"`,
    t.coordinates[0].toFixed(5),
    t.coordinates[1].toFixed(5),
    t.slope.toFixed(2),
    t.storm_count,
    t.storm_energy.toFixed(1),
    t.depth_of_closure.toFixed(1),
    t.geomorphology,
    t.longshore_direction,
    `"${t.historical_trend.replace(/"/g, '""')}"`,
    `"${t.urban_density.replace(/"/g, '""')}"`,
    (t.probability || (t.susceptibility_index ? t.susceptibility_index / 100 : 0.5)).toFixed(3),
    t.risk_class,
    `"${t.top_contributing_factors?.[0]?.displayName || 'storm_energy'}"`,
    (t.top_contributing_factors?.[0]?.shap_value || 0.5).toFixed(3)
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

// Utility: Trigger CSV Download in Browser
export function downloadCSVFile(filename: string = "coastguard_coastal_erosion_dataset.csv", content?: string) {
  const csvData = content || generateDatasetCSV();
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Utility: Parse Custom User Uploaded CSV into CoastalTransect Objects
export function parseUploadedCSV(csvText: string): { transects: CoastalTransect[]; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { transects: [], errors: ["CSV file is empty or missing data rows."] };
  }

  const headerLine = lines[0].toLowerCase();
  const rawHeaders = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

  const transects: CoastalTransect[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV splitter handling quotes
    const values: string[] = [];
    let inQuotes = false;
    let currentVal = "";

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(currentVal.trim().replace(/^["']|["']$/g, ""));
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^["']|["']$/g, ""));

    const getVal = (possibleNames: string[], defaultVal: string = ""): string => {
      for (const name of possibleNames) {
        const idx = rawHeaders.findIndex((h) => {
          const cleanH = h.toLowerCase().trim();
          return cleanH === name || cleanH.startsWith(name + "_") || cleanH.endsWith("_" + name) || cleanH.includes(name);
        });
        if (idx !== -1 && values[idx] !== undefined && values[idx].trim() !== "") {
          return values[idx];
        }
      }
      return defaultVal;
    };

    const id = getVal(["id", "transect", "code"], `TRX-${100 + i}`);
    const name = getVal(["name", "site", "location"], `Coastal Transect ${i}`);
    const region = getVal(["region", "area", "basin"], "Coastal Zone");

    // Safe extraction of Latitude & Longitude avoiding 'longshore' collision
    let lat = 42.0 + ((i % 15) * 0.04);
    let lng = 14.0 + ((i % 15) * 0.04);

    // Check for combined coordinates column (e.g. "42.18, 14.68" or "[42.18, 14.68]")
    const coordsIdx = rawHeaders.findIndex(h => h.includes("coord") || h.includes("lat_lon") || h.includes("location_pt"));
    if (coordsIdx !== -1 && values[coordsIdx]) {
      const match = values[coordsIdx].match(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/g);
      if (match && match.length >= 2) {
        const parsedLat = parseFloat(match[0]);
        const parsedLng = parseFloat(match[1]);
        if (isFinite(parsedLat) && isFinite(parsedLng) && !isNaN(parsedLat) && !isNaN(parsedLng)) {
          lat = parsedLat;
          lng = parsedLng;
        }
      }
    } else {
      // Find latitude specifically (avoid matching unrelated words)
      const latIdx = rawHeaders.findIndex(h => {
        const clean = h.toLowerCase().trim();
        return clean === "lat" || clean === "latitude" || clean.startsWith("lat_") || clean.endsWith("_lat");
      });
      if (latIdx !== -1 && values[latIdx]) {
        const parsed = parseFloat(values[latIdx].replace(/[^0-9.-]/g, ""));
        if (isFinite(parsed) && !isNaN(parsed) && parsed >= -90 && parsed <= 90) {
          lat = parsed;
        }
      }

      // Find longitude specifically (DO NOT match "longshore"!)
      const lngIdx = rawHeaders.findIndex(h => {
        const clean = h.toLowerCase().trim();
        if (clean.includes("longshore") || clean.includes("alongshore") || clean.includes("drift")) return false;
        return clean === "lon" || clean === "lng" || clean === "longitude" || clean.startsWith("lon_") || clean.startsWith("lng_") || clean.endsWith("_lon") || clean.endsWith("_lng");
      });
      if (lngIdx !== -1 && values[lngIdx]) {
        const parsed = parseFloat(values[lngIdx].replace(/[^0-9.-]/g, ""));
        if (isFinite(parsed) && !isNaN(parsed) && parsed >= -180 && parsed <= 180) {
          lng = parsed;
        }
      }
    }

    // Ultimate safeguard: ensure lat/lng are strictly finite numbers
    if (isNaN(lat) || !isFinite(lat)) lat = 42.0 + ((i % 15) * 0.04);
    if (isNaN(lng) || !isFinite(lng)) lng = 14.0 + ((i % 15) * 0.04);

    const slope = parseFloat(getVal(["slope", "gradient"], "5.0")) || 5.0;
    const storm_count = parseInt(getVal(["count", "storm_count", "frequency"], "14"), 10) || 14;
    const storm_energy = parseFloat(getVal(["energy", "wave_energy", "flux"], "200.0")) || 200.0;
    const depth_of_closure = parseFloat(getVal(["closure", "depth"], "9.5")) || 9.5;
    
    let geomorphology: any = getVal(["geomorphology", "substrate", "type"], "sandy").toLowerCase();
    if (!["sandy", "gravel", "dune", "riverbank", "defence structure"].includes(geomorphology)) {
      geomorphology = "sandy";
    }

    let longshore_direction: any = getVal(["longshore", "drift", "direction"], "transitional").toLowerCase();
    if (!["convergent", "transitional", "divergent"].includes(longshore_direction)) {
      longshore_direction = "transitional";
    }

    const historical_trend = getVal(["trend", "history", "rate"], "Dynamic (-0.8 m/yr)");
    const urban_density = getVal(["urban", "density", "asset"], "Coastal Community");

    // Simplified model calculation
    const z_slope = (slope - 4.5) / 3.2;
    const z_storm = (storm_count - 12.0) / 6.5;
    const z_energy = (storm_energy - 180.0) / 95.0;
    const z_doc = (10.0 - depth_of_closure) / 3.8;
    const geoImpact = geomorphology === "dune" ? 0.52 : geomorphology === "sandy" ? 0.35 : geomorphology === "riverbank" ? 0.28 : -0.22;
    const longImpact = longshore_direction === "divergent" ? 0.38 : longshore_direction === "convergent" ? -0.32 : 0.04;

    const logit = -0.42 + (z_energy * 0.58) + (z_storm * 0.44) + (z_slope * 0.38) + (z_doc * 0.29) + (geoImpact * 0.72) + (longImpact * 0.52);
    const prob = Math.max(0.01, Math.min(0.99, 1.0 / (1.0 + Math.exp(-logit))));
    const risk_class = prob >= 0.75 ? "Very High" : prob >= 0.55 ? "High" : prob >= 0.35 ? "Medium" : "Low";

    transects.push({
      id,
      name,
      region,
      coordinates: [lat, lng],
      slope,
      storm_count,
      storm_energy,
      depth_of_closure,
      geomorphology,
      longshore_direction,
      historical_trend,
      urban_density,
      probability: Math.round(prob * 1000) / 1000,
      susceptibility_index: Math.round(prob * 1000) / 10,
      risk_class,
      base_value: -0.42,
      shap_values: {
        storm_energy: Math.round(z_energy * 0.58 * 1000) / 1000,
        slope: Math.round(z_slope * 0.38 * 1000) / 1000,
        storm_count: Math.round(z_storm * 0.44 * 1000) / 1000,
        geomorphology: Math.round(geoImpact * 0.72 * 1000) / 1000,
        depth_of_closure: Math.round(z_doc * 0.29 * 1000) / 1000,
        longshore_direction: Math.round(longImpact * 0.52 * 1000) / 1000
      },
      top_contributing_factors: [
        { factor: "storm_energy", displayName: "Storm Wave Energy Flux (kW/m)", shap_value: Math.round(z_energy * 0.58 * 1000) / 1000, percentage_contribution: 35, impact_direction: z_energy > 0 ? "Increases Risk" : "Decreases Risk", observed_value: storm_energy },
        { factor: "slope", displayName: "Beach & Cliff Slope (%)", shap_value: Math.round(z_slope * 0.38 * 1000) / 1000, percentage_contribution: 25, impact_direction: z_slope > 0 ? "Increases Risk" : "Decreases Risk", observed_value: slope }
      ],
      confidence_interval: [Math.max(0.01, prob - 0.04), Math.min(0.99, prob + 0.04)],
      mitigation: {
        primary_threat: "Hydrodynamic Wave Stress",
        risk_level: risk_class,
        decision_rationale: "Imported CSV data inference complete.",
        recommended_actions: [
          {
            priority: 1,
            category: "Ecological Restoration",
            title: "Dynamic Profile Nourishment",
            description: "Deploy targeted coarse sand replenishment to absorb incident wave action.",
            triggered_by_factor: "Uploaded Dataset Profile",
            estimated_cost_tier: "$$",
            time_horizon: "Seasonal (3-6 months)",
            expected_risk_reduction_pct: 30.0,
            impact_metric: "-30% Risk Exposure"
          }
        ]
      }
    });
  }

  return { transects, errors };
}
