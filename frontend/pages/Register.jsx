import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import { ShieldCheck, User, MapPin, Mail, Lock, Building2, Radio, Fingerprint, ChevronRight, Activity } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const globeRef = useRef();
  const [role, setRole] = useState('citizen'); // citizen | responder

  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.8;
        globeRef.current.pointOfView({ lat: -20, lng: 10, altitude: 2.2 }); // Different angle than login
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex overflow-hidden">
      
      
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-white/10 items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] opacity-30"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full"></div>
        
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Globe 
            ref={globeRef} 
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)" 
            atmosphereColor="#60a5fa" 
            atmosphereAltitude={0.15}
            width={1100} height={1100}
          />
        </div>

        <div className="relative z-20 p-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
            <h1 className="text-[9vw] font-[1000] leading-[0.8] tracking-tighter uppercase italic mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              JOIN <br /> <span className="text-blue-500">FORCE.</span>
            </h1>
            <div className="flex items-center justify-center gap-6 text-slate-500 font-black tracking-[0.4em] uppercase text-[10px]">
              <Activity className="text-blue-500 animate-pulse" /> Initialization_Sequence_02
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-start px-8 md:px-24 py-16 relative bg-black overflow-y-auto custom-scrollbar">
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
             <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.5em] uppercase text-[10px] mb-4">
                <ShieldCheck size={14} className="animate-pulse" /> New Node Registration
             </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">CREATE ID</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Operational Clearance v4.2</p>
          </div>

          {/* ROLE SELECTOR (Sync with Login Style) */}
          <div className="flex gap-2 mb-10 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
            <button 
              onClick={() => setRole('citizen')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 ${role === 'citizen' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-600 hover:text-white'}`}
            >
              Citizen
            </button>
            <button 
              onClick={() => setRole('responder')}
              className={`flex-1 py-4 rounded-xl text-[10px] font-[1000] uppercase tracking-widest transition-all duration-300 ${role === 'responder' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-600 hover:text-white'}`}
            >
              Responder
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500">Full_Name</label>
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                  <User size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                  <input type="text" className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none uppercase placeholder:text-slate-800" placeholder="NAME" required />
                </div>
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500">Location</label>
                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                  <MapPin size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                  <input type="text" className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none uppercase placeholder:text-slate-800" placeholder="CITY" required />
                </div>
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500">Secure_Email</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                <Mail size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                <input type="email" className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none uppercase placeholder:text-slate-800" placeholder="EMAIL@LINK.OS" required />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {role === 'responder' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 py-2"
                >
                  <div className="group space-y-2">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Organization_Identity</label>
                    <div className="flex items-center gap-4 bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl group-focus-within:border-blue-500 transition-all">
                      <Building2 size={16} className="text-blue-900 group-focus-within:text-blue-400" />
                      <input type="text" className="bg-transparent w-full text-xs font-black tracking-widest text-blue-400 focus:outline-none uppercase placeholder:text-blue-950" placeholder="ORG_NAME" required />
                    </div>
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Service_Badge_ID</label>
                    <div className="flex items-center gap-4 bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl group-focus-within:border-blue-500 transition-all">
                      <Radio size={16} className="text-blue-900 group-focus-within:text-blue-400" />
                      <input type="text" className="bg-transparent w-full text-xs font-black tracking-widest text-blue-400 focus:outline-none uppercase placeholder:text-blue-950" placeholder="VGD_SEC_UNIT" required />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500">Security_Key</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl group-focus-within:border-blue-500/50 transition-all">
                <Lock size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                <input type="password" placeholder="••••••••" className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none placeholder:text-slate-800" required />
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-white text-black hover:bg-blue-600 hover:text-white font-[1000] uppercase italic rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl group text-xl mt-4">
              INITIALIZE <Fingerprint size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
          </form>

          <div className="mt-10 mb-10 text-center">
             <button onClick={() => navigate('/login')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-all underline underline-offset-8 decoration-blue-500/50">
               Authorized Personnel? Connect Terminal
             </button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e40af; border-radius: 10px; }
      `}</style>
    </div>
  );
}