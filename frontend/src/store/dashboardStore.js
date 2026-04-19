import { create } from "zustand";

export const RISK_LEVELS = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" };

const INITIAL_SECONDS = 42 * 60; // 42 minutes

export const useDashboardStore = create((set, get) => ({
  risk: RISK_LEVELS.MEDIUM,
  riskPercent: 64,
  confidence: 87,
  timeTocrushSeconds: INITIAL_SECONDS,
  predictedWindow: 0,
  pressureIndex: "0.64",
  flowVelocity: "1.80",
  sensorCount: 142,
  activeLocation: "Somnath",
  sourceMode: "dataset",
  graphData: [
    { time: "00:00:00", real_cpi: 0, pred_cpi: 0 },
    { time: "00:00:00", real_cpi: 0, pred_cpi: 0 },
  ], 
  agencies: [
    { id: "police", label: "District Police", status: "standby", action: "Patrolling Area" },
    { id: "temple", label: "Temple Trust", status: "standby", action: "Managing Gates" },
    { id: "transport", label: "GSRTC (Transport)", status: "standby", action: "Bus Scheduling" }
  ],
  alerts: [],
  tacticalLogs: [],
  rawData: {},
  aiCoordination: null,
  modalVisible: false,
  lastAlertId: null,
  ws: null,
  isConnecting: false,
  showHistory: false,

  setShowHistory: (val) => set({ showHistory: val }),

  setRisk: (risk) => set({ risk }),
  setRiskPercent: (percent) => set({ riskPercent: percent }),
  setConfidence: (conf) => set({ confidence: conf }),
  setCountdown: (seconds) => set({ timeTocrushSeconds: seconds }),
  dismissModal: () => set({ modalVisible: false }),

  // 🔴 SIMULATION CONTROLS 🔴
  simulateNormal: () => {
    set({ risk: RISK_LEVELS.LOW, riskPercent: 18, timeTocrushSeconds: INITIAL_SECONDS, predictedWindow: 0, modalVisible: false, aiCoordination: null });
  },

  resetSimulation: () => {
    const { ws, activeLocation } = get();
    // Clear graph on reset
    set({ 
      graphData: [{ time: "00:00:00", real_cpi: 0, pred_cpi: 0 }],
      tacticalLogs: [] 
    });
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "start_simulation", temple: activeLocation.toLowerCase() }));
    }
  },

  addLog: (action, agency = "System") => {
    const newLog = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      agency,
      action
    };
    set((state) => ({ tacticalLogs: [newLog, ...state.tacticalLogs].slice(0, 50) }));
  },

  setActiveLocation: (loc) => {
    set({ 
        activeLocation: loc,
        graphData: [
            { time: new Date().toLocaleTimeString(), real_cpi: 0, pred_cpi: 0 },
            { time: new Date().toLocaleTimeString(), real_cpi: 0, pred_cpi: 0 }
        ] 
    });
    const { ws, sourceMode } = get();
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "start_simulation", temple: loc.toLowerCase(), mode: sourceMode }));
    }
  },

  setSourceMode: (mode) => {
    set({ 
        sourceMode: mode,
        graphData: [
            { time: new Date().toLocaleTimeString(), real_cpi: 0, pred_cpi: 0 },
            { time: new Date().toLocaleTimeString(), real_cpi: 0, pred_cpi: 0 }
        ] 
    });
    const { ws, activeLocation } = get();
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "start_simulation", temple: activeLocation.toLowerCase(), mode: mode }));
    }
  },

  toggleForceRisk: (status) => {
    const { ws } = get();
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "toggle_force_risk", status: status }));
        get().addLog(`NEAR-CRUSH SIMULATION ${status ? 'ACTIVATED' : 'DEACTIVATED'}`, "SYSTEM-ADMIN");
    }
  },

  // 🔴 CONNECT TO LIVE BACKEND WEBSOCKET 🔴
  connectWebsocket: () => {
    const { ws, isConnecting, activeLocation } = get();
    
    // Don't create multiple connections
    if (isConnecting) return;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    set({ isConnecting: true });
    console.log("🚀 AlertX Connection Initializing...");
    
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
      console.log("WebSocket Connected ✅");
      set({ ws: socket, isConnecting: false });
      // Sync initial location
      socket.send(JSON.stringify({ type: "start_simulation", temple: get().activeLocation.toLowerCase(), mode: get().sourceMode }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === "alert_ack") {
        const updatedAlert = message.data;
        set((state) => ({
          alerts: state.alerts.map(a => a.id === updatedAlert.alert_id ? {
            ...a,
            status: updatedAlert.status,
            acknowledgments: updatedAlert.acknowledgments
          } : a)
        }));
        return;
      }

      if (message.type === "crowd_update") {
        const payload = message.data;
        const cpi = parseFloat(payload.cpi) || 0;
        const predicted_cpi = parseFloat(payload.predicted_cpi) || 0;
        const flow_vel = parseFloat(payload.flow_velocity) || 0;
        const windowMin = payload.predicted_window_min || 0;
        const windowSec = windowMin * 60;

        let riskConst = RISK_LEVELS.LOW;
        const r = String(payload.risk).toUpperCase();
        if (r === "HIGH" || r === "SEVERE" || r === "CRITICAL") riskConst = RISK_LEVELS.HIGH;
        else if (r === "MEDIUM") riskConst = RISK_LEVELS.MEDIUM;

        const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        set((state) => {
          const newGraph = [...state.graphData, { 
            time: timeLabel, 
            real_cpi: cpi, 
            pred_cpi: predicted_cpi,
            velocity: payload.flow_velocity || 0,
            density: (payload.raw_data && payload.raw_data.queue_density_pax_per_m2) || 0
          }];
          if (newGraph.length > 20) newGraph.shift();

          const isNewAlert = payload.alert && payload.alert.alert_id !== state.lastAlertId;

          return {
            risk: riskConst,
            riskPercent: predicted_cpi,
            predictedWindow: windowMin,
            pressureIndex: cpi.toFixed(2),
            confidence: payload.confidence || state.confidence,
            buildup: payload.buildup || "Normal",
            rawData: payload.raw_data || {},
            aiCoordination: payload.ai_coordination || state.aiCoordination,
            timeTocrushSeconds: riskConst === RISK_LEVELS.HIGH ? windowSec : (99 * 60),
            flowVelocity: flow_vel.toFixed(2),
            graphData: newGraph,
            modalVisible: isNewAlert ? true : state.modalVisible,
            lastAlertId: payload.alert ? payload.alert.alert_id : state.lastAlertId,
            alerts: payload.alert && isNewAlert ? [
              {
                id: payload.alert.alert_id,
                title: "AI Coordination Alert",
                desc: payload.alert.ai_instruction || `Crush Window detected at ${windowMin} min.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                startTime: payload.alert.timestamp,
                status: payload.alert.status,
                acknowledgments: []
              },
              ...state.alerts
            ].slice(0, 10) : state.alerts
          };
        });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected ❌. Reconnecting in 3s...");
      set({ ws: null, isConnecting: false });
      setTimeout(() => get().connectWebsocket(), 3000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error 🛑");
      socket.close();
    };
  },

  acknowledgeAlert: async (alertId, agencyId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId, agency: agencyId })
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  }
}));
