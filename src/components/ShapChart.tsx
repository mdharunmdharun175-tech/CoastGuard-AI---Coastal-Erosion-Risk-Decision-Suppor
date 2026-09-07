import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell
} from "recharts";
import { FactorContribution } from "../types";
import { Info, HelpCircle } from "lucide-react";

interface ShapChartProps {
  factors: FactorContribution[];
  baseValue?: number;
  compact?: boolean;
}

export const ShapChart: React.FC<ShapChartProps> = ({
  factors,
  baseValue = -0.42,
  compact = false
}) => {
  const chartData = factors.map((f) => ({
    name: f.displayName.split(" (")[0],
    fullName: f.displayName,
    shap: f.shap_value,
    impactPct: f.percentage_contribution,
    direction: f.impact_direction,
    observed: f.observed_value
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isRiskIncreasing = data.shap > 0;
      return (
        <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700 shadow-xl text-xs max-w-xs backdrop-blur-md">
          <p className="font-bold text-slate-100 mb-1">{data.fullName}</p>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Observed Value:</span>
              <span className="text-cyan-300 font-semibold">{String(data.observed)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TreeSHAP (&phi;):</span>
              <span className={`font-bold ${isRiskIncreasing ? "text-rose-400" : "text-emerald-400"}`}>
                {data.shap > 0 ? "+" : ""}{data.shap.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Impact Share:</span>
              <span className="text-slate-200">{data.impactPct}%</span>
            </div>
          </div>
          <p className={`mt-2 text-[11px] pt-1.5 border-t border-slate-800 ${isRiskIncreasing ? "text-rose-300" : "text-emerald-300"}`}>
            {isRiskIncreasing
              ? "▲ Exacerbates coastal erosion susceptibility"
              : "▼ Promotes shoreline stability & resistance"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>TreeSHAP Feature Attributions</span>
            <span className="text-[10px] text-cyan-400 font-mono font-normal">(&phi; values)</span>
          </h4>
          <p className="text-[11px] text-slate-400">
            Marginal push towards erosion (Red) vs stability (Green)
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-slate-400">+Risk</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-400">-Risk</span>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ height: compact ? 220 : 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[-0.6, 0.8]}
              stroke="#64748b"
              fontSize={10}
              tickFormatter={(v) => (v > 0 ? `+${v}` : `${v}`)}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              width={compact ? 110 : 140}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="shap" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.shap >= 0 ? "#f43f5e" : "#10b981"}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretability Callout */}
      <div className="mt-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">SHAP Formula Context: </span>
          <span className="text-slate-400">
            Log-odds = Base ({(baseValue).toFixed(2)}) + &sum;&phi;<sub>i</sub>. Highest driving factor for this transect is{" "}
            <span className="font-semibold text-slate-200">{factors[0]?.displayName}</span> ({factors[0]?.percentage_contribution}% total influence).
          </span>
        </div>
      </div>
    </div>
  );
};
