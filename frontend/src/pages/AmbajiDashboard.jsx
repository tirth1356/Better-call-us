import { motion } from "framer-motion";
import { useEffect } from "react";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import RiskCard from "../components/dashboard/RiskCard";
import CountdownTimer from "../components/dashboard/CountdownTimer";
import ActionPanel from "../components/dashboard/ActionPanel";
import AgencyPanel from "../components/dashboard/AgencyPanel";
import AlertModal from "../components/dashboard/AlertModal";
import GraphSection from "../components/dashboard/GraphSection";
import InsightPanel from "../components/dashboard/InsightPanel";
import SectorCard from "../components/dashboard/SectorCard";
import AiChatPanel from "../components/dashboard/AiChatPanel";
import { useDashboardStore } from "../store/dashboardStore";

const SECTORS = [
  { name: "Main Entry", risk: "LOW", window: "120m+", density: 1.2 },
  { name: "Gate 1", risk: "MEDIUM", window: "45m", density: 2.8 },
  { name: "Gate 2", risk: "CRITICAL", window: "12m", density: 4.5 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export default function AmbajiDashboard() {
  const { alerts, pressureIndex, flowVelocity, sensorCount, setActiveLocation, connectWebsocket } = useDashboardStore();

  useEffect(() => {
    setActiveLocation("Ambaji");
    connectWebsocket();
  }, [setActiveLocation, connectWebsocket]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-body text-[#4B2E2B]">
      <DashboardNav templeName="Ambaji Temple" />
      <AlertModal />

      <div className="flex">
        <DashboardSidebar />

        {/* Main canvas */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 lg:ml-64 p-6 lg:p-8 max-w-screen-2xl mx-auto w-full"
        >
          {/* Page header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C08552]" />
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#4B2E2B]/40">Site ID: GJ-042 · Gujarat, India</p>
            </div>
            <h2 className="text-3xl font-headline font-black text-[#4B2E2B] tracking-tight">
              Ambaji <span className="text-[#C08552]">Observatory</span>
            </h2>
            <p className="text-sm text-[#4B2E2B]/50 mt-1 max-w-lg">
              Real-time crowd intelligence and stampede risk prediction systems.
            </p>
          </motion.div>

          {/* ── ROW 1: Core KPI cards ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Risk Card */}
            <div className="sm:col-span-2 xl:col-span-1">
              <RiskCard />
            </div>

            {/* Countdown */}
            <div className="sm:col-span-2 xl:col-span-1">
              <CountdownTimer />
            </div>

            {/* Pressure Index */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-[#C08552]/20 bg-[#FFF8F0] p-6 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/50">Pressure Index</p>
                <span className="text-[10px] font-black text-[#C08552] bg-[#C08552]/10 px-2 py-0.5 rounded-full">P/m²</span>
              </div>
              <div className="mt-3">
                <p className="text-4xl font-headline font-black text-[#4B2E2B]">{pressureIndex}</p>
                <p className="text-xs text-[#4B2E2B]/40 mt-1">Pascal per square metre</p>
              </div>
              <div className="mt-3 flex gap-1 items-end h-8">
                {[0.3, 0.5, 0.4, 0.6, 0.64, 0.7, 0.64].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${v * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="flex-1 rounded-t-sm bg-[#C08552]/40"
                  />
                ))}
              </div>
            </motion.div>

            {/* Flow Velocity */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-[#C08552]/20 p-6 flex flex-col justify-between"
              style={{ background: "linear-gradient(135deg, #4B2E2B, #8C5A3C)" }}
            >
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Flow Velocity</p>
              <div className="mt-3">
                <p className="text-4xl font-headline font-black text-white">{flowVelocity}</p>
                <p className="text-xs text-white/40 mt-1">metres / second</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white/70">{sensorCount} sensors active</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── ROW 2: Graph + Action + Agency ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className="xl:col-span-2">
              <GraphSection />
            </div>
            <div className="flex flex-col gap-4">
              <ActionPanel />
            </div>
          </motion.div>

          {/* ── ROW 3: Sectors + Insight + Agency ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            {/* Sector cards */}
            <div className="xl:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#4B2E2B]/40 mb-0.5">Live Monitoring</p>
                  <h3 className="text-lg font-headline font-bold text-[#4B2E2B]">Sector Analysis</h3>
                </div>
                <span className="text-[10px] font-bold text-[#C08552] hover:underline cursor-pointer">View Map →</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SECTORS.map((s, i) => (
                  <SectorCard key={s.name} {...s} index={i} />
                ))}
              </div>
            </div>

            {/* Insight panel */}
            <InsightPanel />
          </motion.div>

          {/* ── ROW 4: Agency + AI Chat ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
            <AgencyPanel />
            <AiChatPanel />
          </motion.div>

          {/* Footer strip */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-4 border-t border-[#C08552]/10">
            <p className="text-[10px] text-[#4B2E2B]/30 font-body uppercase tracking-widest">
              © 2024 Chronos Observatory · Stampede Window Predictor
            </p>
            <div className="flex gap-4">
              {["Architecture", "Privacy", "API Docs", "Support"].map((l) => (
                <a key={l} href="#" className="text-[10px] text-[#4B2E2B]/30 hover:text-[#C08552] transition-colors uppercase tracking-wider">
                  {l}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}
