"""
CoastGuard AI - ML Preprocessing Pipeline
Cleans data, encodes categorical features, and creates 70/30 train/test split
mirroring Azzara et al. (2026) calibration / validation methodology.
"""

import os
import csv
import json
import math

# Feature column definitions
NUMERICAL_FEATURES = ["slope", "storm_count", "storm_energy", "depth_of_closure"]
CATEGORICAL_FEATURES = ["geomorphology", "longshore_direction"]
TARGET_COLUMN = "label"

# Categorical mapping dictionaries for deterministic encoding
GEOMORPHOLOGY_MAP = {
    "sandy": 0,
    "gravel": 1,
    "dune": 2,
    "riverbank": 3,
    "defence structure": 4
}

LONGSHORE_MAP = {
    "convergent": 0,
    "transitional": 1,
    "divergent": 2
}

def load_and_preprocess(raw_csv_path="dataset/raw/coastal_raw.csv", processed_csv_path="dataset/processed/coastal_processed.csv", test_size=0.3, random_seed=42):
    if not os.path.exists(raw_csv_path):
        print(f"[WARN] Raw data '{raw_csv_path}' not found. Generating synthetic raw data...")
        from dataset.generate_synthetic_data import generate_coastal_dataset
        generate_coastal_dataset(1200, raw_csv_path)

    os.makedirs(os.path.dirname(processed_csv_path), exist_ok=True)
    os.makedirs("ml/models", exist_ok=True)

    records = []
    with open(raw_csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Parse & Clean
            try:
                slope = float(row["slope"])
                storm_count = float(row["storm_count"])
                storm_energy = float(row["storm_energy"])
                depth_of_closure = float(row["depth_of_closure"])
                
                geo_raw = row["geomorphology"].strip().lower()
                geo_encoded = GEOMORPHOLOGY_MAP.get(geo_raw, 0)
                
                long_raw = row["longshore_direction"].strip().lower()
                long_encoded = LONGSHORE_MAP.get(long_raw, 1)
                
                label = int(row["label"])
                
                records.append({
                    "transect_id": row.get("transect_id", f"TRX-{len(records)+1}"),
                    "region": row.get("region", "Coastal Zone"),
                    "latitude": float(row.get("latitude", 42.0)),
                    "longitude": float(row.get("longitude", 14.0)),
                    "slope": slope,
                    "storm_count": storm_count,
                    "storm_energy": storm_energy,
                    "depth_of_closure": depth_of_closure,
                    "geomorphology": geo_raw,
                    "geomorphology_encoded": geo_encoded,
                    "longshore_direction": long_raw,
                    "longshore_encoded": long_encoded,
                    "label": label
                })
            except Exception as e:
                continue

    # Save processed CSV
    fieldnames = list(records[0].keys())
    with open(processed_csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"[PREPROCESS] Processed {len(records)} records. Saved to '{processed_csv_path}'")

    # Split Train/Test (70/30)
    import random
    random.seed(random_seed)
    shuffled = list(records)
    random.shuffle(shuffled)
    
    split_idx = int(len(shuffled) * (1.0 - test_size))
    train_data = shuffled[:split_idx]
    test_data = shuffled[split_idx:]
    
    print(f"[SPLIT] Calibration (Train 70%): {len(train_data)} | Validation (Test 30%): {len(test_data)}")
    
    return train_data, test_data

if __name__ == "__main__":
    load_and_preprocess()
