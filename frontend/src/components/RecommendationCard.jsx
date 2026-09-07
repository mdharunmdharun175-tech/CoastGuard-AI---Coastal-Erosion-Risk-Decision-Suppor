import React from "react";
import { Shield, Clock, TrendingDown } from "lucide-react";

export const RecommendationCard = ({ plan = { recommended_actions: [] } }) => {
  return (
    <div className="w-full bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">
          Recommended Mitigation Actions
        </h3>
      </div>

      <div className="space-y-3">
        {plan.recommended_actions?.map((action, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-100 text-xs">{action.title}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {action.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{action.description}</p>
            <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400">-{action.expected_risk_reduction_pct}% Risk</span>
              <span>{action.time_horizon}</span>
              <span className="text-amber-400">Cost: {action.estimated_cost_tier}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
