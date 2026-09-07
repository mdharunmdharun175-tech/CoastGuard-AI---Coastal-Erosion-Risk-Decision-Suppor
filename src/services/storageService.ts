import { BeachProfileConfig } from "../types";

export interface PhysicalSimulatorParams {
  slope: number;
  stormCount: number;
  stormEnergy: number;
  depthOfClosure: number;
  geomorphology: string;
  longshoreDirection: string;
  appliedInterventions: {
    reef: boolean;
    duneNourishment: boolean;
    sandBypass: boolean;
  };
}

export interface BeachProfileSimulatorParams {
  duneCrestHeightM: number;
  bermWidthM: number;
  beachSlopePct: number;
  grainSizeD50Mm: number;
  tideLevelM: number;
  stormSurgeM: number;
  waveHeightHsM: number;
  wavePeriodTpS: number;
  seaLevelRiseM: number;
  depthOfClosureM: number;
  mitigationType: BeachProfileConfig["mitigationType"];
}

export interface MapPreferences {
  isHeatmapActive?: boolean;
  isEvacuationActive?: boolean;
  isSatelliteActive?: boolean;
}

export type ValidAppView = 
  | "dashboard" 
  | "zone-detail" 
  | "simulator" 
  | "beach-profile" 
  | "drone-mission" 
  | "comparator";

export interface AppStatePersistence {
  version: number;
  lastSavedTimestamp: number;
  lastSavedFormatted: string;
  currentView: ValidAppView;
  activeTransectId: string | null;
  physicalSimulatorParams?: PhysicalSimulatorParams;
  beachProfileSimulatorParams?: BeachProfileSimulatorParams;
  mapPreferences?: MapPreferences;
}

const STORAGE_KEY = "coastguard_ai_session_state_v1";
const STORAGE_VERSION = 1;
const STORAGE_EVENT_NAME = "coastguard_storage_sync";

// Verify localStorage availability
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__coastguard_storage_test__";
    window.localStorage.setItem(testKey, "ok");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Loads the persisted application state from localStorage
 */
export function loadPersistedState(): AppStatePersistence | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AppStatePersistence;
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      console.warn("Storage version mismatch or invalid payload, ignoring old cache.");
      return null;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to load persisted state from localStorage:", err);
    return null;
  }
}

/**
 * Saves or merges the application state into localStorage
 */
export function savePersistedState(updates: Partial<AppStatePersistence>): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const existing = loadPersistedState();
    const now = Date.now();
    const formatted = new Date(now).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const newState: AppStatePersistence = {
      version: STORAGE_VERSION,
      lastSavedTimestamp: now,
      lastSavedFormatted: formatted,
      currentView: updates.currentView ?? existing?.currentView ?? "dashboard",
      activeTransectId: updates.activeTransectId !== undefined ? updates.activeTransectId : (existing?.activeTransectId ?? null),
      physicalSimulatorParams: updates.physicalSimulatorParams ?? existing?.physicalSimulatorParams,
      beachProfileSimulatorParams: updates.beachProfileSimulatorParams ?? existing?.beachProfileSimulatorParams,
      mapPreferences: updates.mapPreferences ?? existing?.mapPreferences
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

    // Dispatch custom event to notify any mounted visual indicators
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT_NAME, {
          detail: {
            timestamp: now,
            formatted,
            state: newState
          }
        })
      );
    }

    return true;
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
    return false;
  }
}

/**
 * Clears the persisted application state from localStorage
 */
export function clearPersistedState(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(STORAGE_EVENT_NAME, {
          detail: {
            cleared: true,
            timestamp: Date.now(),
            formatted: "Cleared"
          }
        })
      );
    }
  } catch (err) {
    console.error("Failed to clear persisted state:", err);
  }
}

/**
 * Subscribes to storage sync events to update auto-save timestamps in the UI
 */
export function onStorageSync(
  callback: (detail: { timestamp: number; formatted: string; state?: AppStatePersistence; cleared?: boolean }) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(STORAGE_EVENT_NAME, handler);
  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handler);
  };
}

/**
 * Periodically auto-saves application state and hooks into beforeunload/pagehide
 * to guarantee resilience against accidental page refreshes.
 */
export function startPeriodicAutoSave(
  getState: () => Partial<AppStatePersistence>,
  intervalMs = 4000
): { stop: () => void; forceSave: () => void } {
  if (typeof window === "undefined") {
    return { stop: () => {}, forceSave: () => {} };
  }

  let lastSerialized = "";

  const performSave = () => {
    try {
      const stateToSave = getState();
      const currentSerialized = JSON.stringify(stateToSave);

      // Only write to localStorage if state actually changed
      if (currentSerialized !== lastSerialized) {
        savePersistedState(stateToSave);
        lastSerialized = currentSerialized;
      }
    } catch (e) {
      console.error("Error during periodic auto-save:", e);
    }
  };

  // Periodic interval
  const intervalId = window.setInterval(performSave, intervalMs);

  // Unload event listeners for instantaneous save on browser refresh or close
  const handleBeforeUnload = () => {
    try {
      const stateToSave = getState();
      savePersistedState(stateToSave);
    } catch (e) {
      // ignore
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handleBeforeUnload);

  return {
    stop: () => {
      window.clearInterval(intervalId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
    },
    forceSave: () => {
      performSave();
    }
  };
}
