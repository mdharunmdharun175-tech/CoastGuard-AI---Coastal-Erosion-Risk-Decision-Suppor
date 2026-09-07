import React, { useState, useEffect } from "react";
import { 
  HardDrive, 
  Save, 
  CheckCircle2, 
  Trash2, 
  RotateCcw, 
  Clock, 
  Sliders, 
  Layers, 
  X,
  ChevronDown
} from "lucide-react";
import { 
  loadPersistedState, 
  clearPersistedState, 
  savePersistedState, 
  onStorageSync,
  AppStatePersistence 
} from "../services/storageService";

interface StorageStatusBadgeProps {
  onResetSession?: () => void;
  onForceSave?: () => void;
  currentViewTitle?: string;
  activeTransetName?: string;
}

export const StorageStatusBadge: React.FC<StorageStatusBadgeProps> = ({
  onResetSession,
  onForceSave,
  currentViewTitle,
  activeTransetName
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [lastSavedFormatted, setLastSavedFormatted] = useState<string | null>(null);
  const [persistedState, setPersistedState] = useState<AppStatePersistence | null>(null);
  const [justSaved, setJustSaved] = useState<boolean>(false);

  useEffect(() => {
    // Initial read
    const state = loadPersistedState();
    if (state) {
      setPersistedState(state);
      setLastSavedFormatted(state.lastSavedFormatted);
    }

    // Subscribe to auto-save triggers
    const unsubscribe = onStorageSync((detail) => {
      if (detail.cleared) {
        setPersistedState(null);
        setLastSavedFormatted(null);
      } else {
        setLastSavedFormatted(detail.formatted);
        if (detail.state) {
          setPersistedState(detail.state);
        }
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2200);
      }
    });

    return unsubscribe;
  }, []);

  const handleClear = () => {
    if (window.confirm("Clear saved session state and reset all views and simulator sliders to factory defaults?")) {
      clearPersistedState();
      setPersistedState(null);
      setLastSavedFormatted(null);
      setIsOpen(false);
      onResetSession?.();
    }
  };

  const handleManualSave = () => {
    onForceSave?.();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <div className="relative">
      {/* Trigger Button in Navbar */}
      <button
        id="btn-local-storage-indicator"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
          justSaved
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950/40"
            : isOpen
            ? "bg-slate-800 text-cyan-300 border-cyan-500/40"
            : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60"
        }`}
        title="Auto-Save Status"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${justSaved ? "bg-emerald-400" : "bg-cyan-400"}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${justSaved ? "bg-emerald-500" : "bg-cyan-500"}`} />
        </span>
        <HardDrive className={`w-3.5 h-3.5 shrink-0 ${justSaved ? "text-emerald-400" : "text-cyan-400"}`} />
        <span className="text-[11px] font-semibold whitespace-nowrap">
          {justSaved ? "Auto-Saved" : "Auto-Saved"}
        </span>
        {lastSavedFormatted && (
          <span className="hidden xl:inline text-[10px] text-slate-400 opacity-80 whitespace-nowrap font-mono">
            {lastSavedFormatted}
          </span>
        )}
        <ChevronDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <HardDrive className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-100 text-xs">Local Storage Auto-Save</h4>
                <p className="text-[10px] text-slate-400">Crash & Refresh Resilience Service</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Explanation Banner */}
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-slate-300 leading-relaxed">
            CoastGuard AI periodically writes the application state to your browser’s secure local storage, ensuring your current view, active transect, and simulator slider changes survive accidental browser refreshes.
          </div>

          {/* Persisted State Overview */}
          <div className="space-y-1.5 font-mono text-[11px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Last Auto-Save:
              </span>
              <span className="text-emerald-400 font-bold">
                {lastSavedFormatted || "Never (pending initial change)"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" /> Active View:
              </span>
              <span className="text-cyan-300 font-bold capitalize">
                {currentViewTitle || persistedState?.currentView || "Dashboard"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Transect:</span>
              <span className="text-amber-300 font-bold truncate max-w-[140px]">
                {activeTransetName || persistedState?.activeTransectId || "TRX-01"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-400" /> Hydro Simulator:
              </span>
              <span className={persistedState?.physicalSimulatorParams ? "text-emerald-400" : "text-slate-500"}>
                {persistedState?.physicalSimulatorParams ? "Parameters Cached" : "Default"}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-400" /> 2D Beach Profile:
              </span>
              <span className={persistedState?.beachProfileSimulatorParams ? "text-emerald-400" : "text-slate-500"}>
                {persistedState?.beachProfileSimulatorParams ? "Parameters Cached" : "Default"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleManualSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors cursor-pointer text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Now</span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors cursor-pointer text-xs"
              title="Clear persisted local state"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono">
            Key: coastguard_ai_session_state_v1
          </div>
        </div>
      )}
    </div>
  );
};
