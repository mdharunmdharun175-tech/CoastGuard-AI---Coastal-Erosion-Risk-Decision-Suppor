import React, { useState, useEffect } from "react";
import { DisasterAlert } from "../types";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";
import { 
  AlertTriangle, 
  Radio, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Clock, 
  Flame, 
  Send, 
  X,
  BellRing
} from "lucide-react";

interface DisasterAlertBannerProps {
  alert: DisasterAlert | null;
  onOpenDisasterCenter: () => void;
  onBroadcastNow: () => void;
  onSoundEmergencyAlarm?: () => void;
}

export const DisasterAlertBanner: React.FC<DisasterAlertBannerProps> = ({
  alert,
  onOpenDisasterCenter,
  onBroadcastNow,
  onSoundEmergencyAlarm
}) => {
  const [isAlarmPlaying, setIsAlarmPlaying] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<string>("35h 42m");

  useEffect(() => {
    const unsub = emergencyAlarm.subscribe((playing) => {
      setIsAlarmPlaying(playing);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!alert) return;
    const interval = setInterval(() => {
      // Simulate dynamic countdown clock
      const totalSec = 35 * 3600 + 42 * 60 - Math.floor((Date.now() / 1000) % 3600);
      const hrs = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      setCountdown(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [alert]);

  if (!alert || isDismissed) return null;

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    emergencyAlarm.toggleAlarm(0.85);
  };

  return (
    <div className="relative bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 border-y border-rose-700/80 shadow-2xl text-rose-100 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Siren & Primary Headline */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
            <Radio className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow-sm animate-pulse">
                3-DAY DISASTER EARLY WARNING (T-72H)
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Peak Surge in: <strong className="font-mono text-white underline">{countdown}</strong>
              </span>
            </div>
            <p className="text-xs font-semibold text-rose-100 line-clamp-1">
              {alert.headline} &bull; Peak Energy: <span className="font-mono font-bold text-amber-300">{alert.peak_wave_energy} kW/m</span> (+{alert.estimated_shoreline_loss_meters}m beach loss predicted)
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          
          {/* Direct Sound Siren Button */}
          <button
            id="btn-alert-sound"
            onClick={handleSoundToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isAlarmPlaying 
                ? "bg-amber-400 text-slate-950 border-amber-300 animate-pulse"
                : "bg-rose-900/80 hover:bg-rose-800 border-rose-700/80 text-rose-200"
            }`}
            title={isAlarmPlaying ? "Silence Emergency Alarm Siren" : "Sound Emergency Siren Tone"}
          >
            {isAlarmPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>SIREN ON (STOP)</span>
              </>
            ) : (
              <>
                <BellRing className="w-4 h-4 text-rose-300" />
                <span>SOUND SIREN</span>
              </>
            )}
          </button>

          <button
            id="btn-broadcast-now-banner"
            onClick={(e) => {
              e.stopPropagation();
              if (onSoundEmergencyAlarm) {
                onSoundEmergencyAlarm();
              } else {
                onBroadcastNow();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg transition-transform active:scale-95 shrink-0"
            title="Broadcast emergency disaster alert to civil protection and public sirens"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ALERT EVERYONE</span>
          </button>

          <button
            id="btn-view-disaster-center"
            onClick={onOpenDisasterCenter}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-transform active:scale-95 shrink-0"
          >
            <span>Command Center</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            id="btn-dismiss-banner"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-rose-300/80 hover:text-white hover:bg-rose-900/40 text-xs transition-colors"
            title="Dismiss temporary banner"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
