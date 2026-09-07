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

export const ShapChart = ({
  factors = [],
  baseValue = -0.42
}) => {
  const chartData = factors.map((f) => ({
    name: f.displayName ? f.displayName.split(" (")[0] : f.factor,
    fullName: f.displayName || f.factor,
    shap: f.shap_value,
    impactPct: f.percentage_contribution,
    observed: f.observed_value
  }));

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl p-4 border border-slate-800 flex flex-col">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
        TreeSHAP Feature Attributions
      </h4>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis type="number" stroke="#64748b" fontSize={10} />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={120} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="shap" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.shap >= 0 ? "#f43f5e" : "#10b981"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
