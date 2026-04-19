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
import HistoryReplaySection from "../components/dashboard/HistoryReplaySection";
import { useDashboardStore } from "../store/dashboardStore";
import Footer from "../components/Footer";

const SECTORS = [
  { name: "Main Entry", risk: "HIGH", window: "18m", density: 3.9 },
  { name: "Gate 1", risk: "MEDIUM", window: "40m", density: 2.2 },
  { name: "Gate 2", risk: "LOW", window: "95m+", density: 1.0 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export default function PavagadhDashboard() {
  const { alerts, pressureIndex, flowVelocity, sensorCount, setActiveLocation, connectWebsocket, showHistory } = useDashboardStore();

  useEffect(() => {
    setActiveLocation("Pavagadh");
    connectWebsocket();
  }, [setActiveLocation, connectWebsocket]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-body text-[#4B2E2B]">
      <DashboardNav templeName="Pavagadh Temple" />
      <AlertModal />

      <div className="flex">
        <DashboardSidebar />

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-screen-2xl mx-auto w-full"
        >
          {/* Page header */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#C08552] animate-pulse" />
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#4B2E2B]/40">Node: GJ-067 · Pavagadh Hill</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-black text-[#4B2E2B] tracking-tight leading-none">
              Strategic <span className="text-[#C08552]">Observatory</span>
            </h2>
            <p className="text-sm font-medium text-[#4B2E2B]/50 mt-3 max-w-xl">
              Advanced kinetic tracking for high-altitude pilgrimage corridors. Monitoring elevation-specific density clusters and pathway bottlenecks.
            </p>
          </motion.div>

          {/* ROW 1: Core KPI cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 items-stretch">
            <RiskCard />
            <CountdownTimer />

            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-[2.5rem] border border-[#C08552]/20 bg-white p-8 flex flex-col justify-between shadow-xl shadow-[#C08552]/5"
            >
              <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-1">Pressure Index</p>
                    <p className="text-4xl font-headline font-black text-[#4B2E2B] tracking-tighter">{pressureIndex}</p>
                </div>
                <span className="text-[10px] font-black text-[#C08552] bg-[#C08552]/10 px-3 py-1 rounded-full border border-[#C08552]/20 uppercase tracking-widest">N/m²</span>
              </div>
              <div className="mt-6 flex gap-1 items-end h-16 bg-[#FFF8F0]/50 rounded-2xl p-2 border border-[#C08552]/5">
                {[0.3, 0.5, 0.4, 0.6, 0.64, 0.7, 0.64, 0.55, 0.6, 0.75].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${v * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                    className={`flex-1 rounded-full ${i === 9 ? 'bg-[#C08552]' : 'bg-[#C08552]/30'}`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#4B2E2B]/40 mt-4 font-bold uppercase tracking-widest text-center italic">Live Kinetic Stress Matrix</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-[2.5rem] border border-[#C08552]/20 p-8 flex flex-col justify-between shadow-xl shadow-[#4B2E2B]/10"
              style={{ background: "linear-gradient(145deg, #4B2E2B, #2d1b19)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                   <p className="text-[10px] font-black tracking-[0.25em] uppercase text-white/40 mb-1">Flow Velocity</p>
                   <p className="text-4xl font-headline font-black text-white tracking-tighter">{flowVelocity}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">Active</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col gap-1">
                 <p className="text-xs font-bold text-white/60">System Stability</p>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div animate={{ width: "88%" }} className="h-full bg-[#C08552]" />
                 </div>
              </div>

              <p className="text-[10px] text-white/40 mt-4 font-bold uppercase tracking-widest">Global Corridor Average</p>
            </motion.div>
          </motion.div>

          {/* ROW 2: Graph + Action */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-stretch">
            <div className="xl:col-span-2">
              <GraphSection />
            </div>
            <div className="flex flex-col h-full overflow-hidden">
              <ActionPanel />
            </div>
          </motion.div>

          {/* ROW 3: Sectors + Insight */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 items-stretch">
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#4B2E2B]/40 mb-1">Telemetry Array</p>
                  <h3 className="text-xl font-headline font-black text-[#4B2E2B]">Nodal Analysis</h3>
                </div>
                <button className="text-[10px] font-black text-[#C08552] uppercase tracking-widest hover:underline underline-offset-4">Advanced Map →</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SECTORS.map((s, i) => (
                  <SectorCard key={s.name} {...s} index={i} />
                ))}
              </div>
            </div>
            <div className="flex flex-col h-full">
               <InsightPanel />
            </div>
          </motion.div>

          {/* ROW 4: Agency + AI Chat */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
            <div className="xl:col-span-7">
               <AgencyPanel />
            </div>
            <div className="xl:col-span-5">
               <AiChatPanel />
            </div>
          </motion.div>

          {/* 📊 Integrated History Replay 📊 */}
          {showHistory && <div id="replay-section" className="mt-12"><HistoryReplaySection /></div>}

          <Footer />
        </motion.main>
      </div>
    </div>
  );
}
