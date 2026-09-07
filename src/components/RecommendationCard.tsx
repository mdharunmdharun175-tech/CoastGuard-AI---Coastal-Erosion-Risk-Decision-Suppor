import React, { useState } from "react";
import { MitigationAction, MitigationPlan } from "../types";
import {
  Shield,
  Clock,
  DollarSign,
  TrendingDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Trees,
  Layers,
  Activity,
  Compass
} from "lucide-react";
import confetti from "canvas-confetti";

interface RecommendationCardProps {
  plan: MitigationPlan;
  onSimulateAction?: (action: MitigationAction) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  plan,
  onSimulateAction
}) => {
  const [appliedActionIds, setAppliedActionIds] = useState<number[]>([]);

  const handleApplyAction = (action: MitigationAction) => {
    if (appliedActionIds.includes(action.priority)) {
      setAppliedActionIds(appliedActionIds.filter((id) => id !== action.priority));
    } else {
      setAppliedActionIds([...appliedActionIds, action.priority]);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#06b6d4", "#10b981", "#3b82f6"]
      });
      if (onSimulateAction) {
        onSimulateAction(action);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes("nature") || category.toLowerCase().includes("eco")) {
      return <Trees className="w-4 h-4 text-emerald-400" />;
    }
    if (category.toLowerCase().includes("engineering") || category.toLowerCase().includes("reef")) {
      return <Layers className="w-4 h-4 text-cyan-400" />;
    }
    if (category.toLowerCase().includes("monitoring") || category.toLowerCase().includes("warning")) {
      return <Activity className="w-4 h-4 text-amber-400" />;
    }
    return <Compass className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="w-full bg-slate-900/80 rounded-2xl p-5 border border-slate-800 flex flex-col space-y-4">
      
      {/* Header & Rationale */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              Mitigation Decision Support Plan
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            Trigger: {plan.primary_threat}
          </span>
        </div>

        <p className="mt-2.5 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
          {plan.decision_rationale}
        </p>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Prioritized Recommended Interventions
        </h4>

        {plan.recommended_actions.map((action) => {
          const isApplied = appliedActionIds.includes(action.priority);

          return (
            <div
              key={action.priority}
              className={`p-4 rounded-xl border transition-all ${
                isApplied
                  ? "bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-950/30"
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700 mt-0.5">
                    {action.priority}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-xs sm:text-sm">
                        {action.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {getCategoryIcon(action.category)}
                        {action.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {action.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 flex-wrap font-mono">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>-{action.expected_risk_reduction_pct}% Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{action.time_horizon}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <span>Cost: {action.estimated_cost_tier}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulate Button */}
                <button
                  id={`btn-apply-action-${action.priority}`}
                  onClick={() => handleApplyAction(action)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isApplied
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 border border-slate-700"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simulated</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Test Impact</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
