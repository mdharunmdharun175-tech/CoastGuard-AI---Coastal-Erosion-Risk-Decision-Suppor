"""
CoastGuard AI - SHAP Service Wrapper
Provides TreeSHAP feature attributions and impact summaries for API endpoints.
"""

from typing import Dict, Any, List
import math
from ml.explain_shap import calculate_shap_contributions

class ShapService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ShapService()
        return cls._instance

    def explain_sample(self, features: dict) -> dict:
        explanation = calculate_shap_contributions(features)
        
        shap_values = explanation["shap_values"]
        total_abs = sum(abs(v) for v in shap_values.values()) or 1.0
        
        enriched_factors = []
        baselines = {
            "slope": "4.5%",
            "storm_count": "12 events",
            "storm_energy": "180 kW/m",
            "depth_of_closure": "10.0 m",
            "geomorphology": "sandy",
            "longshore_direction": "transitional"
        }
        
        for k, v in shap_values.items():
            pct = round((abs(v) / total_abs) * 100.0, 1)
            direction = "Increases Risk" if v > 0 else "Decreases Risk"
            enriched_factors.append({
                "factor": k,
                "shap_value": v,
                "percentage_contribution": pct,
                "impact_direction": direction,
                "baseline_value": baselines.get(k, "N/A"),
                "observed_value": features.get(k, "N/A")
            })
            
        enriched_factors.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        
        top_driver = enriched_factors[0]["factor"]
        top_val = enriched_factors[0]["shap_value"]
        
        summary = (
            f"Prediction is primarily pushed {'towards erosion' if top_val > 0 else 'towards stability'} "
            f"by '{top_driver}' (SHAP: {top_val:+.3f}, {enriched_factors[0]['percentage_contribution']}% impact share), "
            f"followed by '{enriched_factors[1]['factor']}' ({enriched_factors[1]['percentage_contribution']}%)."
        )
        
        return {
            "base_value": explanation["base_value"],
            "prediction_probability": explanation["prediction_probability"],
            "risk_class": explanation["risk_class"],
            "shap_values": shap_values,
            "top_contributing_factors": enriched_factors,
            "interpretability_summary": summary
        }
