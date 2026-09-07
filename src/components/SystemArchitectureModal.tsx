import React, { useState } from "react";
import { 
  X, 
  Layers, 
  Cpu, 
  FolderTree, 
  Sparkles, 
  Waves, 
  ShieldAlert, 
  Radio, 
  Satellite, 
  GitBranch, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink,
  Code2,
  Database,
  Volume2
} from "lucide-react";

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "tools" | "workflow" | "folders">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col text-slate-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  SYSTEM ARCHITECTURE SPECIFICATION
                </span>
                <span className="text-xs text-slate-400">&bull; Azzara et al. (2026, Geomorphology)</span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                CoastGuard AI &mdash; System Architecture & Tool Documentation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs font-mono overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "overview"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            1. System Overview
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "architecture"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            2. System Architecture
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "tools"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            3. Tools & Technologies
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "workflow"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            4. How It Works (Workflow)
          </button>
          <button
            onClick={() => setActiveTab("folders")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "folders"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            5. Folder Structure & Files
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Waves className="w-5 h-5 text-cyan-400" />
                  What is CoastGuard AI?
                </h3>
                <p className="leading-relaxed text-slate-300">
                  <strong className="text-cyan-300">CoastGuard AI</strong> is a full-stack coastal erosion susceptibility prediction, 
                  explainable artificial intelligence (XAI), and early disaster decision support system. It directly extends the research paper:
                </p>
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  &ldquo;MARS modelling for spatial analysis of coastal erosion susceptibility&rdquo; &mdash; Azzara et al. (2026, <em>Geomorphology</em>, Vol. 473, 109607).
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">01. PREDICT</span>
                  <h4 className="text-sm font-bold text-white mb-1">XGBoost & Random Forest</h4>
                  <p className="text-xs text-slate-400">
                    Achieves <strong>0.9381 AUC</strong> (vs. MARS 0.7840), predicting 10-year coastal retreat probabilities from physical drivers.
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs font-mono text-purple-400 font-bold block mb-1">02. EXPLAIN</span>
                  <h4 className="text-sm font-bold text-white mb-1">TreeSHAP Game Theory</h4>
                  <p className="text-xs text-slate-400">
                    Calculates exact additive Shapley feature contributions for every transect, clarifying exactly <em>why</em> risk is elevated.
                  </p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs font-mono text-rose-400 font-bold block mb-1">03. DEFEND & ALERT</span>
                  <h4 className="text-sm font-bold text-white mb-1">72-Hour Alert & Alarm</h4>
                  <p className="text-xs text-slate-400">
                    Real-time marine weather, Copernicus satellite telemetry, Web Audio emergency sirens, and OASIS CAP v1.2 mass broadcasting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYSTEM ARCHITECTURE */}
          {activeTab === "architecture" && (
            <div className="space-y-5 animate-fade-in font-mono text-xs">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-cyan-300 font-sans mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  High-Level Architectural Flowchart
                </h3>
                <pre className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`+---------------------------------------------------------------------------------------------------+
|                                   DATA INGESTION & SENSORY LAYER                                  |
|  [Copernicus Sentinel-1/2 SAR]   [Open-Meteo Marine Weather]   [LiDAR Drone Missions]  [User CSV] |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                   BACKEND SERVICE & ML PIPELINE                                   |
|   Node.js / Express Proxy + Python ML Engine                                                      |
|   ├── XGBoost Classifier (AUC 0.9381)                                                             |
|   ├── TreeSHAP Game-Theoretic Attribution Explainer                                               |
|   ├── 72-Hour Extreme Hydrodynamic Storm Surge Evaluator                                          |
|   └── Rule-Based Coastal Mitigation Engine (Nature-Based + Hard Defenses)                        |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                    COMMUNICATION & APIS                                           |
|   • GET /api/zones               -> Active coastal transects & risk profiles                      |
|   • POST /api/predict            -> Real-time inference on hydrodynamic parameters                |
|   • POST /api/explain            -> SHAP waterfall values for individual sectors                  |
|   • GET /api/weather/live        -> Live wave height, period, wind gusts                          |
|   • POST /api/ai/advisor         -> Gemini AI Coastal Intelligence Copilot                        |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                  FRONTEND USER INTERFACE (VITE + REACT 19)                         |
|   ├── Geospatial Risk Map (Leaflet.js + CartoDB Dark Matter)                                      |
|   ├── SHAP Waterfall & Contribution Charts (Recharts)                                             |
|   ├── 2D Equilibrium Beach Profile Wave Flume Simulator (HTML5 Canvas)                           |
|   ├── Autonomous Drone LiDAR Survey Mission Planner (Pathfinding)                                 |
|   ├── Emergency Alarm Audio Siren Engine (Web Audio API Synthesizer)                              |
|   └── OASIS Common Alerting Protocol (CAP v1.2) Multi-Agency Broadcast Center                     |
+---------------------------------------------------------------------------------------------------+`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
                  <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Frontend & Backend Decoupling
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Client application runs on React 19 and Vite with TailwindCSS. The custom server (`server.ts`) handles API routes,
                    Gemini AI proxying, hydrodynamic simulations, and static single-page application serving on Port 3000.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl">
                  <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-rose-400" />
                    Audible Alarm & Broadcast Architecture
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Browser Web Audio API synthesizes a 650Hz–1050Hz oscillating dual-oscillator acoustic siren without external dependencies.
                    Alert messages conform to the internationally standardized OASIS CAP v1.2 schema for cellular and radio broadcast.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOOLS & TECHNOLOGIES */}
          {activeTab === "tools" && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-left">
                  <thead>
                    <tr className="bg-slate-900 text-slate-200 font-mono text-[11px] border-b border-slate-800">
                      <th className="p-3">Category</th>
                      <th className="p-3">Tool / Library</th>
                      <th className="p-3">Role & Purpose in CoastGuard AI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-sans">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-cyan-400">Machine Learning</td>
                      <td className="p-3 font-semibold text-white">XGBoost & Random Forest</td>
                      <td className="p-3 text-slate-300">Ensemble tree gradient boosting for non-linear hydrodynamic susceptibility classification (AUC 0.9381).</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-purple-400">Explainability</td>
                      <td className="p-3 font-semibold text-white">TreeSHAP (shap)</td>
                      <td className="p-3 text-slate-300">Exact Shapley additive local feature attribution calculating positive and negative risk factors per transect.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-amber-400">Artificial Intelligence</td>
                      <td className="p-3 font-semibold text-white">@google/genai (Gemini 2.5 Flash)</td>
                      <td className="p-3 text-slate-300">AI Coastal Intelligence Copilot providing technical geomorphic appraisals and mitigation plans.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-blue-400">Geospatial Mapping</td>
                      <td className="p-3 font-semibold text-white">Leaflet.js & CartoDB</td>
                      <td className="p-3 text-slate-300">Interactive GIS map rendering monitored coastal transects with custom risk pins, popups, and extent flyTo.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-emerald-400">Visualizations</td>
                      <td className="p-3 font-semibold text-white">Recharts & Canvas</td>
                      <td className="p-3 text-slate-300">Interactive SHAP feature ranking charts, 2D hydrodynamic beach profile wave flume simulation.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-rose-400">Audio Alarm & Siren</td>
                      <td className="p-3 font-semibold text-white">Web Audio API (AudioContext)</td>
                      <td className="p-3 text-slate-300">Synthesizes high-urgency civil defense and maritime siren sweeps (650Hz–1050Hz) natively in the browser.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-indigo-400">Full-Stack Framework</td>
                      <td className="p-3 font-semibold text-white">React 19, TypeScript, Vite, TailwindCSS, Express</td>
                      <td className="p-3 text-slate-300">Modern reactive user interface with sub-millisecond updates, modular components, and server routes.</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-cyan-400">Satellite Telemetry</td>
                      <td className="p-3 font-semibold text-white">Copernicus Data Space Ecosystem</td>
                      <td className="p-3 text-slate-300">Sentinel-1 SAR coherence and Sentinel-2 multispectral vegetation/water indices (NDVI/NDWI).</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-sky-400">Marine Weather</td>
                      <td className="p-3 font-semibold text-white">Open-Meteo Marine API</td>
                      <td className="p-3 text-slate-300">Real-time significant wave height (Hs), wave period (Tp), swell, and wind gust telemetry.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOW */}
          {activeTab === "workflow" && (
            <div className="space-y-4 animate-fade-in text-xs font-sans">
              <div className="space-y-3">
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Geospatial Ingestion & Transect Slicing</h4>
                    <p className="text-slate-400 mt-1">
                      Coastline geometries are discretized into 200m–500m perpendicular transects. 
                      Predictors are collected: beach slope, annual storm count, wave energy flux, depth of closure, substrate geomorphology, and longshore drift.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">XGBoost Susceptibility Inference</h4>
                    <p className="text-slate-400 mt-1">
                      The inference model outputs continuous erosion susceptibility probabilities ($P \in [0.0, 1.0]$) and maps them into 4 risk tiers:
                      <span className="text-emerald-400 font-bold ml-1">Low</span>, 
                      <span className="text-amber-400 font-bold ml-1">Medium</span>, 
                      <span className="text-orange-400 font-bold ml-1">High</span>, and 
                      <span className="text-rose-400 font-bold ml-1">Very High</span>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">TreeSHAP Local Feature Attribution</h4>
                    <p className="text-slate-400 mt-1">
                      Rather than black-box scoring, TreeSHAP decomposes the probability delta:
                      Prediction = Base Value + &Sigma; &phi;<sub>i</sub>. 
                      Engineers see whether high wave energy (+0.42) or steep slope (+0.25) is driving erosion.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">3-Day (T-72h) Early Warning & Disaster Alerting</h4>
                    <p className="text-slate-400 mt-1">
                      Real-time telemetry feeds storm surge and wave forecasts into an extreme hazard classifier. If significant wave heights exceed 4.0m or surge exceeds 1.5m, a critical disaster warning is issued.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Audible Alarm & OASIS CAP Mass Broadcast</h4>
                    <p className="text-slate-400 mt-1">
                      Operators click <strong>&ldquo;ALERT EVERYONE&rdquo;</strong> to sound browser-synthesized emergency acoustic alarms (650Hz&ndash;1050Hz) and broadcast OASIS CAP v1.2 XML alerts to civil defense, port authorities, and mobile networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FOLDER STRUCTURE */}
          {activeTab === "folders" && (
            <div className="space-y-4 animate-fade-in font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-cyan-300 font-sans mb-2 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-cyan-400" />
                  Codebase Directory Map & File Location Guide
                </h3>
                <pre className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`coastguard-ai/
├── README.md                                # Comprehensive master architecture and system guide
├── server.ts                                # Node.js / Express backend server (APIs, Vite middleware, Gemini proxy)
├── package.json                             # Dependencies & runtime build scripts
├── vite.config.ts                           # Vite build configuration with TailwindCSS plugin
├── index.html                               # HTML5 entrypoint with Leaflet CSS and fonts
│
├── src/                                     # Core Application Source Code
│   ├── main.tsx                             # React DOM entry point
│   ├── App.tsx                              # Main application coordinator, routing & modal management
│   ├── types.ts                             # Shared TypeScript types, interfaces & enums
│   │
│   ├── api/                                 # API Clients & Data Services
│   │   ├── client.ts                        # Zone fetcher, predict, explain, and Gemini AI endpoints
│   │   └── liveData.ts                      # Open-Meteo marine telemetry & 3-day alert evaluation logic
│   │
│   ├── data/                                # Datasets & Benchmark Models
│   │   ├── coastal_dataset.ts               # Sample transects, CSV exporter, and custom CSV parser
│   │   ├── fallbackTransects.ts             # Hardcoded offline resilience transects
│   │   └── imagery_dataset.ts               # Multispectral satellite imagery & drone datasets
│   │
│   ├── utils/                               # System Utilities & Synthesizers
│   │   └── emergencyAlarmAudio.ts           # Web Audio API emergency acoustic alarm/siren engine
│   │
│   ├── pages/                               # Primary Views
│   │   ├── Dashboard.tsx                    # Main operations center (Risk Map, metrics, transect table)
│   │   └── ZoneDetail.tsx                   # Individual transect deep-dive (SHAP waterfall, mitigation)
│   │
│   └── components/                          # UI Sub-Components & Modals
│       ├── Navbar.tsx                       # Navigation bar with Alert Everyone button & view tabs
│       ├── RiskMap.tsx                      # Leaflet.js interactive geospatial coastal risk map
│       ├── EmergencyAlarmModal.tsx          # "Alert Everyone" broadcast dialog with siren audio controls
│       ├── EmergencyAlarmFloatingBar.tsx    # Persistent floating siren indicator when alarm sounds
│       ├── SystemArchitectureModal.tsx      # In-app interactive architecture & tool documentation modal
│       ├── DisasterAlertBanner.tsx          # Top emergency 72h early warning hazard alert banner
│       ├── DisasterCenterModal.tsx          # Full-screen 3-day disaster early warning command center
│       ├── CapBroadcastStudioModal.tsx      # OASIS CAP v1.2 standardized emergency broadcast studio
│       ├── GeminiAiAdvisorModal.tsx         # Gemini AI Coastal Intelligence Copilot & Chat
│       ├── BeachProfileSimulator.tsx        # 2D Canvas equilibrium beach profile wave flume simulator
│       ├── DroneMissionPlanner.tsx          # Autonomous drone LiDAR survey mission planner & pathfinding
│       ├── ParameterSimulator.tsx           # Hydrodynamic "What-If" parameter perturbation simulator
│       ├── MultiTransectComparator.tsx      # Multi-zone comparative vulnerability radar/matrix
│       └── DataDictionaryModal.tsx          # Full geomorphic predictor unit reference dictionary
│
├── backend/                                 # Python ML Backend Source (Optional standalone service)
│   ├── main.py                              # FastAPI entrypoint (POST /predict, POST /explain)
│   └── requirements.txt                     # Python packages (scikit-learn, xgboost, shap, fastapi)
│
├── ml/                                      # ML Training & Research Benchmark Scripts
│   ├── train_xgboost.py                     # XGBoost training script with hyperparameter tuning
│   ├── train_random_forest.py               # Random Forest training script
│   └── explain_shap.py                      # TreeSHAP explainer generation
│
└── dataset/                                 # Raw & Synthetic Training Datasets
    ├── generate_synthetic_data.py           # Synthetic dataset generator mirroring Azzara et al.
    └── coastal_raw.csv                      # Baseline coastal transects records`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>CoastGuard AI &bull; System Specification v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-bold transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
