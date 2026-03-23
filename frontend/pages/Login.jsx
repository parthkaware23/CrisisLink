import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import { Shield, Lock, Mail, ChevronRight, Radio, Fingerprint, Activity, AlertCircle, Sun } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const globeRef = useRef();
  const [authMode, setAuthMode] = useState('citizen');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.8; // Thoda fast rotate
        globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.2 }); // Thoda nazdeek
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex overflow-hidden">
      
      {/* LEFT SIDE: BRIGHT VISUAL IMMERSION */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-white/10 items-center justify-center overflow-hidden">
        
        {/* LIGHTING EFFECTS (To brighten the Earth area) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] opacity-30"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full"></div>
        
        {/* THE BRIGHTER GLOBE */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Globe 
            ref={globeRef} 
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" // Brighter texture
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)" 
            atmosphereColor="#60a5fa" // Bright blue atmosphere
            atmosphereAltitude={0.15}
            width={1100} height={1100}
          />
        </div>

        {/* OVERLAY CONTENT */}
        <div className="relative z-20 p-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
             <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-[2px] w-20 bg-blue-500"></div>
                <Sun className="text-blue-400 animate-spin-slow" size={20} />
                <div className="h-[2px] w-20 bg-blue-500"></div>
             </div>
            <h1 className="text-[9vw] font-[1000] leading-[0.8] tracking-tighter uppercase italic mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              CRISIS <br /> <span className="text-blue-500">LINK.</span>
            </h1>
          </motion.div>
        </div>

        {/* SYSTEM COORDS */}
        <div className="absolute bottom-10 left-10 text-[10px] font-mono text-blue-400 opacity-60 flex gap-10 tracking-[0.2em] font-black">
            <span>GRID_SCAN: ACTIVE</span>
            <span>UPLINK_STATUS: OPTIMAL</span>
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN TERMINAL */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 relative bg-black">
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-14">
             <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.5em] uppercase text-[10px] mb-4">
                <Radio size={14} className="animate-pulse" /> Personnel Authentication
             </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">ACCESS HUB</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Secure Gateway v4.2</p>
          </div>

          {/* DUAL MODE SELECTOR */}
          <div className="flex gap-2 mb-12 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
            <button 
              onClick={() => setAuthMode('citizen')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 ${authMode === 'citizen' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-600 hover:text-white'}`}
            >
              Citizen
            </button>
            <button 
              onClick={() => setAuthMode('responder')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 ${authMode === 'responder' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-600 hover:text-white'}`}
            >
              Personnel
            </button>
          </div>

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Identification_Email</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-5 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                <Mail size={18} className="text-slate-700 group-focus-within:text-blue-500" />
                <input 
                  type="email" 
                  className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none uppercase placeholder:text-slate-800" 
                  placeholder="USER@LINK.OS"
                  required 
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {authMode === 'responder' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="group space-y-2"
                >
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Responder_Badge_ID</label>
                  <div className="flex items-center gap-4 bg-blue-600/5 border border-blue-500/20 p-5 rounded-2xl group-focus-within:border-blue-500 transition-all">
                    <Radio size={18} className="text-blue-900 group-focus-within:text-blue-400" />
                    <input 
                      type="text" 
                      className="bg-transparent w-full text-xs font-black tracking-widest text-blue-400 focus:outline-none uppercase placeholder:text-blue-950" 
                      placeholder="UNIT_ALPHA_SEC"
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Access_Key</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-5 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                <Lock size={18} className="text-slate-700 group-focus-within:text-blue-500" />
                <input 
                  type="password" 
                  className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none placeholder:text-slate-800" 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-white text-black hover:bg-blue-600 hover:text-white font-[1000] uppercase italic rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl group text-xl">
              INITIALIZE <Fingerprint size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-14 flex items-center justify-between px-2">
            <button onClick={() => navigate('/register')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-all underline underline-offset-4 decoration-blue-500/50">Request New ID</button>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Local Server: Online
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}