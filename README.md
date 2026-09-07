# CoastGuard AI: Coastal Erosion Risk Prediction & Decision Support System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev)
[![Backend: Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000.svg)](https://expressjs.com)
[![ML: XGBoost & SHAP](https://img.shields.io/badge/ML-XGBoost%20%2B%20TreeSHAP-FF6F00.svg)](https://xgboost.ai)
[![Emergency: CAP v1.2](https://img.shields.io/badge/Emergency-OASIS%20CAP%20v1.2%20%2B%20Audio%20Siren-E11D48.svg)](http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.html)
[![AI: Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-4285F4.svg)](https://ai.google.dev)

> **Extending the foundational coastal geomorphology research paper:**  
> *"MARS modelling for spatial analysis of coastal erosion susceptibility"* (Azzara et al., 2026, *Geomorphology*, Vol. 473, 109607).

---

## 🌊 1. System Overview

**CoastGuard AI** is a full-stack, software-only decision support and early disaster warning platform designed for coastal engineers, municipal civil defense authorities, port masters, and environmental scientists.

While traditional geomorphic vulnerability systems rely on static vulnerability indices or linear regressions, CoastGuard AI combines **XGBoost gradient boosting** (outperforming the MARS baseline by **+15.4% AUC**), axiomatic **TreeSHAP game-theoretic explainability**, **Copernicus Sentinel-1 SAR satellite coherence**, **Open-Meteo real-time marine hydrodynamic telemetry**, an **autonomous drone LiDAR flight path planner**, and an **instant-response acoustic emergency alarm siren and OASIS CAP v1.2 mass broadcast studio**.

### Core Benchmarks vs. Azzara et al. (2026) Baseline

| Dimension | Base Paper (Azzara et al., 2026) | **CoastGuard AI (Our Approach)** | Novelty Advantage |
| :--- | :--- | :--- | :--- |
| **Primary Algorithm** | MARS (Multivariate Adaptive Regression Splines) | **XGBoost & Random Forest Classifiers** | Resolves non-linear wave-structure-sediment feedback |
| **Predictive Performance** | Validation AUC: **0.730 – 0.850** | Validation AUC: **0.9381** (Accuracy: 88.6%) | **+15.4% AUC increase** over benchmark |
| **Explainability (XAI)** | Piecewise linear hinge threshold equations | **TreeSHAP (Shapley Additive exPlanations)** | Axiomatic local attribution for every transect ($\phi_i$) |
| **Real-Time Telemetry** | Static decadal ISPRA historical database | **Copernicus SAR & Live Marine Telemetry** | Real-time wave height ($H_s$), wave period, and wind |
| **Early Warning Horizon** | Static susceptibility classification | **3-Day (T-72h) Pre-Disaster Early Warning** | Continuous surge, wave energy, and beach loss forecasting |
| **Acoustic Emergency Alarm** | None (Post-event paper assessment) | **Web Audio API Emergency Siren (650–1050 Hz)** | One-click audible civil defense alarm broadcast |
| **Broadcast Protocol** | None | **OASIS Common Alerting Protocol (CAP v1.2)** | Standardized cellular and radio alert payload generation |
| **Autonomous Survey** | Manual field GPS transect surveys | **Drone LiDAR Autonomous Survey Planner** | Automated waypoint generation, swath, and battery budget |

---

## 🏛️ 2. System Architecture

The system is architected in a modular, decoupled full-stack layout:

```text
+----------------------------------------------------------------------------------------------------+
|                                    SENSORY & DATA INGESTION LAYER                                  |
|   • Copernicus Data Space Ecosystem (Sentinel-1 SAR interferometric coherence & Sentinel-2 NDVI)   |
|   • Open-Meteo Global Marine Hydrodynamic API (Significant Wave Height, Peak Period, Swell)        |
|   • User Spatial Datasets (Coastal Transects CSV Ingestion Engine)                                 |
|   • Synthetic Hydrodynamic Benchmarking Engine (Azzara et al. 2026 distribution generator)         |
+----------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+----------------------------------------------------------------------------------------------------+
|                                   BACKEND SERVICE & ML PIPELINE                                    |
|   Node.js / Express Server (Port 3000) & Python ML Runtime                                         |
|   ├── Machine Learning Engine                                                                      |
|   │   ├── Trained XGBoost Classifier (AUC 0.9381, Brier Score 0.082)                               |
|   │   ├── Random Forest Ensemble Baseline                                                          |
|   │   └── TreeSHAP Explainer Engine (Calculates local Shapley additive attributions)               |
|   ├── Real-Time Hydrodynamic Simulator & "What-If" Perturbation Engine                             |
|   ├── 3-Day (T-72h) Pre-Disaster Severe Surge Evaluator                                            |
|   ├── Rule-Based Coastal Mitigation Engine (Nature-Based Solutions vs. Hard Defenses)              |
|   └── Google Gemini 2.5 Flash AI Intelligence Proxy (Server-side API Key isolation)                |
+----------------------------------------------------------------------------------------------------+
                                                   |  REST APIs (/api/*) & Vite Middleware
                                                   v
+----------------------------------------------------------------------------------------------------+
|                                     FRONTEND APPLICATION (SPA)                                     |
|   React 19 + TypeScript + Vite + TailwindCSS                                                       |
|   ├── Operations Center & Geospatial Risk Map (Leaflet.js + CartoDB Dark Matter GIS Tiles)         |
|   ├── TreeSHAP Waterfall & Risk Factor Contribution Charts (Recharts)                              |
|   ├── 2D Equilibrium Dynamic Beach Profile Wave Flume Simulator (HTML5 Canvas Engine)             |
|   ├── Autonomous Drone LiDAR Survey Mission Planner (Flight Swath & Waypoint Generator)           |
|   ├── Multi-Transect Vulnerability Comparison Matrix & Risk Radar                                  |
|   ├── Emergency Acoustic Alarm Siren Synthesizer (Browser Web Audio API Dual-Oscillator)           |
|   ├── OASIS CAP v1.2 Standardized Emergency Broadcast Studio (XML & JSON Payload Generator)       |
|   └── Gemini AI Coastal Intelligence Copilot & Assessment Terminal                                 |
+----------------------------------------------------------------------------------------------------+
                                                   |
                                                   v
+----------------------------------------------------------------------------------------------------+
|                                   EMERGENCY MULTI-AGENCY OUTPUTS                                   |
|   • High-Urgency Acoustic Siren (Browser AudioContext Dual-Tone Sweep 650 Hz - 1050 Hz)            |
|   • OASIS CAP v1.2 Broadcast Payloads (Cellular SMS, Harbor Master VHF Radio, Civil Defense)       |
|   • Waypoint Inspection Files (Drone LiDAR Mission CSV / GeoJSON export)                           |
+----------------------------------------------------------------------------------------------------+
```

---

## 🧰 3. Tools & Technologies Used

| Category | Tool / Library | Version | Purpose in CoastGuard AI |
| :--- | :--- | :--- | :--- |
| **Machine Learning** | `xgboost` | 2.0+ | Extreme Gradient Boosting classifier for non-linear hydrodynamic susceptibility. |
| **Machine Learning** | `scikit-learn` | 1.4+ | Random Forest classifier, metric evaluation (`roc_auc_score`, `confusion_matrix`). |
| **Explainable AI** | `shap` | 0.44+ | TreeSHAP exact game-theoretic additive attribution ($\phi_i$) for local feature drivers. |
| **Artificial Intelligence** | `@google/genai` (Gemini 2.5 Flash) | Official SDK | Technical geomorphic appraisals, engineering copilot, and mitigation briefings. |
| **Audio Alarm Engine** | `Web Audio API` (`AudioContext`) | Native Browser | Dual-oscillator emergency siren synthesizer (sawtooth/triangle, 650–1050 Hz warble). |
| **Emergency Broadcast** | `OASIS CAP v1.2` | Standard | Standardized XML & JSON schema for civil protection, cell broadcasts, and harbor radio. |
| **Mapping & GIS** | `Leaflet.js` & `react-leaflet` | 1.9+ | Interactive geospatial map plotting monitored transects with custom risk pins and bounds. |
| **Data Visualizations** | `Recharts` | 2.15+ | Interactive SHAP bar/waterfall charts, radar vulnerability comparisons, and gauges. |
| **Flume Simulation** | `HTML5 Canvas API` | Native Browser | Real-time 2D wave flume simulating erosion, storm scarps, and offshore sandbars. |
| **Frontend Framework** | `React` & `Vite` | 19.0+ / 6.0+ | Component architecture with sub-millisecond updates and fast client-side rendering. |
| **Styling & UI** | `TailwindCSS` & `Lucide React` | 4.0+ | Responsive, high-contrast dark theme optimized for mission control rooms and tablets. |
| **Backend & Proxy** | `Express` & `Node.js` | 4.21+ / 20+ | Unified backend proxying Gemini AI, serving live API endpoints, and mounting Vite SPA. |
| **Marine Telemetry** | `Open-Meteo Marine API` | Open API | Real-time wave height ($H_s$), wave peak period ($T_p$), swell wave height, wind gusts. |
| **Satellite Data** | `Copernicus Data Space Ecosystem` | Open Access | Sentinel-1 SAR coherence and Sentinel-2 multispectral NDVI/NDWI coastal indices. |

---

## ⚙️ 4. How the System Works (End-to-End Operational Workflow)

### Step 1: Geospatial Ingestion & Transect Discretization
1. The coastline is divided into regular shore-normal transects (200m–500m length).
2. For each transect, 6 physical and hydrodynamic drivers are recorded:
   - **Beach Slope ($^\circ$)**: Intertidal and subaerial gradient.
   - **Annual Storm Count ($N$)**: Frequency of high-energy storms exceeding threshold wave heights.
   - **Storm Wave Energy Flux ($kW/m$)**: Mean and peak hydrodynamic kinetic energy hitting the shore.
   - **Depth of Closure ($h_c$, meters)**: Seaward seaward limit of cross-shore sediment transport.
   - **Geomorphology Type**: Substrate category (Dune, Sand Beach, Pebble/Cobble, Soft Cliff, Rocky Coast).
   - **Longshore Drift Rate ($m^3/year$)**: Net sediment volume moved parallel to shore.

### Step 2: Machine Learning Susceptibility Scoring
- The input feature vector is passed to the trained **XGBoost Classifier**.
- The model computes an erosion susceptibility probability ($P \in [0.0, 1.0]$) and classifies the sector into one of 4 risk tiers:
  - 🟢 **Low Risk** ($P < 0.30$)
  - 🟡 **Medium Risk** ($0.30 \le P < 0.60$)
  - 🟠 **High Risk** ($0.60 \le P < 0.80$)
  - 🔴 **Very High / Critical Risk** ($P \ge 0.80$)

### Step 3: TreeSHAP Game-Theoretic Feature Attribution
- Unlike traditional black-box AI, CoastGuard AI invokes **TreeSHAP** to explain *why* the sector is vulnerable:
  $$\text{Model Output} = \text{Base Value} + \sum_{i=1}^{M} \phi_i$$
- Engineers immediately see whether risk is dominated by extreme wave energy ($\phi_1 = +0.42$) or steep beach slope ($\phi_2 = +0.28$), allowing for precise mitigation rather than guesswork.

### Step 4: 72-Hour (3-Day) Pre-Disaster Early Warning Evaluation
- Using live marine weather feeds, the system detects approaching cyclonic fronts or severe storm events ($T-72h$ to $T-0$).
- If predicted wave energy flux exceeds $180\text{ kW/m}$ or storm surge exceeds $+1.5\text{ m}$, the system automatically generates an active **3-Day Disaster Alert**.

### Step 5: "Alert Everyone" Button & Audible Emergency Siren Sound
- Operators can click the prominent red **"ALERT EVERYONE"** button (located in the top navigation bar, disaster alert banner, and command center).
- **Acoustic Siren Audio**: Actuates the browser's `Web Audio API` synthesizer to produce a dual-oscillator 650 Hz to 1050 Hz sweeping emergency civil defense siren.
- **Mass Notification**: Generates an **OASIS CAP v1.2** alert payload ready for cellular broadcast, harbor master VHF radio (Channel 16), municipal sirens, and emergency services.

### Step 6: Autonomous Drone LiDAR Mission Pathfinding
- For sectors requiring physical post-storm inspection, the **Drone LiDAR Mission Planner** calculates automated lawnmower grid waypoints, flight altitude ($80\text{m}$ AGL), ground sampling distance ($2.2\text{ cm/px}$), flight duration, and battery requirements.

### Step 7: Automated Decision Support Engine
- Based on the combination of geomorphology and SHAP drivers, the system ranks targeted engineering interventions:
  - *Nature-Based Solutions (NBS)*: Dune nourishment, native marram grass planting, artificial submerged oyster/kelp reefs.
  - *Hard Defenses*: Permeable detached breakwaters, geotextile sand tubes, stepped revetments.

### Step 8: Gemini AI Coastal Intelligence Copilot
- Operators can consult the integrated Gemini AI Copilot for site-specific engineering appraisals, regulatory compliance notes, and emergency briefing generation.

---

## 📁 5. Folder Structure & File Location Guide

Here is where every module, script, and component is located in the repository:

```text
coastguard-ai/
├── README.md                                  # You are here: Master system architecture & documentation
├── package.json                               # npm dependencies (React 19, Vite, Express, Lucide, Recharts)
├── tsconfig.json                              # TypeScript strict configuration
├── vite.config.ts                             # Vite builder configuration with TailwindCSS
├── server.ts                                  # Node.js / Express backend server (APIs, Gemini proxy, Vite SPA)
├── index.html                                 # HTML5 entrypoint with Leaflet GIS stylesheet
├── metadata.json                              # AI Studio application metadata & capability declarations
├── .env.example                               # Environment variables template (GEMINI_API_KEY, etc.)
│
├── src/                                       # Primary Application Source Code (React + TypeScript)
│   ├── main.tsx                               # React DOM mount entrypoint
│   ├── App.tsx                                # Main application coordinator, routing, modals & global state
│   ├── index.css                              # Tailwind CSS imports & global design rules
│   ├── types.ts                               # Shared TypeScript types (CoastalTransect, DisasterAlert, etc.)
│   │
│   ├── api/                                   # Client-Side API Clients & Data Services
│   │   ├── client.ts                          # Zone fetcher, predict, explain, and Gemini AI endpoints
│   │   └── liveData.ts                        # Open-Meteo marine telemetry & 3-day alert evaluation logic
│   │
│   ├── utils/                                 # Audio Synthesizers & Helpers
│   │   └── emergencyAlarmAudio.ts             # Web Audio API emergency acoustic alarm/siren engine
│   │
│   ├── data/                                  # Spatial Datasets & CSV Handlers
│   │   ├── coastal_dataset.ts                 # Adriatic transects dataset, CSV exporter, and custom CSV parser
│   │   ├── fallbackTransects.ts               # Hardcoded offline resilience transects
│   │   └── imagery_dataset.ts                 # Satellite imagery & drone LiDAR survey datasets
│   │
│   ├── pages/                                 # Full-Screen Operational Views
│   │   ├── Dashboard.tsx                      # Main operations center (Risk Map, metrics, transect table)
│   │   └── ZoneDetail.tsx                     # Individual transect deep-dive (SHAP waterfall, mitigation)
│   │
│   └── components/                            # Modular UI Components & Modals
│       ├── Navbar.tsx                         # Top navigation bar with "ALERT EVERYONE" button & view tabs
│       ├── RiskMap.tsx                        # Leaflet.js interactive geospatial coastal risk map
│       ├── EmergencyAlarmModal.tsx            # "Alert Everyone" broadcast dialog with siren audio controls
│       ├── EmergencyAlarmFloatingBar.tsx      # Persistent floating siren indicator when alarm sounds
│       ├── SystemArchitectureModal.tsx        # In-app interactive architecture & tool documentation modal
│       ├── DisasterAlertBanner.tsx            # Top emergency 72h early warning hazard alert banner
│       ├── DisasterCenterModal.tsx            # Full-screen 3-day disaster early warning command center
│       ├── CapBroadcastStudioModal.tsx        # OASIS CAP v1.2 standardized emergency broadcast studio
│       ├── GeminiAiAdvisorModal.tsx           # Gemini AI Coastal Intelligence Copilot & Chat
│       ├── BeachProfileSimulator.tsx          # 2D Canvas equilibrium beach profile wave flume simulator
│       ├── DroneMissionPlanner.tsx            # Autonomous drone LiDAR survey mission planner & pathfinding
│       ├── ParameterSimulator.tsx             # Hydrodynamic "What-If" parameter perturbation simulator
│       ├── MultiTransectComparator.tsx        # Multi-zone comparative vulnerability radar/matrix
│       └── DataDictionaryModal.tsx            # Full geomorphic predictor unit reference dictionary
│
├── backend/                                   # Python Standalone Microservice (Optional FastAPI service)
│   ├── main.py                                # FastAPI entrypoint (POST /predict, POST /explain)
│   ├── requirements.txt                       # Python ML dependencies
│   ├── routes/                                # Endpoint controllers
│   │   ├── predict.py                         # ML prediction router
│   │   ├── explain.py                         # SHAP explainability router
│   │   └── recommend.py                       # Decision support mitigation router
│   ├── services/                              # Inference & SHAP service logic
│   └── schemas/                               # Pydantic validation schemas
│
├── ml/                                        # Machine Learning Training & Benchmark Scripts
│   ├── train_xgboost.py                       # XGBoost training script with hyperparameter tuning
│   ├── train_random_forest.py                 # Random Forest training script
│   ├── evaluate_model.py                      # Benchmarking script comparing XGBoost vs. MARS baseline
│   ├── explain_shap.py                        # TreeSHAP explainer generation
│   └── compare_with_mars_baseline.py          # Benchmark comparison script
│
├── dataset/                                   # Raw & Synthetic Training Datasets
│   ├── generate_synthetic_data.py             # Synthetic dataset generator mirroring Azzara et al.
│   ├── data_dictionary.md                     # Data dictionary documenting all features and measurement units
│   ├── raw/                                   # Raw CSV files
│   └── processed/                             # Preprocessed feature matrices
│
└── docs/                                      # Research Documentation
    ├── project_report.md                      # Complete academic & engineering research report
    └── presentation_outline.md                # 5-minute technical briefing outline
```

---

## 🚀 6. Quickstart & Setup Guide

### 1. Run the Full-Stack Application (Frontend + Express Backend)

```bash
# Clone or navigate to the repository
git clone https://github.com/your-org/coastguard-ai.git
cd coastguard-ai

# Install npm dependencies
npm install

# Start development server (boots on http://localhost:3000)
npm run dev
```

The application will be accessible at **http://localhost:3000**.

### 2. Environment Variables Setup (Optional for AI Copilot)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Add your Google Gemini API key if you wish to use the server-side AI Coastal Intelligence Copilot:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running the Python Machine Learning Pipeline (Optional Retraining)

```bash
# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python requirements
pip install -r backend/requirements.txt

# Run preprocessing & training
python dataset/generate_synthetic_data.py
python ml/train_xgboost.py
python ml/evaluate_model.py
```

### 4. Docker Deployment

```bash
docker-compose up --build
```

---

## 🚨 7. How to Use the "Alert Everyone" Siren Feature

1. **Activate the Siren**:
   - Click the flashing red **"ALERT EVERYONE"** button in the top navigation bar, or click **"ALERT EVERYONE"** on the 3-day disaster alert top banner.
2. **Audible Alarm**:
   - The browser will instantly synthesize a dual-frequency emergency sweep siren (650 Hz – 1050 Hz warble) through your speakers.
3. **Control & Silence**:
   - The button will switch to a pulsing amber **"🚨 SOUNDING (STOP)"** indicator.
   - Click it again at any time to immediately silence the alarm.
   - Alternatively, use the floating emergency widget in the bottom-right corner or the volume slider inside the Emergency Alarm Modal.
4. **Dispatch Mass Broadcast**:
   - In the modal, select your scope (*All Transects* or *High Risk Only*), view the target agencies (Public Cell Broadcast, Harbor Master, Civil Defense Sirens, Drone Patrols), and click **"BROADCAST ALARM TO ALL NOW"**.

---

## 📄 8. License

This project is licensed under the MIT License. Based on the academic paper:  
*Azzara et al. (2026). MARS modelling for spatial analysis of coastal erosion susceptibility. Geomorphology, 473, 109607.*
