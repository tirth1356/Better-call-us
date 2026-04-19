import { useEffect, useRef } from "react";
import { useDashboardStore } from "../store/dashboardStore";

export function useCountdown() {
  const { tickTimer, timeTocrushSeconds, risk, showModal, acknowledgedModal } = useDashboardStore();
  const prevSeconds = useRef(timeTocrushSeconds);

  useEffect(() => {
    const id = setInterval(tickTimer, 1000);
    return () => clearInterval(id);
  }, [tickTimer]);

  // Trigger modal when crossing the 8-minute danger threshold
  useEffect(() => {
    const threshold = 8 * 60;
    if (
      prevSeconds.current > threshold &&
      timeTocrushSeconds <= threshold &&
      !acknowledgedModal
    ) {
      showModal();
    }
    prevSeconds.current = timeTocrushSeconds;
  }, [timeTocrushSeconds, showModal, acknowledgedModal]);

  // Also trigger modal immediately if risk is HIGH and not acknowledged
  useEffect(() => {
    if (risk === "HIGH" && !acknowledgedModal) {
      showModal();
    }
  }, [risk, showModal, acknowledgedModal]);
}
