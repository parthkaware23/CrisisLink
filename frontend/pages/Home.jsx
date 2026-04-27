import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Globe from 'react-globe.gl';
import { Shield, Radio, Zap, Target, Activity, ArrowRight, Server, Globe2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const globeRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
        globeRef.current.controls().enableZoom = false; 
        globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.8 });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. THE BACKGROUND GLOBE (Fixed & Non-Interactive) */}
      <div className="fixed top-0 right-[-15%] w-[80%] h-full z-0 opacity-40 pointer-events-none">
        <Globe 
          ref={globeRef} 
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg" 
          backgroundColor="rgba(0,0,0,0)" 
          atmosphereColor="#3b82f6"
          width={1200} height={1200}
        />
      </div>

      {/* 2. ELITE NAV (Fixed Glass) */}
      <nav className="fixed top-0 w-full z-[100] px-12 py-8 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Crisis<span className="text-blue-500 font-[1000]">Link</span></span>
        </div>
        <div className="flex gap-10 items-center font-black text-[10px] tracking-[0.4em] uppercase text-slate-500">
          <span className="hidden lg:block">System_Ready_v4</span>
          <button onClick={() => navigate('/register')} className="px-10 py-3 bg-white text-black rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl">Connect</button>
        </div>
      </nav>

      {/* 3. HERO SECTION (Massive Scale, Left Aligned) */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-12 pt-32 max-w-[1400px]">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
          <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.5em] uppercase text-[10px] mb-8">
            <Radio size={14} className="animate-pulse" /> Global Monitoring Active
          </div>
          <h1 className="text-[10vw] font-[1000] leading-[0.85] tracking-tighter uppercase italic mb-12">
            NEUTRALIZE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600">THE UNKNOWN.</span>
          </h1>
          <p className="max-w-2xl text-xl md:text-2xl text-slate-400 font-medium italic leading-relaxed mb-16 border-l-4 border-blue-600 pl-8">
            High-velocity intelligence mapping for planetary threats. Predicting the next crisis before it reaches the zero-hour.
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <button onClick={() => navigate('/register')} className="px-16 py-8 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black uppercase italic rounded-2xl flex items-center gap-6 shadow-2xl transition-all group">
              Initialize Dashboard <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 4. STATS STRIP (Floating Glass) */}
      <section className="relative z-10 px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: "Prediction Accuracy", value: "98.4%", icon: <Target className="text-blue-400" /> },
            { label: "Global Nodes", value: "44,209", icon: <Server className="text-blue-400" /> },
            { label: "Response Delay", value: "< 0.8s", icon: <Zap className="text-blue-400" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-10 rounded-[35px] hover:border-blue-500/50 transition-all group">
              <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{stat.label}</div>
              <div className="text-5xl font-black italic tracking-tighter">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DEFENSE MODULES (Clean Vertical Blocks) */}
      <section className="relative z-10 py-40 px-12 border-t border-white/5">
        <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-24">Strategic <span className="text-blue-600">Clusters</span></h2>
        <div className="space-y-12">
          {[
            { t: "Neural Threat Analysis", d: "Using deep-learning to identify seismic and weather patterns 72 hours out." },
            { t: "Atmospheric Telemetry", d: "Real-time scanning of air currents and ground-level pressure shifts." },
            { t: "Rapid Alert Deployment", d: "Zero-latency notifications delivered across all connected planetary nodes." }
          ].map((item, i) => (
            <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-12 bg-white/[0.02] border border-white/5 rounded-[40px] hover:bg-blue-600 hover:text-white transition-all duration-500 cursor-default">
              <div className="max-w-xl">
                <span className="text-xs font-black opacity-30 uppercase tracking-[0.5em] mb-4 block italic">Module_0{i+1}</span>
                <h3 className="text-4xl font-black uppercase italic mb-4 tracking-tighter group-hover:scale-105 transition-transform origin-left">{item.t}</h3>
                <p className="text-slate-500 font-bold italic group-hover:text-blue-100">{item.d}</p>
              </div>
              <Activity className="hidden md:block opacity-10 group-hover:opacity-100 transition-opacity" size={80} />
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION (Mega Glass Banner) */}
      <section className="relative z-10 py-60 px-12 text-center">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-600 to-blue-900 p-24 rounded-[60px] shadow-3xl group relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h2 className="text-[7vw] font-[1000] italic leading-none uppercase tracking-tighter mb-16 relative z-10">BE READY <br /> FOR THE <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>FUTURE.</span></h2>
          <button onClick={() => navigate('/register')} className="relative z-10 px-20 py-10 bg-white text-black text-3xl font-black uppercase italic rounded-2xl hover:scale-110 transition-all shadow-4xl">
            Authorize System
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-20 px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 bg-black text-slate-800 font-black italic uppercase">
        <div className="text-3xl tracking-tighter">CrisisLink<span className="text-blue-600">.OS</span></div>
        <div className="flex gap-12 text-[10px] tracking-[0.4em]">
          <span>Protocol</span>
          <span>Security</span>
          <span>Documentation</span>
        </div>
        <div className="text-[11px] font-mono tracking-tighter">COMP_ENG_2026 // PROJECT_VANGUARD</div>
      </footer>
    </div>
  );
}