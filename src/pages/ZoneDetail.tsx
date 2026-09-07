import React, { useState } from "react";
import { CoastalTransect, MitigationAction } from "../types";
import { RiskGauge } from "../components/RiskGauge";
import { ShapChart } from "../components/ShapChart";
import { RecommendationCard } from "../components/RecommendationCard";
import { ParameterSimulator } from "../components/ParameterSimulator";
import { LiveSatelliteWeatherPanel } from "../components/LiveSatelliteWeatherPanel";
import { GeminiAiAdvisorModal } from "../components/GeminiAiAdvisorModal";
import { HistoricalDataPanel } from "../components/HistoricalDataPanel";
import { HistoricalTrendsD3 } from "../components/HistoricalTrendsD3";
import {
  ArrowLeft,
  MapPin,
  Compass,
  Layers,
  Wind,
  Waves,
  Shield,
  Clock,
  Sparkles,
  Sliders,
  Printer,
  Share2,
  CheckCircle2,
  Bot,
  History,
  TrendingDown
} from "lucide-react";

interface ZoneDetailProps {
  transect: CoastalTransect;
  onBack: () => void;
}

export const ZoneDetail: React.FC<ZoneDetailProps> = ({
  transect,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<"analysis" | "trends" | "history" | "simulator">("trends");
  const [simulatedRiskReduction, setSimulatedRiskReduction] = useState<number>(0);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);

  const handleSimulateAction = (action: MitigationAction) => {
    setSimulatedRiskReduction(action.expected_risk_reduction_pct);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const currentRiskScore = transect.susceptibility_index || (transect.probability * 100);
  const adjustedRisk = Math.max(
    5.0,
    Math.round((currentRiskScore * (1 - simulatedRiskReduction / 100)) * 10) / 10
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          id="btn-back-to-dashboard"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Coastal Overview</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Sub-view Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              id="tab-zone-analysis"
              onClick={() => setActiveTab("analysis")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "analysis"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Susceptibility & SHAP
            </button>
            <button
              id="tab-zone-trends"
              onClick={() => setActiveTab("trends")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "trends"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>Historical Trends</span>
            </button>
            <button
              id="tab-zone-history"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5 text-purple-400" />
              <span>Survey Archive & Storms</span>
            </button>
            <button
              id="tab-zone-simulator"
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "simulator"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3 h-3 text-amber-400" />
              <span>What-If Lab</span>
            </button>
          </div>

          <button
            id="btn-open-gemini-for-zone"
            onClick={() => setIsGeminiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 border border-cyan-400/40 transition-all cursor-pointer"
            title="Generate Deep Gemini AI Assessment for this Zone"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Ask Gemini AI</span>
          </button>

          <button
            id="btn-print-report"
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Print or Export Summary"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Zone Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {transect.name}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold">
                {transect.id}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                {transect.region}
              </span>
              <span>&bull;</span>
              <span className="font-mono">
                Coordinates: [
                {typeof transect?.coordinates?.[0] === "number" && !isNaN(transect.coordinates[0]) ? transect.coordinates[0].toFixed(4) : "42.1855"}°N,{" "}
                {typeof transect?.coordinates?.[1] === "number" && !isNaN(transect.coordinates[1]) ? transect.coordinates[1].toFixed(4) : "14.6865"}°E]
              </span>
            </p>
          </div>

          {/* Key Context Badges */}
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-slate-500 text-[10px] block uppercase">Historical Rate</span>
              <span className="font-bold text-rose-400">{transect.historical_trend}</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
              <span className="text-slate-500 text-[10px] block uppercase">Asset Exposure</span>
              <span className="font-semibold text-slate-200">{transect.urban_density}</span>
            </div>
          </div>
        </div>

        {/* 6 Physical Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80">
          
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Slope</span>
            <span className="text-xs font-bold font-mono text-blue-300">{transect.slope}%</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Beach Gradient</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Storm Energy</span>
            <span className="text-xs font-bold font-mono text-cyan-300">{transect.storm_energy} kW/m</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Wave Flux</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Storm Count</span>
            <span className="text-xs font-bold font-mono text-purple-300">{transect.storm_count} events</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Calibration Epoch</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Depth of Closure</span>
            <span className="text-xs font-bold font-mono text-emerald-300">{transect.depth_of_closure} m</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Sediment Envelope</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Geomorphology</span>
            <span className="text-xs font-bold font-mono text-amber-300 capitalize">{transect.geomorphology}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Substrate</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Longshore Drift</span>
            <span className="text-xs font-bold font-mono text-rose-300 capitalize">{transect.longshore_direction}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Littoral Budget</span>
          </div>

        </div>

      </div>

      {/* Live Satellite & Ocean Weather Telemetry Feed */}
      <LiveSatelliteWeatherPanel transect={transect} />

      {/* What-If Simulator or Analysis Content */}
      {activeTab === "analysis" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Risk Gauge & Model Confidence (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 w-full text-left">
                Susceptibility Risk Assessment
              </h3>

              <RiskGauge
                probability={transect.probability}
                susceptibilityIndex={currentRiskScore}
                riskClass={transect.risk_class}
                confidenceInterval={transect.confidence_interval}
                size="lg"
              />

              {simulatedRiskReduction > 0 && (
                <div className="mt-4 p-3 w-full bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>With Mitigation Plan:</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-300">
                    {adjustedRisk}% (-{simulatedRiskReduction}%)
                  </span>
                </div>
              )}
            </div>

            {/* Model Architecture Info Card */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Inference Engine Diagnostics
              </h4>
              
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-cyan-300">XGBoost Classifier (180 trees)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Validation AUC:</span>
                  <span className="text-emerald-400">0.9381 (vs MARS 0.784)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Background Base &phi;<sub>0</sub>:</span>
                  <span className="text-slate-300">{transect.base_value || -0.42}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Attribution Method:</span>
                  <span className="text-cyan-300">Exact TreeSHAP</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: SHAP Chart & Decision Support (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* TreeSHAP Feature Attributions Bar Chart */}
            <ShapChart
              factors={transect.top_contributing_factors}
              baseValue={transect.base_value}
            />

            {/* Recommended Interventions */}
            <RecommendationCard
              plan={transect.mitigation}
              onSimulateAction={handleSimulateAction}
            />

          </div>

        </div>
      ) : activeTab === "trends" ? (
        /* D3.js Multi-Year Historical Erosion Trends */
        <HistoricalTrendsD3 transect={transect} />
      ) : activeTab === "history" ? (
        /* Historical Multi-Year Surveys & Storm Archive */
        <HistoricalDataPanel
          transects={[transect]}
          selectedTransect={transect}
          onSelectTransect={() => {}}
        />
      ) : (
        /* What-If Simulator for this Transect */
        <ParameterSimulator initialTransect={transect} />
      )}

      {/* Gemini AI Coastal Intelligence Modal */}
      <GeminiAiAdvisorModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        transect={transect}
      />

    </div>
  );
};
