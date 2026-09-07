import React, { useState, useEffect } from "react";
import { CoastalTransect, LiveMarineWeather, HourlyWeatherPredictionPoint, SatelliteTelemetryIndicators } from "../types";
import { fetchLiveMarineWeather, fetchRecentSatelliteIndicators } from "../api/liveData";
import { fetchLiveWeatherPredictions } from "../api/client";
import { 
  Waves, 
  Wind, 
  Compass, 
  Gauge, 
  RefreshCw, 
  Zap, 
  Radio, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Thermometer,
  CloudRain,
  Satellite,
  Leaf,
  Layers,
  Activity,
  Calendar,
  Sparkles,
  Info
} from "lucide-react";

interface DashboardLiveWeatherPredictionProps {
  selectedTransect: CoastalTransect | null;
  onOpenZoneDetail?: (transect: CoastalTransect) => void;
  onOpenDisasterCenter?: () => void;
}

export const DashboardLiveWeatherPrediction: React.FC<DashboardLiveWeatherPredictionProps> = ({
  selectedTransect,
  onOpenZoneDetail,
  onOpenDisasterCenter
}) => {
  const [weather, setWeather] = useState<LiveMarineWeather | null>(null);
  const [satellite, setSatellite] = useState<SatelliteTelemetryIndicators | null>(null);
  const [predictions, setPredictions] = useState<HourlyWeatherPredictionPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"telemetry" | "satellite" | "forecast72h">("telemetry");
  const [selectedPredictionHour, setSelectedPredictionHour] = useState<number>(0);

  const rawLat = selectedTransect?.coordinates?.[0];
  const rawLng = selectedTransect?.coordinates?.[1];
  const lat = typeof rawLat === "number" && !isNaN(rawLat) && isFinite(rawLat) ? rawLat : 42.1855;
  const lng = typeof rawLng === "number" && !isNaN(rawLng) && isFinite(rawLng) ? rawLng : 14.6865;

  const loadData = async () => {
    setLoading(true);
    try {
      const [wRes, sRes, predRes] = await Promise.allSettled([
        fetchLiveMarineWeather(lat, lng),
        fetchRecentSatelliteIndicators(selectedTransect?.id || "TRX-101", lat, lng),
        fetchLiveWeatherPredictions(lat, lng, selectedTransect?.id || "TRX-101")
      ]);

      if (wRes.status === "fulfilled" && wRes.value) {
        setWeather(wRes.value);
      }
      if (sRes.status === "fulfilled" && sRes.value) {
        setSatellite(sRes.value);
      }
      if (predRes.status === "fulfilled" && predRes.value?.hydrodynamic_predictions_72h) {
        setPredictions(predRes.value.hydrodynamic_predictions_72h);
      }
    } catch (e) {
      console.warn("Notice updating real-time weather & satellite telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 45000); // Live poll every 45s
    return () => clearInterval(interval);
  }, [selectedTransect?.id, lat, lng]);

  const activePred = predictions.find((p) => p.hour_offset === selectedPredictionHour) || predictions[0];

  // Maximum values for graph scaling
  const maxWaveEnergy = Math.max(...predictions.map((p) => p.wave_energy_flux_kw_m), 400);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Live Marine Telemetry & Satellite Indices
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-700/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {selectedTransect ? (
                <span>Station: <strong className="text-slate-200">{selectedTransect.name}</strong> ({selectedTransect.region}) &bull; Coordinates: {lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
              ) : (
                <span>Central Adriatic Buoy Array &bull; Copernicus Sentinel-2/1 + ECMWF WAM</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-view toggle */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              id="tab-weather-telemetry"
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === "telemetry"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Live Weather
            </button>
            <button
              id="tab-weather-satellite"
              onClick={() => setActiveTab("satellite")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === "satellite"
                  ? "bg-purple-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite Indices</span>
            </button>
            <button
              id="tab-weather-72h-forecast"
              onClick={() => setActiveTab("forecast72h")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                activeTab === "forecast72h"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              72h Risk Prediction
            </button>
          </div>

          <button
            id="btn-refresh-dashboard-weather"
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Live Sensor & Satellite Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        
        {activeTab === "telemetry" ? (
          /* Live Telemetry View */
          <div className="space-y-4">
            
            {/* Live Weather Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Metric 1: Wave Height */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Significant Wave (Hs)</span>
                  <Waves className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-cyan-400">
                    {weather?.wave_height_m?.toFixed(2) ?? "2.85"}
                  </span>
                  <span className="text-xs text-slate-400">meters</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Wind wave: {weather?.wind_wave_height_m?.toFixed(1) ?? "1.4"}m &bull; Swell: {weather?.swell_wave_height_m?.toFixed(1) ?? "2.1"}m
                </p>
              </div>

              {/* Metric 2: Wave Period & Direction */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Wave Period (Tp)</span>
                  <Compass className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-blue-400">
                    {weather?.wave_period_s?.toFixed(1) ?? "8.6"}
                  </span>
                  <span className="text-xs text-slate-400">sec</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Bearing: {weather?.wave_direction_deg ?? 72}° (ENE)
                </p>
              </div>

              {/* Metric 3: Wave Energy Flux */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Wave Energy Flux</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {weather?.calculated_energy_flux?.toFixed(1) ?? "310.5"}
                  </span>
                  <span className="text-xs text-slate-400">kW/m</span>
                </div>
                <p className="text-[10px] text-amber-500/90 mt-1">
                  {((weather?.calculated_energy_flux ?? 310) > 250) ? "Critical Erosive Attack" : "Moderate Energy"}
                </p>
              </div>

              {/* Metric 4: Wind Speed & Gusts */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Sustained Wind</span>
                  <Wind className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {weather?.wind_speed_kmh?.toFixed(0) ?? "44"}
                  </span>
                  <span className="text-xs text-slate-400">km/h</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Gusts to {weather?.wind_gusts_kmh?.toFixed(0) ?? "68"} km/h ({weather?.wind_direction_deg ?? 60}°)
                </p>
              </div>

              {/* Metric 5: Surface Pressure */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Barometer</span>
                  <Gauge className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-purple-400">
                    {weather?.sea_level_pressure_hpa?.toFixed(0) ?? "1004"}
                  </span>
                  <span className="text-xs text-slate-400">hPa</span>
                </div>
                <p className="text-[10px] text-purple-400/80 mt-1">
                  {(weather?.sea_level_pressure_hpa ?? 1004) < 1008 ? "Low Pressure System" : "Stable Pressure"}
                </p>
              </div>

              {/* Metric 6: Sea Surface Temp */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Sea Surface Temp</span>
                  <Thermometer className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-bold font-mono text-rose-400">
                    {weather?.sea_surface_temp_c?.toFixed(1) ?? "18.2"}
                  </span>
                  <span className="text-xs text-slate-400">°C</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Thermal anomaly: +1.2°C
                </p>
              </div>

            </div>

            {/* Quick Live Hydrodynamic Alert & Risk Diagnosis */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                    Live Dynamic Wave Attack vs Baseline Model
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live incident wave energy flux is currently measured at <strong className="text-amber-400">{weather?.calculated_energy_flux?.toFixed(1) ?? 310.5} kW/m</strong> (compared to calibrated baseline {selectedTransect?.storm_energy ?? 180} kW/m).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenDisasterCenter && (
                  <button
                    id="btn-weather-disaster-center"
                    onClick={onOpenDisasterCenter}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>3-Day Disaster Center</span>
                  </button>
                )}
                {selectedTransect && onOpenZoneDetail && (
                  <button
                    id="btn-weather-zone-detail"
                    onClick={() => onOpenZoneDetail(selectedTransect)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    <span>Inspect Zone Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ) : activeTab === "satellite" ? (
          /* Recent Satellite Telemetry Indicators View */
          <div className="space-y-4">
            
            {/* Mission & Satellite Overpass Status Header */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-purple-300 shrink-0">
                  <Satellite className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Copernicus Multi-Spectral & SAR Telemetry Indicators
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/80 text-purple-300 border border-purple-700">
                      {satellite?.satellite ?? "Sentinel-2 MSI"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sensor: {satellite?.sensor_mode ?? "13-Band Multi-Spectral Level-2A BOA"} &bull; GSD: {satellite?.resolution_gsd ?? "10m GSD"} &bull; Cloud Cover: {satellite?.cloud_cover_pct ?? 8.2}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Last Overpass: <strong>{satellite?.recent_overpasses?.[0]?.date ?? "Today (~2.3h ago)"}</strong></span>
              </div>
            </div>

            {/* 4 Primary Satellite Indicators Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Card 1: NDVI (Dune Vegetation Index) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Dune Vegetation (NDVI)</span>
                  <Leaf className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {satellite?.ndvi?.toFixed(2) ?? "0.22"}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    (satellite?.ndvi ?? 0.22) >= 0.5 
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800" 
                      : (satellite?.ndvi ?? 0.22) >= 0.35 
                      ? "bg-yellow-950 text-yellow-300 border border-yellow-800" 
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}>
                    {satellite?.ndvi_status ?? "Sparse Foredune"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, Math.min(100, ((satellite?.ndvi ?? 0.22) + 0.1) * 100))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 flex justify-between">
                    <span>Vegetation Canopy Cover</span>
                    <strong className="text-slate-200">{satellite?.coastal_vegetation_health_score ?? 22}%</strong>
                  </p>
                </div>
              </div>

              {/* Card 2: Detected Shoreline Shift */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Shoreline Shift Index</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold font-mono ${
                    (satellite?.detected_shoreline_shift_m ?? -3.4) < -2.0 ? "text-rose-400" : "text-cyan-400"
                  }`}>
                    {(satellite?.detected_shoreline_shift_m ?? -3.4) > 0 ? `+${satellite?.detected_shoreline_shift_m}` : satellite?.detected_shoreline_shift_m} m
                  </span>
                  <span className="text-[10px] text-slate-400">vs 2018 MSL</span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Waterline Position:</span>
                    <strong className="text-cyan-300">{satellite?.waterline_position_m ?? 12.6}m</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Dune Scarp Setback:</span>
                    <strong className="text-rose-300">{satellite?.dune_scarp_setback_m ?? -2.8}m</strong>
                  </div>
                </div>
              </div>

              {/* Card 3: Water & Moisture Indices (NDWI / MNDWI) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Water Indices (NDWI)</span>
                  <Layers className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-blue-400">
                    {satellite?.ndwi?.toFixed(2) ?? "0.68"}
                  </span>
                  <span className="text-[10px] text-blue-300 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
                    MNDWI: {satellite?.mndwi?.toFixed(2) ?? "0.74"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div className="flex justify-between">
                    <span>AWEI Index:</span>
                    <strong className="text-blue-300">{satellite?.awei?.toFixed(2) ?? "0.51"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Swash Saturation:</span>
                    <strong className="text-amber-300">{Math.round((satellite?.swash_saturation_index ?? 0.84) * 100)}%</strong>
                  </div>
                </div>
              </div>

              {/* Card 4: SAR Radar Coherence & Roughness */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-medium uppercase tracking-wider">Radar Coherence (SAR)</span>
                  <Radio className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {satellite?.sar_coherence_index?.toFixed(2) ?? "0.38"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {satellite?.surface_backscatter_db ?? -14.2} dB
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 truncate" title={satellite?.radar_roughness_status}>
                  {satellite?.radar_roughness_status ?? "Foredune Scarp / Breached Crest"}
                </p>
              </div>

            </div>

            {/* Recent Multi-Date Overpasses Time-Series Table */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Recent Sentinel & Landsat Overpasses Archive (Last 30 Days)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Spectral Bands: {satellite?.spectral_bands ?? "B02, B03, B04, B08, B11, B12"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2 font-semibold">Date / Overpass</th>
                      <th className="pb-2 font-semibold">Satellite Platform</th>
                      <th className="pb-2 font-semibold">NDVI (Dune Veg)</th>
                      <th className="pb-2 font-semibold">NDWI (Waterline)</th>
                      <th className="pb-2 font-semibold">Shoreline Offset</th>
                      <th className="pb-2 font-semibold">Cloud</th>
                      <th className="pb-2 font-semibold text-right">Data Quality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {satellite?.recent_overpasses?.map((op, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-2.5 text-slate-200 font-semibold">{op.date}</td>
                        <td className="py-2.5 text-purple-300">{op.satellite}</td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            op.ndvi >= 0.5 ? "text-emerald-400 bg-emerald-950/60" : op.ndvi >= 0.35 ? "text-yellow-400 bg-yellow-950/60" : "text-rose-400 bg-rose-950/60"
                          }`}>
                            {op.ndvi.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2.5 text-blue-400">{op.ndwi.toFixed(2)}</td>
                        <td className="py-2.5">
                          <span className={`font-bold ${op.shoreline_shift_m < -2 ? "text-rose-400" : "text-cyan-400"}`}>
                            {op.shoreline_shift_m > 0 ? `+${op.shoreline_shift_m}` : op.shoreline_shift_m} m
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-400">{op.cloud_pct}%</td>
                        <td className="py-2.5 text-right">
                          <span className="text-emerald-400 font-bold">{op.quality_score}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* 72-Hour Hydrodynamic Forecast & Predictive Trajectory */
          <div className="space-y-4">
            
            {/* Hour Timeline Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {predictions.map((p) => {
                const isSelected = p.hour_offset === selectedPredictionHour;
                return (
                  <button
                    key={p.hour_offset}
                    id={`btn-pred-hour-${p.hour_offset}`}
                    onClick={() => setSelectedPredictionHour(p.hour_offset)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-950/50"
                        : p.hazard_alert_level === "Critical Scarp Breach"
                        ? "bg-rose-950/60 border-rose-800/80 text-rose-300 hover:bg-rose-900/60"
                        : p.hazard_alert_level === "Severe Surge"
                        ? "bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/60"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{p.time_label}</span>
                    </div>
                    <div className="text-[10px] mt-1 font-mono">
                      {p.wave_energy_flux_kw_m} kW/m &bull; {p.predicted_erosion_risk_pct}% Risk
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Forecast Detail Card */}
            {activePred && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                
                {/* 1. Time & Hazard Phase */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Forecast Window</span>
                  <h4 className="text-base font-bold text-white">{activePred.time_label}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                    activePred.hazard_alert_level === "Critical Scarp Breach"
                      ? "bg-rose-950 text-rose-300 border-rose-800"
                      : activePred.hazard_alert_level === "Severe Surge"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}>
                    {activePred.hazard_alert_level}
                  </span>
                </div>

                {/* 2. Wave & Energy Predictions */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Predicted Marine Energy</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-cyan-400">{activePred.wave_height_hs_m}m</span>
                    <span className="text-xs text-slate-400">Hs ({activePred.wave_period_tp_s}s Tp)</span>
                  </div>
                  <p className="text-xs font-mono text-amber-400">
                    Energy Flux: <strong>{activePred.wave_energy_flux_kw_m} kW/m</strong>
                  </p>
                </div>

                {/* 3. Storm Surge & Winds */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Atmospheric & Surge</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-mono text-purple-400">+{activePred.storm_surge_m}m</span>
                    <span className="text-xs text-slate-400">Storm Surge</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Wind: {activePred.wind_speed_kmh} km/h &bull; {activePred.barometric_pressure_hpa} hPa
                  </p>
                </div>

                {/* 4. Predictive Erosion Susceptibility */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Dynamic Susceptibility</span>
                  <p className="text-2xl font-bold font-mono text-rose-400 mt-0.5">
                    {activePred.predicted_erosion_risk_pct}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    XGBoost Dynamic Storm Risk
                  </p>
                </div>

              </div>
            )}

            {/* 72-Hour Visual Forecast Trajectory Chart */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">72-Hour Incident Wave Energy & Risk Evolution</span>
                <span className="font-mono text-[11px] text-cyan-400">Peak Energy: {Math.max(...predictions.map(p => p.wave_energy_flux_kw_m))} kW/m</span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-28 flex items-end gap-2 pt-2">
                {predictions.map((p) => {
                  const heightPct = Math.round((p.wave_energy_flux_kw_m / maxWaveEnergy) * 100);
                  const isSelected = p.hour_offset === selectedPredictionHour;
                  const isHigh = p.wave_energy_flux_kw_m > 250;

                  return (
                    <div
                      key={p.hour_offset}
                      onClick={() => setSelectedPredictionHour(p.hour_offset)}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                    >
                      <div className="text-[9px] font-mono text-slate-400 group-hover:text-cyan-300">
                        {p.wave_energy_flux_kw_m}k
                      </div>
                      <div
                        style={{ height: `${Math.max(12, heightPct)}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isSelected
                            ? "bg-cyan-400 ring-2 ring-cyan-300 shadow-lg shadow-cyan-500/40"
                            : isHigh
                            ? "bg-rose-500 hover:bg-rose-400"
                            : "bg-cyan-600/70 hover:bg-cyan-500"
                        }`}
                      />
                      <span className={`text-[10px] font-mono ${isSelected ? "text-cyan-300 font-bold" : "text-slate-500"}`}>
                        +{p.hour_offset}h
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
