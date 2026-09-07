import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, BellRing, Radio, ArrowRight } from "lucide-react";
import { emergencyAlarm } from "../utils/emergencyAlarmAudio";

interface EmergencyAlarmFloatingBarProps {
  onOpenModal: () => void;
}

export const EmergencyAlarmFloatingBar: React.FC<EmergencyAlarmFloatingBarProps> = ({
  onOpenModal
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = emergencyAlarm.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white px-4 py-2.5 rounded-2xl shadow-2xl shadow-rose-900/80 border-2 border-white/40 flex items-center gap-3 backdrop-blur-lg">
        <div className="w-8 h-8 rounded-full bg-white text-rose-700 flex items-center justify-center font-bold animate-pulse">
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black font-mono tracking-wider uppercase bg-black/40 px-1.5 py-0.5 rounded">
              SIREN SOUNDING
            </span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <p className="text-xs font-bold mt-0.5">
            Emergency Alarm Active Across Sectors
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => emergencyAlarm.stopAlarm()}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold rounded-xl border border-rose-400 flex items-center gap-1.5 shadow transition-all cursor-pointer"
            title="Silence emergency alarm audio"
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>SILENCE</span>
          </button>
          <button
            onClick={onOpenModal}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-rose-700 text-xs font-black rounded-xl shadow flex items-center gap-1 transition-all cursor-pointer"
            title="Open emergency broadcast control"
          >
            <span>VIEW</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
