import logging

logger = logging.getLogger(__name__)

def calculate_cpi(features):
    """
    CPI = w1*(entry - exit)
        + w2*(density)
        + w3*(entry / width)
        + w4*(transport_burst * vehicle_count)
        + w5*(festival_peak)
    """
    w1 = 0.3
    w2 = 0.4
    w3 = 0.1
    w4 = 0.1
    w5 = 0.1
    
    def safe_float(v, default=0.0):
        try: return float(v)
        except: return default

    entry = safe_float(features.get("entry_flow_rate_pax_per_min", 0))
    exit_flow = safe_float(features.get("exit_flow_rate_pax_per_min", 0))
    density = safe_float(features.get("queue_density_pax_per_m2", 0))
    width = safe_float(features.get("corridor_width_m", 2), 2)
    transport_burst = safe_float(features.get("transport_arrival_burst", 0))
    vehicle_count = safe_float(features.get("vehicle_count", 0))
    festival_peak = safe_float(features.get("festival_peak", 0))
    
    if width <= 0: width = 2.0

    term1 = max(0.0, entry - exit_flow)
    term2 = density * 10 
    term3 = entry / width
    term4 = transport_burst * vehicle_count
    
    raw_cpi = (w1 * term1) + (w2 * term2) + (w3 * term3) + (w4 * term4) + (w5 * festival_peak)
    cpi = max(0.0, min(100.0, raw_cpi))
    return float(cpi)

def determine_risk_level(cpi):
    if cpi <= 40: return "LOW"
    if cpi <= 60: return "MEDIUM"
    if cpi <= 80: return "HIGH"
    if cpi <= 92: return "SEVERE"
    return "CRITICAL"

def determine_buildup(features, cpi):
    entry = features.get("entry_flow_rate_pax_per_min", 0)
    exit_flow = features.get("exit_flow_rate_pax_per_min", 0)
    if cpi > 50 and entry > exit_flow:
        return "Genuine"
    return "Temporary Surge"
