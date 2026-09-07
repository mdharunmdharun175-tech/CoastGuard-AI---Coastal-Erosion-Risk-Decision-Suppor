import React, { useState, useEffect } from "react";
import { 
  Waves, 
  Layers, 
  BarChart3, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  Database, 
  FolderOpen,
  BellRing,
  Volume2,
  VolumeX,
  Cpu,
  CloudRain
} from "lucide-react";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";
import { StorageStatusBadge } from "./StorageStatusBadge";

interface NavbarProps {
  currentView: "dashboard" | "zone-detail" | "simulator" | "beach-profile" | "drone-mission" | "comparator";
  onSelectView: (view: "dashboard" | "zone-detail" | "simulator" | "beach-profile" | "drone-mission" | "comparator") => void;
  onOpenGeminiAdvisor: () => void;
  onOpenDictionary: () => void;
  onOpenDisasterCenter: () => void;
  onOpenCapStudio: () => void;
  onOpenEmergencyAlarm: () => void;
  onOpenArchitectureDocs: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  hasActiveAlert?: boolean;
  activeTransectName?: string;
  onResetSession?: () => void;
  onForceSave?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenGeminiAdvisor,
  onOpenDictionary,
  onOpenDisasterCenter,
  onOpenCapStudio,
  onOpenEmergencyAlarm,
  onOpenArchitectureDocs,
  onRefreshData,
  isRefreshing,
  hasActiveAlert = true,
  activeTransectName,
  onResetSession,
  onForceSave
}) => {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = emergencyAlarm.subscribe((playing) => {
      setIsAlarmPlaying(playing);
    });
    return unsub;
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Research Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView("dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Waves className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                CoastGuard<span className="text-cyan-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 tracking-wide uppercase">
                XGBoost + TreeSHAP
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Extending Azzara et al. (2026, <span className="italic">Geomorphology</span>)
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 text-xs shrink-0">
          <button
            id="nav-tab-dashboard"
            onClick={() => onSelectView("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === "dashboard"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Risk Map</span>
          </button>

          <button
            id="nav-tab-beach-profile"
            onClick={() => onSelectView("beach-profile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === "beach-profile"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            <span>Beach Profile 2D</span>
          </button>

          <button
            id="nav-tab-drone-mission"
            onClick={() => onSelectView("drone-mission")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === "drone-mission"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Drone LiDAR</span>
          </button>

          <button
            id="nav-tab-comparator"
            onClick={() => onSelectView("comparator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === "comparator"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Compare Sectors</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => onSelectView("simulator")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === "simulator"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hydro What-If</span>
          </button>
        </nav>

        {/* Actions (Emergency Alarm, Gemini AI, 3-Day Alert, Auto-Save Status) */}
        <div className="flex items-center gap-2 shrink-0">

          {/* CRITICAL: "ALERT EVERYONE WITH ALARM SOUND" BUTTON */}
          <button
            id="btn-emergency-alarm-trigger"
            onClick={() => {
              if (!isAlarmPlaying) {
                emergencyAlarm.startAlarm(0.85);
              }
              onOpenEmergencyAlarm();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all shadow-lg cursor-pointer whitespace-nowrap shrink-0 ${
              isAlarmPlaying
                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-rose-500 animate-pulse"
                : "bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white ring-1 ring-rose-400/80 shadow-rose-950/50"
            }`}
            title="Alert Everyone and Sound High-Urgency Acoustic Emergency Alarm Siren"
          >
            {isAlarmPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-slate-950 animate-bounce" />
                <span className="tracking-wide uppercase">🚨 SOUNDING (STOP)</span>
              </>
            ) : (
              <>
                <BellRing className="w-4 h-4 text-white animate-pulse" />
                <span className="tracking-wide uppercase">ALERT EVERYONE</span>
              </>
            )}
          </button>
          
          {/* Gemini AI Advisor Button */}
          <button
            id="btn-open-gemini-advisor"
            onClick={onOpenGeminiAdvisor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-950/50 border border-cyan-400/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Open Gemini AI Coastal Intelligence Copilot & Assessment"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>AI Copilot</span>
          </button>

          {/* 3-Day Disaster Early Warning Alert Button */}
          <button
            id="btn-open-3day-alert"
            onClick={onOpenDisasterCenter}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-700/80 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            title="3-Day Early Disaster Warning & Broadcast Center (T-72h)"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>3-Day Alerts</span>
          </button>

          {/* Local Storage Session Auto-Save Status Badge */}
          <StorageStatusBadge
            currentViewTitle={currentView}
            activeTransetName={activeTransectName}
            onResetSession={onResetSession}
            onForceSave={onForceSave}
          />

          {onRefreshData && (
            <button
              id="btn-refresh-data"
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all disabled:opacity-50 cursor-pointer shrink-0"
              title="Refresh Models & Zones"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

