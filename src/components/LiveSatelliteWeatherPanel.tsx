import React, { useState, useEffect } from "react";
import { CoastalTransect, LiveMarineWeather, SatelliteTelemetryIndicators } from "../types";
import { fetchLiveMarineWeather, fetchRecentSatelliteIndicators } from "../api/liveData";
import { 
  Waves, 
  Wind, 
  Compass, 
  Satellite, 
  RefreshCw, 
  Activity, 
  Gauge, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Radio,
  Eye,
  Leaf
} from "lucide-react";

interface LiveSatelliteWeatherPanelProps {
  transect: CoastalTransect;
  onSyncLiveValues?: (syncedValues: { storm_energy: number }) => void;
}

export const LiveSatelliteWeatherPanel: React.FC<LiveSatelliteWeatherPanelProps> = ({
  transect,
  onSyncLiveValues
}) => {
  const [weather, setWeather] = useState<LiveMarineWeather | null>(null);
  const [satellite, setSatellite] = useState<SatelliteTelemetryIndicators | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(false);

  const loadLiveData = async () => {
    setLoading(true);
    try {
      const rawLat = transect?.coordinates?.[0];
      const rawLng = transect?.coordinates?.[1];
      const lat = typeof rawLat === "number" && !isNaN(rawLat) && isFinite(rawLat) ? rawLat : 42.1855;
      const lng = typeof rawLng === "number" && !isNaN(rawLng) && isFinite(rawLng) ? rawLng : 14.6865;
      const wData = await fetchLiveMarineWeather(lat, lng);
      const sData = await fetchRecentSatelliteIndicators(transect.id, lat, lng);
      setWeather(wData);
      setSatellite(sData);
    } catch (e) {
      console.error("Error loading live weather/satellite:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveData();
    const interval = setInterval(loadLiveData, 45000); // 45s refresh
    return () => clearInterval(interval);
  }, [transect.id]);

  const handleSyncToModel = () => {
    if (!weather || !onSyncLiveValues) return;
    setIsSyncing(true);
    setTimeout(() => {
      onSyncLiveValues({
        storm_energy: weather.calculated_energy_flux
      });
      setIsSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 600);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/40 p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-xs sm:text-sm">
                Live Satellite & Ocean Marine Telemetry
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time Copernicus Sentinel-2/1 Radar + Open-Meteo ECMWF Global Marine API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-live-data"
            onClick={loadLiveData}
            disabled={loading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Live Ingestion"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          {onSyncLiveValues && (
            <button
              id="btn-sync-live-to-model"
              onClick={handleSyncToModel}
              disabled={isSyncing || loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                synced
                  ? "bg-emerald-600 text-white"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{synced ? "Synced with XGBoost!" : "Sync Live Data to Model"}</span>
            </button>
          )}
        </div>
      </div>

      {loading && !weather ? (
        <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Ingesting live ECMWF marine wave vectors & Sentinel orbit passes...</span>
        </div>
      ) : weather && satellite ? (
        <div className="space-y-3 text-xs">
          
          {/* 4 Marine Wave Telemetry Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Tile 1: Live Significant Wave Height */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Wave Height (Hs)</span>
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-base font-bold font-mono text-cyan-300">
                {weather.wave_height_m} m
              </p>
              <span className="text-[10px] text-slate-500 block">Swell: {weather.swell_wave_height_m.toFixed(1)}m</span>
            </div>

            {/* Tile 2: Wave Period & Direction */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Peak Period (Tp)</span>
                <Compass className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className="text-base font-bold font-mono text-blue-300">
                {weather.wave_period_s} s
              </p>
              <span className="text-[10px] text-slate-500 block">Direction: {weather.wave_direction_deg}°</span>
            </div>

            {/* Tile 3: Live Wave Energy Flux (Computed) */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Wave Energy Flux</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-base font-bold font-mono text-amber-300">
                {weather.calculated_energy_flux} kW/m
              </p>
              <span className="text-[10px] text-slate-500 block">P = 0.49 &bull; Hs² &bull; Tp</span>
            </div>

            {/* Tile 4: Wind Speed & Surface Pressure */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Wind & Pressure</span>
                <Wind className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className="text-base font-bold font-mono text-purple-300">
                {weather.wind_speed_kmh} km/h
              </p>
              <span className="text-[10px] text-slate-500 block">{weather.sea_level_pressure_hpa} hPa</span>
            </div>

          </div>

          {/* Satellite Telemetry Strip */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Satellite className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">{satellite.satellite}</span>
                  <span className="text-slate-500 ml-2">({satellite.resolution_gsd})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-slate-400">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  NDVI: <strong className="text-emerald-300">{satellite.ndvi?.toFixed(2) ?? "0.22"}</strong> ({satellite.ndvi_status ?? "Dune Veg"})
                </span>
                <span>Shoreline: <strong className={satellite.detected_shoreline_shift_m < -2 ? "text-rose-400" : "text-cyan-300"}>{satellite.detected_shoreline_shift_m > 0 ? `+${satellite.detected_shoreline_shift_m}` : satellite.detected_shoreline_shift_m}m</strong></span>
                <span>NDWI: <strong className="text-blue-300">{satellite.coastal_ndwi_index}</strong></span>
                <span>SAR: <strong className="text-amber-300">{satellite.sar_coherence_index}</strong></span>
              </div>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};
