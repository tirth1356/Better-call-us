import pandas as pd
import requests
import time
import os
from datetime import datetime

# CONFIG
CSV_PATH = os.path.join(os.path.dirname(__file__), "model", "testing", "somnath_10k_dataset.csv")
BACKEND_URL = "http://127.0.0.1:8000/predict"
DELAY_SECONDS = 5.0  # Controls how fast the simulation runs

def run_simulation():
    if not os.path.exists(CSV_PATH):
        print(f"Error: Dataset not found at {CSV_PATH}")
        return

    print(f"Loading dataset: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    
    print(f"Starting Simulation with {len(df)} rows. Speed: 1 update every {DELAY_SECONDS}s")
    print("Graph in frontend should start populating now...")

    for index, row in df.iterrows():
        # Prepare payload exactly as FastAPI expects (CrowdData model)
        payload = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), # Use current time for graph sync
            "location": str(row["location"]),
            "corridor_width_m": float(row["corridor_width_m"]),
            "entry_flow_rate_pax_per_min": float(row["entry_flow_rate_pax_per_min"]),
            "exit_flow_rate_pax_per_min": float(row["exit_flow_rate_pax_per_min"]),
            "transport_arrival_burst": int(row["transport_arrival_burst"]),
            "vehicle_count": int(row["vehicle_count"]),
            "queue_density_pax_per_m2": float(row["queue_density_pax_per_m2"]),
            "festival_peak": int(row["festival_peak"])
        }

        try:
            response = requests.post(BACKEND_URL, json=payload)
            if response.status_code == 200:
                data = response.json()
                print(f"Row {index}: CPI={data['cpi']} | Risk={data['risk']} | Window={data['predicted_window_min']}m")
            else:
                print(f"Failed at row {index}: {response.status_code}")
        except Exception as e:
            print(f"Connection Error: {e}")
            break

        time.sleep(DELAY_SECONDS)

if __name__ == "__main__":
    run_simulation()
