import joblib
import os

model_path = r"c:\Users\tirth\Downloads\projects\ld final\model\pressure_model.pkl"
try:
    model = joblib.load(model_path)
    if hasattr(model, 'feature_names_in_'):
        print("Feature Names In:", list(model.feature_names_in_))
    else:
        print("Model does not have feature_names_in_ attribute.")
except Exception as e:
    print("Error:", e)
