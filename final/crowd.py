import cv2
import numpy as np
import pandas as pd
import time
import random
import requests
from datetime import datetime
from ultralytics import YOLO
from shapely.geometry import Point, Polygon

# ==============================
# CONFIG (EDIT THIS)
# ==============================

VIDEO_PATH = r"C:\Users\tirth\Downloads\crowdVideo - LOOP - Videobolt.net.mp4"
LOCATION = "Somnath"
CORRIDOR_WIDTH = 2
QUEUE_AREA_M2 = 20

# (Dynamic setup based on frame size)
ENTRY_LINE = []
EXIT_LINE = []
ZONE_POLYGON = [] # The actual area between entry/exit where we count the crowd
zone_poly = None

CSV_PATH = r"C:\Users\tirth\Downloads\projects\ldce\stampede_predictor\final\output.csv"

WINDOW_SECONDS = 10  # Automatically send feed every 10 sec

# ==============================
# INIT
# ==============================

model = YOLO("yolov8n.pt")  # lightweight model

cap = cv2.VideoCapture(VIDEO_PATH)
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Dynamic setup based on frame size
# Entry near top (40%), Exit near bottom (70%)
ENTRY_LINE = [(0, int(frame_height * 0.4)), (frame_width, int(frame_height * 0.4))]
EXIT_LINE = [(0, int(frame_height * 0.7)), (frame_width, int(frame_height * 0.7))]

# The zone is defined exactly as the rectangle between these two vertical Y-marks
ZONE_POLYGON = [
    (0, int(frame_height * 0.4)),
    (frame_width, int(frame_height * 0.4)),
    (frame_width, int(frame_height * 0.7)),
    (0, int(frame_height * 0.7))
]
zone_poly = Polygon(ZONE_POLYGON)

# Tracking memory
entry_ids = set()
exit_ids = set()

window_entry_ids = set()
window_exit_ids = set()
instant_counts = [] # Stores count of people currently in the zone per frame

prev_positions = {}

start_time = time.time()

# ==============================
# HELPER FUNCTIONS
# ==============================

def check_line_cross(prev_y, curr_y, line_y):
    if prev_y < line_y and curr_y >= line_y:
        return "down"
    if prev_y > line_y and curr_y <= line_y:
        return "up"
    return None

def generate_transport_data():
    vehicle_count = random.randint(3, 10)
    burst = 1 if vehicle_count >= 7 else 0
    return vehicle_count, burst

def write_csv(row):
    df = pd.DataFrame([row])
    try:
        df.to_csv(CSV_PATH, mode='a', header=not pd.io.common.file_exists(CSV_PATH), index=False)
    except:
        df.to_csv(CSV_PATH, index=False)

# ==============================
# MAIN LOOP
# ==============================

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model.track(frame, persist=True, classes=[0])  # only person

    current_ids = set()
    centers = {}

    if results[0].boxes.id is not None:
        ids = results[0].boxes.id.cpu().numpy().astype(int)
        boxes = results[0].boxes.xyxy.cpu().numpy()

        for box, track_id in zip(boxes, ids):
            x1, y1, x2, y2 = box
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)

            centers[track_id] = (cx, cy)
            current_ids.add(track_id)

            # Draw
            cv2.circle(frame, (cx, cy), 4, (0, 255, 0), -1)
            cv2.putText(frame, str(track_id), (cx, cy), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)

    # ==============================
    # LINE CROSSING
    # ==============================

    entry_y = ENTRY_LINE[0][1]
    exit_y = EXIT_LINE[0][1]

    for track_id, (cx, cy) in centers.items():
        if track_id in prev_positions:
            prev_x, prev_y = prev_positions[track_id]

            # ENTRY
            direction = check_line_cross(prev_y, cy, entry_y)
            if direction == "down" and track_id not in entry_ids:
                window_entry_ids.add(track_id)
                entry_ids.add(track_id)

            # EXIT
            direction = check_line_cross(prev_y, cy, exit_y)
            if direction == "up" and track_id not in exit_ids:
                window_exit_ids.add(track_id)
                exit_ids.add(track_id)

        prev_positions[track_id] = (cx, cy)

    # ==============================
    # OCCUPANCY (Count all people between lines)
    # ==============================
    count_in_zone = 0
    for (cx, cy) in centers.values():
        if zone_poly.contains(Point(cx, cy)):
            count_in_zone += 1
    
    instant_counts.append(count_in_zone)

    # ==============================
    # WINDOW LOGIC (30 sec)
    # ==============================

    if time.time() - start_time >= WINDOW_SECONDS:

        duration_min = WINDOW_SECONDS / 60

        entry_flow = len(window_entry_ids) / duration_min
        exit_flow = len(window_exit_ids) / duration_min

        avg_occupancy = np.mean(instant_counts) if instant_counts else 0
        density = avg_occupancy / QUEUE_AREA_M2   # People per m2 in the zone

        vehicle_count, burst = generate_transport_data()

        row = {
            "timestamp": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
            "location": LOCATION,
            "corridor_width_m": CORRIDOR_WIDTH,
            "entry_flow_rate_pax_per_min": round(entry_flow, 2),
            "exit_flow_rate_pax_per_min": round(exit_flow, 2),
            "transport_arrival_burst": burst,
            "vehicle_count": vehicle_count,
            "queue_density_pax_per_m2": round(density, 2)
        }

        print("CSV ROW:", row)

        write_csv(row)

        try:
            res = requests.post("http://127.0.0.1:8000/predict", json=row)
            print("🚀 Successfully sent AI data to FastAPI! Status:", res.status_code)
        except Exception as e:
            print("❌ Failed connecting to backend. Is it running?", e)

        # reset window
        window_entry_ids.clear()
        window_exit_ids.clear()
        instant_counts.clear()
        start_time = time.time()

    # ==============================
    # DRAW LINES
    # ==============================

    cv2.line(frame, ENTRY_LINE[0], ENTRY_LINE[1], (255, 0, 0), 2)
    cv2.putText(frame, "ENTRY", ENTRY_LINE[0], cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,0,0), 2)

    cv2.line(frame, EXIT_LINE[0], EXIT_LINE[1], (0, 0, 255), 2)
    cv2.putText(frame, "EXIT", EXIT_LINE[0], cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,255), 2)

    # Draw zone polygon
    pts = np.array(ZONE_POLYGON, np.int32)
    overlay = frame.copy()
    cv2.fillPoly(overlay, [pts], (0, 255, 255))
    cv2.addWeighted(overlay, 0.2, frame, 0.8, 0, frame)
    cv2.polylines(frame, [pts], True, (0, 255, 255), 2)

    cv2.imshow("Crowd Analytics", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()