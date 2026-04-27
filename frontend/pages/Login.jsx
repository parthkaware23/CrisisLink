import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import axios from 'axios';
import { Shield, Lock, Mail, Radio, Fingerprint, Sun, Key } from 'lucide-react'; // Key icon add kiya

export default function Login() {
  const navigate = useNavigate();
  const globeRef = useRef();
  const [authMode, setAuthMode] = useState('citizen');
  
  // --- LOGIN STATE ---
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminSecretKey: '', // Admin key ke liye state
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GLOBE LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.8;
        globeRef.current.pointOfView({ lat: 20, lng: 70, altitude: 2.2 });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logic for selecting endpoint
      let endpoint = '/user/login';
      if (authMode === 'responder') endpoint = '/responder/login';
      if (authMode === 'admin') endpoint = '/admin/login';
      
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      // Agar Admin hai toh secret key bhi bhejo
      if (authMode === 'admin') {
        payload.secretKey = formData.adminSecretKey;
      }

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', authMode);
        
        alert(`IDENTITY VERIFIED: ACCESS GRANTED [${authMode.toUpperCase()}]`);
        navigate(`/${authMode}/dashboard`);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Authentication Failed: Access Denied");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans flex overflow-hidden">
      
      {/* LEFT SIDE: GLOBE (Keep as it is) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] opacity-30"></div>
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
            <h1 className="text-[9vw] font-[1000] leading-[0.8] tracking-tighter uppercase italic mb-8 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              CRISIS <br /> <span className="text-blue-500">LINK.</span>
            </h1>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 relative bg-black">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md w-full mx-auto">
          
          <div className="mb-10">
             <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.5em] uppercase text-[10px] mb-4">
                <Radio size={14} className="animate-pulse" /> Authentication Protocol
             </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-2">ACCESS HUB</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Secure Gateway v4.2</p>
          </div>

          {/* TRIPLE MODE SELECTOR */}
          <div className="flex gap-2 mb-10 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
            {['citizen', 'responder', 'admin'].map((mode) => (
              <button 
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`flex-1 py-3 rounded-xl text-[9px] font-[1000] uppercase tracking-widest transition-all duration-300 ${authMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="group space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Identification_Email</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl group-focus-within:border-blue-500/50 transition-all">
                <Mail size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                <input 
                  name="email" type="email" onChange={handleChange}
                  className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none uppercase" 
                  placeholder="USER@LINK.OS" required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">Access_Key</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-xl group-focus-within:border-blue-500/50 transition-all">
                <Lock size={16} className="text-slate-700 group-focus-within:text-blue-500" />
                <input 
                  name="password" type="password" onChange={handleChange}
                  className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none" 
                  placeholder="••••••••" required 
                />
              </div>
            </div>

            {/* ADMIN SECRET KEY FIELD (Only shows when Admin is selected) */}
            <AnimatePresence>
              {authMode === 'admin' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="group space-y-1 overflow-hidden"
                >
                  <label className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1">Root_Secret_Key</label>
                  <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 p-4 rounded-xl group-focus-within:border-red-500/50 transition-all">
                    <Key size={16} className="text-red-900 group-focus-within:text-red-500" />
                    <input 
                      name="adminSecretKey" type="password" onChange={handleChange}
                      className="bg-transparent w-full text-xs font-bold tracking-widest focus:outline-none text-red-500" 
                      placeholder="ENTER ROOT KEY" required 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className={`w-full py-5 font-[1000] uppercase italic rounded-2xl flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl group text-lg ${authMode === 'admin' ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
              {authMode === 'admin' ? 'BYPASS SECURITY' : 'INITIALIZE'} <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-10 flex items-center justify-between px-2">
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