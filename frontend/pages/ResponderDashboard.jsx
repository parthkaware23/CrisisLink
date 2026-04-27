import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Radio, ShieldAlert, CheckCircle2, 
  XCircle, LogOut, Bot, Search, Clock, 
  AlertCircle, Activity, Send, FileText, Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResponderDashboard() {
  const navigate = useNavigate();
  const [selectedRumor, setSelectedRumor] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [queue, setQueue] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. FETCH LIVE QUEUE (With Auth Headers & Array Fix) ---
  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/responder/queue', {
        headers: { 'x-auth-token': token }
      });

      // Agar backend se wrap hoke data aa raha ho toh handle karne ke liye
      const finalData = Array.isArray(res.data) ? res.data : (res.data.queue || res.data.data || []);
      
      setQueue(finalData);
      setIsLoading(false);
    } catch (err) {
      console.error("QUEUE_FETCH_ERROR", err);
      setQueue([]); // Crash se bachne ke liye
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Thoda fast refresh (5s)
    return () => clearInterval(interval);
  }, []);

  const handleSelectRumor = async (rumor) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/responder/claim/${rumor._id}`, {}, {
        headers: { 'x-auth-token': token } 
      });
      navigate(`/resolution/${rumor._id}`);
    } catch (err) {
      console.error("Claim Error Details:", err.response?.data); 
      alert("CLAIM_FAILED: " + (err.response?.data?.msg || "Shayad rasta galat hai!"));
    }
  };

  // --- 3. FINAL VERDICT (Broadcast) ---
  const handleBustAction = async (verdict) => {
    if (!verificationNote) return alert("Please add a verification note first!");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/responder/resolve/${selectedRumor._id}`, {
        status: verdict === 'FACTUAL' ? 'VERIFIED' : 'DEBUNKED',
        resolutionNote: verificationNote
      }, {
        headers: { 'x-auth-token': token }
      });

      alert(`TRUTH BROADCASTED: Marked as ${verdict}`);
      setSelectedRumor(null);
      setVerificationNote('');
      fetchQueue();
    } catch (err) {
      alert("BROADCAST_ERROR: Resolution failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      
      {/* --- NAV --- */}
      <nav className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl px-8 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <Radio className="text-blue-500 animate-pulse" size={20} />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase italic text-white">
            Truth<span className="text-blue-500">_Responder</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 border-r border-white/10 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Incoming_Signals</span>
              <span className="text-sm font-mono font-black text-blue-500">
                {Array.isArray(queue) ? queue.length : 0}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-full transition-all group">
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* --- MAIN QUEUE --- */}
        <main className={`flex-1 overflow-y-auto p-8 bg-[#080808] transition-all duration-500 ${selectedRumor ? 'mr-[450px]' : ''}`}>
          <div className="max-w-5xl mx-auto">
            <header className="mb-10">
              <div className="flex items-center gap-2 text-blue-500 mb-1">
                 <Activity size={14}/>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operational Command Feed</span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic text-white">Verification_Queue</h2>
            </header>

            <div className="grid gap-4">
              {/* Empty State Check */}
              {(!Array.isArray(queue) || queue.length === 0) && !isLoading && (
                <div className="text-center py-20 opacity-20 font-black tracking-[0.5em]">SYSTEM_IDLE: NO_PENDING_RUMORS</div>
              )}

              {/* Data Rendering */}
              {Array.isArray(queue) && queue.map(rumor => (
                <motion.div 
                  layout
                  whileHover={{ x: 8 }}
                  onClick={() => handleSelectRumor(rumor)}
                  key={rumor._id} 
                  className={`group p-8 rounded-[2.5rem] border transition-all cursor-pointer relative overflow-hidden ${
                      selectedRumor?._id === rumor._id 
                      ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20' 
                      : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded uppercase tracking-widest border border-blue-500/20">
                          {rumor.priority || 'NORMAL'} PRIORITY
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono font-bold flex items-center gap-1.5">
                          <Clock size={12}/> {new Date(rumor.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white leading-tight tracking-tight italic">
                        "{rumor.query}"
                      </h3>
                    </div>
                    <div className={`p-5 rounded-2xl transition-all ${selectedRumor?._id === rumor._id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-600 group-hover:text-blue-500'}`}>
                      <Send size={22} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {/* --- RIGHT PANEL --- */}
        <AnimatePresence>
          {selectedRumor && (
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-16 bottom-0 w-[450px] bg-black border-l border-white/10 p-10 flex flex-col z-50 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] overflow-y-auto"
            >
              <button onClick={() => setSelectedRumor(null)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full text-slate-400 transition-all">
                <XCircle size={26}/>
              </button>

              <div className="mt-6 mb-8">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Analysis_Module_Active</span>
                <h2 className="text-2xl font-black italic text-white mt-2 leading-tight">"{selectedRumor.query}"</h2>
              </div>

              {/* Evidence Section */}
              <div className="mb-8">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Evidence_Attachments</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRumor.evidenceLinks?.map((link, idx) => (
                    <div key={idx} className="aspect-square bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all group relative">
                      <img src={link.url} alt="evidence" className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[8px] font-bold uppercase">{link.fileType}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Box */}
              <div className="mt-auto space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Broadcast_Report</label>
                  <textarea 
                    value={verificationNote}
                    onChange={(e) => setVerificationNote(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:border-blue-500 min-h-[150px] resize-none text-white"
                    placeholder="Enter official verdict details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleBustAction('FACTUAL')} className="py-5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 font-black uppercase tracking-widest rounded-2xl text-[10px] flex items-center justify-center gap-2 transition-all">
                    <CheckCircle2 size={18} /> Confirm Fact
                  </button>
                  <button onClick={() => handleBustAction('MISINFORMATION')} className="py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black uppercase tracking-widest rounded-2xl text-[10px] flex items-center justify-center gap-2 transition-all">
                    <ShieldAlert size={18} /> Mark as Fake
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}