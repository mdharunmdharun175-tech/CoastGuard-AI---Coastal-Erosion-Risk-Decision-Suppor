"""
CoastGuard AI - Pydantic Request & Response Schemas
Type-safe schemas for prediction, SHAP explanation, and mitigation recommendation endpoints.
"""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class TransectInput(BaseModel):
    slope: float = Field(..., description="Coastal slope percentage (e.g. 5.2%)", ge=0.1, le=45.0)
    storm_count: int = Field(..., description="Number of storms during calibration period", ge=0, le=100)
    storm_energy: float = Field(..., description="Wave energy flux density (kW/m)", ge=1.0, le=1000.0)
    depth_of_closure: float = Field(..., description="Depth of closure in meters", ge=1.0, le=50.0)
    geomorphology: str = Field("sandy", description="Substrate: sandy, gravel, dune, riverbank, defence structure")
    longshore_direction: str = Field("transitional", description="Drift pattern: convergent, transitional, divergent")
    transect_id: Optional[str] = Field(None, description="Optional transect identifier")
    location_name: Optional[str] = Field(None, description="Optional zone name")
    latitude: Optional[float] = Field(None, description="Latitude")
    longitude: Optional[float] = Field(None, description="Longitude")

class PredictionResponse(BaseModel):
    transect_id: Optional[str] = None
    erosion_probability: float
    risk_class: str  # Low, Medium, High, Very High
    susceptibility_index: float
    model_used: str
    confidence_interval: List[float]

class FactorContribution(BaseModel):
    factor: str
    shap_value: float
    percentage_contribution: float
    impact_direction: str  # "Increases Risk" or "Decreases Risk"
    baseline_value: Any
    observed_value: Any

class ExplainResponse(BaseModel):
    transect_id: Optional[str] = None
    base_value: float
    prediction_probability: float
    risk_class: str
    shap_values: Dict[str, float]
    top_contributing_factors: List[FactorContribution]
    interpretability_summary: str

class MitigationAction(BaseModel):
    priority: int
    category: str  # Nature-Based, Hard Engineering, Policy/Planning, Monitoring
    title: str
    description: str
    triggered_by_factor: str
    estimated_cost_tier: str  # $, $$, $$$, $$$$
    time_horizon: str  # Immediate, Medium-Term, Long-Term
    expected_risk_reduction_pct: float

class RecommendRequest(BaseModel):
    features: TransectInput
    top_factors: Optional[List[Dict[str, Any]]] = None
    risk_class: Optional[str] = None

class RecommendResponse(BaseModel):
    transect_id: Optional[str] = None
    primary_threat: str
    risk_level: str
    recommended_actions: List[MitigationAction]
    decision_rationale: str
