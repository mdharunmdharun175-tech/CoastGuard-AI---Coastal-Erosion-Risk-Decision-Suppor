# System Architecture & Technical Specifications

*(For full architecture documentation, see [/ARCHITECTURE.md](/ARCHITECTURE.md) at the repository root)*

## Summary of Core Subsystems
1. **Machine Learning Pipeline**: XGBoost classifier (AUC 0.9381) trained on multi-temporal coastal transect physical indicators.
2. **TreeSHAP Explainability**: Game-theoretic decomposition of feature contributions $\phi_i$ per station.
3. **Slide-Based Geospatial Operations**: Dedicated Map Slide, Detailed Transect Fleet Slide, and Split Concurrent View.
4. **Emergency Audio & Broadcasting**: Web Audio API siren oscillation (650Hz–1050Hz) and OASIS CAP v1.2 cellular alerts.
5. **Real-Time Marine Weather**: Open-Meteo integration predicting significant wave heights and storm surges.
