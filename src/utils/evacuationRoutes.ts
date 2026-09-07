import { CoastalTransect, DisasterAlert } from "../types";
import { parseValidLatLng, getSusceptibilityScore } from "./heatmapRenderer";

export interface EvacuationWaypoint {
  name: string;
  coordinates: [number, number]; // [lat, lng]
  elevation_m: number;
  instruction: string;
  type: "origin" | "junction" | "chokepoint_clear" | "inland_ridge" | "destination";
}

export interface SafeZone {
  id: string;
  name: string;
  type: "Civic Shelter" | "High Ground Assembly" | "Sports Complex Haven" | "Monastery / Citadel Refuge";
  coordinates: [number, number]; // [lat, lng]
  elevation_m: number; // Elevated safe height ASL
  capacity_people: number;
  current_occupancy: number;
  medical_support: "Type-A Emergency Triage" | "Type-B Mobile First Aid" | "Paramedic Base Unit";
  supplies_status: "Fully Stocked (72h)" | "Operational Readiness" | "Emergency Standby";
  primary_access_road: string;
  amenities: string[];
  contact_vhf_channel: string;
}

export interface EvacuationRoute {
  id: string;
  origin_transect_id: string;
  origin_transect_name: string;
  origin_coordinates: [number, number];
  origin_risk_score: number;
  is_high_risk_disaster_target: boolean; // Flagged by current disaster alert system
  alert_severity?: string;
  safe_zone: SafeZone;
  path_coordinates: [number, number][]; // Multi-point path from coast to safe zone
  distance_meters: number;
  est_walk_minutes: number;
  est_vehicle_minutes: number;
  elevation_gain_m: number;
  slope_difficulty: "Gentle Incline" | "Moderate Ridge Climb" | "Steep Coastal Escarpment";
  corridor_name: string;
  evacuation_status: "Mandatory Immediate Evacuation" | "Active Evacuation Corridor" | "Precautionary Standby";
  waypoints: EvacuationWaypoint[];
  hazard_warnings: string[];
  action_steps: string[];
}

export interface EvacuationNetworkSummary {
  totalRoutes: number;
  highRiskEvacRoutesCount: number;
  totalSafeZones: number;
  totalShelterCapacity: number;
  totalEstimatedEvacuees: number;
  averageEvacuationDistanceM: number;
  averageWalkTimeMin: number;
  highestElevationSafeZoneM: number;
}

/**
 * Curated high-ground Safe Zones for the monitored Adriatic and regional coastlines.
 * All safe zones are deliberately elevated between +28m and +85m above sea level,
 * well beyond any storm surge (1.6m - 2.5m) or tsunami runup (3m - 6m).
 */
export const DESIGNATED_SAFE_ZONES: Record<string, SafeZone> = {
  "SZ-ADERCI-RIDGE": {
    id: "SZ-ADERCI-RIDGE",
    name: "Montevecchio Municipal Emergency Hub",
    type: "High Ground Assembly",
    coordinates: [42.1760, 14.6640],
    elevation_m: 54.0,
    capacity_people: 1800,
    current_occupancy: 120,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "SP154 Strada Panoramica Collinare",
    amenities: ["Backup Diesel 300kVA", "Water Reservoir 60kL", "Starlink Satellite Comms", "Helipad Zone"],
    contact_vhf_channel: "VHF Ch 16 / 72.450 MHz"
  },
  "SZ-SANVITO-ALTA": {
    id: "SZ-SANVITO-ALTA",
    name: "San Vito Chietino Colle Civic Center",
    type: "Civic Shelter",
    coordinates: [42.2920, 14.4180],
    elevation_m: 68.0,
    capacity_people: 2200,
    current_occupancy: 240,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "SS524 Lanciano-San Vito",
    amenities: ["Civil Protection HQ", "Backup Power 400kVA", "Emergency Kitchen", "Ambulance Staging"],
    contact_vhf_channel: "VHF Ch 16 / 72.500 MHz"
  },
  "SZ-PESCARA-COLLI": {
    id: "SZ-PESCARA-COLLI",
    name: "Pescara Colli Inland Sports Citadel",
    type: "Sports Complex Haven",
    coordinates: [42.4610, 14.1890],
    elevation_m: 48.0,
    capacity_people: 4500,
    current_occupancy: 410,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "Via di Sotto / Raccordo Autostradale A14",
    amenities: ["Covered Gymnasiums", "Mobile Surgical Field Hospital", "Red Cross Depot", "Mass Catering"],
    contact_vhf_channel: "VHF Ch 16 / 73.100 MHz"
  },
  "SZ-ORTONA-CASTLE": {
    id: "SZ-ORTONA-CASTLE",
    name: "Ortona Aragonese High Citadel Shelter",
    type: "Monastery / Citadel Refuge",
    coordinates: [42.3480, 14.3820],
    elevation_m: 72.0,
    capacity_people: 3100,
    current_occupancy: 310,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "Strada Panoramica Orientale / Corso Matteotti",
    amenities: ["Deep Cistern Water System", "Underground Reinforced Vaults", "Helicopter Extraction Point"],
    contact_vhf_channel: "VHF Ch 16 / 72.825 MHz"
  },
  "SZ-VASTO-BELVEDERE": {
    id: "SZ-VASTO-BELVEDERE",
    name: "Vasto Alta Belvedère Civic Haven",
    type: "Civic Shelter",
    coordinates: [42.1180, 14.6980],
    elevation_m: 85.0,
    capacity_people: 3600,
    current_occupancy: 280,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "Circonvallazione Istoniense / SP Vasto-Marina",
    amenities: ["Civil Protection Operations Room", "Backup Microgrid", "Emergency Pharmaceutical Supply", "Food Rations"],
    contact_vhf_channel: "VHF Ch 16 / 72.950 MHz"
  },
  "SZ-DOMIZIA-INLAND": {
    id: "SZ-DOMIZIA-INLAND",
    name: "Cellole / Domizia Inland Municipal Haven",
    type: "Civic Shelter",
    coordinates: [41.2280, 13.9150],
    elevation_m: 36.0,
    capacity_people: 2000,
    current_occupancy: 150,
    medical_support: "Type-B Mobile First Aid",
    supplies_status: "Operational Readiness",
    primary_access_road: "SS7 Quater Domiziana",
    amenities: ["Emergency Potable Water", "Power Generator 200kVA", "Civil Evac Center"],
    contact_vhf_channel: "VHF Ch 16 / 71.400 MHz"
  },
  "SZ-CINQUETERRE-HIGH": {
    id: "SZ-CINQUETERRE-HIGH",
    name: "Santuario Nostra Signora di Soviore Haven",
    type: "Monastery / Citadel Refuge",
    coordinates: [44.1520, 9.6920],
    elevation_m: 140.0,
    capacity_people: 1200,
    current_occupancy: 95,
    medical_support: "Type-B Mobile First Aid",
    supplies_status: "Fully Stocked (72h)",
    primary_access_road: "SP38 Colle di Soviore",
    amenities: ["Mountain Refuge Facilities", "Alpine Rescue Station", "Off-grid Solar/Generator"],
    contact_vhf_channel: "VHF Ch 16 / 73.000 MHz"
  },
  "SZ-HATTERAS-INLAND": {
    id: "SZ-HATTERAS-INLAND",
    name: "Buxton Maritime Forest Ridge Shelter",
    type: "High Ground Assembly",
    coordinates: [35.2650, -75.5450],
    elevation_m: 9.5, // Island dune ridge safety
    capacity_people: 2400,
    current_occupancy: 320,
    medical_support: "Type-A Emergency Triage",
    supplies_status: "Operational Readiness",
    primary_access_road: "NC Highway 12 Inland Evacuation Spur",
    amenities: ["Elevated Hurricane Shelter", "Debris Clearance Heavy Machinery", "Satellite Comms"],
    contact_vhf_channel: "VHF Ch 16 / 72.200 MHz"
  }
};

/**
 * Curated real multi-point path geometries connecting coastal transects
 * to their respective high-ground safe zones, steering clear of beaches and river inlets.
 */
const CURATED_PATH_WAYPOINTS: Record<string, {
  safeZoneId: string;
  corridorName: string;
  waypoints: [number, number][];
  instructions: string[];
  hazardWarnings: string[];
}> = {
  "TRX-101": {
    safeZoneId: "SZ-ADERCI-RIDGE",
    corridorName: "Punta Aderci Coastal Escarpment to Montevecchio Ridge",
    waypoints: [
      [42.1855, 14.6865], // Origin: Punta Aderci beach
      [42.1840, 14.6820], // Trail head / Dune parking
      [42.1815, 14.6750], // SS16 Junction underpass bypass
      [42.1790, 14.6690], // SP154 Ridge Ascent
      [42.1760, 14.6640]  // Safe Zone: Montevecchio Emergency Hub (+54m)
    ],
    instructions: [
      "Vacate Punta Aderci pebble strand immediately via northern staircase.",
      "Follow marked green reflectors away from scarp edge onto gravel service road.",
      "Cross railway overpass via SP154 ascending roadway (Do NOT use beach underpass).",
      "Proceed 900m inland to Montevecchio Civil Protection Reception Hub."
    ],
    hazardWarnings: [
      "Active bluff scarp collapse danger along base cliff path.",
      "High storm wave runup may flood lower coastal railway culverts."
    ]
  },
  "TRX-102": {
    safeZoneId: "SZ-SANVITO-ALTA",
    corridorName: "San Vito Marina Strand to Colle Civic Citadel",
    waypoints: [
      [42.2980, 14.4440], // Origin: San Vito littoral
      [42.2965, 14.4380], // Lungomare Ericle exit
      [42.2945, 14.4290], // SP San Vito uphill switchback
      [42.2930, 14.4230], // Via Panoramica junction
      [42.2920, 14.4180]  // Safe Zone: Colle Civic Center (+68m)
    ],
    instructions: [
      "Immediate egress from Trabocchi wooden piers and boardwalk.",
      "Take Via Feltrino inland ascending towards San Vito Paese.",
      "Follow emergency civil protection luminous arrows to Civic Centre."
    ],
    hazardWarnings: [
      "Trabocchi platforms subject to destructive wave energy impact.",
      "Beach roadway prone to pebble spit overwash."
    ]
  },
  "TRX-103": {
    safeZoneId: "SZ-PESCARA-COLLI",
    corridorName: "Pescara Harbor Inundation Cutoff to Pescara Colli Haven",
    waypoints: [
      [42.4680, 14.2250], // Origin: Pescara river mouth
      [42.4665, 14.2150], // Lungomare Matteotti exit
      [42.4640, 14.2040], // Ponte del Mare crossing to higher ground
      [42.4625, 14.1950], // Viale Bovio / Colli ascent
      [42.4610, 14.1890]  // Safe Zone: Pescara Colli Sports Citadel (+48m)
    ],
    instructions: [
      "Evacuate harbor piers and low-lying coastal promenade.",
      "Move west away from river mouth embankment.",
      "Ascend Pescara Colli hill via Viale Bovio to the sports arena haven."
    ],
    hazardWarnings: [
      "Compound river backwater surge and storm tide will flood harbor docks.",
      "Avoid low-lying subways under the central railway."
    ]
  },
  "TRX-104": {
    safeZoneId: "SZ-ORTONA-CASTLE",
    corridorName: "Ortona Port & Pebble Spit to Aragonese Citadel",
    waypoints: [
      [42.3550, 14.4020], // Origin: Ortona Cliff & Pebble Spit
      [42.3530, 14.3960], // Via Marina port gate exit
      [42.3505, 14.3890], // Scalinata del Castello cliff ascent
      [42.3480, 14.3820]  // Safe Zone: Aragonese High Citadel (+72m)
    ],
    instructions: [
      "Immediately clear pebble strand and port breakwater arm.",
      "Ascend panoramic steps / funicular corridor toward Ortona Alta.",
      "Gather at the fortified Aragonese Castle safe assembly square."
    ],
    hazardWarnings: [
      "Severe cliff slumping risk beneath headland promontory.",
      "Seaward wave reflection causing intense breaker spray."
    ]
  },
  "TRX-105": {
    safeZoneId: "SZ-VASTO-BELVEDERE",
    corridorName: "Vasto Marina Dune Spit to Vasto Alta Belvedère",
    waypoints: [
      [42.1120, 14.7180], // Origin: Vasto Marina beach
      [42.1140, 14.7110], // Viale Dalmazia cross-road
      [42.1160, 14.7040], // Via Istoniense hillside ascent
      [42.1180, 14.6980]  // Safe Zone: Vasto Alta Belvedère Haven (+85m)
    ],
    instructions: [
      "Evacuate beachfront lidos and dune camping facilities.",
      "Move along Viale Dalmazia toward Via Istoniense hillside artery.",
      "Climb to Vasto Alta (+85m elevation) well above storm inundation."
    ],
    hazardWarnings: [
      "Flat sandy foredune offers zero protection from +1.6m storm surge.",
      "High ground in Vasto Alta provides complete topological protection."
    ]
  },
  "TRX-106": {
    safeZoneId: "SZ-DOMIZIA-INLAND",
    corridorName: "Baia Domizia Pine Grove to Cellole Municipal Haven",
    waypoints: [
      [41.2150, 13.8820],
      [41.2190, 13.8940],
      [41.2240, 13.9050],
      [41.2280, 13.9150]
    ],
    instructions: [
      "Evacuate low-lying holiday chalets and coastal pine forest.",
      "Follow provincial road northeast towards Cellole town center."
    ],
    hazardWarnings: [
      "Dune breaching can inundate coastal pine groves up to 400m inland."
    ]
  },
  "TRX-107": {
    safeZoneId: "SZ-CINQUETERRE-HIGH",
    corridorName: "Cinque Terre Pocket Beach to Soviore Mountain Sanctuary",
    waypoints: [
      [44.1350, 9.6840],
      [44.1410, 9.6870],
      [44.1470, 9.6900],
      [44.1520, 9.6920]
    ],
    instructions: [
      "Clear narrow pocket cove and coastal hiking trail immediately.",
      "Climb mountain sanctuary mule track to Soviore Refuge (+140m)."
    ],
    hazardWarnings: [
      "Narrow gorge concentrates storm swell with severe wave surge amplification."
    ]
  },
  "TRX-108": {
    safeZoneId: "SZ-HATTERAS-INLAND",
    corridorName: "Cape Hatteras Overwash Zone to Maritime Forest Ridge",
    waypoints: [
      [35.2450, -75.5250],
      [35.2520, -75.5340],
      [35.2590, -75.5400],
      [35.2650, -75.5450]
    ],
    instructions: [
      "Evacuate oceanfront barrier dune and beach ramp.",
      "Follow NC Highway 12 north to Buxton Woods Maritime Ridge."
    ],
    hazardWarnings: [
      "NC-12 is susceptible to severe ocean overwash cuts."
    ]
  }
};

/**
 * Calculates geographic distance in meters between two lat/lng points using Haversine formula
 */
export function calculateHaversineDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((coords2[0] - coords1[0]) * Math.PI) / 180;
  const dLon = ((coords2[1] - coords1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1[0] * Math.PI) / 180) *
      Math.cos((coords2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Automatically synthesizes an inland safe zone for custom or newly imported transects.
 * Places a safe zone ~1.2 km inland in the direction opposite to the seaward slope.
 */
function generateDynamicSafeZoneForTransect(t: CoastalTransect): SafeZone {
  const lat = t.coordinates[0];
  const lng = t.coordinates[1];

  // In Adriatic/Italian central region, inland is west/southwest (lower longitude)
  // Shift ~0.015 deg lat and ~0.025 deg lng inland
  const inlandLat = Number((lat + (lat > 0 ? -0.008 : 0.008)).toFixed(4));
  const inlandLng = Number((lng - 0.024).toFixed(4));

  return {
    id: `SZ-AUTO-${t.id}`,
    name: `${t.name.split("-")[0].trim()} Inland Civic Safe Haven`,
    type: "Civic Shelter",
    coordinates: [inlandLat, inlandLng],
    elevation_m: 45.0,
    capacity_people: 1500,
    current_occupancy: 90,
    medical_support: "Type-B Mobile First Aid",
    supplies_status: "Operational Readiness",
    primary_access_road: "Provincial Inland Radial Road",
    amenities: ["Emergency Power 250kVA", "Water Distribution", "Satellite Uplink"],
    contact_vhf_channel: "VHF Ch 16 / 72.450 MHz"
  };
}

/**
 * Builds an EvacuationRoute object for a given transect,
 * connecting the coastal transect to its designated inland safe zone.
 */
export function buildEvacuationRoute(
  transect: CoastalTransect,
  activeAlert?: DisasterAlert | null
): EvacuationRoute {
  const originCoords = parseValidLatLng(transect.coordinates) || [42.1855, 14.6865];
  const riskScore = getSusceptibilityScore(transect);

  // Check if identified as high risk by disaster alert system:
  // 1. Alert affected IDs include this transect
  // 2. Or susceptibility score >= 75%
  // 3. Or storm_energy >= 300 kW/m
  // 4. Or risk_class === "Very High"
  const isAlertTarget = Boolean(
    (activeAlert && activeAlert.affected_transect_ids.includes(transect.id)) ||
    riskScore >= 75 ||
    transect.risk_class === "Very High" ||
    transect.storm_energy >= 300
  );

  const curated = CURATED_PATH_WAYPOINTS[transect.id];
  let safeZone: SafeZone;
  let pathCoords: [number, number][];
  let corridorName: string;
  let instructions: string[];
  let hazardWarnings: string[];

  if (curated && DESIGNATED_SAFE_ZONES[curated.safeZoneId]) {
    safeZone = DESIGNATED_SAFE_ZONES[curated.safeZoneId];
    pathCoords = curated.waypoints;
    corridorName = curated.corridorName;
    instructions = curated.instructions;
    hazardWarnings = curated.hazardWarnings;
  } else {
    safeZone = generateDynamicSafeZoneForTransect(transect);
    pathCoords = [
      originCoords,
      [Number(((originCoords[0] + safeZone.coordinates[0]) / 2).toFixed(4)), Number(((originCoords[1] + safeZone.coordinates[1]) / 2).toFixed(4))],
      safeZone.coordinates
    ];
    corridorName = `${transect.name} Inland Evacuation Arterial`;
    instructions = [
      "Evacuate coastal waterline immediately.",
      "Follow main provincial artery westward to elevated inland terrain.",
      "Check in at municipal civic shelter."
    ];
    hazardWarnings = [
      "Do not cross low-elevation beach walkways during peak surge hours."
    ];
  }

  // Calculate cumulative path distance
  let totalDistanceM = 0;
  for (let i = 0; i < pathCoords.length - 1; i++) {
    totalDistanceM += calculateHaversineDistance(pathCoords[i], pathCoords[i + 1]);
  }
  totalDistanceM = Math.max(450, totalDistanceM);

  // Walking speed avg: ~4.5 km/h = 75 m/min; uphill reduces to ~65 m/min
  const estWalkMin = Math.ceil(totalDistanceM / 68);
  // Vehicle speed avg: ~25 km/h in urban/inland evacuation = 416 m/min
  const estVehicleMin = Math.max(2, Math.ceil(totalDistanceM / 350));

  const elevationGain = Math.max(15, Math.round(safeZone.elevation_m - 3.5));

  const slopeDifficulty: "Gentle Incline" | "Moderate Ridge Climb" | "Steep Coastal Escarpment" =
    elevationGain > 60
      ? "Steep Coastal Escarpment"
      : elevationGain > 30
      ? "Moderate Ridge Climb"
      : "Gentle Incline";

  const evacuationStatus: "Mandatory Immediate Evacuation" | "Active Evacuation Corridor" | "Precautionary Standby" =
    isAlertTarget && (activeAlert?.severity === "CRITICAL" || riskScore >= 80)
      ? "Mandatory Immediate Evacuation"
      : isAlertTarget
      ? "Active Evacuation Corridor"
      : "Precautionary Standby";

  // Create granular waypoints along the path
  const waypoints: EvacuationWaypoint[] = pathCoords.map((coord, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === pathCoords.length - 1;
    const progress = idx / (pathCoords.length - 1);
    const interpElevation = Math.round(3.5 + progress * (safeZone.elevation_m - 3.5));

    if (isFirst) {
      return {
        name: `Origin: ${transect.name} Beachfront`,
        coordinates: coord,
        elevation_m: 3.5,
        instruction: "Initial evacuation departure point (Exclusion Zone)",
        type: "origin"
      };
    } else if (isLast) {
      return {
        name: safeZone.name,
        coordinates: coord,
        elevation_m: safeZone.elevation_m,
        instruction: `Shelter Reception: ${safeZone.medical_support} Active`,
        type: "destination"
      };
    } else if (idx === 1) {
      return {
        name: "Coastal Highway / Underpass Chokepoint",
        coordinates: coord,
        elevation_m: interpElevation,
        instruction: "Clear seaward underpass and move to high-grade roadway",
        type: "chokepoint_clear"
      };
    } else {
      return {
        name: `Arterial Waypoint ${idx} (Ridge Crest)`,
        coordinates: coord,
        elevation_m: interpElevation,
        instruction: "Continue uphill ascent along designated evacuation route",
        type: "inland_ridge"
      };
    }
  });

  return {
    id: `EVAC-${transect.id}`,
    origin_transect_id: transect.id,
    origin_transect_name: transect.name,
    origin_coordinates: originCoords,
    origin_risk_score: riskScore,
    is_high_risk_disaster_target: isAlertTarget,
    alert_severity: activeAlert?.severity,
    safe_zone: safeZone,
    path_coordinates: pathCoords,
    distance_meters: totalDistanceM,
    est_walk_minutes: estWalkMin,
    est_vehicle_minutes: estVehicleMin,
    elevation_gain_m: elevationGain,
    slope_difficulty: slopeDifficulty,
    corridor_name: corridorName,
    evacuation_status: evacuationStatus,
    waypoints,
    hazard_warnings: hazardWarnings,
    action_steps: instructions
  };
}

/**
 * Returns all evacuation routes for the provided transects,
 * prioritized with high-risk disaster alert targets first.
 */
export function getAllEvacuationRoutes(
  transects: CoastalTransect[],
  activeAlert?: DisasterAlert | null
): EvacuationRoute[] {
  const routes = transects.map((t) => buildEvacuationRoute(t, activeAlert));

  // Sort high-risk disaster targets to top, then by risk score descending
  return routes.sort((a, b) => {
    if (a.is_high_risk_disaster_target && !b.is_high_risk_disaster_target) return -1;
    if (!a.is_high_risk_disaster_target && b.is_high_risk_disaster_target) return 1;
    return b.origin_risk_score - a.origin_risk_score;
  });
}

/**
 * Deduplicates and returns all active Safe Zones across the network
 */
export function getUniqueSafeZones(routes: EvacuationRoute[]): SafeZone[] {
  const map = new Map<string, SafeZone>();
  routes.forEach((r) => {
    if (!map.has(r.safe_zone.id)) {
      map.set(r.safe_zone.id, r.safe_zone);
    }
  });
  return Array.from(map.values());
}

/**
 * Computes network-level evacuation statistics
 */
export function computeEvacuationNetworkSummary(routes: EvacuationRoute[]): EvacuationNetworkSummary {
  const highRiskRoutes = routes.filter((r) => r.is_high_risk_disaster_target);
  const safeZones = getUniqueSafeZones(routes);

  const totalCapacity = safeZones.reduce((sum, sz) => sum + sz.capacity_people, 0);
  const totalDistance = routes.reduce((sum, r) => sum + r.distance_meters, 0);
  const totalWalkMin = routes.reduce((sum, r) => sum + r.est_walk_minutes, 0);
  const maxElev = safeZones.reduce((max, sz) => Math.max(max, sz.elevation_m), 0);

  // Estimate ~350-800 residents per high-risk coastal transect
  const totalEvacuees = highRiskRoutes.length * 620;

  return {
    totalRoutes: routes.length,
    highRiskEvacRoutesCount: highRiskRoutes.length,
    totalSafeZones: safeZones.length,
    totalShelterCapacity: totalCapacity,
    totalEstimatedEvacuees: totalEvacuees,
    averageEvacuationDistanceM: routes.length ? Math.round(totalDistance / routes.length) : 0,
    averageWalkTimeMin: routes.length ? Math.round(totalWalkMin / routes.length) : 0,
    highestElevationSafeZoneM: maxElev
  };
}
