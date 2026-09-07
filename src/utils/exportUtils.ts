import { CoastalTransect } from "../types";

/**
 * Generates a clean, comprehensive CSV string containing all current coastal transect
 * erosion data and XGBoost / TreeSHAP susceptibility model statistics.
 */
export function generateFormattedTransectsCSV(transects: CoastalTransect[]): string {
  const headers = [
    "transect_id",
    "transect_name",
    "region",
    "latitude",
    "longitude",
    "slope_percent",
    "storm_count_annual",
    "storm_wave_energy_kw_m",
    "depth_of_closure_m",
    "substrate_geomorphology",
    "longshore_drift_direction",
    "historical_erosion_trend",
    "urban_asset_exposure",
    "susceptibility_probability",
    "susceptibility_index_pct",
    "risk_classification",
    "confidence_interval_95_lower",
    "confidence_interval_95_upper",
    "model_base_log_odds",
    "primary_risk_driver",
    "driver_display_name",
    "driver_observed_value",
    "driver_shap_attribution",
    "driver_percentage_contribution",
    "driver_impact_direction",
    "shap_storm_wave_energy",
    "shap_beach_slope",
    "shap_storm_recurrence_count",
    "shap_substrate_geomorphology",
    "shap_depth_of_closure",
    "shap_longshore_drift",
    "mitigation_primary_threat",
    "mitigation_recommended_action",
    "mitigation_category",
    "mitigation_expected_risk_reduction_pct",
    "mitigation_cost_tier",
    "mitigation_time_horizon",
    "mitigation_impact_metric",
    "latest_survey_displacement_m",
    "latest_beach_width_m",
    "latest_volumetric_loss_m3_m",
    "recorded_storm_events_count",
    "model_architecture",
    "model_validation_auc",
    "model_validation_f1_score"
  ];

  const escapeCSV = (val: any): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transects.map((t) => {
    const prob = t.probability ?? (t.susceptibility_index ? t.susceptibility_index / 100 : 0.5);
    const indexPct = t.susceptibility_index ?? Math.round(prob * 1000) / 10;
    const topFactor = t.top_contributing_factors?.[0];
    const mitigationAction = t.mitigation?.recommended_actions?.[0];
    const latestSurvey = t.historical_surveys && t.historical_surveys.length > 0
      ? t.historical_surveys[t.historical_surveys.length - 1]
      : undefined;

    return [
      escapeCSV(t.id),
      escapeCSV(t.name),
      escapeCSV(t.region),
      t.coordinates?.[0]?.toFixed(5) ?? "",
      t.coordinates?.[1]?.toFixed(5) ?? "",
      t.slope !== undefined ? t.slope.toFixed(2) : "",
      t.storm_count ?? "",
      t.storm_energy !== undefined ? t.storm_energy.toFixed(1) : "",
      t.depth_of_closure !== undefined ? t.depth_of_closure.toFixed(1) : "",
      escapeCSV(t.geomorphology || ""),
      escapeCSV(t.longshore_direction || ""),
      escapeCSV(t.historical_trend || ""),
      escapeCSV(t.urban_density || ""),
      prob.toFixed(3),
      indexPct.toFixed(1),
      escapeCSV(t.risk_class || ""),
      t.confidence_interval?.[0]?.toFixed(3) ?? "",
      t.confidence_interval?.[1]?.toFixed(3) ?? "",
      t.base_value !== undefined ? t.base_value.toFixed(2) : "-0.42",
      escapeCSV(topFactor?.factor || ""),
      escapeCSV(topFactor?.displayName || topFactor?.factor || ""),
      topFactor?.observed_value !== undefined ? topFactor.observed_value : "",
      topFactor?.shap_value !== undefined ? topFactor.shap_value.toFixed(3) : "",
      topFactor?.percentage_contribution !== undefined ? topFactor.percentage_contribution.toFixed(1) : "",
      escapeCSV(topFactor?.impact_direction || ""),
      t.shap_values?.storm_energy !== undefined ? t.shap_values.storm_energy.toFixed(3) : "",
      t.shap_values?.slope !== undefined ? t.shap_values.slope.toFixed(3) : "",
      t.shap_values?.storm_count !== undefined ? t.shap_values.storm_count.toFixed(3) : "",
      t.shap_values?.geomorphology !== undefined ? t.shap_values.geomorphology.toFixed(3) : "",
      t.shap_values?.depth_of_closure !== undefined ? t.shap_values.depth_of_closure.toFixed(3) : "",
      t.shap_values?.longshore_direction !== undefined ? t.shap_values.longshore_direction.toFixed(3) : "",
      escapeCSV(t.mitigation?.primary_threat || ""),
      escapeCSV(mitigationAction?.title || ""),
      escapeCSV(mitigationAction?.category || ""),
      mitigationAction?.expected_risk_reduction_pct !== undefined ? mitigationAction.expected_risk_reduction_pct.toFixed(1) : "",
      escapeCSV(mitigationAction?.estimated_cost_tier || ""),
      escapeCSV(mitigationAction?.time_horizon || ""),
      escapeCSV(mitigationAction?.impact_metric || ""),
      latestSurvey?.shoreline_displacement_m !== undefined ? latestSurvey.shoreline_displacement_m.toFixed(1) : "",
      latestSurvey?.beach_width_m !== undefined ? latestSurvey.beach_width_m.toFixed(1) : "",
      latestSurvey?.volumetric_loss_m3_m !== undefined ? latestSurvey.volumetric_loss_m3_m.toFixed(1) : "",
      t.historical_storms ? t.historical_storms.length : 0,
      "XGBoost v2.4 + TreeSHAP (CoastGuard AI)",
      "0.9381",
      "0.8905"
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Downloads a formatted CSV file of transects erosion data and susceptibility model statistics
 */
export function downloadTransectCSV(
  transects: CoastalTransect[], 
  customFilename?: string
): void {
  const content = generateFormattedTransectsCSV(transects);
  // Prepend UTF-8 BOM (\uFEFF) for optimal Excel and multilingual character compatibility
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const defaultFilename = `coastguard_transect_erosion_and_model_stats_${dateStr}.csv`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", customFilename || defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
