import React from "react";
import { RiskGauge } from "../components/RiskGauge";
import { ShapChart } from "../components/ShapChart";
import { RecommendationCard } from "../components/RecommendationCard";
import { ArrowLeft, MapPin } from "lucide-react";

export const ZoneDetail = ({ transect, onBack }) => {
  if (!transect) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4 text-cyan-400" />
        <span>Back to Overview</span>
      </button>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
        <h2 className="text-xl font-bold text-white">{transect.name}</h2>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          {transect.region} &bull; Coordinates: [{transect.coordinates?.join(", ")}]
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RiskGauge
            probability={transect.probability}
            susceptibilityIndex={transect.susceptibility_index || transect.probability * 100}
            riskClass={transect.risk_class}
            confidenceInterval={transect.confidence_interval}
            size="lg"
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <ShapChart factors={transect.top_contributing_factors} baseValue={transect.base_value} />
          {transect.mitigation && <RecommendationCard plan={transect.mitigation} />}
        </div>
      </div>
    </div>
  );
};
