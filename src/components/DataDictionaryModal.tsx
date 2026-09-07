import React from "react";
import { X, BookOpen, Layers, Wind, Waves, Compass, Shield } from "lucide-react";

interface DataDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataDictionaryModal: React.FC<DataDictionaryModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const predictors = [
    {
      name: "slope",
      title: "Beach & Cliff Slope (%)",
      unit: "Percentage (%)",
      range: "0.8% - 15.0%",
      baseline: "4.5%",
      icon: Layers,
      color: "text-blue-400",
      description: "Cross-shore gradient from the shoreline to the dune crest or cliff top. Steeper slopes promote plunging wave breakers, scour, and gravitational cliff instability."
    },
    {
      name: "storm_energy",
      title: "Storm Wave Energy Flux (kW/m)",
      unit: "Kilowatts per meter (kW/m)",
      range: "20 - 450 kW/m",
      baseline: "180 kW/m",
      icon: Waves,
      color: "text-cyan-400",
      description: "Mean and peak wave energy flux density during storm events. Primary hydrodynamic driver causing offshore sediment transport and berm depletion."
    },
    {
      name: "storm_count",
      title: "Storm Recurrence Frequency",
      unit: "Integer event count",
      range: "1 - 35 events / period",
      baseline: "12 events",
      icon: Wind,
      color: "text-purple-400",
      description: "Cumulative count of energetic wave storms exceeding the 95th percentile threshold during the calibration epoch, reducing post-storm beach recovery windows."
    },
    {
      name: "depth_of_closure",
      title: "Depth of Closure (m)",
      unit: "Meters (m)",
      range: "3.5m - 20.0m",
      baseline: "10.0m",
      icon: Shield,
      color: "text-emerald-400",
      description: "Seaward depth limit beyond which significant cross-shore littoral sediment movement ceases. Shallower closure depths compress the active sand budget, accelerating shoreline retreat."
    },
    {
      name: "geomorphology",
      title: "Substrate Composition & Geomorphology",
      unit: "Categorical",
      range: "dune, sandy, riverbank, gravel, defence structure",
      baseline: "sandy",
      icon: Compass,
      color: "text-amber-400",
      description: "Geological composition of the intertidal and subaerial zone. Dunes and unconsolidated sands are highly vulnerable; gravel and engineered defence structures provide natural or structural resilience."
    },
    {
      name: "longshore_direction",
      title: "Longshore Sediment Transport Drift",
      unit: "Categorical",
      range: "divergent, transitional, convergent",
      baseline: "transitional",
      icon: Compass,
      color: "text-rose-400",
      description: "Littoral drift sediment budget gradient. Divergent drift pulls sand away causing severe chronic deficit; convergent drift causes sediment surplus (accretion)."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Coastal Erosion Data Dictionary
              </h2>
              <p className="text-xs text-slate-400">
                Definitions, physical mechanisms, and units from Azzara et al. (2026)
              </p>
            </div>
          </div>

          <button
            id="btn-close-dictionary-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of features */}
        <div className="p-6 space-y-4">
          {predictors.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className="font-bold text-slate-100 text-sm">{p.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Baseline: <strong className="text-slate-200">{p.baseline}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Unit: <strong className="text-slate-300">{p.unit}</strong></span>
                  <span>Typical Range: <strong className="text-slate-300">{p.range}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            id="btn-close-dictionary-footer"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
