import React from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";

export const RiskGauge = ({
  probability = 0.5,
  susceptibilityIndex = 50,
  riskClass = "Medium",
  confidenceInterval = [0.45, 0.55],
  size = "md"
}) => {
  const radius = size === "lg" ? 85 : size === "md" ? 65 : 45;
  const strokeWidth = size === "lg" ? 14 : size === "md" ? 10 : 8;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - probability * circumference;

  const getRiskTheme = (level) => {
    switch (level) {
      case "Very High":
        return { stroke: "#f43f5e", text: "text-rose-400", bg: "bg-rose-950/50 border-rose-800 text-rose-300", icon: ShieldAlert, label: "Very High Risk" };
      case "High":
        return { stroke: "#f97316", text: "text-orange-400", bg: "bg-orange-950/50 border-orange-800 text-orange-300", icon: AlertTriangle, label: "High Risk" };
      case "Medium":
        return { stroke: "#eab308", text: "text-amber-400", bg: "bg-amber-950/50 border-amber-800 text-amber-300", icon: AlertCircle, label: "Moderate Risk" };
      case "Low":
      default:
        return { stroke: "#10b981", text: "text-emerald-400", bg: "bg-emerald-950/50 border-emerald-800 text-emerald-300", icon: ShieldCheck, label: "Low Risk / Stable" };
    }
  };

  const theme = getRiskTheme(riskClass);
  const IconComponent = theme.icon;
  const svgWidth = radius * 2 + strokeWidth * 2 + 20;
  const svgHeight = radius + strokeWidth + 24;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-inner">
      <div className="relative flex items-center justify-center" style={{ width: svgWidth, height: svgHeight }}>
        <svg width={svgWidth} height={svgHeight} className="overflow-visible">
          <defs>
            <linearGradient id="feGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth + 10} A ${radius} ${radius} 0 0 1 ${svgWidth - (strokeWidth + 10)} ${radius + strokeWidth + 10}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth + 10} A ${radius} ${radius} 0 0 1 ${svgWidth - (strokeWidth + 10)} ${radius + strokeWidth + 10}`}
            fill="none"
            stroke="url(#feGaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
          <div className="flex items-baseline justify-center gap-0.5">
            <span className={`font-black font-mono tracking-tight ${size === "lg" ? "text-4xl" : "text-3xl"} ${theme.text}`}>
              {Number(susceptibilityIndex).toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Erosion Risk</p>
        </div>
      </div>

      <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.bg}`}>
        <IconComponent className="w-3.5 h-3.5" />
        <span>{theme.label}</span>
      </div>
    </div>
  );
};
