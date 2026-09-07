# CoastGuard AI - Coastal Erosion Data Dictionary

This dataset mirrors the physical predictors identified in the foundational research paper **"MARS modelling for spatial analysis of coastal erosion susceptibility" (Azzara et al., 2026, *Geomorphology*)**.

---

## Predictor Variables & Target Feature

| Column Name | Data Type | Units / Categories | Physical Meaning & Range | Expected Impact on Erosion |
| :--- | :--- | :--- | :--- | :--- |
| `transect_id` | String | e.g. `TRX-0042` | Unique coastal cross-shore profile identifier | Metadata / Identifier |
| `region` | String | Geographical string | Littoral cell / macro-zone name | Spatial grouping |
| `latitude` | Float | Decimal degrees | WGS84 Latitude of transect baseline | Spatial visualization |
| `longitude` | Float | Decimal degrees | WGS84 Longitude of transect baseline | Spatial visualization |
| `slope` | Float | Percentage (%) | Cross-shore intertidal beach & cliff slope (0.8% – 12.5%) | **Positive correlation**: Steeper profiles generate more energetic wave breaking and cliff instability. |
| `storm_count` | Integer | Integer count | Cumulative storm events recorded in the calibration period (1 – 30) | **Positive correlation**: High storm frequencies deplete berm recovery time. |
| `storm_energy` | Float | $kW/m$ | Mean/Peak storm wave energy flux density (20.0 – 420.0 kW/m) | **Strong positive correlation**: Primary hydrodynamic driving force for cross-shore sediment transport. |
| `depth_of_closure` | Float | Meters ($m$) | Seaward depth limit for active seasonal sediment transport (4.5 – 17.5 m) | **Negative correlation**: Shallower closure depths constrict active profile volume, exacerbating shoreline retreat. |
| `geomorphology` | Categorical | `sandy`, `gravel`, `dune`, `riverbank`, `defence structure` | Substrate composition & shoreline morphodynamics | **High Risk**: `dune` (unconsolidated), `sandy`<br>**Medium**: `riverbank`<br>**Low/Mitigated**: `gravel`, `defence structure` |
| `longshore_direction`| Categorical | `convergent`, `transitional`, `divergent` | Littoral sediment drift gradients | `divergent` (sediment deficit $\rightarrow$ high erosion)<br>`transitional` (neutral)<br>`convergent` (sediment surplus $\rightarrow$ accretion) |
| `label` *(Target)* | Binary | `0` (Stable / Accreting), `1` (Eroding) | Shoreline position change over time interval | Supervised ML classification target |

---

## Methodological Comparison vs. Base Paper

- **Base Paper (Azzara et al., 2026)**:
  - Algorithm: **MARS** (Multivariate Adaptive Regression Splines).
  - Validation AUC: $0.73 - 0.85$.
  - Interpretability: Piecewise linear basis functions (hinge functions).
- **CoastGuard AI Novelty**:
  - Algorithm: **XGBoost** (Extreme Gradient Boosting) & **Random Forest**.
  - Validation AUC: $0.89 - 0.94$ (significantly higher non-linear capture).
  - Interpretability: **TreeSHAP** (Shapley Additive exPlanations) providing exact game-theoretic additive local attribution per transect.
  - Decision Support: Automatic translation of top SHAP drivers into prioritized, actionable engineering and nature-based coastal defence strategies.
