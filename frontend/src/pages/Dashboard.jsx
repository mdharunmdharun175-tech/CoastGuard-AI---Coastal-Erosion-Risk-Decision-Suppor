import React, { useState } from "react";
import { RiskMap } from "../components/RiskMap";
import { Search, MapPin, ArrowRight } from "lucide-react";

export const Dashboard = ({
  transects = [],
  selectedTransect = null,
  onSelectTransect = () => {},
  onOpenZoneDetail = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = transects.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[500px]">
          <RiskMap
            transects={filtered}
            selectedTransect={selectedTransect}
            onSelectTransect={onSelectTransect}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coastal transects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200"
            />
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto">
            {filtered.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTransect(t)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedTransect?.id === t.id
                    ? "bg-slate-800 border-cyan-500"
                    : "bg-slate-900/70 border-slate-800 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {t.region}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {t.risk_class} ({(t.susceptibility_index || t.probability * 100).toFixed(1)}%)
                  </span>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenZoneDetail(t);
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
