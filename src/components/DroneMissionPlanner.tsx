import React, { useState, useEffect } from "react";
import { CoastalTransect, DroneFlightMission } from "../types";
import { generateLidarTransectProfile } from "../utils/coastalPhysics";
import confetti from "canvas-confetti";
import {
  Plane,
  Radar,
  Camera,
  Play,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  MapPin,
  Clock,
  BatteryCharging,
  Gauge,
  Sparkles,
  FileSpreadsheet
} from "lucide-react";

interface DroneMissionPlannerProps {
  transect: CoastalTransect | null;
}

export const DroneMissionPlanner: React.FC<DroneMissionPlannerProps> = ({
  transect
}) => {
  const currentTransect = transect || {
    id: "TRX-101",
    name: "Punta Aderci Coastal Bluff",
    region: "Vasto (Abruzzo, Central Adriatic)",
    coordinates: [42.1812, 14.6865] as [number, number],
    slope: 12.4,
    storm_count: 8,
    storm_energy: 385,
    depth_of_closure: 6.8,
    geomorphology: "dune" as const,
    longshore_direction: "convergent" as const,
    historical_trend: "Critical Erosion",
    urban_density: "Natural Reserve / Rail Corridor",
    probability: 0.88,
    susceptibility_index: 88,
    risk_class: "Very High" as const,
    base_value: 0.35,
    shap_values: {},
    top_contributing_factors: [],
    confidence_interval: [0.82, 0.94] as [number, number],
    mitigation: {
      primary_threat: "Wave energy attack",
      risk_level: "Very High" as const,
      recommended_actions: [],
      decision_rationale: "High energy"
    }
  };

  // Drone Flight Parameters
  const [altitudeM, setAltitudeM] = useState<number>(65);
  const [speedMs, setSpeedMs] = useState<number>(8);
  const [forwardOverlap, setForwardOverlap] = useState<number>(80);
  const [sideOverlap, setSideOverlap] = useState<number>(75);
  const [missionStatus, setMissionStatus] = useState<DroneFlightMission["status"]>("Ready for Dispatch");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"mission-path" | "lidar-dem-analysis">("mission-path");

  // Calculate derived flight telemetry
  const gsdCm = Math.round((altitudeM * 0.024) * 10) / 10; // GSD ~ 1.5 cm/px at 60m
  const pointDensity = Math.round((320 / (altitudeM / 50)) * 10) / 10; // pts/m2
  const flightTimeMin = Math.round((14.5 * (60 / altitudeM)) * 10) / 10;
  const surveyAreaHa = 18.4;
  const volumetricLossM3 = Math.round(currentTransect.storm_energy * 3.8);

  const lidarPoints = generateLidarTransectProfile(currentTransect.id);

  // Dispatch Drone Mission Workflow
  const handleLaunchSurvey = () => {
    setMissionStatus("In Flight Surveying");
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setMissionStatus("Processing DEM Point Cloud");
          setTimeout(() => {
            setMissionStatus("Survey Complete");
            setActiveTab("lidar-dem-analysis");
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#06b6d4", "#10b981", "#3b82f6"]
            });
          }, 1200);
          return 100;
        }
        return prev + 20;
      });
    }, 450);
  };

  const handleExportMission = () => {
    const missionData = {
      mission_id: `DRONE-LIDAR-${currentTransect.id}-${Date.now()}`,
      transect_id: currentTransect.id,
      site_name: currentTransect.name,
      coordinates: currentTransect.coordinates,
      flight_specs: {
        altitude_m: altitudeM,
        gsd_cm_px: gsdCm,
        speed_m_s: speedMs,
        forward_overlap_pct: forwardOverlap,
        side_overlap_pct: sideOverlap,
        point_density_pts_m2: pointDensity,
        sensor: "Zenmuse L2 LiDAR + 4/3 RGB Orthomosaic Camera"
      },
      volumetric_loss_detected_m3: volumetricLossM3,
      lidar_cross_shore_points: lidarPoints
    };

    const blob = new Blob([JSON.stringify(missionData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drone_lidar_mission_${currentTransect.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
            <Plane className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Autonomous Coastal UAV Drone Mission Planner
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Sensor: Zenmuse L2 Aerial LiDAR (300 kHz)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentTransect.name} &bull; Volumetric DEM LiDAR Survey
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-drone-mission"
            onClick={handleExportMission}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Mission Plan (.json)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Mission Controls & Flight Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Drone Flight Path & LiDAR Point Cloud Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              {/* Tab Selector */}
              <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveTab("mission-path")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === "mission-path"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>UAV Flight Grid</span>
                </button>

                <button
                  onClick={() => setActiveTab("lidar-dem-analysis")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeTab === "lidar-dem-analysis"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LiDAR DEM Elevation Profile</span>
                </button>
              </div>

              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                missionStatus === "Survey Complete" ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                missionStatus === "In Flight Surveying" ? "bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse" :
                "bg-slate-800 text-slate-300"
              }`}>
                {missionStatus}
              </span>
            </div>

            {/* TAB 1: Visual UAV Flight Grid Canvas */}
            {activeTab === "mission-path" && (
              <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
                
                {/* Background Orthomosaic Simulation */}
                <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* Waypoint Flight Lines SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300">
                  <defs>
                    <linearGradient id="flightLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Flight Grid Lawn-Mower Path */}
                  <path
                    d="M 60 50 L 540 50 L 540 95 L 60 95 L 60 140 L 540 140 L 540 185 L 60 185 L 60 230 L 540 230"
                    fill="none"
                    stroke="url(#flightLineGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />

                  {/* Waypoint nodes */}
                  {[
                    [60, 50], [540, 50], [540, 95], [60, 95],
                    [60, 140], [540, 140], [540, 185], [60, 185],
                    [60, 230], [540, 230]
                  ].map(([wx, wy], idx) => (
                    <g key={idx}>
                      <circle cx={wx} cy={wy} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                      <text x={wx + 7} y={wy + 3} fill="#94a3b8" fontSize="8" fontFamily="monospace">
                        WP{idx + 1}
                      </text>
                    </g>
                  ))}

                  {/* Active Drone Position Icon (Simulated in flight) */}
                  {missionStatus === "In Flight Surveying" && (
                    <g transform={`translate(${60 + (scanProgress / 100) * 480}, ${50 + Math.floor(scanProgress / 25) * 45})`}>
                      <circle cx="0" cy="0" r="16" fill="#06b6d4" fillOpacity="0.3" className="animate-ping" />
                      <circle cx="0" cy="0" r="8" fill="#38bdf8" />
                      {/* Laser beam cone down to ground */}
                      <polygon points="-25,45 25,45 0,0" fill="#10b981" fillOpacity="0.25" />
                    </g>
                  )}
                </svg>

                {/* Top overlay badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300">
                    <span>Survey Bounding Box: </span>
                    <strong className="text-cyan-300">
                      {Array.isArray(currentTransect?.coordinates) ? currentTransect.coordinates.join(", ") : "42.1855, 14.6865"} &bull; {surveyAreaHa} ha
                    </strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-emerald-400 font-bold">
                    10 Flight Lines &bull; 80% Overlap
                  </div>
                </div>

                {/* Bottom scan progress bar */}
                {missionStatus === "In Flight Surveying" && (
                  <div className="relative z-10 bg-slate-900/95 p-3 rounded-xl border border-cyan-500/50 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-cyan-300 font-mono">
                      <span>Live LiDAR Point Cloud Acquisition</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: LiDAR Point Cloud Cross-Shore Elevation Difference Chart */}
            {activeTab === "lidar-dem-analysis" && (
              <div className="space-y-4">
                <div className="relative w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner p-4 flex flex-col justify-between">
                  
                  {/* SVG Elevation Difference Chart */}
                  <svg className="w-full h-56" viewBox="0 0 600 200">
                    <defs>
                      <linearGradient id="lidarLossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Zero line */}
                    <line x1="40" y1="160" x2="580" y2="160" stroke="#475569" strokeDasharray="3 3" />
                    <text x="8" y="163" fill="#94a3b8" fontSize="9" fontFamily="monospace">0m</text>
                    <text x="8" y="40" fill="#94a3b8" fontSize="9" fontFamily="monospace">+6m</text>

                    {/* Pre-Storm Baseline Elevation Line (Blue) */}
                    <path
                      d={lidarPoints.reduce((acc, pt, i) => {
                        const x = 40 + (pt.crossShoreDistanceM / 100) * 540;
                        const y = 160 - (pt.preStormBaselineElevationM / 7) * 140;
                        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, "")}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />

                    {/* Post-Storm Survey LiDAR Elevation Line (Rose) */}
                    <path
                      d={lidarPoints.reduce((acc, pt, i) => {
                        const x = 40 + (pt.crossShoreDistanceM / 100) * 540;
                        const y = 160 - (pt.postStormSurveyElevationM / 7) * 140;
                        return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, "")}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    {lidarPoints.map((pt, i) => {
                      const x = 40 + (pt.crossShoreDistanceM / 100) * 540;
                      const y = 160 - (pt.postStormSurveyElevationM / 7) * 140;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="3"
                          fill={pt.differenceZCm < -50 ? "#ef4444" : "#10b981"}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>

                  {/* Chart Legend */}
                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <span className="w-3 h-1 bg-cyan-400 rounded" /> Baseline DEM Profile
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-3 h-1 bg-rose-500 rounded" /> Post-Storm LiDAR Scarp
                    </span>
                    <span className="text-amber-300 font-bold">
                      Max Elevation Drop: -140 cm at Foredune Scarp
                    </span>
                  </div>

                </div>

                {/* Table of Classified Geomorphic Zones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Dune Crest</span>
                    <span className="font-bold text-rose-400 font-mono">-140 cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Foredune Scarp</span>
                    <span className="font-bold text-rose-400 font-mono">-95 cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Berm & Intertidal</span>
                    <span className="font-bold text-amber-400 font-mono">-70 cm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Submerged Bar Accretion</span>
                    <span className="font-bold text-emerald-400 font-mono">+45 cm</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Ground Resolution</span>
              <p className="text-lg font-bold font-mono text-cyan-300">{gsdCm} cm/px</p>
              <span className="text-[10px] text-slate-500 font-mono">Sub-decimeter GSD</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Point Density</span>
              <p className="text-lg font-bold font-mono text-emerald-300">{pointDensity} pts/m²</p>
              <span className="text-[10px] text-slate-500 font-mono">High-density return</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Estimated Flight Time</span>
              <p className="text-lg font-bold font-mono text-amber-300">{flightTimeMin} min</p>
              <span className="text-[10px] text-slate-500 font-mono">1 Battery Pack</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Volumetric Sand Loss</span>
              <p className="text-lg font-bold font-mono text-rose-400">-{volumetricLossM3} m³</p>
              <span className="text-[10px] text-slate-500 font-mono">Cross-shore erosion</span>
            </div>
          </div>

        </div>

        {/* Right Column: Mission Control Sliders & Dispatch Button (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6 text-xs">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Flight Parameters & Sensor Setup</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">DJI Matrice 350 RTK</span>
          </div>

          {/* Primary Action Button: Dispatch Drone Flight */}
          <button
            id="btn-dispatch-drone-survey"
            onClick={handleLaunchSurvey}
            disabled={missionStatus === "In Flight Surveying"}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            {missionStatus === "In Flight Surveying" ? (
              <>
                <Plane className="w-4 h-4 animate-spin text-slate-950" />
                <span>Surveying Coastal Transect in Real-Time...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Dispatch Autonomous Drone LiDAR Survey</span>
              </>
            )}
          </button>

          {/* Slider 1: Flight Altitude (m) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Survey Flight Altitude (AGL):</span>
              <span className="font-mono text-cyan-400 font-bold">{altitudeM} meters</span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="5"
              value={altitudeM}
              onChange={(e) => setAltitudeM(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>40m (Ultra-dense)</span>
              <span>65m (Optimal)</span>
              <span>120m (Fast coverage)</span>
            </div>
          </div>

          {/* Slider 2: Drone Flight Speed (m/s) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Cruise Velocity (v_air):</span>
              <span className="font-mono text-emerald-400 font-bold">{speedMs} m/s ({Math.round(speedMs * 3.6)} km/h)</span>
            </div>
            <input
              type="range"
              min="4"
              max="14"
              step="1"
              value={speedMs}
              onChange={(e) => setSpeedMs(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slider 3: Forward Overlap (%) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Forward Overlap (Frontal):</span>
              <span className="font-mono text-amber-400 font-bold">{forwardOverlap}%</span>
            </div>
            <input
              type="range"
              min="65"
              max="90"
              step="5"
              value={forwardOverlap}
              onChange={(e) => setForwardOverlap(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Slider 4: Side Overlap (%) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Side Overlap (Lateral):</span>
              <span className="font-mono text-purple-400 font-bold">{sideOverlap}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="85"
              step="5"
              value={sideOverlap}
              onChange={(e) => setSideOverlap(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Equipment Metadata Badge */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">GNSS Positioning:</span>
              <span className="text-emerald-400 font-bold">RTK Fixed (1cm Accuracy)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LiDAR Sensor:</span>
              <span className="text-cyan-300 font-bold">Zenmuse L2 (Triple Return)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Laser Repetition:</span>
              <span className="text-slate-200">240,000 pts/sec</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DEM Output:</span>
              <span className="text-amber-300">GeoTIFF 32-bit Floating Point</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
