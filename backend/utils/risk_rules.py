"""
CoastGuard AI - Decision Support & Coastal Mitigation Rule Engine
Maps identified high-impact SHAP risk factors into prioritized mitigation actions.
"""

from typing import List, Dict, Any

def generate_mitigation_recommendations(features: dict, top_factors: list, risk_class: str) -> dict:
    """
    Generates structured, domain-informed coastal engineering and ecological mitigation
    strategies based on the top SHAP drivers and ambient geomorphology.
    """
    actions = []
    slope = features.get("slope", 4.5)
    storm_energy = features.get("storm_energy", 180.0)
    storm_count = features.get("storm_count", 12)
    depth_of_closure = features.get("depth_of_closure", 10.0)
    geomorphology = str(features.get("geomorphology", "sandy")).lower()
    longshore = str(features.get("longshore_direction", "transitional")).lower()
    
    factor_names = [f.get("factor") if isinstance(f, dict) else str(f) for f in top_factors]
    
    # Rule 1: High Storm Wave Energy
    if storm_energy > 200.0 or "storm_energy" in factor_names[:2]:
        actions.append({
            "priority": 1,
            "category": "Nature-Based / Hybrid Infrastructure",
            "title": "Submerged Multi-Purpose Artificial Reef & Oyster Sill",
            "description": "Deploy low-crested submerged permeable geotextile or oyster reef breakwaters seaward of the breaker zone to dissipate up to 45% of incident wave energy before reaching the shoreline.",
            "triggered_by_factor": "storm_energy (Elevated wave energy flux)",
            "estimated_cost_tier": "$$$",
            "time_horizon": "Medium-Term (6-18 months)",
            "expected_risk_reduction_pct": 38.5
        })
    
    # Rule 2: Steep Beach Slope / Cliff Instability
    if slope > 6.0 or "slope" in factor_names[:2]:
        actions.append({
            "priority": len(actions) + 1,
            "category": "Nature-Based Coastal Engineering",
            "title": "Beach Profile Regrading & Living Shoreline Sills",
            "description": "Artificially regrade the steep upper beach berm slope with compatible coarser sediment and establish bio-engineered root-mat living shoreline vegetation to stabilize gradient collapse.",
            "triggered_by_factor": "slope (Steep cross-shore gradient)",
            "estimated_cost_tier": "$$",
            "time_horizon": "Immediate (1-3 months)",
            "expected_risk_reduction_pct": 26.0
        })
        
    # Rule 3: High Storm Frequency / Repetitive Impact
    if storm_count > 15 or "storm_count" in factor_names[:2]:
        actions.append({
            "priority": len(actions) + 1,
            "category": "Monitoring & Rapid Response",
            "title": "Automated Satellite InSAR & LiDAR Erosion Early Warning",
            "description": "Deploy continuous Sentinel-1/2 SAR optical change detection and post-storm rapid UAV LiDAR surveys to monitor critical sediment threshold drops.",
            "triggered_by_factor": "storm_count (High storm recurrence frequency)",
            "estimated_cost_tier": "$",
            "time_horizon": "Immediate (< 1 month)",
            "expected_risk_reduction_pct": 15.0
        })

    # Rule 4: Dune / Unconsolidated Sandy Substrate
    if geomorphology in ["dune", "sandy"] or "geomorphology" in factor_names[:2]:
        actions.append({
            "priority": len(actions) + 1,
            "category": "Ecological Restoration",
            "title": "Dune Core Nourishment with Marram Grass (Ammophila) Revegetation",
            "description": "Rebuild the primary foredune with sand-trapping timber brushwood fencing and plant native Ammophila arenaria to anchor windblown sediment and provide storm surge buffer.",
            "triggered_by_factor": "geomorphology (Unconsolidated dune/sand)",
            "estimated_cost_tier": "$$",
            "time_horizon": "Seasonal (3-6 months)",
            "expected_risk_reduction_pct": 32.0
        })

    # Rule 5: Divergent Longshore Drift
    if longshore == "divergent" or "longshore_direction" in factor_names[:2]:
        actions.append({
            "priority": len(actions) + 1,
            "category": "Sediment Management",
            "title": "Strategic Beach Nourishment & Littoral Sediment Bypass",
            "description": "Implement periodic beach nourishment (15,000-40,000 m³/year) coupled with an updrift pneumatic sand-bypass system to offset downdrift divergent sediment starvation.",
            "triggered_by_factor": "longshore_direction (Divergent transport deficit)",
            "estimated_cost_tier": "$$$",
            "time_horizon": "Continuous / Annual",
            "expected_risk_reduction_pct": 30.0
        })

    # Rule 6: Shallower Depth of Closure (Constrained active envelope)
    if depth_of_closure < 8.0:
        actions.append({
            "priority": len(actions) + 1,
            "category": "Policy & Spatial Planning",
            "title": "Coastal Setback Zone & Managed Realignment Buffer",
            "description": "Establish a mandatory 100-meter non-structural setback corridor along the transect to accommodate shoreline migration without infrastructure loss.",
            "triggered_by_factor": "depth_of_closure (Constrained nearshore sediment closure)",
            "estimated_cost_tier": "$",
            "time_horizon": "Policy / Long-Term",
            "expected_risk_reduction_pct": 45.0
        })

    # Fallback default if very low risk or no triggers
    if not actions:
        actions.append({
            "priority": 1,
            "category": "Routine Stewardship",
            "title": "Baseline Seasonal Profiling & Conservation Monitoring",
            "description": "Maintain biannual GPS cross-shore transect surveys. Currently, hydrodynamic forces are balanced and stable.",
            "triggered_by_factor": "All factors within resilient thresholds",
            "estimated_cost_tier": "$",
            "time_horizon": "Ongoing",
            "expected_risk_reduction_pct": 10.0
        })
        
    primary_threat = factor_names[0] if factor_names else "General hydrodynamic stress"
    
    rationale = (
        f"Based on XGBoost and TreeSHAP attribution, the transect exhibits '{risk_class}' vulnerability. "
        f"The primary driver exacerbating erosion susceptibility is '{primary_threat}'. "
        f"Implementing a combination of {actions[0]['category']} and targeted sediment management is projected "
        f"to substantially reduce cross-shore shoreline retreat."
    )
    
    return {
        "primary_threat": primary_threat,
        "risk_level": risk_class,
        "recommended_actions": actions,
        "decision_rationale": rationale
    }
