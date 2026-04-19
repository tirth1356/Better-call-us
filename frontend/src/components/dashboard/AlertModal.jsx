import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { formatTime } from "../../utils/riskUtils";

export default function AlertModal() {
  const { modalVisible, hideModal, acknowledgeModal, timeTocrushSeconds, risk, alerts, pressureIndex } = useDashboardStore();
  
  const currentAlert = alerts[0] || { title: "High Risk", desc: "Density threshold breached." };

  // Auto-dismiss after 10 seconds (increased from 5s)
  useEffect(() => {
    if (!modalVisible) return;
    const id = setTimeout(hideModal, 10000);
    return () => clearTimeout(id);
  }, [modalVisible, hideModal]);

  return (
    <AnimatePresence>
      {modalVisible && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed top-24 right-6 z-[100] w-80 rounded-2xl overflow-hidden shadow-2xl border border-red-200"
        >
          {/* Red gradient header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <AlertTriangle size={20} className="text-white" />
              </motion.div>
              <div>
                <p className="text-white font-headline font-black text-sm tracking-tight uppercase">{currentAlert.title}</p>
                <p className="text-red-100 text-[11px] font-body mt-0.5">ML Prediction: Serious Risk</p>
              </div>
            </div>
            <button onClick={hideModal} className="text-white/70 hover:text-white transition-colors mt-0.5">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-white px-5 py-4">
            <p className="text-[#4B2E2B] font-bold text-sm mb-1">
              Estimated Window:{" "}
              <span className="text-red-600 font-black">{formatTime(timeTocrushSeconds)}</span>
            </p>
            <p className="text-[#4B2E2B]/60 text-xs leading-relaxed">
              {currentAlert.desc}
            </p>

            {/* Auto-dismiss progress bar */}
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
            <p className="text-[9px] font-bold text-[#4B2E2B]/30 mt-1.5 uppercase tracking-tighter">Auto-dismissing in 10s</p>

            <div className="flex gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={acknowledgeModal}
                className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white"
                style={{ background: "linear-gradient(135deg, #C08552, #8C5A3C)" }}
              >
                Acknowledge
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={hideModal}
                className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-200 text-[#4B2E2B]/60 hover:bg-gray-50"
              >
                Dismiss
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

