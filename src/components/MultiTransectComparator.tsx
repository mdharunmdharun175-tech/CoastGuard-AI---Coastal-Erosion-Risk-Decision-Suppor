import React, { useState } from "react";
import { CoastalTransect } from "../types";
import {
  GitCompare,
  Layers,
  Activity,
  Shield,
  Zap,
  TrendingDown,
  ArrowRight,
  Download,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface MultiTransectComparatorProps {
  transects: CoastalTransect[];
  selectedTransect: CoastalTransect | null;
  onSelectTransect: (t: CoastalTransect) => void;
}

export const MultiTransectComparator: React.FC<MultiTransectComparatorProps> = ({
  transects,
  selectedTransect,
  onSelectTransect
}) => {
  // Allow picking 2 or 3 transect IDs to compare
  const [selectedIds, setSelectedIds] = useState<string[]>([
    selectedTransect?.id || transects[0]?.id || "TRX-101",
    transects[3]?.id || "TRX-104",
    transects[7]?.id || "TRX-108"
  ]);

  const activeTransects = transects.filter((t) => selectedIds.includes(t.id));

  const toggleTransect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const handleExportComparison = () => {
    const rows = [
      ["Transect ID", "Name", "Region", "Susceptibility %", "Risk Level", "Slope %", "Storm Energy (kW/m)", "Depth of Closure (m)", "Geomorphology", "Primary Threat", "Top Mitigation Action"],
      ...activeTransects.map((t) => [
        t.id,
        t.name,
        t.region,
        t.susceptibility_index,
        t.risk_class,
        t.slope,
        t.storm_energy,
        t.depth_of_closure,
        t.geomorphology,
        t.mitigation.primary_threat,
        t.mitigation.recommended_actions[0]?.title || "N/A"
      ])
    ];

    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coastal_transect_comparison_matrix.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider">
                  Regional Coastal Vulnerability Matrix
                </span>
                <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded-full">
                  Comparative SHAP & Hydrodynamics
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Multi-Transect Risk & Mitigation Benchmark
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Directly cross-reference multiple coastal sectors to evaluate hydrodynamic forcing, dune scarp stability, SHAP feature attributions, and optimal mitigation ROI.
          </p>
        </div>

        <button
          onClick={handleExportComparison}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Matrix (CSV)</span>
        </button>
      </div>

      {/* Sector Quick Selector Pills */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-xl space-y-2">
        <span className="text-xs font-bold text-slate-300 block">
          Select Transects to Compare (Select up to 4 sectors):
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {transects.map((t) => {
            const isSelected = selectedIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTransect(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.id} &bull; {t.name.split(" ")[0]} ({t.susceptibility_index}%)
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeTransects.map((t) => {
          const isHigh = t.risk_class === "Very High" || t.risk_class === "High";
          return (
            <div
              key={t.id}
              className={`bg-slate-900 rounded-3xl border p-6 shadow-xl space-y-5 transition-all ${
                selectedTransect?.id === t.id
                  ? "border-cyan-500/70 ring-2 ring-cyan-500/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                      {t.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.risk_class === "Very High" ? "bg-rose-950 text-rose-300 border border-rose-800" :
                      t.risk_class === "High" ? "bg-orange-950 text-orange-300 border border-orange-800" :
                      t.risk_class === "Medium" ? "bg-amber-950 text-amber-300 border border-amber-800" :
                      "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}>
                      {t.risk_class} Risk
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {t.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 block">{t.region}</span>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-cyan-300">
                    {t.susceptibility_index}%
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">XGBoost Prob</span>
                </div>
              </div>

              {/* Hydrodynamic & Morphologic Metrics */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Beach Slope:</span>
                  <span className="text-slate-200 font-bold">{t.slope}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Storm Energy Flux (P):</span>
                  <span className="text-amber-300 font-bold">{t.storm_energy} kW/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Depth of Closure (h_c):</span>
                  <span className="text-cyan-300 font-bold">{t.depth_of_closure} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Substrate Class:</span>
                  <span className="text-slate-300 font-bold capitalize">{t.geomorphology}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Longshore Drift:</span>
                  <span className="text-slate-300 font-bold capitalize">{t.longshore_direction}</span>
                </div>
              </div>

              {/* Primary Threat & Decision Rationale */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary Risk Threat:</span>
                </span>
                <p className="text-slate-400 leading-relaxed text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {t.mitigation.primary_threat}
                </p>
              </div>

              {/* Recommended Mitigation Action */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Optimal Engineering Action:</span>
                </span>
                {t.mitigation.recommended_actions[0] ? (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-300 text-[11px]">
                        {t.mitigation.recommended_actions[0].title}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 font-bold">
                        {t.mitigation.recommended_actions[0].estimated_cost_tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {t.mitigation.recommended_actions[0].description}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-[10px]">Routine monitoring protocol.</p>
                )}
              </div>

              {/* Quick Select Button */}
              <button
                onClick={() => onSelectTransect(t)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inspect in Active Map & SHAP View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
