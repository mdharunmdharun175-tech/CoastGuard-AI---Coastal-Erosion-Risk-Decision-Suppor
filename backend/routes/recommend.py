"""
CoastGuard AI - Decision Support Recommendation Route (POST /recommend)
Translates SHAP top contributing risk factors into actionable coastal protection recommendations.
"""

from fastapi import APIRouter, HTTPException
from backend.schemas.request_models import RecommendRequest, RecommendResponse, MitigationAction
from backend.utils.risk_rules import generate_mitigation_recommendations
from backend.services.shap_service import ShapService

router = APIRouter()
shap_service = ShapService.get_instance()

@router.post("/recommend", response_model=RecommendResponse)
async def recommend_mitigation_actions(req: RecommendRequest):
    try:
        features = req.features.model_dump()
        
        # If top_factors not explicitly provided, compute SHAP live
        if not req.top_factors or not req.risk_class:
            explanation = shap_service.explain_sample(features)
            top_factors = explanation["top_contributing_factors"]
            risk_class = explanation["risk_class"]
        else:
            top_factors = req.top_factors
            risk_class = req.risk_class
            
        result = generate_mitigation_recommendations(features, top_factors, risk_class)
        
        actions = [
            MitigationAction(
                priority=a["priority"],
                category=a["category"],
                title=a["title"],
                description=a["description"],
                triggered_by_factor=a["triggered_by_factor"],
                estimated_cost_tier=a["estimated_cost_tier"],
                time_horizon=a["time_horizon"],
                expected_risk_reduction_pct=a["expected_risk_reduction_pct"]
            )
            for a in result["recommended_actions"]
        ]
        
        return RecommendResponse(
            transect_id=req.features.transect_id,
            primary_threat=result["primary_threat"],
            risk_level=result["risk_level"],
            recommended_actions=actions,
            decision_rationale=result["decision_rationale"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine failed: {str(e)}")
