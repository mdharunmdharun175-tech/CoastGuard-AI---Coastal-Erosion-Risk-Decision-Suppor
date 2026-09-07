"""
CoastGuard AI - Hugging Face Hub Dataset Downloader
Attempts to download climate/coastal tabular datasets from Hugging Face Hub.
If HF_TOKEN is not configured, gracefully falls back to synthetic dataset.
"""

import os
import sys

def download_huggingface():
    print("[INFO] Checking Hugging Face API credentials / environment...")
    hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_HUB_TOKEN")
    
    if not hf_token:
        print("[WARNING] HF_TOKEN not set. Running synthetic fallback generator...")
        from generate_synthetic_data import generate_coastal_dataset
        raw_path = generate_coastal_dataset(1200, "dataset/raw/coastal_raw.csv")
        print(f"[READY] Pipeline populated with synthetic data at: {raw_path}")
        return raw_path
        
    try:
        from datasets import load_dataset
        print("[DOWNLOADING] Querying Hugging Face datasets for coastal climate records...")
        ds = load_dataset("climate-change/coastal-erosion-risk", split="train")
        df = ds.to_pandas()
        os.makedirs("dataset/raw", exist_ok=True)
        raw_path = "dataset/raw/coastal_raw.csv"
        df.to_csv(raw_path, index=False)
        print(f"[SUCCESS] Downloaded HF dataset ({len(df)} rows) to '{raw_path}'")
        return raw_path
    except Exception as e:
        print(f"[ERROR] Hugging Face download failed ({e}). Falling back to synthetic generator...")
        from generate_synthetic_data import generate_coastal_dataset
        return generate_coastal_dataset(1200, "dataset/raw/coastal_raw.csv")

if __name__ == "__main__":
    download_huggingface()
