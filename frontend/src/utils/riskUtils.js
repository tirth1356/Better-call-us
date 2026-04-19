export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function getRiskConfig(risk) {
  switch (risk) {
    case "HIGH":
      return {
        label: "CRITICAL",
        color: "#DC2626",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-600",
        bar: "bg-red-500",
        glow: "shadow-[0_0_24px_rgba(220,38,38,0.35)]",
        pulse: true,
      };
    case "MEDIUM":
      return {
        label: "MODERATE",
        color: "#D97706",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-600",
        bar: "bg-amber-500",
        glow: "shadow-[0_0_24px_rgba(217,119,6,0.25)]",
        pulse: false,
      };
    default:
      return {
        label: "SAFE",
        color: "#C08552",
        bg: "bg-[#FFF8F0]",
        border: "border-[#C08552]/30",
        text: "text-[#C08552]",
        bar: "bg-[#C08552]",
        glow: "shadow-[0_0_16px_rgba(192,133,82,0.15)]",
        pulse: false,
      };
  }
}

export function getAgencyConfig(status) {
  switch (status) {
    case "active":
      return { dot: "bg-amber-400", label: "Active", text: "text-amber-600", border: "border-l-amber-400" };
    case "completed":
      return { dot: "bg-emerald-400", label: "Completed", text: "text-emerald-600", border: "border-l-emerald-400" };
    default:
      return { dot: "bg-gray-300", label: "Pending", text: "text-gray-400", border: "border-l-gray-300" };
  }
}

// Generate mock time-series data for charts
export function generateChartData() {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now - (19 - i) * 3 * 60 * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    risk: Math.round(30 + Math.sin(i * 0.4) * 15 + i * 2.2),
    flow: Math.round(40 + Math.cos(i * 0.3) * 12 + i * 1.5),
  }));
}
