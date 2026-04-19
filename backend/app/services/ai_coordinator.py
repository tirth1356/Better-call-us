import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """
You are the "Sentinel AI" for the Stampede Sentinel crowd management system.
You will receive crowd safety data (CPI, risk level, prediction window, etc.).
Your job is to generate specific, actionable, and rapid coordination instructions for three agencies:
1. Police (Enforcement, physical crowd control, gate management)
2. Temple Trust (Queue routing, administrative control, announcements)
3. Transport (GSRTC bus frequency, depot holding, arrival pacing)

GOAL: Prevent stampedes by managing the "Critical 5 Minutes".
STRATEGIES:
- Low Risk: Standard monitoring.
- Moderate Risk: Staged entry, increase staff visibility.
- High Risk: Immediate "Hold and Release" at Gate 1, halt GSRTC arrivals at depot, clear exits.
- Critical Risk: EMERGENCY - Full gate closure, initiate nodal diversion, broadcast PANIC PREVENTION messages.

Outputs must be in JSON format:
{
  "police": "instruction string",
  "temple": "instruction string",
  "transport": "instruction string",
  "alert_summary": "Short 1-sentence tactical warning"
}

Keep instructions short, professional, and highly specific to the data provided. Use the location provided in your context.
"""

def get_agency_coordination(data):
    if not os.getenv("GROQ_API_KEY") or os.getenv("GROQ_API_KEY") == "your_groq_api_key_here":
        return {
            "police": "Deploy crowd control units to main gate.",
            "temple": "Activate queuing management protocols.",
            "transport": "Sync bus frequency with exit flow.",
            "alert_summary": "Standard precautionary coordination active."
        }

    prompt = f"""
    Current Data:
    - Location: {data.get('location', 'Unknown')}
    - Risk Level: {data.get('risk', 'Unknown')}
    - Pressure Index (CPI): {data.get('cpi', 0)}
    - Predicted Crush Window: {data.get('predicted_window_min', 0)} mins
    - Crowd Density: {data.get('raw_data', {}).get('queue_density_pax_per_m2', 0)} Pax/m2
    - Transport Bursts: {data.get('raw_data', {}).get('transport_arrival_burst', 0)} units
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "police": "Standby for manual instructions.",
            "temple": "Maintain current protocol.",
            "transport": "Regular schedule active.",
            "alert_summary": "AI Coordination offline."
        }
