"""
CoastGuard AI - Kaggle Dataset Downloader
Attempts to download coastal erosion / shoreline vulnerability dataset from Kaggle.
If KAGGLE_USERNAME / KAGGLE_KEY are not present, gracefully falls back to synthetic dataset.
"""

import os
import sys

def download_kaggle():
    print("[INFO] Checking Kaggle API credentials...")
    kaggle_user = os.environ.get("KAGGLE_USERNAME")
    kaggle_key = os.environ.get("KAGGLE_KEY")
    
    if not kaggle_user or not kaggle_key:
        print("[WARNING] Kaggle credentials (KAGGLE_USERNAME, KAGGLE_KEY) not found in environment.")
        print("[FALLBACK] Executing synthetic generator (Azzara et al., 2026 calibrated parameters)...")
        from generate_synthetic_data import generate_coastal_dataset
        raw_path = generate_coastal_dataset(1200, "dataset/raw/coastal_raw.csv")
        print(f"[READY] Pipeline ready using synthetic dataset at: {raw_path}")
        return raw_path
    
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        dataset_name = "noaa/coastal-vulnerability-index"
        print(f"[DOWNLOADING] Pulling '{dataset_name}' from Kaggle...")
        os.makedirs("dataset/raw", exist_ok=True)
        api.dataset_download_files(dataset_name, path="dataset/raw", unzip=True)
        print("[SUCCESS] Dataset downloaded and unzipped into dataset/raw/")
        return "dataset/raw/coastal_raw.csv"
    except Exception as e:
        print(f"[ERROR] Kaggle download failed ({e}). Falling back to synthetic generator...")
        from generate_synthetic_data import generate_coastal_dataset
        return generate_coastal_dataset(1200, "dataset/raw/coastal_raw.csv")

if __name__ == "__main__":
    download_kaggle()
