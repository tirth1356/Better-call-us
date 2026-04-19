# alertX 🛡️

**Stampede Sentinel** is a high-fidelity, real-time crowd pressure intelligence and early-warning system designed for high-density pilgrimage corridors. By merging fluid dynamics with ML-driven predictive modeling, the system identifies potential stampede risks up to 45 minutes before they reach critical levels.

## 🚀 Key Features
- **ML Predictive Forecast**: Real-time CPI (Crowd Pressure Index) prediction using Random Forest models trained on historical flow data.
- **Dynamic Risk Escalation**: Automated tactical directives and AI-coordinated response strategies for multiple agencies (Police, Temple Trust, GSRTC).
- **Tactical Operational Log**: A synchronized, timestamped audit trail of all agency actions and system escalations.
- **Flow Dynamics Analytics**: Live monitoring of velocity (m/s), density (p/m²), and net-flow variance.
- **Micro-Inference Loop**: Sub-100ms latency via optimized FastAPI and non-blocking WebSocket streams.

## 🛠️ Tech Stack
- **Backend**: FastAPI (Python 3.10), Pandas, Scikit-Learn.
- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **AI/LLM**: Llama-3.1-8B (via Groq) for tactical coordination.
- **DevOps**: WebSocket-driven simulation engine with schema-compliant datasets.

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
1. Navigate to the root folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `.\venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt` (or install manually: `fastapi uvicorn pandas scikit-learn joblib groq`)
5. Run the server: `python -m uvicorn backend.app.main:app --reload`

### Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Credentials
Create a `.env` file in the root with:
```env
GROQ_API_KEY=your_api_key_here
```

## 📐 Architecture
The system utilizes a decoupled architecture where the simulation engine (Python) feeds a real-time WebSocket stream. The React frontend manages state via a global store, allowing for a unified command view across different site-specific observatories (Somnath, Ambaji, Dwarka, Pavagadh).

---
© 2024 Chronos Sentinel · Engineered for Human Safety.
