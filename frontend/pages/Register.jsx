import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'react-globe.gl';
import axios from 'axios';
import { Building2, Fingerprint } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const globeRef = useRef();
  const [role, setRole] = useState('citizen'); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    city: '',
    organization: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!navigator.geolocation) return alert("Location not supported by browser!");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        lat: latitude,
        lng: longitude,
        ...(role === 'responder' && { organization: formData.organization })
      };

      try {
        const endpoint = role === 'citizen' ? '/user/register' : '/responder/register';
        const res = await axios.post(`http://localhost:5000${endpoint}`, payload);  
  
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userRole', role);
          alert("Access Granted: Registration Successful!");
          navigate(`/${role}/dashboard`);
        } else {
          alert("Registered Successfully! Please Login.");
          navigate('/login');
        }
      } catch (err) {
        alert(err.response?.data?.msg || "Registration Failed!");
      }
    }, (error) => {
      alert("Location access is mandatory for CrisisLink!");
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex overflow-hidden font-sans">
      {/* LEFT: GLOBE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] border-r border-white/10 items-center justify-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1e40af_0%,_transparent_70%)] opacity-20"></div>
        <Globe 
          ref={globeRef} 
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(0,0,0,0)" 
          width={700} height={700}
        />
      </div>

      {/* RIGHT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 bg-black overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold mb-8 tracking-tight">Create Account</h2>

          {/* ROLE SWITCHER */}
          <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
            <button 
              type="button" 
              onClick={() => setRole('citizen')} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'citizen' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Citizen
            </button>
            <button 
              type="button" 
              onClick={() => setRole('responder')} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${role === 'responder' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Responder
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <input name="name" onChange={handleChange} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" required />
            </div>

            <input name="email" onChange={handleChange} type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" required />
            
            <input name="phoneNumber" onChange={handleChange} type="number" placeholder="Phone Number" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" required />
            
            <input name="city" onChange={handleChange} placeholder="City" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" required />

            <AnimatePresence>
              {role === 'responder' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <Building2 size={18} className="text-blue-500" />
                    <input name="organization" onChange={handleChange} placeholder="Organization Name" className="bg-transparent w-full text-sm text-blue-100 focus:outline-none" required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input name="password" onChange={handleChange} type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all" required />

            <button type="submit" className="w-full py-4 bg-white text-black hover:bg-blue-600 hover:text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all text-lg mt-6">
                Initialize Access
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an ID? <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer hover:underline">Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
}