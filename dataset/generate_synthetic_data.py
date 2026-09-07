"""
CoastGuard AI - Synthetic Coastal Erosion Dataset Generator
Mirrors the 6 core physical predictors from Azzara et al. (2026, Geomorphology)
Generates realistic coastal transects with physical erosion susceptibility labels.
"""

import os
import random
import csv
import math

def generate_coastal_dataset(num_samples=1200, output_raw_path="dataset/raw/coastal_raw.csv"):
    os.makedirs(os.path.dirname(output_raw_path), exist_ok=True)
    
    # Representative coastal regions with realistic coordinates
    regions = [
        {"name": "Adriatic Central Coast (Abruzzo)", "lat_base": 42.35, "lon_base": 14.40},
        {"name": "Tyrrhenian Bay (Campania)", "lat_base": 40.85, "lon_base": 14.26},
        {"name": "Ligurian Littoral", "lat_base": 44.30, "lon_base": 9.20},
        {"name": "Ionian Barrier Spit", "lat_base": 39.50, "lon_base": 16.50},
        {"name": "North Sea Barrier Island", "lat_base": 53.50, "lon_base": 7.20},
        {"name": "Outer Banks Transect", "lat_base": 35.80, "lon_base": -75.60},
        {"name": "California Central Coast", "lat_base": 36.95, "lon_base": -122.05},
        {"name": "Gold Coast Spit", "lat_base": -27.95, "lon_base": 153.42}
    ]
    
    geomorphologies = ["sandy", "gravel", "dune", "riverbank", "defence structure"]
    geo_vulnerability = {
        "sandy": 0.35,
        "dune": 0.45,
        "riverbank": 0.30,
        "gravel": -0.15,
        "defence structure": -0.40
    }
    
    longshore_dirs = ["convergent", "transitional", "divergent"]
    longshore_vulnerability = {
        "divergent": 0.35,      # sediment is pulled away
        "transitional": 0.05,
        "convergent": -0.30     # sediment accumulates
    }

    rows = []
    random.seed(42)

    for i in range(1, num_samples + 1):
        region = random.choice(regions)
        transect_id = f"TRX-{i:04d}"
        
        # Coordinate jitter along coastal strip
        lat = round(region["lat_base"] + random.uniform(-0.15, 0.15), 5)
        lon = round(region["lon_base"] + random.uniform(-0.15, 0.15), 5)
        
        # Physical Predictors (based on Azzara et al., 2026)
        # 1. Slope (%): Low slope beaches dissipate waves; steep beaches or unstable cliffs have high erosion
        slope = round(random.uniform(0.8, 12.5), 2)
        
        # 2. Storm count (per period): 1 to 32 storms
        storm_count = random.randint(1, 28)
        
        # 3. Storm energy (kW/m): Wave energy flux
        storm_energy = round(random.uniform(20.0, 420.0), 1)
        
        # 4. Depth of closure (m): shallow depth of closure limits nearshore active sediment budget
        depth_of_closure = round(random.uniform(4.5, 17.5), 2)
        
        # 5. Geomorphology
        geomorphology = random.choices(
            geomorphologies, 
            weights=[0.38, 0.18, 0.22, 0.12, 0.10]
        )[0]
        
        # 6. Longshore transport direction
        longshore_direction = random.choices(
            longshore_dirs,
            weights=[0.30, 0.40, 0.30]
        )[0]
        
        # Latent Susceptibility Index (Physical formula + non-linear interaction terms)
        # Higher slope + higher storm energy + divergent longshore + dune/sandy = extreme erosion risk
        z_slope = (slope - 4.5) / 3.0
        z_storm = (storm_count - 12) / 6.0
        z_energy = (storm_energy - 180) / 90.0
        z_doc = (10.0 - depth_of_closure) / 3.5  # shallower = more vulnerable
        
        geo_factor = geo_vulnerability[geomorphology]
        longshore_factor = longshore_vulnerability[longshore_direction]
        
        # Interaction effect: high storm energy + steep slope amplifies erosion
        interaction = 0.35 * (z_energy * z_slope) if (z_energy > 0 and z_slope > 0) else 0.0
        
        logit = (
            -0.45 
            + 0.55 * z_energy 
            + 0.42 * z_storm 
            + 0.38 * z_slope 
            + 0.28 * z_doc 
            + 0.65 * geo_factor 
            + 0.50 * longshore_factor 
            + interaction
            + random.gauss(0, 0.35) # environmental stochasticity
        )
        
        prob = 1.0 / (1.0 + math.exp(-logit))
        label = 1 if prob >= 0.50 else 0  # 1 = eroding, 0 = stable/accreting
        
        rows.append({
            "transect_id": transect_id,
            "region": region["name"],
            "latitude": lat,
            "longitude": lon,
            "slope": slope,
            "storm_count": storm_count,
            "storm_energy": storm_energy,
            "depth_of_closure": depth_of_closure,
            "geomorphology": geomorphology,
            "longshore_direction": longshore_direction,
            "true_probability": round(prob, 4),
            "label": label
        })
        
    fieldnames = [
        "transect_id", "region", "latitude", "longitude", 
        "slope", "storm_count", "storm_energy", "depth_of_closure", 
        "geomorphology", "longshore_direction", "true_probability", "label"
    ]
    
    with open(output_raw_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"[SUCCESS] Generated {len(rows)} coastal transects in '{output_raw_path}'")
    return output_raw_path

if __name__ == "__main__":
    generate_coastal_dataset()
