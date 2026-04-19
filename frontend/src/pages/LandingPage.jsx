import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ambajiTempleImage from "../assets/temples/Ambaji-main-img.jpg";
import dwarkaTempleImage from "../assets/temples/dwarla-main-img.jpg";
import pavagadhTempleImage from "../assets/temples/pavagadh-main-img.jpg";
import somnathTempleImage from "../assets/temples/somnath-main-img.jpg";

const temples = [
  {
    id: "GJ-042", name: "Ambaji Temple", to: "/ambaji", dark: false,
    desc: "Real-time crowd monitoring & risk prediction engine active. Currently processing 4,200 data points per second.",
    img: ambajiTempleImage,
  },
  {
    id: "GJ-018", name: "Dwarka", to: "/dwarka", dark: true,
    desc: "Advanced coastal surge and pilgrim inflow modeling. Multi-nodal sensor network fully operational.",
    img: dwarkaTempleImage,
  },
  {
    id: "GJ-001", name: "Somnath", to: "/somnath", dark: false,
    desc: "Historical analysis integrated with real-time sensor data for precise stampede risk mitigation.",
    img: somnathTempleImage,
  },
  {
    id: "GJ-067", name: "Pavagadh", to: "/pavagadh", dark: true,
    desc: "Hill-station crowd dynamics specialized AI. Monitoring cable-car and trekking pathway density.",
    img: pavagadhTempleImage,
  },
];

export default function LandingPage() {
  const [showSpecs, setShowSpecs] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const heroImages = [somnathTempleImage, ambajiTempleImage, dwarkaTempleImage, pavagadhTempleImage];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main>
        {/* Hero */}
        <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden px-6 md:px-10 py-16 scroll-mt-28 bg-white">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="lg:col-span-7 space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-stone-50 border border-stone-100 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#4B2E2B]/60 font-label">Neural-Net Active Tracking</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-[#4B2E2B] leading-[0.85]">
                AlertX <br /><span className="text-primary italic">Intelligence.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[#4B2E2B]/60 max-w-xl font-body leading-relaxed font-light">
                Engineering safety through predictive kinetics. Anticipating crowd density before it forms, protecting millions across sacred corridors with precision AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link to="/pavagadh">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#4B2E2B] text-white px-10 py-5 rounded-[2rem] font-headline font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#4B2E2B]/20 transition-all"
                  >
                    Enter Observatory
                  </motion.button>
                </Link>
                <motion.button 
                  whileHover={{ backgroundColor: "#F5F5F7" }}
                  onClick={() => setShowSpecs(true)}
                  className="bg-white border border-stone-200 text-[#4B2E2B] px-10 py-5 rounded-[2rem] font-headline font-black text-xs uppercase tracking-[0.3em] transition-all"
                >
                  System Specs
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 h-[500px] lg:h-[700px] w-full rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(75,46,43,0.3)] bg-stone-100">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImg}
                    src={heroImages[currentImg]} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    alt="AlertX Strategic Monitoring"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E2B]/20 to-transparent pointer-events-none" />
                
                {/* Progress Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                   {heroImages.map((_, i) => (
                     <div 
                       key={i} 
                       className={`h-1 rounded-full transition-all duration-500 ${i === currentImg ? "w-8 bg-white" : "w-2 bg-white/30"}`} 
                     />
                   ))}
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />
            </motion.div>
          </div>
        </section>

        {/* Dynamic Observatory Explorer - Alternative to standard cards */}
        <section id="sites" className="py-32 bg-[#FAFAFA] overflow-hidden">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase mb-6 flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-primary/30" /> Active Deployments
                </h2>
                <h3 className="text-5xl md:text-7xl font-headline font-black text-[#4B2E2B] tracking-tighter leading-none">The Observatory <br/>Network.</h3>
              </div>
              <p className="text-lg text-[#4B2E2B]/50 font-body max-w-xs leading-relaxed">
                Localized AI agents tailored to specific architectural bottleneck dynamics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {temples.map((temple, idx) => (
                <motion.div
                  key={temple.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative h-[450px] rounded-[3.5rem] overflow-hidden cursor-pointer bg-white border border-stone-200 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl"
                >
                  <Link to={temple.to} className="absolute inset-0 flex">
                    <div className="w-1/2 h-full overflow-hidden relative">
                       <img 
                         src={temple.img} 
                         className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                         alt={temple.name} 
                       />
                       <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="w-1/2 h-full p-12 flex flex-col justify-between bg-white group-hover:bg-stone-50 transition-colors">
                       <div>
                          <p className="text-[10px] font-black tracking-[0.3em] text-primary uppercase mb-4 decoration-primary/30 underline underline-offset-4">GJ-{temple.id.slice(-3)}</p>
                          <h4 className="text-3xl font-headline font-black text-[#4B2E2B] tracking-tighter leading-tight mb-4">{temple.name}</h4>
                          <p className="text-xs text-[#4B2E2B]/40 leading-relaxed font-body font-medium">
                            {temple.desc}
                          </p>
                       </div>
                       
                       <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-[#4B2E2B]/30 uppercase tracking-widest group-hover:text-primary transition-colors">Live Feed Agent</span>
                          <motion.div 
                            whileHover={{ x: 5 }}
                            className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-[#4B2E2B] group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm"
                          >
                             <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </motion.div>
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Statistics */}
        <section className="py-32 bg-[#4B2E2B] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] -z-0 opacity-40" />
           <div className="max-w-screen-2xl mx-auto px-6 md:px-10 relative z-10">
              <div className="text-center mb-24">
                <h2 className="text-[10px] font-black tracking-[0.5em] uppercase text-primary mb-6">Network Health</h2>
                <h2 className="text-5xl md:text-7xl font-headline font-black text-white tracking-tighter leading-none">AlertX Global <br/>Footprint.</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: "Active Nodes", value: "04", unit: "Observatories", icon: "visibility" },
                   { label: "Neural Compute", value: "112", unit: "NPU Cluster", icon: "memory" },
                   { label: "Predictive Sets", value: "40k", unit: "Data Targets", icon: "dataset" },
                   { label: "Sensor Grid", value: "840", unit: "Edge Units", icon: "sensors" }
                 ].map((s, i) => (
                   <motion.div 
                     key={s.label}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: i * 0.1 }}
                     className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-all duration-500"
                   >
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                         <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-5xl font-headline font-black text-white">{s.value}</p>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{s.unit}</p>
                      </div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-6">{s.label}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Features - Depth based Interaction */}
        <section id="features" className="py-40 px-6 md:px-10 bg-white overflow-hidden scroll-mt-28">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-28">
              <div className="max-w-3xl">
                <h2 className="text-[10px] font-black tracking-[0.4em] text-[#4B2E2B]/40 uppercase mb-6">Observatory Modules</h2>
                <h3 className="text-5xl md:text-8xl font-headline font-black text-[#4B2E2B] tracking-tighter leading-[0.85]">Core <br/><span className="text-primary italic">Intelligence.</span></h3>
              </div>
              <p className="text-xl text-[#4B2E2B]/50 font-body max-w-sm leading-relaxed mb-4">
                Redefining crowd safety through precision engineering and real-time inference.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: "query_stats", title: "Predictive Window", desc: "Proprietary algorithms that forecast density shifts 45 minutes in advance, enabling proactive perimeter control." },
                { icon: "hub", title: "Multi-Agency Bridge", desc: "A singular, high-fidelity command interface synchronizing Police, Medical, and Temple management teams." },
                { icon: "emergency_home", title: "Kinetic Anomaly", desc: "Neural-link detection for erratic movement patterns at bottleneck points, triggering automated safety protocols." },
              ].map((f, i) => (
                <motion.div 
                  key={f.title} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-stone-50 rounded-[3rem] p-12 flex flex-col gap-10 border border-stone-100 group transition-all duration-500 hover:shadow-2xl hover:bg-white hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <div className="space-y-4 flex-1">
                    <h4 className="text-3xl font-headline font-black text-[#4B2E2B] tracking-tight">{f.title}</h4>
                    <p className="text-sm text-[#4B2E2B]/50 leading-relaxed font-body font-medium">{f.desc}</p>
                  </div>
                  <div className="w-10 h-1 bg-[#4B2E2B]/10 rounded-full group-hover:bg-primary group-hover:w-full transition-all duration-500" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* The Science of Flow - Enhanced */}
        <section id="tech" className="py-32 bg-[#FFF8F0] scroll-mt-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                   <span className="material-symbols-outlined text-sm">science</span> Operational Framework
                </div>
                <h2 className="text-5xl md:text-6xl font-headline font-black text-[#4B2E2B] mb-8 tracking-tighter leading-[0.9]">The Science <br/><span className="text-secondary">of Prediction</span></h2>
                <p className="text-lg text-[#4B2E2B]/60 font-body leading-relaxed mb-12 max-w-xl">
                  AlertX merges fluid dynamics with neural-link predictive modeling. We don't just count crowds; we simulate the kinetic pressure of every pilgrim to prevent the disaster before it starts.
                </p>
                
                <div className="space-y-8">
                  {[
                    { title: "LiDAR Density Mapping", desc: "Real-time point-cloud analysis for sub-centimeter accuracy in corridor bottlenecks.", icon: "radar" },
                    { title: "Kineti-AI Engine", desc: "Proprietary ML model predicting crush windows using historical pilgrim flow patterns.", icon: "bolt" },
                    { title: "Dynamic Path Optimization", desc: "Live-calculated exit routes that adjust based on sector-specific pressure buildup.", icon: "directions_run" }
                  ].map((feat) => (
                    <div key={feat.title} className="flex gap-6 group">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-[#C08552]/10 flex items-center justify-center text-[#8C5A3C] group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <span className="material-symbols-outlined">{feat.icon}</span>
                       </div>
                       <div>
                          <h4 className="text-lg font-black text-[#4B2E2B] mb-1">{feat.title}</h4>
                          <p className="text-sm text-[#4B2E2B]/40 leading-relaxed font-body">{feat.desc}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={() => setShowSpecs(true)}
                    className="px-8 py-4 bg-[#4B2E2B] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#4B2E2B]/20"
                  >
                    Technical Specs
                  </button>
                </div>
              </div>

              <div className="lg:w-1/2 relative">
                 <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1000" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" alt="Technical" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E2B]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
                 <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl font-black text-[200px] text-primary/5 select-none -z-0">AI</div>
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {showSpecs && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#4B2E2B]/90 backdrop-blur-md"
            >
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 30 }} 
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 30 }}
                 className="bg-white rounded-[3rem] max-w-2xl w-full p-12 relative shadow-2xl overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                  <button onClick={() => setShowSpecs(false)} className="absolute top-8 right-8 text-[#4B2E2B]/30 hover:text-[#4B2E2B] p-2 hover:bg-stone-100 rounded-full transition-all">
                     <span className="material-symbols-outlined">close</span>
                  </button>
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-4 block underline decoration-2 underline-offset-4">Architecture v1.4</span>
                  <h3 className="text-4xl font-headline font-black text-[#4B2E2B] mb-8 tracking-tighter">System Architecture</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {[
                       { l: "Backend Infrastructure", v: "FastAPI Optimized Performance" },
                       { l: "LLM Coordination", v: "Llama-3.1-8B Real-time Agents" },
                       { l: "ML Inference Engine", v: "SciKit Random Forest Dynamics" },
                       { l: "Data Pipeline", v: "Non-blocking Pandas Stream" },
                       { l: "Frontend Framework", v: "React 18 / Tailwind / Motion" },
                       { l: "Visualization Core", v: "Recharts Telemetry Analysis" }
                     ].map(s => (
                       <div key={s.l} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                          <p className="text-[10px] font-bold text-[#4B2E2B]/40 uppercase tracking-widest mb-1">{s.l}</p>
                          <p className="text-sm font-black text-[#8C5A3C]">{s.v}</p>
                       </div>
                     ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-[#C08552]/10 text-center">
                     <p className="text-xs text-[#4B2E2B]/50 leading-relaxed italic">
                       * decentralized NPU nodes for sub-100ms inference latency across the Gujarat corridor.
                     </p>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
