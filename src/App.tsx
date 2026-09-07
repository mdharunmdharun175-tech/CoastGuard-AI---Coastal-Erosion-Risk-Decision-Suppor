import React, { useState, useEffect } from "react";
import { CoastalTransect, DisasterAlert } from "./types";
import { fetchZones } from "./api/client";
import { evaluate3DayDisasterAlerts } from "./api/liveData";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { ZoneDetail } from "./pages/ZoneDetail";
import { ParameterSimulator } from "./components/ParameterSimulator";
import { BeachProfileSimulator } from "./components/BeachProfileSimulator";
import { DroneMissionPlanner } from "./components/DroneMissionPlanner";
import { MultiTransectComparator } from "./components/MultiTransectComparator";
import { CapBroadcastStudioModal } from "./components/CapBroadcastStudioModal";
import { DataDictionaryModal } from "./components/DataDictionaryModal";
import { DisasterAlertBanner } from "./components/DisasterAlertBanner";
import { DisasterCenterModal } from "./components/DisasterCenterModal";
import { GeminiAiAdvisorModal } from "./components/GeminiAiAdvisorModal";
import { EmergencyAlarmModal } from "./components/EmergencyAlarmModal";
import { EmergencyAlarmFloatingBar } from "./components/EmergencyAlarmFloatingBar";
import { SystemArchitectureModal } from "./components/SystemArchitectureModal";
import { 
  loadPersistedState, 
  savePersistedState, 
  startPeriodicAutoSave, 
  clearPersistedState, 
  PhysicalSimulatorParams, 
  BeachProfileSimulatorParams, 
  ValidAppView 
} from "./services/storageService";
import { Loader2, AlertCircle } from "lucide-react";

export default function App() {
  // Load cached session state synchronously once at initialization
  const [initialCachedState] = useState(() => loadPersistedState());

  const [transects, setTransects] = useState<CoastalTransect[]>([]);
  const [selectedTransect, setSelectedTransect] = useState<CoastalTransect | null>(null);
  const [currentView, setCurrentView] = useState<ValidAppView>(
    initialCachedState?.currentView || "dashboard"
  );

  // Simulator parameters persisted across accidental refreshes
  const [physicalSimulatorParams, setPhysicalSimulatorParams] = useState<PhysicalSimulatorParams | undefined>(
    initialCachedState?.physicalSimulatorParams
  );
  const [beachProfileSimulatorParams, setBeachProfileSimulatorParams] = useState<BeachProfileSimulatorParams | undefined>(
    initialCachedState?.beachProfileSimulatorParams
  );
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Disaster Alert State
  const [activeAlert, setActiveAlert] = useState<DisasterAlert | null>(null);

  // Modals
  const [isGeminiAdvisorOpen, setIsGeminiAdvisorOpen] = useState<boolean>(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState<boolean>(false);
  const [isDisasterCenterOpen, setIsDisasterCenterOpen] = useState<boolean>(false);
  const [isCapStudioOpen, setIsCapStudioOpen] = useState<boolean>(false);
  const [isEmergencyAlarmOpen, setIsEmergencyAlarmOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  const loadData = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    try {
      const res = await fetchZones();
      if (res && res.zones && res.zones.length > 0) {
        setTransects(res.zones);

        // If a previously saved active transect exists, restore it; otherwise default to first zone
        const savedTransectId = initialCachedState?.activeTransectId;
        const matched = savedTransectId ? res.zones.find(z => z.id === savedTransectId) : null;
        setSelectedTransect((prev) => prev || matched || res.zones[0]);

        // Evaluate 3-day early warning disaster alerts
        const alerts = evaluate3DayDisasterAlerts(res.zones);
        if (alerts.length > 0) {
          setActiveAlert(alerts[0]);
        }
        setError(null);
      }
    } catch (err: any) {
      console.error("Error loading transects:", err);
      // Only show error if no transects are loaded yet
      setTransects((current) => {
        if (current.length === 0) {
          setError("Initializing connection to CoastGuard AI inference backend...");
        }
        return current;
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Periodic Auto-Save Service: saves state periodically and binds to beforeunload/pagehide
  useEffect(() => {
    const autoSaveService = startPeriodicAutoSave(() => ({
      currentView,
      activeTransectId: selectedTransect?.id ?? null,
      physicalSimulatorParams,
      beachProfileSimulatorParams
    }), 3000);

    return () => {
      autoSaveService.stop();
    };
  }, [currentView, selectedTransect, physicalSimulatorParams, beachProfileSimulatorParams]);

  const handleForceSave = () => {
    savePersistedState({
      currentView,
      activeTransectId: selectedTransect?.id ?? null,
      physicalSimulatorParams,
      beachProfileSimulatorParams
    });
  };

  const handleResetSession = () => {
    clearPersistedState();
    setCurrentView("dashboard");
    if (transects.length > 0) {
      setSelectedTransect(transects[0]);
    }
    setPhysicalSimulatorParams(undefined);
    setBeachProfileSimulatorParams(undefined);
  };

  const handleOpenZoneDetail = (t: CoastalTransect) => {
    setSelectedTransect(t);
    setCurrentView("zone-detail");
  };

  const handleImportTransects = (newTransects: CoastalTransect[]) => {
    setTransects((prev) => {
      const merged = [...newTransects, ...prev.filter(p => !newTransects.some(n => n.id === p.id))];
      if (newTransects.length > 0) {
        setSelectedTransect(newTransects[0]);
      }
      return merged;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Day Disaster Early Warning Alert Top Banner */}
      <DisasterAlertBanner
        alert={activeAlert}
        onOpenDisasterCenter={() => setIsDisasterCenterOpen(true)}
        onBroadcastNow={() => setIsCapStudioOpen(true)}
        onSoundEmergencyAlarm={() => setIsEmergencyAlarmOpen(true)}
      />

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenGeminiAdvisor={() => setIsGeminiAdvisorOpen(true)}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenDisasterCenter={() => setIsDisasterCenterOpen(true)}
        onOpenCapStudio={() => setIsCapStudioOpen(true)}
        onOpenEmergencyAlarm={() => setIsEmergencyAlarmOpen(true)}
        onOpenArchitectureDocs={() => setIsArchitectureModalOpen(true)}
        onRefreshData={() => loadData(true)}
        isRefreshing={isRefreshing}
        hasActiveAlert={!!activeAlert}
        activeTransectName={selectedTransect ? `${selectedTransect.id} (${selectedTransect.zone_name})` : undefined}
        onResetSession={handleResetSession}
        onForceSave={handleForceSave}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full px-4 sm:px-6 lg:px-8 py-4">
        
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-slate-400">
              Initializing XGBoost model & TreeSHAP inference pipeline...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-950/40 rounded-2xl border border-rose-800/60 max-w-lg mx-auto text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-rose-200">Backend Connection Error</h3>
            <p className="text-xs text-rose-300/80">{error}</p>
            <button
              onClick={() => loadData(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {currentView === "dashboard" && (
              <Dashboard
                transects={transects}
                selectedTransect={selectedTransect}
                onSelectTransect={(t) => setSelectedTransect(t)}
                onOpenZoneDetail={handleOpenZoneDetail}
                onOpenSimulator={() => setCurrentView("simulator")}
                onOpenDisasterCenter={() => setIsDisasterCenterOpen(true)}
                onOpenGeminiAdvisor={() => setIsGeminiAdvisorOpen(true)}
                activeAlert={activeAlert}
              />
            )}

            {currentView === "zone-detail" && selectedTransect && (
              <ZoneDetail
                transect={selectedTransect}
                onBack={() => setCurrentView("dashboard")}
              />
            )}

            {currentView === "beach-profile" && (
              <BeachProfileSimulator
                initialTransect={selectedTransect}
                savedParams={beachProfileSimulatorParams}
                onParametersChange={setBeachProfileSimulatorParams}
              />
            )}

            {currentView === "drone-mission" && (
              <DroneMissionPlanner
                transect={selectedTransect}
              />
            )}

            {currentView === "comparator" && (
              <MultiTransectComparator
                transects={transects}
                selectedTransect={selectedTransect}
                onSelectTransect={(t) => {
                  setSelectedTransect(t);
                  setCurrentView("dashboard");
                }}
              />
            )}

            {currentView === "simulator" && (
              <ParameterSimulator
                initialTransect={selectedTransect}
                savedParams={physicalSimulatorParams}
                onParametersChange={setPhysicalSimulatorParams}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-8 text-center text-xs text-slate-400 font-mono">
        <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            CoastGuard AI &copy; 2026 &bull; Coastal Erosion Decision Support Engine &bull; Satellite Telemetry & 3-Day Alert System
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              System Architecture & Tools Guide
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsEmergencyAlarmOpen(true)}
              className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Emergency Siren Dispatch
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Siren Audio Status Indicator */}
      <EmergencyAlarmFloatingBar
        onOpenModal={() => setIsEmergencyAlarmOpen(true)}
      />

      {/* Emergency Alarm Siren & Mass Broadcast Modal */}
      <EmergencyAlarmModal
        isOpen={isEmergencyAlarmOpen}
        onClose={() => setIsEmergencyAlarmOpen(false)}
        activeAlert={activeAlert}
        transects={transects}
        onOpenCapStudio={() => setIsCapStudioOpen(true)}
      />

      {/* System Architecture, Tools & Folder Location Documentation Modal */}
      <SystemArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* 3-Day Disaster Early Warning & Emergency Broadcast Command Center Modal */}
      <DisasterCenterModal
        isOpen={isDisasterCenterOpen}
        onClose={() => setIsDisasterCenterOpen(false)}
        alert={activeAlert}
        transects={transects}
      />

      {/* Standardized OASIS CAP Emergency Broadcast Studio Modal */}
      {activeAlert && (
        <CapBroadcastStudioModal
          isOpen={isCapStudioOpen}
          onClose={() => setIsCapStudioOpen(false)}
          alert={activeAlert}
        />
      )}

      {/* Gemini AI Coastal Intelligence Advisor & Copilot Modal */}
      <GeminiAiAdvisorModal
        isOpen={isGeminiAdvisorOpen}
        onClose={() => setIsGeminiAdvisorOpen(false)}
        transect={selectedTransect}
        transects={transects}
        onSelectTransect={(t) => setSelectedTransect(t)}
      />

      {/* Data Dictionary & Predictor Units Modal */}
      <DataDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
      />

    </div>
  );
}
