from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import uuid
import datetime
import asyncio
import pandas as pd
import os
import random

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
logs_db = []

# Global ML Model Instance
ml_model = CrowdPredictionModel()

@app.get("/post_mortem")
async def generate_post_mortem():
    if len(logs_db) < 10:
        return {"status": "error", "message": "Insufficient data"}
    
    # Take the last 15 events
    recent_events = logs_db[-15:]
    
    timeline_data = []
    for e in recent_events:
        payload = e["payload"]
        time_str = e["timestamp"].split("T")[1][:8]
        risk = payload.get("risk", "Unknown")
        cpi = payload.get("cpi", 0)
        action = payload.get("ai_coordination", {}).get("alert_summary", "")
        timeline_data.append(f"[{time_str}] CPI: {cpi}, Risk: {risk}, AI Action: {action}")
        
    prompt = f"""
    You are the Senior Analyst for the Stampede Sentinel system.
    Review the following historical crowd telemetry timeline from the last few minutes:
    
    {chr(10).join(timeline_data)}
    
    Provide a professional post-mortem structural analysis. Include:
    1. SUMMARY: What happened? Was it a genuine crush build-up or a self-resolving surge?
    2. ACTIONS TAKEN: What did the local sectors (Police/Temple/Transport) do?
    3. EFFECTIVENESS: How did their actions affect the Pressure Index (CPI)?
    4. AI INSIGHT: What could have been done better based on the predictive model?
    
    Format nicely as plain text without Markdown asterisks. Keep sizes concise.
    """
    
    try:
        from groq import Groq
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a highly analytical crowd disaster prevention AI system."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=600
        )
        report = completion.choices[0].message.content
        return {"status": "success", "report": report}
    except Exception as e:
        return {"status": "error", "message": str(e)}

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

                # perform prediction
                prediction = ml_model.predict(features)
                predicted_cpi = prediction['predicted_cpi']
                cpi = float(calculate_cpi(features))

                # ⚠️ Force Risk Logic (For Demo Item #7)
                if getattr(self, "force_risk", False):
                    cpi = 85.0 + (random.random() * 10)
                    predicted_cpi = 92.0
                    features['queue_density_pax_per_m2'] = 5.8
                    features['entry_flow_rate_pax_per_min'] = 140.0
                
                risk = determine_risk_level(cpi)
                buildup = determine_buildup(features, cpi) 
                predicted_window_min = float(prediction['crush_window'])
                if getattr(self, "force_risk", False):
                    predicted_window_min = 4.0
                    buildup = "Genuine"
                
                confidence = prediction['confidence']
                
                # 🛡️ Prolonged High Risk Tracking
                if risk in ["High", "Severe", "Critical"]:
                    self.high_risk_counters[websocket] = self.high_risk_counters.get(websocket, 0) + 1
                else:
                    self.high_risk_counters[websocket] = 0
                
                # Dynamic Velocity calculation
                flow_vel = features.get('entry_flow_rate_pax_per_min', 0) / 60.0

                print(f"📊 [{temple.upper()}] CPI: {cpi:.2f} | PRED: {predicted_cpi:.2f} | FORCED: {getattr(self, 'force_risk', False)}")

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

                # 5. Log event to Archive (REQUIRED FOR REPLAY)
                archive_entry = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.datetime.now().isoformat(),
                    "payload": response_payload
                }
                logs_db.append(archive_entry)
                if len(logs_db) > 500: logs_db.pop(0)

                await websocket.send_json({
                    "type": "crowd_update",
                    "data": response_payload
                })

                await asyncio.sleep(2) # Faster simulation for better experience
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"Simulation error for {temple}: {e}")

import subprocess
import sys
# Global state for tracking the one active simulation task globally
sim_manager = SimulationManager()
global_sim_task = None
global_video_proc = None

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global global_sim_task, global_video_proc
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "start_simulation":
                # Globally enforce a SINGLE active simulation across all tabs/connections
                if global_sim_task:
                    global_sim_task.cancel()
                    global_sim_task = None
                
                if global_video_proc:
                    try:
                        global_video_proc.terminate()
                    except:
                        pass
                    global_video_proc = None
                
                # Clear historical logs so you don't mix datasets (e.g., Somnath & Pavagadh clash)
                logs_db.clear()
                
                temple = message.get("temple", "somnath")
                mode = message.get("mode", "dataset")

                if mode == "video":
                    print(f"🎬 Starting LIVE VIDEO MODE for {temple}")
                    script_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "final", "crowd.py")
                    global_video_proc = subprocess.Popen([sys.executable, script_path])
                else:
                    global_sim_task = asyncio.create_task(sim_manager.run_simulation(websocket, temple))
                
            elif message.get("type") == "toggle_force_risk":
                status = message.get("status", False)
                sim_manager.force_risk = status
                print(f"⚠️ NEAR-CRUSH SIMULATION {'ENABLED' if status else 'DISABLED'}")

            elif message.get("type") == "stop_simulation":
                if global_sim_task:
                    global_sim_task.cancel()
                    global_sim_task = None
                if global_video_proc:
                    try:
                        global_video_proc.terminate()
                    except:
                        pass
                    global_video_proc = None

    except WebSocketDisconnect:
        if global_sim_task:
            global_sim_task.cancel()
            global_sim_task = None
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
        if global_sim_task:
            global_sim_task.cancel()
            global_sim_task = None
        manager.disconnect(websocket)
