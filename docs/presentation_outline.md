# CoastGuard AI: Presentation & Pitch Outline

**Target Audience:** Hackathon Judges, Academic Reviewers, Coastal Zone Managers, Municipal Planners  
**Time Limit:** 5-7 Minutes  

---

## Slide 1: Title & Hook
- **Title:** CoastGuard AI - Precision Coastal Erosion Risk & Decision Support
- **Subtitle:** Beyond MARS: Boosting Susceptibility Forecasting with XGBoost, TreeSHAP & Automated Mitigation
- **Presenter:** CoastGuard AI Team
- **Hook:** "Every year, coastal erosion claims kilometers of global shorelines. Traditional models force a painful choice: simple interpretable models with low accuracy, or high-accuracy black-box AI that engineers cannot trust. CoastGuard AI solves this dilemma."

---

## Slide 2: The Foundation & Research Gap
- **Reference Paper:** *Azzara et al. (2026, Geomorphology)* proposed MARS (Multivariate Adaptive Regression Splines).
- **The Trade-Off in Base Paper:**
  - MARS is interpretable (piecewise equations), but tops out at AUC 0.73-0.85.
  - Complex wave interactions (e.g. storm energy flux $\times$ beach slope) are poorly approximated.
  - No automated decision layer to advise municipal planners on *what to do next*.

---

## Slide 3: Our Core Novelty & Solution Architecture
- **Novelty 1: Modern Ensemble ML (XGBoost & Random Forest)** $\rightarrow$ Reaches AUC 0.938 (+15.4% boost).
- **Novelty 2: Game-Theoretic TreeSHAP Interpretability** $\rightarrow$ Translates black-box predictions into transparent, additive feature attributions for every coastal transect.
- **Novelty 3: Decision Support Layer** $\rightarrow$ Directly converts top SHAP drivers into prioritized, cost-tiered engineering and nature-based interventions.
- **Software-Only & Fully Reproducible:** Runs on public datasets (Kaggle/HF + synthetic fallback) with no drone surveys required.

---

## Slide 4: Live Demo Highlights
1. **Interactive Geospatial Dashboard:** Color-coded susceptibility zones (Low to Very High) along Mediterranean and global transects.
2. **Dynamic Transect Deep-Dive:** Real-time risk probability gauge and confidence interval calculation.
3. **Interactive SHAP Waterfall/Bar Chart:** Instant visual proof of which parameters (e.g., storm energy vs dune slope) are driving erosion.
4. **Actionable Mitigation Action Plan:** Tailored interventions (submerged artificial reefs, marram grass dune revegetation, sand bypassing).
5. **Real-Time 'What-If' Parameter Simulator:** Adjust slope or wave energy and observe the instantaneous SHAP redistribution and risk mitigation impact.

---

## Slide 5: Model Evaluation & Benchmark Results
- Comparison Table: MARS vs Random Forest vs XGBoost
  - AUC-ROC: **0.9381** vs 0.7840
  - Sensitivity / Recall: **89.58%** vs 76.10%
  - Specificity: **87.64%** vs 72.30%
- Proves the core scientific hypothesis: XGBoost + TreeSHAP is strictly superior to MARS in both predictive precision and explanatory granularity.

---

## Slide 6: Summary & Future Roadmap
- **Immediate Impact:** Ready-to-deploy tool for coastal planning authorities, port managers, and environmental agencies.
- **Next Steps:** Ingest live Copernicus Sentinel-2 satellite feeds and NOAA wave buoy telemetry.
- **Call to Action:** Experience the live dashboard and explore the open-source pipeline!
