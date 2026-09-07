import React, { useState, useEffect } from "react";
import { CoastalTransect, FactorContribution, RiskLevel } from "../types";
import { predictSusceptibility, explainPrediction, getRecommendations } from "../api/client";
import { PhysicalSimulatorParams } from "../services/storageService";
import { RiskGauge } from "./RiskGauge";
import { ShapChart } from "./ShapChart";
import { RecommendationCard } from "./RecommendationCard";
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  ShieldCheck, 
  Waves, 
  Wind, 
  ArrowRight,
  TrendingDown,
  Layers,
  HardDrive
} from "lucide-react";

interface ParameterSimulatorProps {
  initialTransect?: CoastalTransect | null;
  savedParams?: PhysicalSimulatorParams | null;
  onParametersChange?: (params: PhysicalSimulatorParams) => void;
}

export const ParameterSimulator: React.FC<ParameterSimulatorProps> = ({
  initialTransect,
  savedParams,
  onParametersChange
}) => {
  // State for all 6 physical predictors (initialized from savedParams if available)
  const [slope, setSlope] = useState<number>(savedParams?.slope ?? initialTransect?.slope ?? 8.4);
  const [stormCount, setStormCount] = useState<number>(savedParams?.stormCount ?? initialTransect?.storm_count ?? 22);
  const [stormEnergy, setStormEnergy] = useState<number>(savedParams?.stormEnergy ?? initialTransect?.storm_energy ?? 310);
  const [depthOfClosure, setDepthOfClosure] = useState<number>(savedParams?.depthOfClosure ?? initialTransect?.depth_of_closure ?? 6.8);
  const [geomorphology, setGeomorphology] = useState<string>(savedParams?.geomorphology ?? initialTransect?.geomorphology ?? "dune");
  const [longshoreDirection, setLongshoreDirection] = useState<string>(savedParams?.longshoreDirection ?? initialTransect?.longshore_direction ?? "divergent");

  // Simulated results
  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<{
    probability: number;
    susceptibility_index: number;
    risk_class: RiskLevel;
    confidence_interval: [number, number];
  }>({
    probability: 0.84,
    susceptibility_index: 84.0,
    risk_class: "Very High",
    confidence_interval: [0.80, 0.88]
  });

  const [explanation, setExplanation] = useState<{
    base_value: number;
    top_contributing_factors: FactorContribution[];
  }>({
    base_value: -0.42,
    top_contributing_factors: []
  });

  const [recommendations, setRecommendations] = useState<any>(null);

  // Quick mitigation preset toggles
  const [appliedInterventions, setAppliedInterventions] = useState<{
    reef: boolean;
    duneNourishment: boolean;
    sandBypass: boolean;
  }>(savedParams?.appliedInterventions ?? {
    reef: false,
    duneNourishment: false,
    sandBypass: false
  });

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Calculate effective parameters after interventions
      let effectiveEnergy = stormEnergy;
      let effectiveSlope = slope;
      let effectiveGeo = geomorphology;
      let effectiveLongshore = longshoreDirection;

      if (appliedInterventions.reef) {
        effectiveEnergy = Math.round(stormEnergy * 0.58); // -42% wave attenuation
      }
      if (appliedInterventions.duneNourishment) {
        effectiveSlope = Math.max(2.5, Math.round((slope * 0.65) * 10) / 10);
        if (effectiveGeo === "dune" || effectiveGeo === "sandy") {
          effectiveGeo = "defence structure";
        }
      }
      if (appliedInterventions.sandBypass) {
        effectiveLongshore = "convergent";
      }

      const payload = {
        slope: effectiveSlope,
        storm_count: stormCount,
        storm_energy: effectiveEnergy,
        depth_of_closure: depthOfClosure,
        geomorphology: effectiveGeo,
        longshore_direction: effectiveLongshore,
        transect_id: "SIMULATED-TRX"
      };

      const predRes = await predictSusceptibility(payload);
      const explRes = await explainPrediction(payload);
      const recRes = await getRecommendations(payload, explRes.top_contributing_factors, predRes.risk_class);

      setPrediction({
        probability: predRes.erosion_probability,
        susceptibility_index: predRes.susceptibility_index,
        risk_class: predRes.risk_class,
        confidence_interval: predRes.confidence_interval
      });

      setExplanation({
        base_value: explRes.base_value,
        top_contributing_factors: explRes.top_contributing_factors
      });

      setRecommendations(recRes);
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
    if (onParametersChange) {
      onParametersChange({
        slope,
        stormCount,
        stormEnergy,
        depthOfClosure,
        geomorphology,
        longshoreDirection,
        appliedInterventions
      });
    }
  }, [slope, stormCount, stormEnergy, depthOfClosure, geomorphology, longshoreDirection, appliedInterventions]);

  const handleResetDefaults = () => {
    setSlope(initialTransect?.slope ?? 8.4);
    setStormCount(initialTransect?.storm_count ?? 22);
    setStormEnergy(initialTransect?.storm_energy ?? 310);
    setDepthOfClosure(initialTransect?.depth_of_closure ?? 6.8);
    setGeomorphology(initialTransect?.geomorphology ?? "dune");
    setLongshoreDirection(initialTransect?.longshore_direction ?? "divergent");
    setAppliedInterventions({ reef: false, duneNourishment: false, sandBypass: false });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interactive Hydrodynamic & Climate Scenario Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Test the Azzara et al. (2026) physical variables in real-time. Adjust storm intensity, beach slope, or deploy simulated interventions to observe instant XGBoost probability and TreeSHAP redistribution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/70 text-slate-400 border border-slate-800 text-[11px] font-mono">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span>State Auto-Persisted</span>
          </span>
          <button
            id="btn-reset-simulator"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Physical Predictors</span>
              <span className="text-[10px] text-cyan-400 font-mono">6 Input Features</span>
            </h3>

            {/* 1. Storm Wave Energy Flux */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  Storm Wave Energy Flux
                </span>
                <span className="font-mono font-bold text-cyan-300">{stormEnergy} kW/m</span>
              </div>
              <input
                id="slider-storm-energy"
                type="range"
                min={20}
                max={450}
                step={5}
                value={stormEnergy}
                onChange={(e) => setStormEnergy(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20 kW/m (Calm)</span>
                <span>180 (Baseline)</span>
                <span>450 kW/m (Extreme Surge)</span>
              </div>
            </div>

            {/* 2. Coastal Slope (%) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Beach & Cliff Slope
                </span>
                <span className="font-mono font-bold text-blue-300">{slope}%</span>
              </div>
              <input
                id="slider-slope"
                type="range"
                min={0.8}
                max={15.0}
                step={0.2}
                value={slope}
                onChange={(e) => setSlope(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.8% (Gentle Dissipative)</span>
                <span>4.5% (Avg)</span>
                <span>15.0% (Steep Cliff)</span>
              </div>
            </div>

            {/* 3. Storm Frequency */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-purple-400" />
                  Storm Recurrence Count
                </span>
                <span className="font-mono font-bold text-purple-300">{stormCount} storms</span>
              </div>
              <input
                id="slider-storm-count"
                type="range"
                min={1}
                max={35}
                step={1}
                value={stormCount}
                onChange={(e) => setStormCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 storm</span>
                <span>12 (Baseline)</span>
                <span>35 storms (Clustered)</span>
              </div>
            </div>

            {/* 4. Depth of Closure */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Depth of Closure (Active Sediment Limit)
                </span>
                <span className="font-mono font-bold text-emerald-300">{depthOfClosure} m</span>
              </div>
              <input
                id="slider-depth-closure"
                type="range"
                min={3.5}
                max={20.0}
                step={0.5}
                value={depthOfClosure}
                onChange={(e) => setDepthOfClosure(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3.5 m (Constrained)</span>
                <span>10.0 m (Avg)</span>
                <span>20.0 m (Expansive)</span>
              </div>
            </div>

            {/* 5. Geomorphology Substrate */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Substrate Geomorphology
              </label>
              <select
                id="select-geomorphology"
                value={geomorphology}
                onChange={(e) => setGeomorphology(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="dune">Dune System (High Vulnerability)</option>
                <option value="sandy">Sandy Beach (Medium-High Vulnerability)</option>
                <option value="riverbank">Riverbank / Estuary (Medium Vulnerability)</option>
                <option value="gravel">Gravel / Pebble Beach (Low Vulnerability)</option>
                <option value="defence structure">Hard Defence / Seawall (Mitigated)</option>
              </select>
            </div>

            {/* 6. Longshore Drift Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Longshore Transport Gradient
              </label>
              <select
                id="select-longshore"
                value={longshoreDirection}
                onChange={(e) => setLongshoreDirection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="divergent">Divergent (Sediment Deficit / High Erosion)</option>
                <option value="transitional">Transitional (Balanced Drift)</option>
                <option value="convergent">Convergent (Sediment Surplus / Accretion)</option>
              </select>
            </div>

          </div>

          {/* Quick Simulated Mitigation Presets */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Active Coastal Defence</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Toggle mitigation infrastructure to test real-time risk reduction:
            </p>

            <div className="space-y-2">
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                appliedInterventions.reef
                  ? "bg-cyan-950/40 border-cyan-500/60"
                  : "bg-slate-950/40 border-slate-800"
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={appliedInterventions.reef}
                    onChange={(e) => setAppliedInterventions({ ...appliedInterventions, reef: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Submerged Multi-Purpose Reef</span>
                    <span className="text-[10px] text-slate-400">Reduces wave energy flux by ~42%</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">-42% kW/m</span>
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                appliedInterventions.duneNourishment
                  ? "bg-cyan-950/40 border-cyan-500/60"
                  : "bg-slate-950/40 border-slate-800"
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={appliedInterventions.duneNourishment}
                    onChange={(e) => setAppliedInterventions({ ...appliedInterventions, duneNourishment: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Dune Nourishment & Vegetated Core</span>
                    <span className="text-[10px] text-slate-400">Dissipates slope & anchors substrate</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Living Sill</span>
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                appliedInterventions.sandBypass
                  ? "bg-cyan-950/40 border-cyan-500/60"
                  : "bg-slate-950/40 border-slate-800"
              }`}>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={appliedInterventions.sandBypass}
                    onChange={(e) => setAppliedInterventions({ ...appliedInterventions, sandBypass: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Littoral Sand Bypass System</span>
                    <span className="text-[10px] text-slate-400">Eliminates downdrift sediment deficit</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Convergent</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Live Model Output & SHAP (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Risk Gauge */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Simulated Erosion Risk Score
              </h3>
              <RiskGauge
                probability={prediction.probability}
                susceptibilityIndex={prediction.susceptibility_index}
                riskClass={prediction.risk_class}
                confidenceInterval={prediction.confidence_interval}
                size="md"
              />
            </div>

            {/* Key Drivers Summary */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Top SHAP Drivers Ranking
                </h3>
                <div className="space-y-2 mt-3">
                  {explanation.top_contributing_factors.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-200 text-[11px]">{f.displayName}</span>
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${f.shap_value > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {f.shap_value > 0 ? "+" : ""}{f.shap_value.toFixed(3)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400">
                <span>Model: </span>
                <span className="text-cyan-300 font-mono font-semibold">XGBoost (AUC 0.938)</span>
              </div>
            </div>

          </div>

          {/* Full SHAP Chart */}
          <ShapChart
            factors={explanation.top_contributing_factors}
            baseValue={explanation.base_value}
            compact={true}
          />

          {/* Recommendations based on simulated parameters */}
          {recommendations && (
            <RecommendationCard plan={recommendations} />
          )}

        </div>

      </div>

    </div>
  );
};
