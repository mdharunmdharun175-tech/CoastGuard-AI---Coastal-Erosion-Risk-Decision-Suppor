import React, { useState, useEffect } from "react";
import { DisasterAlert, CoastalTransect } from "../types";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  Radio,
  Send,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Users,
  Building,
  Navigation,
  Printer,
  X,
  Play,
  RotateCcw,
  Sparkles,
  BellRing
} from "lucide-react";

interface DisasterCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: DisasterAlert | null;
  transects: CoastalTransect[];
}

export const DisasterCenterModal: React.FC<DisasterCenterModalProps> = ({
  isOpen,
  onClose,
  alert,
  transects
}) => {
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("severe-bora");
  const [checkedProtocols, setCheckedProtocols] = useState<Record<number, boolean>>({});
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = emergencyAlarm.subscribe((playing) => {
      setIsAlarmPlaying(playing);
    });
    return unsub;
  }, []);

  if (!isOpen || !alert) return null;

  const handleBroadcastToEveryone = () => {
    setBroadcasting(true);
    emergencyAlarm.startAlarm(0.85);

    setTimeout(() => {
      setBroadcasting(false);
      setBroadcastSent(true);

      // Trigger celebratory/warning confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ef4444", "#f59e0b", "#06b6d4"]
      });
    }, 1200);
  };

  const toggleProtocol = (idx: number) => {
    setCheckedProtocols((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-rose-800/80 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-b border-rose-800/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300 shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-600 text-white tracking-wider">
                  3-DAY DISASTER EARLY WARNING & BROADCAST CENTER
                </span>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  Horizon: T-72h to T-0
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                {alert.headline}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-disaster-center"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Quick Broadcast Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-amber-950/40 to-slate-900 border border-rose-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Public Emergency Broadcast Dispatch</span>
              </div>
              <p className="text-slate-300 text-xs">
                Transmit multi-channel early disaster warnings to all coastal residents, harbour masters, port authorities, and mobile cellular alerts.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                id="btn-trigger-alarm-audio"
                onClick={() => emergencyAlarm.toggleAlarm(0.85)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isAlarmPlaying 
                    ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse" 
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-rose-300"
                }`}
                title={isAlarmPlaying ? "Stop Emergency Siren Audio" : "Sound Emergency Siren Audio"}
              >
                {isAlarmPlaying ? <Volume2 className="w-4 h-4 text-slate-950 animate-bounce" /> : <BellRing className="w-4 h-4" />}
                <span>{isAlarmPlaying ? "SIREN ACTIVE" : "SOUND SIREN"}</span>
              </button>

              <button
                id="btn-broadcast-disaster-everyone"
                onClick={handleBroadcastToEveryone}
                disabled={broadcasting}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all ${
                  broadcastSent
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:brightness-110"
                }`}
              >
                {broadcasting ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin" />
                    <span>Broadcasting Alert...</span>
                  </>
                ) : broadcastSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Broadcast Sent to 14,820 Citizens</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Alert to Everyone</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3-Day Forecast Breakdown Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>3-Day Hazard Evolution Matrix (T-72h Timeline)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Model: ECMWF WAM + XGBoost</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alert.forecast_3day.map((f) => {
                const isDay2Peak = f.day_offset === 2;

                return (
                  <div
                    key={f.day_offset}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                      isDay2Peak
                        ? "bg-rose-950/70 border-rose-500/80 shadow-md ring-1 ring-rose-500/40"
                        : "bg-slate-950/60 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          isDay2Peak ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"
                        }`}>
                          DAY {f.day_offset} &bull; {f.target_date}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          f.evacuation_status === "Mandatory Exclusion" ? "text-rose-400" : "text-amber-400"
                        }`}>
                          {f.evacuation_status}
                        </span>
                      </div>

                      <p className="font-bold text-slate-100 text-xs mt-2">
                        {f.hour_label}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Wave Energy Flux:</span>
                        <span className="font-bold text-amber-300">{f.wave_energy_forecast_kw_m} kW/m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Peak Wave Height (Hs):</span>
                        <span className="font-bold text-cyan-300">{f.peak_wave_height_m} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Storm Surge:</span>
                        <span className="font-bold text-rose-300">+{f.storm_surge_meters} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Disaster Probability:</span>
                        <span className={`font-bold ${isDay2Peak ? "text-rose-400" : "text-amber-300"}`}>
                          {f.disaster_probability}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency Evacuation & Action Protocol Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>3-Day Civil Protection & Evacuation Checklist</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">
                {Object.values(checkedProtocols).filter(Boolean).length} / {alert.evacuation_protocol.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {alert.evacuation_protocol.map((step, idx) => {
                const isChecked = !!checkedProtocols[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleProtocol(idx)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? "bg-emerald-950/30 border-emerald-800/80 text-slate-300"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleProtocol(idx)}
                      className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span className={`text-xs leading-relaxed ${isChecked ? "line-through text-slate-400" : ""}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Broadcast Channels Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Public Sirens</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">18 Coastal Acoustic Units</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Cell Broadcast</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">CAP SMS Geofenced</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Harbour Master</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">VHF Channel 16 Active</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Civil Protection</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Operations Command On</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px]">
            Emergency Alert Protocol &copy; 2026 &bull; Automatic 3-Day Pre-Disaster Broadcasting
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Emergency Briefing</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
