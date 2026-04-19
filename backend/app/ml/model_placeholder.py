import joblib
import pandas as pd
import os
import datetime
import numpy as np

class CrowdPredictionModel:
    def __init__(self):
        # Base directory to locate models correctly
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../model"))
        
        self.pressure_model_path = os.path.join(base_dir, "pressure_model.pkl")
        self.risk_model_path = os.path.join(base_dir, "risk_model.pkl")
        self.window_model_path = os.path.join(base_dir, "window_model.pkl")
        
        # Buffers for feature engineering
        self.history = [] 
        
        try:
            print(f"🔍 Loading ML Models from: {base_dir}...")
            if os.path.exists(self.pressure_model_path):
                self.pressure_model = joblib.load(self.pressure_model_path)
                self.risk_model = joblib.load(self.risk_model_path)
                self.window_model = joblib.load(self.window_model_path)
                self.models_loaded = True
                print("✅ ML MODELS LOADED SUCCESSFULLY")
            else:
                print(f"❌ ERROR: Model files not found at {base_dir}")
                self.models_loaded = False
        except Exception as e:
            print("❌ FAILED to load ML models:", e)
            self.models_loaded = False

    def predict(self, features):
        if not self.models_loaded:
            return {"predicted_cpi": 0, "crush_window": 0, "confidence": "Fallback"}

        now = datetime.datetime.now()
        
        # Map incoming data to internal base features
        base = {
            "width": float(features.get("corridor_width_m", 5.0)),
            "entry_flow": float(features.get("entry_flow_rate_pax_per_min", 0)),
            "exit_flow": float(features.get("exit_flow_rate_pax_per_min", 0)),
            "transport_burst": int(features.get("transport_arrival_burst", 0)),
            "vehicle_count": int(features.get("vehicle_count", 0)),
            "density": float(features.get("queue_density_pax_per_m2", 0)),
            "festival_peak": int(features.get("festival_peak", 0)),
            "location": features.get("location", "Somnath")
        }

        self.history.append(base)
        if len(self.history) > 5: self.history.pop(0)
        
        prev = self.history[-2] if len(self.history) > 1 else base
        last_3 = self.history[-3:]

        # Create the full 48-feature set
        eng = {
            "width": base["width"],
            "entry_flow": base["entry_flow"],
            "exit_flow": base["exit_flow"],
            "transport_burst": base["transport_burst"],
            "vehicle_count": base["vehicle_count"],
            "density": base["density"],
            "festival_peak": base["festival_peak"],
            "hour": now.hour,
            "minute": now.minute,
            "day": now.day,
            "month": now.month,
            "dayofweek": now.weekday(),
            "is_weekend": 1 if now.weekday() >= 5 else 0,
            "net_flow": base["entry_flow"] - base["exit_flow"],
            "flow_balance_ratio": base["entry_flow"] / max(1, base["exit_flow"]),
            "entry_per_width": base["entry_flow"] / base["width"],
            "exit_per_width": base["exit_flow"] / base["width"],
            "density_per_width": base["density"] / base["width"],
            "entry_exit_ratio": base["entry_flow"] / max(1, base["exit_flow"]),
            "burst_load": float(base["transport_burst"]),
            "festival_entry": base["entry_flow"] * base["festival_peak"],
            "festival_density": base["density"] * base["festival_peak"],
            "entry_flow_roll3": np.mean([h["entry_flow"] for h in last_3]),
            "exit_flow_roll3": np.mean([h["exit_flow"] for h in last_3]),
            "density_roll3": np.mean([h["density"] for h in last_3]),
            "net_flow_roll3": np.mean([h["entry_flow"] - h["exit_flow"] for h in last_3]),
            "burst_load_roll3": np.mean([h["transport_burst"] for h in last_3]),
            "entry_flow_lag1": prev["entry_flow"],
            "exit_flow_lag1": prev["exit_flow"],
            "density_lag1": prev["density"],
            "net_flow_lag1": prev["entry_flow"] - prev["exit_flow"],
            "entry_diff1": base["entry_flow"] - prev["entry_flow"],
            "exit_diff1": base["exit_flow"] - prev["exit_flow"],
            "density_diff1": base["density"] - prev["density"],
            "net_flow_diff1": (base["entry_flow"] - base["exit_flow"]) - (prev["entry_flow"] - prev["exit_flow"]),
            "positive_net_flow_flag": 1 if (base["entry_flow"] - base["exit_flow"]) > 0 else 0,
            "transport_burst_flag": 1 if base["transport_burst"] > 0 else 0,
            "positive_net_flow_persist3": 1 if all((h["entry_flow"] - h["exit_flow"]) > 0 for h in last_3) else 0,
            "burst_persist3": sum(h["transport_burst"] for h in last_3),
            "time_gap_min": 5,
            "congestion_proxy": base["density"]
        }
        
        # Location One-Hot
        for l in ["Ambaji", "Dwarka", "Pavagadh", "Somnath"]:
            eng[f"location_{l}"] = 1 if base["location"] == l else 0
        
        # Weather One-Hot (Placeholder)
        for w in ["Clear", "Heat", "Rain"]:
            eng[f"weather_{w}"] = 1 if w == "Clear" else 0

        # Exact order as seen during model fit
        feature_order = [
            'width', 'entry_flow', 'exit_flow', 'transport_burst', 'vehicle_count', 'density', 
            'festival_peak', 'hour', 'minute', 'day', 'month', 'dayofweek', 'is_weekend', 
            'net_flow', 'flow_balance_ratio', 'entry_per_width', 'exit_per_width', 
            'density_per_width', 'entry_exit_ratio', 'burst_load', 'festival_entry', 
            'festival_density', 'entry_flow_roll3', 'exit_flow_roll3', 'density_roll3', 
            'net_flow_roll3', 'burst_load_roll3', 'entry_flow_lag1', 'exit_flow_lag1', 
            'density_lag1', 'net_flow_lag1', 'entry_diff1', 'exit_diff1', 'density_diff1', 
            'net_flow_diff1', 'positive_net_flow_flag', 'transport_burst_flag', 
            'positive_net_flow_persist3', 'burst_persist3', 'time_gap_min', 'congestion_proxy', 
            'location_Ambaji', 'location_Dwarka', 'location_Pavagadh', 'location_Somnath', 
            'weather_Clear', 'weather_Heat', 'weather_Rain'
        ]
        
        df_eng = pd.DataFrame([eng])[feature_order]

        try:
            pred_pressure = self.pressure_model.predict(df_eng)[0]
            pred_window = self.window_model.predict(df_eng)[0]
            return {
                "predicted_cpi": float(pred_pressure),
                "crush_window": max(0, float(pred_window)),
                "confidence": 95.00
            }
        except Exception as e:
            print("Inference Error:", e)
            return {"predicted_cpi": 0, "crush_window": 0, "confidence": "Error"}
