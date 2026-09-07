import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldAlert, 
  BellRing, 
  CheckCircle2, 
  Users, 
  Send, 
  X, 
  Flame, 
  Waves,
  MapPin
} from "lucide-react";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";
import { CoastalTransect, DisasterAlert } from "../types";

interface EmergencyAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAlert: DisasterAlert | null;
  transects: CoastalTransect[];
  onOpenCapStudio?: () => void;
}

export const EmergencyAlarmModal: React.FC<EmergencyAlarmModalProps> = ({
  isOpen,
  onClose,
  activeAlert,
  transects,
  onOpenCapStudio
}) => {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastTarget, setBroadcastTarget] = useState<"ALL_ZONES" | "HIGH_RISK_ONLY">("ALL_ZONES");

  // Sync state with audio alarm singleton
  useEffect(() => {
    const unsubscribe = emergencyAlarm.subscribe((playing) => {
      setIsAlarmPlaying(playing);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleToggleAlarm = () => {
    emergencyAlarm.toggleAlarm(volume);
  };

  const handleDispatchBroadcast = () => {
    setIsBroadcasting(true);
    // Ensure alarm is playing when alert is blasted
    if (!emergencyAlarm.getIsPlaying()) {
      emergencyAlarm.startAlarm(volume);
    }
    setTimeout(() => {
      setIsBroadcasting(false);
      setDispatched(true);
    }, 900);
  };

  const highRiskCount = transects.filter(t => t.risk_class === "High" || t.risk_class === "Very High").length;
  const targetCount = broadcastTarget === "ALL_ZONES" ? transects.length : highRiskCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-950 border-2 border-rose-600/90 rounded-2xl shadow-2xl shadow-rose-950/80 overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Emergency Red Flashing Bar */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <BellRing className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black text-rose-300 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                  CRITICAL DEFENSE ACTION
                </span>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                ALERT EVERYONE & SOUND EMERGENCY ALARM
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors"
            title="Close Alert Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Audio Siren Control Panel */}
          <div className={`p-4 rounded-xl border-2 transition-all ${
            isAlarmPlaying 
              ? "bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-950/50 animate-pulse" 
              : "bg-slate-900/90 border-slate-800"
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isAlarmPlaying 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50" 
                    : "bg-slate-800 text-slate-400"
                }`}>
                  {isAlarmPlaying ? (
                    <Volume2 className="w-7 h-7 animate-pulse" />
                  ) : (
                    <VolumeX className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm uppercase tracking-wide">
                      {isAlarmPlaying ? "🚨 Acoustic Alarm Siren Active" : "Audio Alarm Standby"}
                    </h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isAlarmPlaying ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {isAlarmPlaying ? "SOUNDING (WEB AUDIO SYNTH)" : "MUTED"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synthesizes maritime dual-tone emergency sweep (650 Hz - 1050 Hz warble)
                  </p>
                </div>
              </div>

              {/* Siren Toggle Button */}
              <button
                onClick={handleToggleAlarm}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isAlarmPlaying
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                }`}
              >
                {isAlarmPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>STOP / SILENCE ALARM</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>START ALARM SOUND</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Control Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Siren Output Gain:
              </span>
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (isAlarmPlaying) {
                      emergencyAlarm.stopAlarm();
                      setTimeout(() => emergencyAlarm.startAlarm(newVol), 100);
                    }
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="w-10 text-right text-rose-300 font-bold">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Active Emergency Context */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                  CURRENT 72-HOUR HAZARD SUMMARY
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-1 flex items-center gap-2">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  {activeAlert ? activeAlert.headline : "Severe Storm Surge & Coastal Dune Breaching Hazard"}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  {activeAlert ? activeAlert.instruction : "Immediate relocation of beachfront operations, deployment of temporary wave baffles, and harbor vessel securing advised."}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">SEVERITY LEVEL</span>
                <span className="text-xs font-black text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-800 inline-block mt-0.5">
                  CRITICAL / IMMINENT
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center font-mono text-xs">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">ESTIMATED SURGE</span>
                <strong className="text-cyan-300">+{activeAlert?.event_details?.storm_surge_m ?? "1.85"} m</strong>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">WAVE HEIGHT (Hs)</span>
                <strong className="text-rose-400">{activeAlert?.event_details?.wave_height_m ?? "4.60"} m</strong>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">PEAK IMPACT TIME</span>
                <strong className="text-amber-300">T + 28 Hours</strong>
              </div>
            </div>
          </div>

          {/* Mass Broadcast Channels & Target Scope */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                Select Notification Target Scope:
              </span>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => setBroadcastTarget("ALL_ZONES")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    broadcastTarget === "ALL_ZONES"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All Transects ({transects.length})
                </button>
                <button
                  onClick={() => setBroadcastTarget("HIGH_RISK_ONLY")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    broadcastTarget === "HIGH_RISK_ONLY"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  High/Critical Only ({highRiskCount})
                </button>
              </div>
            </div>

            {/* Recipients Channel List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Public Cell Broadcast</span>
                </div>
                <p className="text-[11px] text-slate-400">OASIS CAP v1.2 SMS blast</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Harbor VHF Radio</span>
                </div>
                <p className="text-[11px] text-slate-400">Channel 16 automated relay</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Municipal Defenses</span>
                </div>
                <p className="text-[11px] text-slate-400">Civil defense sirens sync</p>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Drone Fleet</span>
                </div>
                <p className="text-[11px] text-slate-400">Autonomous LiDAR scout</p>
              </div>
            </div>
          </div>

          {/* Dispatched Confirmation Feedback */}
          {dispatched && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">EMERGENCY BROADCAST SUCCESSFULLY SENT TO EVERYONE</span>
                  <span className="text-emerald-400/90 text-[11px]">
                    Alert dispatched to {targetCount} coastal sectors, 14,280 municipal subscribers, and 8 harbor beacons.
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-2 py-1 rounded border border-emerald-700">
                DISPATCHED T-00:00
              </span>
            </div>
          )}

          {/* Action Triggers */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {onOpenCapStudio && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCapStudio();
                }}
                className="w-full sm:w-auto text-xs font-bold text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 underline underline-offset-4"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Open Advanced CAP XML Studio
              </button>
            )}

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Dismiss Window
              </button>

              <button
                onClick={handleDispatchBroadcast}
                disabled={isBroadcasting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 via-red-600 to-rose-600 hover:from-rose-500 hover:to-red-500 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isBroadcasting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>BROADCASTING TO ALL CHANNELS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>BROADCAST ALARM TO ALL NOW</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
