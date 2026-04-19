import { useState } from "react";
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
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main>
        {/* Hero */}
        <section id="home" className="relative min-h-[795px] flex items-center overflow-hidden px-6 md:px-10 py-16 md:py-20 max-w-screen-2xl mx-auto scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full pt-8 md:pt-10">
            <div className="lg:col-span-7 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                <span className="text-[0.6875rem] font-bold tracking-widest uppercase text-on-surface-variant font-label">SYSTEM LIVE: ACTIVE PREDICTION</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-on-surface leading-[0.95]">
                Real-Time <br /><span className="text-primary italic">Crowd Intelligence</span> <br />for Safer Pilgrimage
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
                Leveraging advanced neural networks to predict density peaks before they happen. Precision engineering for the world's most sacred gathering sites.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/ambaji">
                  <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-2xl font-headline font-bold text-lg active:scale-95 transition-all shadow-lg">
                    Explore Dashboards
                  </button>
                </Link>
                <button 
                  onClick={() => setShowSpecs(true)}
                  className="border border-outline-variant/40 hover:bg-surface-container-low text-primary px-8 py-4 rounded-2xl font-headline font-bold text-lg transition-all"
                >
                  Technical Specs
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-[430px] overflow-hidden rounded-[2rem] border border-[#f6e9dd] bg-[#e8d6c2] shadow-[0_30px_80px_rgba(75,46,43,0.22)] lg:h-[620px]">
                <img className="h-full w-full object-cover object-center grayscale-[8%] sepia-[6%] contrast-[1.06]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiOwey2AwL5EhiGol2n_BUblOD9WsrfUVxGr78zH19RzCyJD3hhrCZSEXPcTxa2M--aGFhO9GNxxxJmgYilLaxD51AhLqk4j-Ry7OOixQZMdyuuqSLFypa5C5rjfy-tPNJEZRdE0s3RUu69JIia94i6y77mkk9dUwtM2Ug_Odz0wLHyk9aF123PRQUYKUl3xqIT-wZ9zsbiJHMew2PWjBzEayDTLHm_e8EjtbAGZdOsYESQk5Z2vro0gY8l6QlCKGOhYPi-8C8vjY" alt="Temple crowd monitoring command view" />
              </div>
            </div>
          </div>
          <div className="absolute top-20 right-[-10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        </section>

        {/* Temple Selection */}
        <section id="sites" className="py-24 bg-surface-container-low scroll-mt-28">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
            <div className="mb-16">
              <h2 className="text-[0.75rem] font-bold tracking-[0.3em] text-secondary uppercase font-label mb-4">Active Observatories</h2>
              <h3 className="text-4xl md:text-5xl font-headline font-bold text-on-surface tracking-tight">Intelligence Nodes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {temples.map((temple) => (
                <Link key={temple.id} to={temple.to} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#C08552]/10 p-3">
                  <div className="relative h-[250px] rounded-[1.8rem] overflow-hidden mb-6">
                    <img src={temple.img} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={temple.name} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-2 border border-white/20">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[8px] font-black text-[#4B2E2B] uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 font-label">Site GJ-{temple.id.slice(-3)}</span>
                    <h4 className="text-2xl font-headline font-black text-[#4B2E2B] leading-none mb-3 group-hover:text-primary transition-colors">{temple.name}</h4>
                    <p className="text-[10px] text-[#4B2E2B]/50 leading-relaxed font-body">
                      Monitoring real-time corridor pressure and entry flow dynamic.
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                       <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Observatory</span>
                       <div className="w-8 h-8 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="material-symbols-outlined text-xs">rocket_launch</span>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </section>

        {/* Global Statistics */}
        <section className="py-24 bg-[#4B2E2B] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0 opacity-50" />
           <div className="max-w-screen-2xl mx-auto px-6 md:px-10 relative z-10 text-center">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-6">Network Topology</p>
              <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-16 tracking-tighter">Live Sentinel Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 {[
                   { label: "Active Observers", value: "4", unit: "Temples", icon: "visibility" },
                   { label: "AI Processors", value: "112", unit: "NPU Nodes", icon: "memory" },
                   { label: "Dataset Points", value: "40k+", unit: "Real Samples", icon: "dataset" },
                   { label: "Sensor Array", value: "840", unit: "IoT Units", icon: "sensors" }
                 ].map((s) => (
                   <div key={s.label} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 mx-auto">
                         <span className="material-symbols-outlined">{s.icon}</span>
                      </div>
                      <p className="text-4xl font-headline font-black text-white mb-1">{s.value}</p>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{s.label}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Features */}
        <section id="features" className="py-32 px-6 md:px-10 bg-background overflow-hidden scroll-mt-28">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-[0.75rem] font-bold tracking-[0.3em] text-primary uppercase font-label mb-6">Core Capabilities</h2>
              <h3 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter">Engineered for Human Safety</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "query_stats", title: "Real-Time Prediction", desc: "Patented 'Predictive Window' algorithms forecast crowd surges 45 minutes before they reach critical density levels." },
                { icon: "hub", title: "Agency Coordination", desc: "Unified communication hub for police, medical, and temple management teams to act on synchronized data." },
                { icon: "emergency_home", title: "Early Risk Alerts", desc: "Automated visual and auditory alert systems triggered by algorithmic anomaly detection at entry/exit points." },
              ].map((f) => (
                <div key={f.title} className="bg-surface-container rounded-2xl p-10 flex flex-col gap-6 group hover:bg-surface-container-highest transition-colors duration-300">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                  </div>
                  <h4 className="text-2xl font-headline font-bold text-on-surface">{f.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
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
                <h2 className="text-5xl md:text-6xl font-headline font-black text-[#4B2E2B] mb-8 tracking-tighter leading-[0.9]">The Science <br/><span className="text-secondary">of Flow</span></h2>
                <p className="text-lg text-[#4B2E2B]/60 font-body leading-relaxed mb-12 max-w-xl">
                  Stampede Sentinel merges fluid dynamics with neural-link predictive modeling. We don't just count crowds; we simulate the kinetic pressure of every pilgrim to prevent the disaster before it starts.
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
