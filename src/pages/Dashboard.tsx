import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CoastalTransect, RiskLevel, DisasterAlert } from "../types";
import { RiskMap } from "../components/RiskMap";
import { DashboardLiveWeatherPrediction } from "../components/DashboardLiveWeatherPrediction";
import { HistoricalDataPanel } from "../components/HistoricalDataPanel";
import { downloadTransectCSV } from "../utils/exportUtils";
import { loadPersistedState, savePersistedState } from "../services/storageService";
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingDown, 
  Waves, 
  Download, 
  Check, 
  Flame, 
  Layers, 
  Sparkles, 
  Radio, 
  History,
  CloudRain,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
  Map as MapIcon,
  Columns,
  ExternalLink,
  Activity,
  Compass,
  SlidersHorizontal
} from "lucide-react";

interface DashboardProps {
  transects: CoastalTransect[];
  selectedTransect: CoastalTransect | null;
  onSelectTransect: (transect: CoastalTransect) => void;
  onOpenZoneDetail: (transect: CoastalTransect) => void;
  onOpenSimulator: () => void;
  onOpenDisasterCenter?: () => void;
  onOpenGeminiAdvisor?: () => void;
  activeAlert?: DisasterAlert | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transects,
  selectedTransect,
  onSelectTransect,
  onOpenZoneDetail,
  onOpenSimulator,
  onOpenDisasterCenter,
  onOpenGeminiAdvisor,
  activeAlert
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [dashboardViewMode, setDashboardViewMode] = useState<"map_fleet" | "historical" | "rainfall_tsunami">("map_fleet");
  const [slideMode, setSlideMode] = useState<"map" | "details" | "split">("map");
  
  // Persistent map layer toggles
  const [isHeatmapActive, setIsHeatmapActive] = useState<boolean>(() => {
    return loadPersistedState()?.mapPreferences?.isHeatmapActive ?? true;
  });
  const [isEvacuationActive, setIsEvacuationActive] = useState<boolean>(() => {
    return loadPersistedState()?.mapPreferences?.isEvacuationActive ?? true;
  });
  const [isSatelliteActive, setIsSatelliteActive] = useState<boolean>(() => {
    return loadPersistedState()?.mapPreferences?.isSatelliteActive ?? true;
  });
  const [exportFeedback, setExportFeedback] = useState<boolean>(false);

  // Auto-persist map layer preferences when toggled
  useEffect(() => {
    savePersistedState({
      mapPreferences: {
        isHeatmapActive,
        isEvacuationActive,
        isSatelliteActive
      }
    });
  }, [isHeatmapActive, isEvacuationActive, isSatelliteActive]);

  // Summary Metrics
  const totalZones = transects.length;
  const highRiskCount = transects.filter((t) => t.risk_class === "High" || t.risk_class === "Very High").length;
  const avgSusceptibility = transects.length
    ? Math.round((transects.reduce((acc, t) => acc + (t.susceptibility_index || t.probability * 100), 0) / transects.length) * 10) / 10
    : 0;

  // Filtered List
  const filteredTransects = transects.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "ALL" || t.risk_class === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskCount = (level: string) => {
    if (level === "ALL") return transects.length;
    return transects.filter((t) => t.risk_class === level).length;
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "Very High":
        return "bg-rose-950 text-rose-400 border-rose-800/80";
      case "High":
        return "bg-orange-950 text-orange-400 border-orange-800/80";
      case "Medium":
        return "bg-amber-950 text-amber-400 border-amber-800/80";
      case "Low":
      default:
        return "bg-emerald-950 text-emerald-400 border-emerald-800/80";
    }
  };

  const handleExportCSV = () => {
    const datasetToExport = filteredTransects.length > 0 ? filteredTransects : transects;
    downloadTransectCSV(datasetToExport);
    setExportFeedback(true);
    setTimeout(() => setExportFeedback(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Monitored Transects</p>
            <p className="text-xl font-bold font-mono text-white mt-0.5">{totalZones} Profiles</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Critical Risk Hotspots</p>
            <p className="text-xl font-bold font-mono text-rose-400 mt-0.5">{highRiskCount} Zones ({Math.round((highRiskCount/totalZones)*100)}%)</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Mean Regional Risk</p>
            <p className="text-xl font-bold font-mono text-amber-300 mt-0.5">{avgSusceptibility}%</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">XGBoost Val AUC</p>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">0.9381 <span className="text-xs font-normal text-slate-400">(+15.4%)</span></p>
          </div>
        </div>

      </div>

      {/* Real-Time Ocean Weather Telemetry & 72h Hydrodynamic Prediction Component */}
      <DashboardLiveWeatherPrediction
        selectedTransect={selectedTransect}
        onOpenZoneDetail={onOpenZoneDetail}
        onOpenDisasterCenter={onOpenDisasterCenter}
      />

      {/* High-Level Dashboard Section Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-2 bg-slate-900/80 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-switch-map-fleet"
            onClick={() => setDashboardViewMode("map_fleet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              dashboardViewMode === "map_fleet"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Spatial Map & Transects</span>
          </button>

          <button
            id="btn-switch-historical"
            onClick={() => setDashboardViewMode("historical")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              dashboardViewMode === "historical"
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <History className="w-4 h-4 text-purple-400" />
            <span>Historical Surveys & Storm Archive</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <AnimatePresence mode="wait">
            {selectedTransect && (
              <motion.div
                key={selectedTransect.id}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="text-xs text-slate-400 font-mono hidden xl:flex items-center gap-2"
              >
                <span>Selected:</span>
                <strong className="text-cyan-300 font-sans truncate max-w-[160px]">{selectedTransect.name}</strong>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggleable Heatmap Layer Quick Action */}
          <button
            id="btn-toggle-dashboard-heatmap"
            onClick={() => setIsHeatmapActive(!isHeatmapActive)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              isHeatmapActive
                ? "bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="Toggle coastal erosion susceptibility heatmap overlay"
          >
            <Flame className={`w-3.5 h-3.5 ${isHeatmapActive ? "text-rose-400 fill-rose-400 animate-pulse" : "text-slate-400"}`} />
            <span>Heatmap: <strong className={isHeatmapActive ? "text-rose-300" : "text-slate-400"}>{isHeatmapActive ? "ON" : "OFF"}</strong></span>
          </button>

          <button
            id="btn-download-csv-top"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Download CSV of current transect erosion data and susceptibility model statistics"
          >
            {exportFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* View Modes Container */}
      <AnimatePresence mode="wait">
        {dashboardViewMode === "historical" ? (
          <motion.div
            key="dashboard-view-historical"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <HistoricalDataPanel
              transects={transects}
              selectedTransect={selectedTransect}
              onSelectTransect={onSelectTransect}
              onOpenZoneDetail={onOpenZoneDetail}
            />
          </motion.div>
        ) : (
          /* Main Spatial GIS & Fleet Section with Dedicated Slide Switcher */
          <div className="space-y-4">
            
            {/* SEPARATE SLIDE NAVIGATION BAR */}
            <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-slate-900/90 rounded-2xl border border-cyan-900/40 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    id="btn-slide-map"
                    onClick={() => setSlideMode("map")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      slideMode === "map"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-950/50 font-black"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Slide 1: Dedicated Full Geospatial Risk Map"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map Slide</span>
                  </button>

                  <button
                    id="btn-slide-details"
                    onClick={() => setSlideMode("details")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      slideMode === "details"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-950/50 font-black"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Slide 2: Dedicated Transect Details & Station Profile Fleet"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Transect Details Slide</span>
                  </button>

                  <button
                    id="btn-slide-split"
                    onClick={() => setSlideMode("split")}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      slideMode === "split"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-950/50 font-black"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                    title="Split View: Concurrent Side-by-Side Map & Station Inspector"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Split View</span>
                  </button>
                </div>

                {/* Slide Status Label */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>
                    {slideMode === "map" && "Slide 1 of 2: Interactive Geospatial Map"}
                    {slideMode === "details" && "Slide 2 of 2: Station Profiles & Transect Analysis"}
                    {slideMode === "split" && "Dual Layout: Concurrent Map & Station Inspector"}
                  </span>
                </div>
              </div>

              {/* Quick Slide Transition Arrow Buttons */}
              <div className="flex items-center gap-2">
                {slideMode === "map" ? (
                  <button
                    id="btn-goto-details-slide"
                    onClick={() => setSlideMode("details")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <span>View Station Details Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : slideMode === "details" ? (
                  <button
                    id="btn-goto-map-slide"
                    onClick={() => setSlideMode("map")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Map Slide</span>
                  </button>
                ) : (
                  <button
                    id="btn-goto-fullmap"
                    onClick={() => setSlideMode("map")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Expand Map Slide</span>
                  </button>
                )}
              </div>
            </div>

            {/* SLIDE CONTENT AREA WITH SMOOTH HORIZONTAL TRANSITIONS */}
            <AnimatePresence mode="wait">
              
              {/* SLIDE 1: DEDICATED FULL GEOSPATIAL MAP */}
              {slideMode === "map" && (
                <motion.div
                  key="slide-view-map-fullscreen"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <div className="h-[calc(100vh-210px)] min-h-[580px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                    <RiskMap
                      transects={filteredTransects}
                      selectedTransect={selectedTransect}
                      onSelectTransect={onSelectTransect}
                      isHeatmapActive={isHeatmapActive}
                      onToggleHeatmap={setIsHeatmapActive}
                      isEvacuationActive={isEvacuationActive}
                      onToggleEvacuation={setIsEvacuationActive}
                      isSatelliteActive={isSatelliteActive}
                      onToggleSatellite={setIsSatelliteActive}
                      activeAlert={activeAlert}
                      onOpenDisasterCenter={onOpenDisasterCenter}
                    />
                  </div>

                  {/* Station Callout Banner & Action Strip */}
                  <AnimatePresence mode="wait">
                    {selectedTransect && (
                      <motion.div
                        key={`map-slide-callout-${selectedTransect.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3.5 h-3.5 rounded-full ${
                            selectedTransect.risk_class === "Very High" ? "bg-rose-500" :
                            selectedTransect.risk_class === "High" ? "bg-orange-500" :
                            selectedTransect.risk_class === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                          } animate-ping`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-sm sm:text-base">{selectedTransect.name}</span>
                              <span className="font-mono text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{selectedTransect.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getRiskBadge(selectedTransect.risk_class)}`}>
                                {selectedTransect.risk_class} ({(selectedTransect.susceptibility_index || selectedTransect.probability * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Region: <strong className="text-slate-200">{selectedTransect.region}</strong> &bull; Beach Slope: <strong className="text-slate-200">{selectedTransect.slope}%</strong> &bull; Wave Energy: <strong className="text-slate-200">{selectedTransect.storm_energy} kW/m</strong> &bull; Top Driver: <strong className="text-cyan-400">{selectedTransect.top_contributing_factors?.[0]?.displayName || 'High Wave Energy'}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id="btn-map-slide-deep-details"
                            onClick={() => setSlideMode("details")}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-bold text-xs border border-slate-700 shadow-md transition-all cursor-pointer whitespace-nowrap"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span>View Full Details Slide</span>
                          </button>

                          <button
                            id="btn-map-slide-deep-dive"
                            onClick={() => onOpenZoneDetail(selectedTransect)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                          >
                            <span>Deep-Dive & SHAP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* SLIDE 2: DEDICATED TRANSECT DETAILS & FLEET PROFILES */}
              {slideMode === "details" && (
                <motion.div
                  key="slide-view-details-fullscreen"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Selected Station Spotlight Banner */}
                  {selectedTransect && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/50 shadow-2xl relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-black text-lg text-white font-sans">{selectedTransect.name}</span>
                            <span className="font-mono text-xs text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-800/80">{selectedTransect.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRiskBadge(selectedTransect.risk_class)}`}>
                              {selectedTransect.risk_class} Risk &bull; {(selectedTransect.susceptibility_index || selectedTransect.probability * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{selectedTransect.region} ({selectedTransect.lat.toFixed(4)}°N, {selectedTransect.lng.toFixed(4)}°E)</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            id="btn-details-goto-map"
                            onClick={() => setSlideMode("map")}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm"
                          >
                            <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Locate on Map Slide</span>
                          </button>

                          <button
                            id="btn-details-deep-dive"
                            onClick={() => onOpenZoneDetail(selectedTransect)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                          >
                            <span>Open Deep Analysis & TreeSHAP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 6 High-Density Physical Telemetry Blocks */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-800/80 relative z-10">
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Beach Slope</span>
                          <span className="text-sm font-bold font-mono text-cyan-300 mt-0.5 block">{selectedTransect.slope}%</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Wave Energy</span>
                          <span className="text-sm font-bold font-mono text-amber-300 mt-0.5 block">{selectedTransect.storm_energy} kW/m</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Closure Depth</span>
                          <span className="text-sm font-bold font-mono text-blue-300 mt-0.5 block">{selectedTransect.closure_depth || 6.4} m</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Lithology</span>
                          <span className="text-xs font-semibold text-slate-200 mt-0.5 truncate block">{selectedTransect.geomorphology}</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Longshore Drift</span>
                          <span className="text-sm font-bold font-mono text-emerald-300 mt-0.5 block">{selectedTransect.longshore_drift_m3_yr || 42000} m³/yr</span>
                        </div>
                        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Top Driver</span>
                          <span className="text-xs font-bold text-rose-400 mt-0.5 truncate block">{selectedTransect.top_contributing_factors?.[0]?.displayName || 'Wave Energy'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search, Risk Filters & Action Controls */}
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-search-transects-details"
                          type="text"
                          placeholder="Search transect name, region, or station code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>

                      <button
                        id="btn-download-csv-details"
                        onClick={handleExportCSV}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm shrink-0"
                      >
                        {exportFeedback ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-medium">Exported!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Export CSV</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Risk Filter Buttons with Counts */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {["ALL", "Very High", "High", "Medium", "Low"].map((level) => {
                        const count = getRiskCount(level);
                        return (
                          <button
                            key={`filter-details-${level}`}
                            id={`filter-details-${level.toLowerCase().replace(" ", "-")}`}
                            onClick={() => setRiskFilter(level)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                              riskFilter === level
                                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40"
                                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                            }`}
                          >
                            <span>{level === "ALL" ? "All Profiles" : level}</span>
                            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                              riskFilter === level ? "bg-slate-950/20 text-slate-950" : "bg-slate-900 text-slate-300"
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Transect Fleet Cards Responsive Multi-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredTransects.length === 0 ? (
                      <div className="col-span-full p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                        No coastal transects match your search filter.
                      </div>
                    ) : (
                      filteredTransects.map((t) => {
                        const isSelected = selectedTransect?.id === t.id;
                        const riskScore = t.susceptibility_index || (t.probability * 100).toFixed(1);

                        return (
                          <motion.div
                            key={`card-details-grid-${t.id}`}
                            id={`card-details-grid-${t.id}`}
                            onClick={() => onSelectTransect(t)}
                            layout
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            whileHover={{ scale: 1.015, transition: { duration: 0.12 } }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                              isSelected
                                ? "bg-slate-800/95 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50"
                                : "bg-slate-900/80 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" />
                            )}

                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-100 text-sm">{t.name}</span>
                                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">{t.id}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                    <span>{t.region}</span>
                                  </p>
                                </div>

                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 ${getRiskBadge(t.risk_class)}`}>
                                  {t.risk_class} ({riskScore}%)
                                </span>
                              </div>

                              {/* Physical Telemetry Chips */}
                              <div className="grid grid-cols-3 gap-1.5 mt-3 text-[10px] font-mono">
                                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                                  <span className="text-slate-400 block text-[9px]">Slope</span>
                                  <span className="text-cyan-300 font-bold">{t.slope}%</span>
                                </div>
                                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                                  <span className="text-slate-400 block text-[9px]">Wave Pw</span>
                                  <span className="text-amber-300 font-bold">{t.storm_energy} kW/m</span>
                                </div>
                                <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-center">
                                  <span className="text-slate-400 block text-[9px]">Closure</span>
                                  <span className="text-blue-300 font-bold">{t.closure_depth || 6.4}m</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                              <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                                Driver: <strong className="text-cyan-300">{t.top_contributing_factors?.[0]?.factor || 'storm_energy'}</strong>
                              </span>

                              <button
                                id={`btn-details-analyze-${t.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenZoneDetail(t);
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer whitespace-nowrap shrink-0"
                              >
                                <span>Deep-Dive</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* SLIDE 3: SPLIT VIEW (MAP + TRANSECT LIST CONCURRENT) */}
              {slideMode === "split" && (
                <motion.div
                  key="slide-view-split-both"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Left: Map Container */}
                  <div className="lg:col-span-7 h-[calc(100vh-230px)] min-h-[540px] flex flex-col space-y-3">
                    <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-800 bg-slate-950">
                      <RiskMap
                        transects={filteredTransects}
                        selectedTransect={selectedTransect}
                        onSelectTransect={onSelectTransect}
                        isHeatmapActive={isHeatmapActive}
                        onToggleHeatmap={setIsHeatmapActive}
                        isEvacuationActive={isEvacuationActive}
                        onToggleEvacuation={setIsEvacuationActive}
                        isSatelliteActive={isSatelliteActive}
                        onToggleSatellite={setIsSatelliteActive}
                        activeAlert={activeAlert}
                        onOpenDisasterCenter={onOpenDisasterCenter}
                      />
                    </div>

                    {/* Quick Selected Transect Callout Bar */}
                    <AnimatePresence mode="wait">
                      {selectedTransect && (
                        <motion.div
                          key={`split-callout-transect-${selectedTransect.id}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.18 }}
                          className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-lg flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              selectedTransect.risk_class === "Very High" ? "bg-rose-500" :
                              selectedTransect.risk_class === "High" ? "bg-orange-500" :
                              selectedTransect.risk_class === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                            } animate-ping`} />
                            <div>
                              <span className="font-bold text-slate-100 text-xs sm:text-sm">{selectedTransect.name}</span>
                              <p className="text-xs text-slate-400">
                                Risk: <strong className="text-cyan-400">{selectedTransect.risk_class} ({(selectedTransect.susceptibility_index || selectedTransect.probability * 100).toFixed(1)}%)</strong>
                              </p>
                            </div>
                          </div>

                          <button
                            id="btn-split-deep-dive-selected"
                            onClick={() => onOpenZoneDetail(selectedTransect)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer whitespace-nowrap"
                          >
                            <span>Deep-Dive & SHAP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right: Search, Filters & Transect List */}
                  <div className="lg:col-span-5 flex flex-col space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-search-transects-split"
                          type="text"
                          placeholder="Search zone name, region, or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1 flex-wrap pt-1">
                        {["ALL", "Very High", "High", "Medium", "Low"].map((level) => (
                          <button
                            key={`filter-split-${level}`}
                            id={`filter-split-${level.toLowerCase().replace(" ", "-")}`}
                            onClick={() => setRiskFilter(level)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                              riskFilter === level
                                ? "bg-cyan-500 text-slate-950 shadow-sm font-bold"
                                : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                            }`}
                          >
                            {level === "ALL" ? "All" : level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {filteredTransects.length === 0 ? (
                        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                          No coastal transects match your search filter.
                        </div>
                      ) : (
                        filteredTransects.map((t) => {
                          const isSelected = selectedTransect?.id === t.id;
                          const riskScore = t.susceptibility_index || (t.probability * 100).toFixed(1);

                          return (
                            <motion.div
                              key={`split-card-${t.id}`}
                              id={`card-transect-${t.id}`}
                              onClick={() => onSelectTransect(t)}
                              layout
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              whileHover={{ scale: 1.012, transition: { duration: 0.12 } }}
                              whileTap={{ scale: 0.992 }}
                              className={`relative p-3.5 rounded-2xl border transition-colors cursor-pointer overflow-hidden ${
                                isSelected
                                  ? "bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40"
                                  : "bg-slate-900/70 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="active-transect-indicator-bar"
                                  className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                />
                              )}

                              <div className="flex items-start justify-between gap-2 pl-1">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-100 text-xs sm:text-sm">{t.name}</span>
                                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">{t.id}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                                    <span>{t.region}</span>
                                  </p>
                                </div>

                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0 ${getRiskBadge(t.risk_class)}`}>
                                  {t.risk_class} ({riskScore}%)
                                </span>
                              </div>

                              <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-slate-400 flex-wrap pl-1">
                                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                  Slope: <strong className="text-slate-200">{t.slope}%</strong>
                                </span>
                                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                  Wave: <strong className="text-slate-200">{t.storm_energy} kW/m</strong>
                                </span>
                                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                  {t.geomorphology}
                                </span>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs pl-1">
                                <span className="text-[11px] text-slate-400">
                                  Top SHAP: <strong className="text-cyan-300">{t.top_contributing_factors?.[0]?.factor || 'storm_energy'}</strong>
                                </span>

                                <button
                                  id={`btn-open-detail-${t.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenZoneDetail(t);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer whitespace-nowrap shrink-0"
                                >
                                  <span>Analyze</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
