"""
CoastGuard AI - FastAPI Application Entrypoint
Serves coastal erosion susceptibility predictions, TreeSHAP explainability, and decision support.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.predict import router as predict_router
from backend.routes.explain import router as explain_router
from backend.routes.recommend import router as recommend_router

app = FastAPI(
    title="CoastGuard AI - Coastal Erosion Risk & Decision Support API",
    description="Extended research implementation of Azzara et al. (2026) using XGBoost, Random Forest, and SHAP explainability.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(predict_router, tags=["Prediction"])
app.include_router(explain_router, tags=["Explainability"])
app.include_router(recommend_router, tags=["Decision Support"])

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CoastGuard AI FastAPI Backend",
        "models_ready": True,
        "explainer": "TreeSHAP v0.42+"
    }

@app.get("/")
async def root():
    return {
        "message": "CoastGuard AI API is running. Access interactive docs at /docs",
        "endpoints": ["/predict", "/explain", "/recommend", "/health"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
