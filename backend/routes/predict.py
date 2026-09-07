"""
CoastGuard AI - Prediction Route (POST /predict)
Receives physical transect features, outputs erosion probability & risk class.
"""

from fastapi import APIRouter, HTTPException
from backend.schemas.request_models import TransectInput, PredictionResponse
from backend.services.model_loader import ModelLoaderService

router = APIRouter()
model_loader = ModelLoaderService.get_instance()

@router.post("/predict", response_model=PredictionResponse)
async def predict_coastal_erosion(data: TransectInput):
    try:
        features = data.model_dump()
        result = model_loader.predict_susceptibility(features)
        
        return PredictionResponse(
            transect_id=data.transect_id,
            erosion_probability=result["erosion_probability"],
            risk_class=result["risk_class"],
            susceptibility_index=result["susceptibility_index"],
            model_used=result["model_used"],
            confidence_interval=result["confidence_interval"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
