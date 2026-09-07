import React, { useState, useMemo, useEffect } from "react";
import { CoastalTransect, BeachProfileConfig } from "../types";
import { generateCrossShoreProfilePoints, simulateBeachProfilePhysics } from "../utils/coastalPhysics";
import { BeachProfileSimulatorParams } from "../services/storageService";
import {
  Waves,
  Shield,
  Layers,
  Sliders,
  TrendingDown,
  AlertTriangle,
  Zap,
  Info,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Droplets,
  Anchor,
  HardDrive
} from "lucide-react";

interface BeachProfileSimulatorProps {
  initialTransect?: CoastalTransect | null;
  savedParams?: BeachProfileSimulatorParams | null;
  onParametersChange?: (params: BeachProfileSimulatorParams) => void;
}

export const BeachProfileSimulator: React.FC<BeachProfileSimulatorProps> = ({
  initialTransect,
  savedParams,
  onParametersChange
}) => {
  // Config state (initialized from savedParams if available)
  const [duneCrestHeightM, setDuneCrestHeightM] = useState<number>(savedParams?.duneCrestHeightM ?? 5.5);
  const [bermWidthM, setBermWidthM] = useState<number>(savedParams?.bermWidthM ?? 32);
  const [beachSlopePct, setBeachSlopePct] = useState<number>(savedParams?.beachSlopePct ?? (initialTransect?.slope || 6.5));
  const [grainSizeD50Mm, setGrainSizeD50Mm] = useState<number>(savedParams?.grainSizeD50Mm ?? 0.35);
  const [tideLevelM, setTideLevelM] = useState<number>(savedParams?.tideLevelM ?? 1.1);
  const [stormSurgeM, setStormSurgeM] = useState<number>(savedParams?.stormSurgeM ?? 1.8);
  const [waveHeightHsM, setWaveHeightHsM] = useState<number>(
    savedParams?.waveHeightHsM ?? (initialTransect ? Math.min(6.5, Math.max(1.5, initialTransect.storm_energy / 60)) : 3.8)
  );
  const [wavePeriodTpS, setWavePeriodTpS] = useState<number>(savedParams?.wavePeriodTpS ?? 9.2);
  const [seaLevelRiseM, setSeaLevelRiseM] = useState<number>(savedParams?.seaLevelRiseM ?? 0.0);
  const [depthOfClosureM, setDepthOfClosureM] = useState<number>(
    savedParams?.depthOfClosureM ?? (initialTransect?.depth_of_closure || 7.2)
  );
  const [mitigationType, setMitigationType] = useState<BeachProfileConfig["mitigationType"]>(
    savedParams?.mitigationType ?? "none"
  );

  const config: BeachProfileConfig = useMemo(() => ({
    duneCrestHeightM,
    bermWidthM,
    beachSlopePct,
    grainSizeD50Mm,
    tideLevelM,
    stormSurgeM,
    waveHeightHsM,
    wavePeriodTpS,
    seaLevelRiseM,
    depthOfClosureM,
    mitigationType
  }), [
    duneCrestHeightM,
    bermWidthM,
    beachSlopePct,
    grainSizeD50Mm,
    tideLevelM,
    stormSurgeM,
    waveHeightHsM,
    wavePeriodTpS,
    seaLevelRiseM,
    depthOfClosureM,
    mitigationType
  ]);

  // Notify parent of parameter changes to ensure auto-persistence
  useEffect(() => {
    if (onParametersChange) {
      onParametersChange(config);
    }
  }, [config, onParametersChange]);

  // Compute profile points and physics outputs
  const profilePoints = useMemo(() => generateCrossShoreProfilePoints(config), [config]);
  const simResult = useMemo(() => simulateBeachProfilePhysics(config), [config]);

  // SVG coordinate transformation helpers
  const svgWidth = 840;
  const svgHeight = 320;
  const minX = -20;
  const maxX = 160;
  const minZ = -8;
  const maxZ = 8;

  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * svgWidth;
  const scaleZ = (z: number) => svgHeight - ((z - minZ) / (maxZ - minZ)) * svgHeight;

  // Build SVG Path for Baseline Profile
  const baselinePathD = useMemo(() => {
    return profilePoints.reduce((acc, pt, idx) => {
      const sx = scaleX(pt.x);
      const sz = scaleZ(pt.baselineElevation);
      return idx === 0 ? `M ${sx} ${sz}` : `${acc} L ${sx} ${sz}`;
    }, "") + ` L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  }, [profilePoints]);

  // Build SVG Path for Post-Storm Profile
  const postStormPathD = useMemo(() => {
    return profilePoints.reduce((acc, pt, idx) => {
      const sx = scaleX(pt.x);
      const sz = scaleZ(pt.postStormElevation);
      return idx === 0 ? `M ${sx} ${sz}` : `${acc} L ${sx} ${sz}`;
    }, "") + ` L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  }, [profilePoints]);

  const waterLevelY = scaleZ(config.tideLevelM + config.stormSurgeM + config.seaLevelRiseM);
  const totalWaterLevelY = scaleZ(simResult.totalWaterLevelM);

  const resetToBaseline = () => {
    setDuneCrestHeightM(5.5);
    setBermWidthM(32);
    setBeachSlopePct(initialTransect?.slope || 6.5);
    setStormSurgeM(1.8);
    setWaveHeightHsM(3.8);
    setWavePeriodTpS(9.2);
    setSeaLevelRiseM(0.0);
    setMitigationType("none");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider">
                  2D Cross-Shore Bathymetry & Hydrodynamics Engine
                </span>
                <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-full">
                  Stockdon (2006) &bull; Dean Equilibrium h = A &middot; x^(2/3)
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Beach Profile & Dune Scarp Physics Simulator
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Simulate wave runup (R2%), cyclonic storm surge, and subaerial sediment transport across the active cross-shore transect. Evaluate dune scarp retreat and volumetric sand loss under variable sea level rise and nature-based defenses.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950/80 text-slate-400 border border-slate-800 text-[11px] font-mono">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>State Auto-Persisted</span>
          </span>
          <button
            onClick={resetToBaseline}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Parameters</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Cross-Section Canvas + Control Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive 2D Cross-Section Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Cross-Shore Bathymetry & Scarp Cross-Section
                </h3>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-1 bg-amber-500 rounded-sm" /> Baseline DEM
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-3 h-1 bg-rose-500 rounded-sm" /> Post-Storm Scarp
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-3 h-1 bg-cyan-400 rounded-sm" /> Wave Runup ($TWL$)
                </span>
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="relative w-full h-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Sky/Atmosphere Gradient */}
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#090d16" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Water Gradient */}
                  <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#0284c7" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Subaerial Sand Beach Gradient */}
                  <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#b45309" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#78350f" stopOpacity="1" />
                  </linearGradient>

                  {/* Post-storm eroded sand layer */}
                  <linearGradient id="erodedSandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#991b1b" stopOpacity="0.6" />
                  </linearGradient>

                  {/* Hatched Pattern for Scarp Loss */}
                  <pattern id="scarpHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.5" />
                  </pattern>
                </defs>

                {/* Sky Backing */}
                <rect width={svgWidth} height={svgHeight} fill="url(#skyGrad)" />

                {/* Grid Lines (Z elevations) */}
                {[-6, -4, -2, 0, 2, 4, 6].map((z) => {
                  const y = scaleZ(z);
                  return (
                    <g key={z} opacity={0.25}>
                      <line x1="0" y1={y} x2={svgWidth} y2={y} stroke="#64748b" strokeDasharray="3 3" />
                      <text x="8" y={y - 3} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                        {z > 0 ? `+${z}m` : `${z}m`}
                      </text>
                    </g>
                  );
                })}

                {/* Cross-shore distance X markers */}
                {[0, 25, 50, 75, 100, 125, 150].map((x) => {
                  const sx = scaleX(x);
                  return (
                    <g key={x} opacity={0.2}>
                      <line x1={sx} y1="0" x2={sx} y2={svgHeight} stroke="#64748b" strokeDasharray="2 4" />
                      <text x={sx + 4} y={svgHeight - 8} fill="#94a3b8" fontSize="9" fontFamily="monospace">
                        {x}m
                      </text>
                    </g>
                  );
                })}

                {/* 1. Baseline Pre-Storm Beach Sand Fill */}
                <path d={baselinePathD} fill="url(#sandGrad)" stroke="#f59e0b" strokeWidth="1.5" />

                {/* 2. Erosion Cut Pattern (between baseline and post-storm) */}
                <path d={baselinePathD} fill="url(#scarpHatch)" opacity={0.8} />

                {/* 3. Post-Storm Residual Profile Fill */}
                <path d={postStormPathD} fill="#1e293b" opacity={0.92} stroke="#f43f5e" strokeWidth="2.5" />

                {/* 4. Dynamic Water & Waves */}
                {/* Still Water Level Body */}
                <rect
                  x={scaleX(15)}
                  y={waterLevelY}
                  width={svgWidth - scaleX(15)}
                  height={svgHeight - waterLevelY}
                  fill="url(#oceanGrad)"
                />

                {/* Animated Wave crests */}
                <path
                  d={`M ${scaleX(15)} ${totalWaterLevelY} Q ${scaleX(45)} ${waterLevelY - 12}, ${scaleX(80)} ${waterLevelY + 4} T ${scaleX(140)} ${waterLevelY - 8} L ${svgWidth} ${waterLevelY} L ${svgWidth} ${svgHeight} L ${scaleX(15)} ${svgHeight} Z`}
                  fill="#38bdf8"
                  fillOpacity="0.25"
                  stroke="#38bdf8"
                  strokeWidth="2"
                />

                {/* Total Water Level (TWL = Surge + Runup R2%) Line */}
                <line
                  x1="0"
                  y1={totalWaterLevelY}
                  x2={svgWidth}
                  y2={totalWaterLevelY}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />
                <text
                  x={svgWidth - 180}
                  y={totalWaterLevelY - 6}
                  fill="#38bdf8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  TWL (Surge + R₂%): +{simResult.totalWaterLevelM}m
                </text>

                {/* Mitigation Structural Overlays */}
                {mitigationType === "geotextile_dune_core" && (
                  <g>
                    <ellipse
                      cx={scaleX(8)}
                      cy={scaleZ(2.2)}
                      rx="16"
                      ry="22"
                      fill="#10b981"
                      fillOpacity="0.8"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x={scaleX(8) - 20} y={scaleZ(2.2) - 26} fill="#34d399" fontSize="9" fontWeight="bold">
                      Geotextile Tube
                    </text>
                  </g>
                )}

                {mitigationType === "submerged_artificial_reef" && (
                  <g>
                    <polygon
                      points={`${scaleX(90)},${scaleZ(-1.8)} ${scaleX(98)},${scaleZ(0.2)} ${scaleX(106)},${scaleZ(-1.8)}`}
                      fill="#065f46"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <text x={scaleX(90) - 15} y={scaleZ(0.2) - 8} fill="#34d399" fontSize="9" fontWeight="bold">
                      Submerged Reef
                    </text>
                  </g>
                )}

                {mitigationType === "rock_revetment" && (
                  <g>
                    <polygon
                      points={`${scaleX(5)},${scaleZ(1.2)} ${scaleX(16)},${scaleZ(3.8)} ${scaleX(20)},${scaleZ(1.5)}`}
                      fill="#334155"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x={scaleX(5)} y={scaleZ(3.8) - 8} fill="#cbd5e1" fontSize="9" fontWeight="bold">
                      Rock Revetment
                    </text>
                  </g>
                )}

                {mitigationType === "sand_nourishment_berm" && (
                  <g>
                    <rect
                      x={scaleX(15)}
                      y={scaleZ(2.8)}
                      width={scaleX(45) - scaleX(15)}
                      height={20}
                      fill="#fbbf24"
                      fillOpacity="0.6"
                      stroke="#f59e0b"
                      strokeDasharray="3 3"
                    />
                    <text x={scaleX(20)} y={scaleZ(2.8) - 6} fill="#fbbf24" fontSize="9" fontWeight="bold">
                      +25m Sand Nourishment
                    </text>
                  </g>
                )}

                {/* Scarp Retreat Indicator Annotation */}
                {simResult.duneScarpRetreatM > 0.5 && (
                  <g>
                    <line
                      x1={scaleX(5)}
                      y1={scaleZ(4.5)}
                      x2={scaleX(5 + simResult.duneScarpRetreatM * 2.5)}
                      y2={scaleZ(4.5)}
                      stroke="#ef4444"
                      strokeWidth="2"
                      markerEnd="url(#arrow)"
                    />
                    <text
                      x={scaleX(5)}
                      y={scaleZ(4.5) - 6}
                      fill="#f87171"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Scarp Retreat: -{simResult.duneScarpRetreatM}m
                    </text>
                  </g>
                )}
              </svg>

            </div>

            {/* Visual Region Labels */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono text-slate-400 pt-1">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300 font-bold block">Hinterland & Crest</span>
                <span>x = -20m to 0m</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-amber-400 font-bold block">Foredune Scarp Face</span>
                <span>x = 0m to 15m</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-cyan-400 font-bold block">Dry Berm & Swash</span>
                <span>x = 15m to 45m</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-blue-400 font-bold block">Dean's Bathymetry</span>
                <span>x = 45m to 150m</span>
              </div>
            </div>

          </div>

          {/* 4 Live KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Dune Scarp Retreat</span>
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-xl font-bold font-mono text-rose-400">
                -{simResult.duneScarpRetreatM} m
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Horizontal shoreline loss</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Volumetric Sand Loss</span>
                <Layers className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-xl font-bold font-mono text-amber-300">
                -{simResult.volumetricErosionM3PerM} m³/m
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Cross-shore profile cut</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Water Level (TWL)</span>
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-xl font-bold font-mono text-cyan-300">
                +{simResult.totalWaterLevelM} m
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Surge + Tide + Runup</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Overwash Hazard</span>
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <p className={`text-base font-bold truncate ${
                simResult.overwashRisk === "Catastrophic Breach" ? "text-rose-400" :
                simResult.overwashRisk === "Scarp Collapse" ? "text-orange-400" :
                simResult.overwashRisk === "Toe Erosion" ? "text-amber-400" : "text-emerald-400"
              }`}>
                {simResult.overwashRisk}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Dune stability threshold</span>
            </div>

          </div>

          {/* Mitigation Benefit Strip */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-900/60 flex items-start gap-3 text-xs">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-300 text-xs">Mitigation Impact Assessment</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {simResult.energyDissipationPct}% Energy Dissipated
                </span>
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {simResult.mitigationBenefitSummary}
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Parameter Sliders & Scenarios (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6 text-xs">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Hydrodynamic & Climate Controls
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Real-Time Physics</span>
          </div>

          {/* Mitigation Strategy Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Coastal Mitigation Defense Strategy:</span>
              <span className="font-mono text-[10px] text-cyan-400 uppercase">
                {mitigationType.replace(/_/g, " ")}
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setMitigationType("none")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mitigationType === "none"
                    ? "bg-slate-800 border-rose-500 text-white shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold block text-[11px]">No Defense (Base)</span>
                <span className="text-[10px] text-slate-400">Unshielded natural profile</span>
              </button>

              <button
                onClick={() => setMitigationType("geotextile_dune_core")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mitigationType === "geotextile_dune_core"
                    ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold block text-[11px]">Geotextile Dune Core</span>
                <span className="text-[10px] text-slate-400">Sand tube bluff reinforcement</span>
              </button>

              <button
                onClick={() => setMitigationType("submerged_artificial_reef")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mitigationType === "submerged_artificial_reef"
                    ? "bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold block text-[11px]">Submerged Modular Reef</span>
                <span className="text-[10px] text-slate-400">Offshore wave breaker</span>
              </button>

              <button
                onClick={() => setMitigationType("sand_nourishment_berm")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  mitigationType === "sand_nourishment_berm"
                    ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="font-bold block text-[11px]">Sand Nourishment Berm</span>
                <span className="text-[10px] text-slate-400">+25m sacrificial berm</span>
              </button>
            </div>
          </div>

          {/* Slider 1: Storm Surge (m) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Meteorological Storm Surge:</span>
              <span className="font-mono text-amber-400 font-bold">+{stormSurgeM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.5"
              step="0.1"
              value={stormSurgeM}
              onChange={(e) => setStormSurgeM(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0m (Calm)</span>
              <span>1.8m (1-in-10yr)</span>
              <span>3.5m (1-in-100yr Cyclone)</span>
            </div>
          </div>

          {/* Slider 2: Significant Wave Height Hs (m) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Significant Wave Height (Hs):</span>
              <span className="font-mono text-cyan-400 font-bold">{waveHeightHsM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.1"
              value={waveHeightHsM}
              onChange={(e) => setWaveHeightHsM(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0m</span>
              <span>3.8m</span>
              <span>7.0m Extreme</span>
            </div>
          </div>

          {/* Slider 3: Sea Level Rise Scenario (2030-2100) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Climate Sea Level Rise (IPCC SSP5-8.5):</span>
              <span className="font-mono text-rose-400 font-bold">+{seaLevelRiseM.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.5"
              step="0.05"
              value={seaLevelRiseM}
              onChange={(e) => setSeaLevelRiseM(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>+0.0m (2026)</span>
              <span>+0.45m (2050)</span>
              <span>+1.50m (2100 High)</span>
            </div>
          </div>

          {/* Slider 4: Beach Slope (%) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Intertidal Beach Slope (Slope %):</span>
              <span className="font-mono text-slate-200 font-bold">{beachSlopePct.toFixed(1)} %</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="18.0"
              step="0.5"
              value={beachSlopePct}
              onChange={(e) => setBeachSlopePct(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Slider 5: Dune Crest Elevation (m) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-semibold">Dune Crest Elevation (z_crest):</span>
              <span className="font-mono text-emerald-400 font-bold">{duneCrestHeightM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="9.0"
              step="0.5"
              value={duneCrestHeightM}
              onChange={(e) => setDuneCrestHeightM(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
