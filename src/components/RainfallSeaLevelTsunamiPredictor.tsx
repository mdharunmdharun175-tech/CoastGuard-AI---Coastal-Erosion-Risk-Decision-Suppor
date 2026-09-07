import React, { useState, useMemo } from "react";
import { 
  CoastalTransect, 
  RainfallSeaLevelConfig, 
  HistoricalRainfallSoilEvent 
} from "../types";
import { 
  calculateRainfallSeaLevelIncrease, 
  analyzeSoilMoistureMechanics, 
  evaluateTsunamiAlertCriteria, 
  HISTORICAL_RAINFALL_SOIL_EVENTS 
} from "../utils/rainfallTsunamiCalculations";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";
import { 
  Waves, 
  CloudRain, 
  Droplets, 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  Calendar, 
  TrendingUp, 
  Compass, 
  MapPin, 
  Activity, 
  Layers, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  RefreshCw, 
  Play, 
  ArrowRight,
  Sliders,
  Wind,
  Thermometer,
  Gauge
} from "lucide-react";

interface RainfallSeaLevelTsunamiPredictorProps {
  initialTransect?: CoastalTransect | null;
  allTransects?: CoastalTransect[];
  onOpenCapStudio?: () => void;
  onOpenDisasterCenter?: () => void;
  onSelectTransect?: (t: CoastalTransect) => void;
}

export const RainfallSeaLevelTsunamiPredictor: React.FC<RainfallSeaLevelTsunamiPredictorProps> = ({
  initialTransect,
  allTransects = [],
  onOpenCapStudio,
  onOpenDisasterCenter,
  onSelectTransect
}) => {
  const [selectedTransect, setSelectedTransect] = useState<CoastalTransect | null>(
    initialTransect || (allTransects.length > 0 ? allTransects[0] : null)
  );

  // Main Simulation Configuration State
  const [config, setConfig] = useState<RainfallSeaLevelConfig>({
    rainfall24hMm: 110,
    rainIntensityMmHr: 34,
    soilMoisturePct: 84,
    catchmentAreaKm2: 85,
    estuaryWidthM: 65,
    soilType: "coastal_cliff_marl",
    tideStageM: 0.45,
    surfacePressureHpa: 998,
    onshoreWindKmh: 68
  });

  const [selectedHistoricalEvent, setSelectedHistoricalEvent] = useState<HistoricalRainfallSoilEvent | null>(
    HISTORICAL_RAINFALL_SOIL_EVENTS[0]
  );
  const [activeTab, setActiveTab] = useState<"simulator" | "history" | "protocols">("simulator");
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);

  // Run Calculations
  const seaLevelResult = useMemo(() => {
    return calculateRainfallSeaLevelIncrease(config);
  }, [config]);

  const soilAnalysis = useMemo(() => {
    const slopeDeg = selectedTransect?.slope ? Math.min(45, Math.max(12, selectedTransect.slope * 2.5)) : 24;
    return analyzeSoilMoistureMechanics(config, slopeDeg);
  }, [config, selectedTransect]);

  const tsunamiEvaluation = useMemo(() => {
    return evaluateTsunamiAlertCriteria(config, seaLevelResult, soilAnalysis, selectedTransect);
  }, [config, seaLevelResult, soilAnalysis, selectedTransect]);

  // Load Historical Event Preset into Simulator
  const handleLoadHistoricalEvent = (event: HistoricalRainfallSoilEvent) => {
    setSelectedHistoricalEvent(event);
    setConfig(prev => ({
      ...prev,
      rainfall24hMm: event.cumulativeRainfall24hMm,
      rainIntensityMmHr: event.peakRainRateMmHr,
      soilMoisturePct: event.antecedentSoilMoisturePct,
      surfacePressureHpa: event.tsunamiType === "Meteotsunami" ? 990 : 998
    }));
  };

  // Sound Alarm Siren
  const handleToggleAlarm = () => {
    if (isAlarmPlaying) {
      emergencyAlarm.stopAlarm();
      setIsAlarmPlaying(false);
    } else {
      emergencyAlarm.startAlarm(0.95);
      setIsAlarmPlaying(true);
    }
  };

  // Export CSV of Simulation & Historical Matrix
  const handleExportCSV = () => {
    const headers = [
      "Record Type",
      "Scenario / Event Name",
      "24h Rainfall (mm)",
      "Peak Rain Rate (mm/hr)",
      "Soil Moisture Saturation (%)",
      "Pore Water Pressure (kPa)",
      "Effective Shear Stress (kPa)",
      "Slope Factor of Safety",
      "Pluvial Runoff Rise (m)",
      "Barometric Rise (m)",
      "Wind Setup (m)",
      "Wave Setup (m)",
      "Total Sea Level Rise (m)",
      "TWL With Tide (m)",
      "Tsunami Alert Level",
      "Estimated Tsunami Wave (m)"
    ];

    const currentSimRow = [
      "Live Predictive Simulation",
      `"Active User Scenario (${config.soilType})"`,
      config.rainfall24hMm,
      config.rainIntensityMmHr,
      config.soilMoisturePct,
      soilAnalysis.poreWaterPressureKPa,
      soilAnalysis.effectiveShearStressKPa,
      soilAnalysis.factorOfSafety,
      seaLevelResult.pluvialRunoffIncreaseM,
      seaLevelResult.barometricIncreaseM,
      seaLevelResult.windSetupM,
      seaLevelResult.waveSetupM,
      seaLevelResult.totalSeaLevelIncreaseM,
      seaLevelResult.totalWaterLevelWithTideM,
      `"${tsunamiEvaluation.alertLevel}"`,
      tsunamiEvaluation.potentialTsunamiWaveHeightM
    ];

    const historicalRows = HISTORICAL_RAINFALL_SOIL_EVENTS.map(e => [
      "Historical Calibrated Event",
      `"${e.eventName}"`,
      e.cumulativeRainfall24hMm,
      e.peakRainRateMmHr,
      e.antecedentSoilMoisturePct,
      e.poreWaterPressureKPa,
      "N/A (Empirical)",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      "N/A",
      e.seaLevelIncreaseM,
      e.seaLevelIncreaseM + 0.4,
      `"${e.alertIssued}"`,
      e.observedTsunamiHeightM
    ]);

    const allRows = [currentSimRow, ...historicalRows];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...allRows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rainfall_sealevel_soil_tsunami_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAlertBadgeClasses = (level: string) => {
    switch (level) {
      case "CRITICAL_TSUNAMI_EVACUATION":
        return "bg-rose-950 text-rose-300 border-rose-600 animate-pulse";
      case "WARNING":
        return "bg-orange-950 text-orange-300 border-orange-600";
      case "ADVISORY":
        return "bg-amber-950 text-amber-300 border-amber-600";
      default:
        return "bg-emerald-950 text-emerald-300 border-emerald-600";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Strip */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40 shrink-0">
              <CloudRain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Rainfall-Induced Sea Level Surge & Soil Moisture Tsunami Alert System
                </h1>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Hydro-Geotechnical Coupling
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Predicts compound sea level rise from pluvial catchment backwater, barometric drop, and wind surge; correlates antecedent soil moisture saturation and pore water pressure with historical disaster datasets to trigger early landslide tsunami and meteotsunami warnings.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-trigger-tsunami-siren"
              onClick={handleToggleAlarm}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isAlarmPlaying 
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-rose-500 animate-pulse"
                  : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 border border-rose-400/40"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isAlarmPlaying ? "Stop Tsunami Siren" : "Sound Tsunami Alarm"}</span>
            </button>

            {onOpenCapStudio && (
              <button
                id="btn-open-cap-from-tsunami"
                onClick={onOpenCapStudio}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>CAP Broadcast Studio</span>
              </button>
            )}

            <button
              id="btn-export-tsunami-csv"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
              title="Export complete simulation and historical calibration matrix"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Coastal Transect Filter & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Coastal Sector:</span>
            </span>
            {allTransects.length > 0 ? (
              <select
                id="select-tsunami-transect"
                value={selectedTransect?.id || ""}
                onChange={(e) => {
                  const t = allTransects.find(item => item.id === e.target.value);
                  if (t) {
                    setSelectedTransect(t);
                    if (onSelectTransect) onSelectTransect(t);
                  }
                }}
                className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500"
              >
                {allTransects.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.name} ({t.geomorphology})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-mono text-cyan-300">Default Central Adriatic Sector</span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interactive Simulator
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Historical Disaster Archive ({HISTORICAL_RAINFALL_SOIL_EVENTS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("protocols")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "protocols"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Evacuation Protocols</span>
            </button>
          </div>

        </div>

      </div>

      {/* Critical Tsunami & Sea Level Alert Banner */}
      <div className={`p-5 rounded-3xl border shadow-xl transition-all ${
        tsunamiEvaluation.alertLevel === "CRITICAL_TSUNAMI_EVACUATION"
          ? "bg-gradient-to-r from-rose-950/90 via-red-950/80 to-slate-900 border-rose-500/80 ring-2 ring-rose-500/40 shadow-rose-950/60"
          : tsunamiEvaluation.alertLevel === "WARNING"
          ? "bg-gradient-to-r from-orange-950/90 via-amber-950/70 to-slate-900 border-orange-500/70 shadow-orange-950/40"
          : tsunamiEvaluation.alertLevel === "ADVISORY"
          ? "bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/60"
          : "bg-slate-900/90 border-slate-800"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase border ${getAlertBadgeClasses(tsunamiEvaluation.alertLevel)}`}>
                {tsunamiEvaluation.alertLevel.replace(/_/g, " ")}
              </span>
              <span className="text-white font-bold text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{tsunamiEvaluation.headline}</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {tsunamiEvaluation.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Est. Impulse Wave</span>
              <span className="text-xl font-extrabold text-cyan-400">
                {tsunamiEvaluation.potentialTsunamiWaveHeightM > 0 ? `+${tsunamiEvaluation.potentialTsunamiWaveHeightM} m` : "Negligible"}
              </span>
            </div>
            <div className="text-right font-mono bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Evacuation Line</span>
              <span className="text-xl font-extrabold text-rose-400">
                {tsunamiEvaluation.evacuationDistanceM > 0 ? `${tsunamiEvaluation.evacuationDistanceM}m` : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Tsunami Parameters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Primary Mechanism</span>
            <span className="font-bold text-slate-200 text-[11px] truncate block">
              {tsunamiEvaluation.tsunamiMechanism}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Arrival Lag Time</span>
            <span className="font-bold text-amber-400 text-[11px] block">
              {tsunamiEvaluation.estimatedArrivalTimeMin > 0 ? `~${tsunamiEvaluation.estimatedArrivalTimeMin} minutes` : "Stable"}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Soil Liquefaction Status</span>
            <span className={`font-bold text-[11px] block ${
              soilAnalysis.liquefactionRisk.includes("Critical") ? "text-rose-400" :
              soilAnalysis.liquefactionRisk.includes("High") ? "text-orange-400" : "text-emerald-400"
            }`}>
              {soilAnalysis.liquefactionRisk}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">Compound Sea Level Surge</span>
            <span className="font-bold text-cyan-300 text-[11px] block">
              +{seaLevelResult.totalSeaLevelIncreaseM} m (TWL: {seaLevelResult.totalWaterLevelWithTideM}m)
            </span>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Sliders & Parameter Modulators (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Rainfall & Catchment Hydrology</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">Pluvial Model</span>
              </div>

              {/* Slider 1: 24h Rainfall */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>24h Cumulative Precipitation:</span>
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{config.rainfall24hMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="5"
                  value={config.rainfall24hMm}
                  onChange={(e) => setConfig({ ...config, rainfall24hMm: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 mm (Dry)</span>
                  <span>100 mm (Storm)</span>
                  <span>250+ mm (Historic Megastorm)</span>
                </div>
              </div>

              {/* Slider 2: Rain Intensity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Peak Downpour Intensity:</span>
                  </span>
                  <span className="font-mono font-bold text-blue-300">{config.rainIntensityMmHr} mm/hr</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="2"
                  value={config.rainIntensityMmHr}
                  onChange={(e) => setConfig({ ...config, rainIntensityMmHr: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5 mm/h (Drizzle)</span>
                  <span>35 mm/h (Cloudburst)</span>
                  <span>80+ mm/h (Extreme Squall)</span>
                </div>
              </div>

              {/* Slider 3: Barometric Surface Pressure */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Barometric Pressure:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300">{config.surfacePressureHpa} hPa</span>
                </div>
                <input
                  type="range"
                  min="980"
                  max="1025"
                  step="1"
                  value={config.surfacePressureHpa}
                  onChange={(e) => setConfig({ ...config, surfacePressureHpa: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>980 hPa (Deep Cyclone)</span>
                  <span>1013 hPa (Standard)</span>
                  <span>1025 hPa (High)</span>
                </div>
              </div>

              {/* Quick Rainfall Presets */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-2">
                  Standard Rainfall Intensity Presets:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setConfig({ ...config, rainfall24hMm: 35, rainIntensityMmHr: 12, surfacePressureHpa: 1010 })}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-cyan-400 block text-[11px]">Light Coastal Rain</span>
                    <span className="text-[10px] text-slate-500">35mm &bull; 1010 hPa</span>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, rainfall24hMm: 95, rainIntensityMmHr: 30, surfacePressureHpa: 1002 })}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-amber-400 block text-[11px]">Cyclone Gale</span>
                    <span className="text-[10px] text-slate-500">95mm &bull; 1002 hPa</span>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, rainfall24hMm: 185, rainIntensityMmHr: 52, surfacePressureHpa: 992 })}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-orange-400 block text-[11px]">Severe Nor'easter</span>
                    <span className="text-[10px] text-slate-500">185mm &bull; 992 hPa</span>
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, rainfall24hMm: 265, rainIntensityMmHr: 68, surfacePressureHpa: 986 })}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-rose-400 block text-[11px]">100-Yr Cloudburst</span>
                    <span className="text-[10px] text-slate-500">265mm &bull; 986 hPa</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Geotechnical Soil Moisture Mechanics Card */}
            <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-purple-400" />
                  <span>Soil Moisture & Pore Water Pressure</span>
                </h3>
                <span className="text-[10px] font-mono text-purple-400">Mohr-Coulomb</span>
              </div>

              {/* Slider: Soil Moisture Saturation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-purple-400" />
                    <span>Antecedent Soil Saturation Degree:</span>
                  </span>
                  <span className="font-mono font-bold text-purple-300">{config.soilMoisturePct}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="1"
                  value={config.soilMoisturePct}
                  onChange={(e) => setConfig({ ...config, soilMoisturePct: Number(e.target.value) })}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>20% (Dry)</span>
                  <span>65% (Field Cap)</span>
                  <span>90%+ (Liquefaction Hazard)</span>
                </div>
              </div>

              {/* Soil Archetype Selector */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-300 font-semibold block">Coastal Geological Substrate:</span>
                <select
                  value={config.soilType}
                  onChange={(e: any) => setConfig({ ...config, soilType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="coastal_cliff_marl">Coastal Cliff Marl & Fractured Clay (c'=18 kPa, φ=28°)</option>
                  <option value="coastal_sand_dune">Foredune Quartz Sand & Berm (c'=2.5 kPa, φ=33°)</option>
                  <option value="clayey_silt_alluvium">Estuarine Silt-Clay Alluvium (c'=14 kPa, φ=25°)</option>
                  <option value="permeable_gravel">Permeable Coarse Pebble & Shingle (c'=0 kPa, φ=36°)</option>
                </select>
              </div>

              {/* Geotechnical Outputs Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Volumetric Water θ</span>
                  <span className="font-bold text-purple-300 text-sm">{soilAnalysis.volumetricWaterContent} m³/m³</span>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Sentinel-1 Dielectric</span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Pore Pressure u</span>
                  <span className={`font-bold text-sm ${soilAnalysis.poreWaterPressureKPa > 15 ? "text-rose-400" : "text-cyan-300"}`}>
                    {soilAnalysis.poreWaterPressureKPa} kPa
                  </span>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">
                    {soilAnalysis.poreWaterPressureKPa < 0 ? "Negative Suction" : "Positive Hydrostatic"}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Factor of Safety (FS)</span>
                  <span className={`font-bold text-sm ${soilAnalysis.factorOfSafety < 1.0 ? "text-rose-400 animate-pulse" : soilAnalysis.factorOfSafety < 1.25 ? "text-amber-400" : "text-emerald-400"}`}>
                    FS = {soilAnalysis.factorOfSafety}
                  </span>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">
                    {soilAnalysis.factorOfSafety < 1.0 ? "FAILED (Detachment)" : soilAnalysis.factorOfSafety < 1.25 ? "Marginal" : "Stable Slope"}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Slide Volume Potential</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {soilAnalysis.estimatedDisplacedSlideVolumeM3 > 0 ? `${soilAnalysis.estimatedDisplacedSlideVolumeM3.toLocaleString()} m³` : "0 m³"}
                  </span>
                  <span className="text-[9.5px] text-slate-500 block mt-0.5">Tsunami Displacement</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Hydrodynamic Sea Level Prediction & Tsunami Evaluation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hydrodynamic Sea Level Rise Breakdown */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Predicted Compound Sea Level Rise (Rainfall + Surge + Barometer)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                  Total Surge: +{seaLevelResult.totalSeaLevelIncreaseM} m
                </span>
              </div>

              {/* Big Visual Gauge & Water Level Visualizer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Total Water Level (TWL)</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-cyan-300">
                      +{seaLevelResult.totalWaterLevelWithTideM}
                    </span>
                    <span className="text-xs text-slate-400">m MSL</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Includes astronomical tide (+{config.tideStageM}m)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Pluvial Runoff Backwater</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-blue-400">
                      +{seaLevelResult.pluvialRunoffIncreaseM}
                    </span>
                    <span className="text-xs text-slate-400">m</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Estuary watershed bottleneck
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Compound Inland Reach</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-amber-400">
                      {seaLevelResult.compoundInundationExtentM}
                    </span>
                    <span className="text-xs text-slate-400">meters</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Overwash past normal berm
                  </span>
                </div>

              </div>

              {/* Hydrodynamic Component Breakdown Bars */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-300 block">
                  Hydrodynamic Surge Component Distribution:
                </span>

                {/* 1. Pluvial Catchment Runoff */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                      <span>Pluvial Runoff Backwater (Q = {(config.rainfall24hMm * config.catchmentAreaKm2 * 0.15).toFixed(0)} m³/s):</span>
                    </span>
                    <span className="text-blue-300 font-bold">+{seaLevelResult.pluvialRunoffIncreaseM} m</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (seaLevelResult.pluvialRunoffIncreaseM / 2.5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Inverted Barometer */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span>Inverted Barometer Effect (ΔP = {(1013.25 - config.surfacePressureHpa).toFixed(1)} hPa):</span>
                    </span>
                    <span className="text-amber-300 font-bold">+{seaLevelResult.barometricIncreaseM} m</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (seaLevelResult.barometricIncreaseM / 2.5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Convective Wind Surge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                      <span>Onshore Convective Wind Drag Setup:</span>
                    </span>
                    <span className="text-cyan-300 font-bold">+{seaLevelResult.windSetupM} m</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (seaLevelResult.windSetupM / 2.5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 4. Wave Breaking Radiation Stress Setup */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                      <span>Wave Breaking Radiation Stress Setup:</span>
                    </span>
                    <span className="text-purple-300 font-bold">+{seaLevelResult.waveSetupM} m</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (seaLevelResult.waveSetupM / 2.5) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Tsunami Generation Physics Card */}
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Soil-Induced Tsunami & Meteotsunami Physics Evaluation
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  Impulse & Gravity Wave Coupling
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Mechanism 1: Landslide Tsunami */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <Layers className="w-4 h-4 text-rose-400" />
                      <span>Landslide Impulse Tsunami</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      soilAnalysis.factorOfSafety < 1.0 ? "bg-rose-950 text-rose-300 font-bold" : "bg-slate-900 text-slate-400"
                    }`}>
                      {soilAnalysis.factorOfSafety < 1.0 ? "ACTIVE TRIGGER" : "DORMANT"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    When soil moisture exceeds 86%, pore water pressure eliminates effective shear resistance (FS={soilAnalysis.factorOfSafety}). Sudden coastal bluff failure into shallow waters displaces a predicted <b>{soilAnalysis.estimatedDisplacedSlideVolumeM3.toLocaleString()} m³</b> of sediment, generating an impulse wave.
                  </p>
                  <div className="text-slate-300 font-mono text-[11px] pt-1">
                    Wave Amplitude: <b className="text-rose-400">{tsunamiEvaluation.potentialTsunamiWaveHeightM} m</b> &bull; Failure Probability: <b className="text-rose-400">{soilAnalysis.cliffLandslideProbabilityPct}%</b>
                  </div>
                </div>

                {/* Mechanism 2: Meteotsunami */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Wind className="w-4 h-4 text-amber-400" />
                      <span>Meteotsunami Squall Resonance</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      config.surfacePressureHpa < 1002 ? "bg-amber-950 text-amber-300 font-bold" : "bg-slate-900 text-slate-400"
                    }`}>
                      {config.surfacePressureHpa < 1002 ? "EXCITED" : "STABLE"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Rapid atmospheric pressure drop ({config.surfacePressureHpa} hPa) coupled with intense convective downbursts ({config.rainIntensityMmHr} mm/hr) excites Proudman resonance on the shallow coastal shelf, creating non-seismic tsunami waves without an earthquake.
                  </p>
                  <div className="text-slate-300 font-mono text-[11px] pt-1">
                    Resonance Phase Speed: <b className="text-cyan-300">U ≈ √(g·H) = 14.8 m/s</b> &bull; Seiche Period: <b className="text-cyan-300">18-24 min</b>
                  </div>
                </div>

              </div>

              {/* Recommended Civil Protection Actions */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Automated Disaster Action Guidance:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {tsunamiEvaluation.recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Historical Disaster Archive Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Empirical Historical Rainfall, Soil Moisture & Tsunami Archive</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calibrated correlation between antecedent soil saturation, recorded 24h rainfall, measured sea level surge, and observed impulse/meteotsunami waves across major Mediterranean storm epochs.
                </p>
              </div>

              <span className="font-mono text-xs text-purple-300 bg-purple-950 px-3 py-1 rounded-xl border border-purple-800/80 shrink-0">
                {HISTORICAL_RAINFALL_SOIL_EVENTS.length} Benchmark Storm Events
              </span>
            </div>

            {/* Historical Events Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Event & Epoch</th>
                    <th className="py-3 px-3 text-right">24h Rainfall</th>
                    <th className="py-3 px-3 text-right">Soil Moisture</th>
                    <th className="py-3 px-3 text-right">Pore Pressure</th>
                    <th className="py-3 px-3 text-right">Sea Level Rise</th>
                    <th className="py-3 px-3 text-right">Observed Wave</th>
                    <th className="py-3 px-3">Tsunami Type</th>
                    <th className="py-3 px-3">Alert Issued</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {HISTORICAL_RAINFALL_SOIL_EVENTS.map((event) => {
                    const isSelected = selectedHistoricalEvent?.id === event.id;
                    return (
                      <tr 
                        key={event.id}
                        onClick={() => setSelectedHistoricalEvent(event)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-purple-950/40 text-white" : "hover:bg-slate-800/50 text-slate-300"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{event.eventName}</span>
                          <span className="text-[10.5px] text-slate-500 font-mono">{event.date}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                          {event.cumulativeRainfall24hMm} mm
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-purple-300">
                          {event.antecedentSoilMoisturePct}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-300">
                          {event.poreWaterPressureKPa} kPa
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-400">
                          +{event.seaLevelIncreaseM} m
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                          +{event.observedTsunamiHeightM} m
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">
                          {event.tsunamiType}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase border ${getAlertBadgeClasses(event.alertIssued)}`}>
                            {event.alertIssued.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadHistoricalEvent(event);
                              setActiveTab("simulator");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[10.5px] font-semibold border border-cyan-800 transition-colors cursor-pointer"
                          >
                            Simulate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Event Details Inspector */}
            {selectedHistoricalEvent && (
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-purple-800/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">
                      {selectedHistoricalEvent.eventName} ({selectedHistoricalEvent.date})
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      handleLoadHistoricalEvent(selectedHistoricalEvent);
                      setActiveTab("simulator");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <span>Load into Live Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  &ldquo;{selectedHistoricalEvent.impactNotes}&rdquo;
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Peak Rain Intensity</span>
                    <span className="font-bold text-cyan-300">{selectedHistoricalEvent.peakRainRateMmHr} mm/hr</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Soil Saturation</span>
                    <span className="font-bold text-purple-300">{selectedHistoricalEvent.antecedentSoilMoisturePct}%</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Detached Slide Debris</span>
                    <span className="font-bold text-amber-300">{selectedHistoricalEvent.slopeFailureVolumeM3.toLocaleString()} m³</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Tsunami Impulse Wave</span>
                    <span className="font-bold text-rose-400">+{selectedHistoricalEvent.observedTsunamiHeightM} m</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Evacuation Protocols Tab */}
      {activeTab === "protocols" && (
        <div className="space-y-6">
          
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Civil Protection Tsunami Evacuation & Compound Surge Standard Operating Procedures</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 block text-sm">Phase 1: Waterline Evacuation</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Upon reaching <b>ADVISORY</b> or <b>WARNING</b> (soil saturation &gt;75% with rainfall &gt;60mm), immediate orders are dispatched to clear all beaches, piers, and low-lying coastal paths.
                </p>
                <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside">
                  <li>Clear all sunbathers and maritime personnel</li>
                  <li>Close harbour locks and boat ramps</li>
                  <li>Monitor sea level gauges for sudden drawdown</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300 block text-sm">Phase 2: Estuary & Seawall Defense</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When pluvial catchment runoff backwater exceeds +0.8m, deploy rapid geotextile tubes and close riverine flood barriers to prevent reverse estuary storm surges.
                </p>
                <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside">
                  <li>Deploy pre-positioned high-density sand barriers</li>
                  <li>Isolate municipal storm drainage flap gates</li>
                  <li>Engage backup diesel dewatering pumps</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-400 block text-sm">Phase 3: Critical Landslide Evacuation</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Under <b>CRITICAL TSUNAMI EVACUATION</b> (FS &lt;1.0, Soil moisture &gt;90%), enforce an immediate <b>250-meter inland exclusion corridor</b> and sound municipal acoustic sirens.
                </p>
                <ul className="text-slate-300 space-y-1 text-[11px] list-disc list-inside">
                  <li>Sound high-decibel acoustic siren tone</li>
                  <li>Broadcast OASIS CAP emergency cell alerts</li>
                  <li>Evacuate all residents to elevations &gt;15m MSL</li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
