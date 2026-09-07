"""
CoastGuard AI - Explainability Route (POST /explain)
Receives physical transect features, returns exact TreeSHAP attributions and driver rankings.
"""

from fastapi import APIRouter, HTTPException
from backend.schemas.request_models import TransectInput, ExplainResponse
from backend.services.shap_service import ShapService

router = APIRouter()
shap_service = ShapService.get_instance()

@router.post("/explain", response_model=ExplainResponse)
async def explain_coastal_prediction(data: TransectInput):
    try:
        features = data.model_dump()
        result = shap_service.explain_sample(features)
        
        return ExplainResponse(
            transect_id=data.transect_id,
            base_value=result["base_value"],
            prediction_probability=result["prediction_probability"],
            risk_class=result["risk_class"],
            shap_values=result["shap_values"],
            top_contributing_factors=result["top_contributing_factors"],
            interpretability_summary=result["interpretability_summary"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability computation failed: {str(e)}")
