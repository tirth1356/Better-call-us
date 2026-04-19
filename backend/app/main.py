from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import uuid
import datetime
import asyncio
import pandas as pd
import os

from .ml.model_placeholder import CrowdPredictionModel
from .services.cpi_engine import calculate_cpi, determine_risk_level, determine_buildup
from .services.ai_coordinator import get_agency_coordination

app = FastAPI(title="Stampede Sentinel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for hackathon simplicity
alerts_db = []
logs_db = [
    {
        "id": str(uuid.uuid4()),
        "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=45)).isoformat(),
        "payload": {
            "cpi": 4.2, "risk": "Moderate", "predicted_cpi": 3.8, "predicted_window_min": 25, "buildup": "Normal", "confidence": "88%",
            "raw_data": {"timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=45)).isoformat(), "location": "Somnath"},
            "ai_coordination": {"alert_summary": "Morning crowd surge handled via alternate exits."}
        }
    },
    {
        "id": str(uuid.uuid4()),
        "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=30)).isoformat(),
        "payload": {
            "cpi": 8.7, "risk": "Severe", "predicted_cpi": 9.2, "predicted_window_min": 8, "buildup": "Genuine", "confidence": "94%",
            "raw_data": {"timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=30)).isoformat(), "location": "Somnath"},
            "ai_coordination": {"alert_summary": "Sector 3 bottleneck detected. Police deployment recommended."}
        }
    },
     {
        "id": str(uuid.uuid4()),
        "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=10)).isoformat(),
        "payload": {
            "cpi": 5.1, "risk": "Normal", "predicted_cpi": 4.2, "predicted_window_min": 40, "buildup": "Normal", "confidence": "91%",
            "raw_data": {"timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=10)).isoformat(), "location": "Somnath"},
            "ai_coordination": {"alert_summary": "Situation stabilized. Normal operations resumed."}
        }
    }
]

# Global ML Model Instance
ml_model = CrowdPredictionModel()

# WebSocket Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()


class CrowdData(BaseModel):
    timestamp: str
    location: str
    corridor_width_m: float
    entry_flow_rate_pax_per_min: float
    exit_flow_rate_pax_per_min: float
    transport_arrival_burst: int
    vehicle_count: int
    queue_density_pax_per_m2: float
    festival_peak: int = 0

class AckData(BaseModel):
    alert_id: str
    agency: str


@app.post("/predict")
async def predict_risk(data: CrowdData):
    features = data.dict()
    
    # 1. Compute CPI (Engine)
    cpi = calculate_cpi(features)
    risk = determine_risk_level(cpi)
    buildup = determine_buildup(features, cpi)
    features["cpi"] = cpi

    # 2. Get Prediction (ML Hook)
    prediction = ml_model.predict(features)
    predicted_cpi = prediction["predicted_cpi"]
    predicted_window_min = prediction["crush_window"]
    confidence = prediction["confidence"]

    # 3. Check for Alerts (Only trigger for Severe/Critical to avoid nuisance alarms)
    alert_triggered = False
    new_alert = None
    if risk in ["Severe", "Critical"] and predicted_window_min <= 10 and buildup == "Genuine":
        alert_triggered = True
        new_alert = {
            "alert_id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now().isoformat(),
            "location": data.location,
            "risk_level": risk,
            "predicted_window_min": predicted_window_min,
            "status": "Active",
            "acknowledgments": []
        }
        alerts_db.append(new_alert)

    response_payload = {
        "cpi": round(float(cpi), 2),
        "predicted_cpi": round(float(predicted_cpi), 2),
        "risk": risk,
        "predicted_window_min": round(float(predicted_window_min), 2),
        "confidence": round(float(confidence), 2) if isinstance(confidence, (int, float)) else confidence,
        "buildup": buildup,
        "raw_data": {k: (round(float(v), 2) if isinstance(v, (int, float)) else v) for k, v in features.items()},
        "alert": None
    }

    # 3. Get AI Coordination (Groq Llama 3.1)
    ai_coordination = get_agency_coordination(response_payload)
    response_payload["ai_coordination"] = ai_coordination

    # 4. Check for Alerts (Only trigger for Severe/Critical to avoid nuisance alarms)
    alert_triggered = False
    new_alert = None
    if risk in ["Severe", "Critical"] and predicted_window_min <= 10 and buildup == "Genuine":
        alert_triggered = True
        new_alert = {
            "alert_id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now().isoformat(),
            "location": data.location,
            "risk_level": risk,
            "predicted_window_min": predicted_window_min,
            "status": "Active",
            "acknowledgments": [],
            "ai_instruction": ai_coordination.get("alert_summary", "Crush risk detected.")
        }
        alerts_db.append(new_alert)
        response_payload["alert"] = new_alert

    # 5. Log event to Archive
    archive_entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.datetime.now().isoformat(),
        "payload": response_payload
    }
    logs_db.append(archive_entry)
    if len(logs_db) > 500: logs_db.pop(0)

    # 6. Broadcast via WebSockets
    ws_message = {
        "type": "crowd_update",
        "data": response_payload
    }
    await manager.broadcast(ws_message)

    return response_payload

@app.get("/archive")
async def get_archive():
    return {"history": logs_db}

@app.get("/events")
async def get_events():
    # Helper for legacy replay components
    return {"events": [l["payload"] for l in logs_db]}


@app.post("/acknowledge")
async def acknowledge_alert(data: AckData):
    for alert in alerts_db:
        if alert["alert_id"] == data.alert_id:
            ack_info = {
                "agency": data.agency,
                "ack_time": datetime.datetime.now().isoformat()
            }
            alert["acknowledgments"].append(ack_info)
            alert["status"] = "Acknowledged"
            
            # Broadcast update
            await manager.broadcast({
                "type": "alert_ack",
                "data": alert
            })
            return {"status": "success", "alert": alert}
    return {"status": "error", "message": "Alert not found"}


class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    # Use the existing AI coordinator but with a custom prompt for what-if scenarios
    from .services.ai_coordinator import get_agency_coordination
    
    # Use a cleaner prompt instruction to avoid markdown
    prompt = f"Hypothetical Scenario: {request.message}. Provide a professional, tactical response. DO NOT USE MARKDOWN BOLDING (**). Return plain text only. Be concise (max 80 words)."
    
    from groq import Groq
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are the Observatory Tactical Sentinel. You coordinate emergency responses for temple crowd disasters. Provide clear, plain-text instructions without any markdown formatting."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=256
    )
    
    return {"response": completion.choices[0].message.content}




# In-memory session tracking
class SimulationManager:
    def __init__(self):
        self.active_tasks = {}
        self.high_risk_counters = {} # WebSocket -> Counter

    async def run_simulation(self, websocket: WebSocket, temple: str):
        file_map = {
            "somnath": "model/testing/somnath_10k_dataset.csv",
            "ambaji": "model/testing/ambaji_10k_dataset.csv",
            "dwarka": "model/testing/dwarka_10k_dataset.csv",
            "pavagadh": "model/testing/pavagadh_10k_dataset.csv"
        }
        
        file_path = file_map.get(temple.lower())
        if not file_path or not os.path.exists(file_path):
            print(f"Dataset not found for {temple}: {file_path}")
            return

        print(f"🚀 Starting Dynamic Simulation for {temple} using {file_path}")
        df = pd.read_csv(file_path)
        
        try:
            for index, row in df.iterrows():
                features = {}
                for key, val in row.to_dict().items():
                    try:
                        features[key] = float(val)
                    except (ValueError, TypeError):
                        features[key] = val
                features['timestamp'] = datetime.datetime.now().isoformat()
                features['location'] = temple.capitalize() 

                # Perform prediction logic directly with model instance
                prediction = ml_model.predict(features)
                predicted_cpi = prediction['predicted_cpi']
                
                cpi = float(calculate_cpi(features)) # Ensure float
                risk = determine_risk_level(cpi)
                buildup = determine_buildup(features, cpi) 
                predicted_window_min = float(prediction['crush_window'])
                confidence = prediction['confidence']
                
                # 🛡️ Prolonged High Risk Tracking
                if risk in ["High", "Severe", "Critical"]:
                    self.high_risk_counters[websocket] = self.high_risk_counters.get(websocket, 0) + 1
                else:
                    self.high_risk_counters[websocket] = 0
                
                # Dynamic Velocity calculation: (entry_flow / 60) for m/s approximation
                flow_vel = features.get('entry_flow_rate_pax_per_min', 0) / 60.0

                print(f"📊 [{temple.upper()}] CPI: {cpi:.2f} | PRED: {predicted_cpi:.2f} | COUNTER: {self.high_risk_counters[websocket]}")

                response_payload = {
                    "cpi": round(cpi, 2),
                    "predicted_cpi": round(float(predicted_cpi), 2),
                    "risk": risk,
                    "predicted_window_min": round(predicted_window_min, 2),
                    "confidence": round(float(confidence), 2) if isinstance(confidence, (int, float)) else confidence,
                    "buildup": buildup,
                    "location": temple.capitalize(),
                    "flow_velocity": round(flow_vel, 2),
                    "raw_data": {k: (round(float(v), 2) if isinstance(v, (int, float)) else v) for k, v in features.items()},
                    "alert": None
                }

                # AI Coordination
                ai_coordination = get_agency_coordination(response_payload)
                response_payload["ai_coordination"] = ai_coordination

                # 🚨 Alert Trigger (Immediate Risk OR Prolonged High Risk)
                is_prolonged = self.high_risk_counters.get(websocket, 0) >= 5
                if (risk in ["Severe", "Critical"] and predicted_window_min <= 10) or is_prolonged:
                    instruction = ai_coordination.get("alert_summary", "Crush risk alert.")
                    if is_prolonged:
                        instruction = "🛑 PROLONGED HIGH RISK: " + instruction

                    new_alert = {
                        "alert_id": str(uuid.uuid4()),
                        "timestamp": datetime.datetime.now().isoformat(),
                        "location": temple.capitalize(),
                        "risk_level": "PROLONGED" if is_prolonged and risk != "Critical" else risk,
                        "predicted_window_min": predicted_window_min,
                        "status": "Active",
                        "acknowledgments": [],
                        "ai_instruction": instruction
                    }
                    response_payload["alert"] = new_alert

                await websocket.send_json({
                    "type": "crowd_update",
                    "data": response_payload
                })

                await asyncio.sleep(5)
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"Simulation error for {temple}: {e}")

import subprocess
video_proc = None
sim_manager = SimulationManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global video_proc
    await manager.connect(websocket)
    sim_task = None
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "start_simulation":
                # Stop existing task if any
                if sim_task:
                    sim_task.cancel()
                    sim_task = None
                
                if video_proc:
                    try:
                        video_proc.terminate()
                    except:
                        pass
                    video_proc = None
                
                temple = message.get("temple", "somnath")
                mode = message.get("mode", "dataset")

                if mode == "video":
                    print(f"🎬 Starting LIVE VIDEO MODE for {temple}")
                    script_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "final", "crowd.py")
                    video_proc = subprocess.Popen(["python", script_path])
                else:
                    sim_task = asyncio.create_task(sim_manager.run_simulation(websocket, temple))
                
            elif message.get("type") == "stop_simulation":
                if sim_task:
                    sim_task.cancel()
                    sim_task = None
                if video_proc:
                    try:
                        video_proc.terminate()
                    except:
                        pass
                    video_proc = None

    except WebSocketDisconnect:
        if sim_task:
            sim_task.cancel()
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        if sim_task:
            sim_task.cancel()
        manager.disconnect(websocket)
