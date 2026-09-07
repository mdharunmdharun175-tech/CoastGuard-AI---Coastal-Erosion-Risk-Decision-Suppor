import React from "react";
import { RiskLevel } from "../types";
import { AlertTriangle, ShieldCheck, ShieldAlert, AlertCircle } from "lucide-react";

interface RiskGaugeProps {
  probability: number; // 0.0 to 1.0
  susceptibilityIndex: number; // 0 to 100
  riskClass: RiskLevel;
  confidenceInterval?: [number, number];
  size?: "sm" | "md" | "lg";
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  probability,
  susceptibilityIndex,
  riskClass,
  confidenceInterval = [0.0, 1.0],
  size = "md"
}) => {
  // Gauge angles: 180 degrees arc (from 180deg to 0deg)
  const radius = size === "lg" ? 85 : size === "md" ? 65 : 45;
  const strokeWidth = size === "lg" ? 14 : size === "md" ? 10 : 8;
  const circumference = Math.PI * radius; // half circle arc
  const strokeDashoffset = circumference - probability * circumference;

  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case "Very High":
        return {
          stroke: "#f43f5e", // Rose-500
          text: "text-rose-400",
          bg: "bg-rose-950/50 border-rose-800/80 text-rose-300",
          icon: ShieldAlert,
          label: "Very High Susceptibility"
        };
      case "High":
        return {
          stroke: "#f97316", // Orange-500
          text: "text-orange-400",
          bg: "bg-orange-950/50 border-orange-800/80 text-orange-300",
          icon: AlertTriangle,
          label: "High Susceptibility"
        };
      case "Medium":
        return {
          stroke: "#eab308", // Amber-500
          text: "text-amber-400",
          bg: "bg-amber-950/50 border-amber-800/80 text-amber-300",
          icon: AlertCircle,
          label: "Moderate Susceptibility"
        };
      case "Low":
      default:
        return {
          stroke: "#10b981", // Emerald-500
          text: "text-emerald-400",
          bg: "bg-emerald-950/50 border-emerald-800/80 text-emerald-300",
          icon: ShieldCheck,
          label: "Low Susceptibility / Stable"
        };
    }
  };

  const theme = getRiskTheme(riskClass);
  const IconComponent = theme.icon;

  const svgWidth = radius * 2 + strokeWidth * 2 + 20;
  const svgHeight = radius + strokeWidth + 24;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-inner">
      <div className="relative flex items-center justify-center" style={{ width: svgWidth, height: svgHeight }}>
        <svg
          width={svgWidth}
          height={svgHeight}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth + 10} A ${radius} ${radius} 0 0 1 ${svgWidth - (strokeWidth + 10)} ${radius + strokeWidth + 10}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Arc */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth + 10} A ${radius} ${radius} 0 0 1 ${svgWidth - (strokeWidth + 10)} ${radius + strokeWidth + 10}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Youden-Index Cutoff Marker (0.48 / 48%) */}
          <line
            x1={svgWidth / 2 - 2}
            y1={10}
            x2={svgWidth / 2 - 2}
            y2={22}
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="2,2"
          />
        </svg>

        {/* Center Numerical Score */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
          <div className="flex items-baseline justify-center gap-0.5">
            <span className={`font-black font-mono tracking-tight ${size === "lg" ? "text-4xl" : "text-3xl"} ${theme.text}`}>
              {susceptibilityIndex.toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm font-semibold">%</span>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">
            Erosion Risk
          </p>
        </div>
      </div>

      {/* Risk Class Badge */}
      <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.bg} shadow-sm`}>
        <IconComponent className="w-3.5 h-3.5" />
        <span>{theme.label}</span>
      </div>

      {/* Confidence Interval & Youden Index Info */}
      <div className="mt-3 w-full flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
        <span>CI (95%): [{(confidenceInterval[0] * 100).toFixed(0)}% - {(confidenceInterval[1] * 100).toFixed(0)}%]</span>
        <span className="text-slate-400" title="Youden-index threshold from calibration dataset">Youden: 48%</span>
      </div>
    </div>
  );
};
