import React, { useState, useEffect } from "react";
import { CoastalTransect, HistoricalSurveyPoint, HistoricalStormEvent } from "../types";
import { fetchHistoricalData } from "../api/client";
import { 
  History, 
  Calendar, 
  TrendingDown, 
  Layers, 
  Download, 
  Waves, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  FileText,
  MapPin,
  Clock,
  Compass,
  ArrowRight
} from "lucide-react";

interface HistoricalDataPanelProps {
  transects: CoastalTransect[];
  selectedTransect: CoastalTransect | null;
  onSelectTransect: (t: CoastalTransect) => void;
  onOpenZoneDetail?: (t: CoastalTransect) => void;
}

export const HistoricalDataPanel: React.FC<HistoricalDataPanelProps> = ({
  transects,
  selectedTransect,
  onSelectTransect,
  onOpenZoneDetail
}) => {
  const currentTransect = selectedTransect || transects[0];
  const [activeTab, setActiveTab] = useState<"surveys" | "storms" | "regional">("surveys");
  const [historyData, setHistoryData] = useState<{
    historical_surveys: HistoricalSurveyPoint[];
    historical_storms: HistoricalStormEvent[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentTransect) return;

    // Use embedded historical data or fetch from backend API
    if (currentTransect.historical_surveys && currentTransect.historical_storms) {
      setHistoryData({
        historical_surveys: currentTransect.historical_surveys,
        historical_storms: currentTransect.historical_storms
      });
    } else {
      setLoading(true);
      fetchHistoricalData(currentTransect.id)
        .then((res) => {
          if (res) {
            setHistoryData({
              historical_surveys: res.historical_surveys || [],
              historical_storms: res.historical_storms || []
            });
          }
        })
        .catch((err) => console.error("Error fetching historical data:", err))
        .finally(() => setLoading(false));
    }
  }, [currentTransect?.id]);

  const surveys = historyData?.historical_surveys || currentTransect?.historical_surveys || [];
  const storms = historyData?.historical_storms || currentTransect?.historical_storms || [];

  // Cumulative retreat max
  const maxRetreat = Math.max(...surveys.map((s) => Math.abs(s.shoreline_displacement_m)), 20);

  const handleExportHistoryCSV = () => {
    if (!currentTransect) return;
    const headers = ["Year", "Date", "Shoreline Displacement (m)", "Annual Retreat Rate (m/yr)", "Beach Width (m)", "Dune Crest Elevation (m)", "Volumetric Loss (m3/m)", "Survey Method", "Notes"];
    const rows = surveys.map((s) => [
      s.year,
      `"${s.date}"`,
      s.shoreline_displacement_m,
      s.annual_retreat_rate_m_yr,
      s.beach_width_m,
      s.dune_crest_elevation_m,
      s.volumetric_loss_m3_m,
      `"${s.survey_method}"`,
      `"${s.notes || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentTransect.id}_historical_surveys_2018_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-0">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Historical Shoreline Evolution & Past Storm Archive (2018 – 2026)
              </h3>
              <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80">
                8-YEAR SURVEY TIMELINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Station: <strong className="text-slate-200">{currentTransect.name}</strong> ({currentTransect.id}) &bull; Baseline Trend: <strong className="text-cyan-400">{currentTransect.historical_trend}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-tabs */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              id="tab-history-surveys"
              onClick={() => setActiveTab("surveys")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === "surveys"
                  ? "bg-purple-600 text-white font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Shoreline Surveys (2018-2026)
            </button>
            <button
              id="tab-history-storms"
              onClick={() => setActiveTab("storms")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === "storms"
                  ? "bg-purple-600 text-white font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Past Storm Events ({storms.length})
            </button>
          </div>

          <button
            id="btn-export-history-csv"
            onClick={handleExportHistoryCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
            title="Download Historical Survey Dataset"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-5">
        
        {activeTab === "surveys" ? (
          /* Multi-Year Survey Timeline View */
          <div className="space-y-5">
            
            {/* Visual Shoreline Retreat Timeline Chart */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Cumulative Cross-Shore Displacement (m from 2018 Baseline)</span>
                <span className="font-mono text-cyan-400">
                  Total Displacement (2018-2026): {surveys[surveys.length - 1]?.shoreline_displacement_m ?? -14.4} meters
                </span>
              </div>

              {/* Graphical Timeline Bar / Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
                {surveys.map((s, idx) => {
                  const isErosion = s.shoreline_displacement_m < 0;
                  const isZero = s.shoreline_displacement_m === 0;

                  return (
                    <div
                      key={s.year}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {s.year}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{s.date}</span>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold font-mono ${isZero ? "text-slate-300" : isErosion ? "text-rose-400" : "text-emerald-400"}`}>
                            {s.shoreline_displacement_m > 0 ? `+${s.shoreline_displacement_m}` : s.shoreline_displacement_m}m
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Rate: <strong className="text-slate-200">{s.annual_retreat_rate_m_yr} m/yr</strong>
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Berm Width:</span>
                          <strong className="text-slate-300">{s.beach_width_m}m</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Vol. Loss:</span>
                          <strong className="text-rose-300">{s.volumetric_loss_m3_m} m³/m</strong>
                        </div>
                      </div>

                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-950 text-[9px] font-mono text-purple-300 border border-purple-900/50 text-center truncate">
                        {s.survey_method}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Historical Surveys Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3.5">Survey Year</th>
                    <th className="py-2.5 px-3.5">Date</th>
                    <th className="py-2.5 px-3.5">Displacement</th>
                    <th className="py-2.5 px-3.5">Annual Rate</th>
                    <th className="py-2.5 px-3.5">Beach Width</th>
                    <th className="py-2.5 px-3.5">Dune Elevation</th>
                    <th className="py-2.5 px-3.5">Sand Loss</th>
                    <th className="py-2.5 px-3.5">Survey Method</th>
                    <th className="py-2.5 px-3.5">Field Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 font-mono">
                  {surveys.map((s) => (
                    <tr key={s.year} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-white font-sans">{s.year}</td>
                      <td className="py-2.5 px-3.5 text-slate-400 font-sans">{s.date}</td>
                      <td className={`py-2.5 px-3.5 font-bold ${s.shoreline_displacement_m < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {s.shoreline_displacement_m > 0 ? `+${s.shoreline_displacement_m}` : s.shoreline_displacement_m} m
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-300">{s.annual_retreat_rate_m_yr} m/yr</td>
                      <td className="py-2.5 px-3.5 text-slate-300">{s.beach_width_m} m</td>
                      <td className="py-2.5 px-3.5 text-slate-300">{s.dune_crest_elevation_m} m</td>
                      <td className="py-2.5 px-3.5 text-rose-300">{s.volumetric_loss_m3_m} m³/m</td>
                      <td className="py-2.5 px-3.5 text-purple-300 font-sans">{s.survey_method}</td>
                      <td className="py-2.5 px-3.5 text-slate-400 font-sans text-[11px] max-w-xs truncate" title={s.notes}>
                        {s.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* Historical Past Extreme Storm Archive View */
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storms.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{st.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {st.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{st.season}</p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
                      Peak Surge: +{st.peak_surge_m}m
                    </span>
                  </div>

                  {/* Storm Physics Specs */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono py-1 bg-slate-900/60 rounded-lg border border-slate-800/80">
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-sans">Wave Hs</span>
                      <strong className="text-cyan-400">{st.peak_hs_m}m</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-sans">Energy Flux</span>
                      <strong className="text-amber-400">{st.peak_wave_energy_kw_m} kW/m</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-sans">Max Wind</span>
                      <strong className="text-emerald-400">{st.max_wind_speed_kmh} km/h</strong>
                    </div>
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-sans">Scarp Loss</span>
                      <strong className="text-rose-400">{st.scarp_retreat_recorded_m}m</strong>
                    </div>
                  </div>

                  {/* Impact Summary & Emergency Action */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="text-slate-400">
                      <strong className="text-slate-200">Impact Diagnosis:</strong> {st.impact_summary}
                    </p>
                    <p className="text-emerald-400 text-[11px]">
                      <strong className="text-emerald-300">Response Deployed:</strong> {st.emergency_action_taken}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
