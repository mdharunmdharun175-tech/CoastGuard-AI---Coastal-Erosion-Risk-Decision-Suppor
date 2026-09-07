import React, { useState, useEffect } from "react";
import { fetchZones } from "./api/client";
import { Dashboard } from "./pages/Dashboard";
import { ZoneDetail } from "./pages/ZoneDetail";
import { Waves } from "lucide-react";

export default function App() {
  const [transects, setTransects] = useState([]);
  const [selectedTransect, setSelectedTransect] = useState(null);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    fetchZones().then((res) => {
      setTransects(res.zones || []);
      if (res.zones?.length) setSelectedTransect(res.zones[0]);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CoastGuard AI</h1>
            <p className="text-xs text-slate-400">Azzara et al. (2026) Extension &bull; XGBoost + TreeSHAP</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {view === "dashboard" ? (
          <Dashboard
            transects={transects}
            selectedTransect={selectedTransect}
            onSelectTransect={setSelectedTransect}
            onOpenZoneDetail={(t) => {
              setSelectedTransect(t);
              setView("detail");
            }}
          />
        ) : (
          <ZoneDetail
            transect={selectedTransect}
            onBack={() => setView("dashboard")}
          />
        )}
      </main>
    </div>
  );
}
