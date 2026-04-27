import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ShieldCheck, Clock, Share2, 
  Target, Zap, AlertCircle, Database, Maximize2
} from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchSingleNews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/citizen/news/${id}`);
        setNews(response.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchSingleNews();
  }, [id]);

  if (!news) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="animate-pulse text-red-600 font-black italic tracking-[0.3em] uppercase text-[10px]">
        DECRYPTING_FILE_STREAM...
      </div>
    </div>
  );

  const displayMedia = news.imageUrl || "";
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  const isVideo = videoExtensions.some(ext => displayMedia.toLowerCase().endsWith(ext));

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-mono selection:bg-red-600/40 overflow-x-hidden relative">
      
      {/* Background Global Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* --- TOP HUD NAV --- */}
      <nav className="sticky top-0 z-[1000] bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 border border-white/10 hover:border-red-600 transition-all text-red-600 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">INTEL_ID: {id.slice(-8).toUpperCase()}</h2>
            </div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Status: Classified_Citizen_Report</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
           <div className="text-right">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Uplink_Strength</div>
              <div className="text-[10px] text-green-500 font-black tracking-widest uppercase italic">98.4%_STABLE</div>
           </div>
           <Database size={18} className="text-slate-700" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        
        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Media & Data */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative group border border-white/10 bg-black overflow-hidden shadow-[0_0_40px_rgba(0,0,0,1)]">
              {/* Media UI Overlays */}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <div className="bg-black/60 backdrop-blur-md border border-white/20 p-1 text-[8px] text-white px-2 uppercase font-black tracking-widest">Live_Capture</div>
                <div className="bg-red-600 p-1 text-[8px] text-black px-2 uppercase font-black tracking-widest italic">Encrypted</div>
              </div>
              <Maximize2 size={18} className="absolute bottom-4 right-4 text-white opacity-40 z-20" />
              
              <div className="relative min-h-[350px] flex items-center justify-center">
                {displayMedia ? (
                  isVideo ? (
                    <video controls autoPlay muted loop className="w-full h-auto object-contain">
                      <source src={displayMedia} type="video/mp4" />
                    </video>
                  ) : (
                    <img 
                      src={displayMedia} 
                      alt="Intel" 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://placehold.co/800x600/000000/ff0000?text=SIGNAL_LOST"; }}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-800">
                    <Target size={48} className="opacity-10" />
                    <span className="text-[10px] font-black tracking-[0.5em]">NO_VISUAL_DATA</span>
                  </div>
                )}
                {/* Visual Glitch/Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-10 w-full -translate-y-full animate-[scan_4s_linear_infinite] pointer-events-none opacity-20"></div>
              </div>
            </div>

            {/* Technical Stats Bar */}
            <div className="grid grid-cols-3 gap-1 px-1">
              {[
                { label: 'Time', val: new Date(news.createdAt).toLocaleTimeString(), icon: Clock },
                { label: 'Verify', val: 'Verified', icon: ShieldCheck },
                { label: 'Source', val: 'Node_Auth', icon: Zap }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-3 flex flex-col items-center justify-center text-center">
                  <stat.icon size={12} className="text-red-600 mb-1" />
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</span>
                  <span className="text-[10px] text-white font-bold italic uppercase">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Intel Text */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-[10px] font-black italic uppercase tracking-widest">Anomaly_Detected</span>
                <span className="text-slate-700 font-black text-[10px]">— DATA_FEED</span>
              </div>

              <h1 className="text-3xl font-black text-white italic uppercase leading-[0.9] tracking-tighter">
                {news.title}
              </h1>

              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-red-600/40"></div>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap pl-2 italic">
                  {news.description}
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-12 space-y-4">
               <div className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle size={16} className="text-blue-500" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Conflict_Resolution</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-6 italic leading-relaxed">
                    If this intel is suspected to be false or a rumor, initiate "Bust_Protocol" to notify global grid monitors.
                  </p>
                  <button 
                    onClick={() => navigate('/bust-news')}
                    className="w-full py-4 bg-transparent border-2 border-red-600 text-red-600 font-black uppercase italic tracking-widest hover:bg-red-600 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.15)] group relative overflow-hidden"
                  >
                    <span className="relative z-10">INITIALIZE_BUST_PROTOCOL</span>
                    <div className="absolute inset-0 bg-red-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
               </div>
               
               <button className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-white transition-colors py-2 text-[10px] font-black uppercase tracking-widest">
                 <Share2 size={14} /> Encrypt_&_Share_Link
               </button>
            </div>
          </div>
        </div>

      </main>

      {/* Ticker for extra vibe */}
      <footer className="fixed bottom-0 w-full h-8 bg-black border-t border-white/10 flex items-center overflow-hidden z-[1001]">
        <div className="bg-red-600 h-full px-4 flex items-center text-black font-black text-[10px] italic skew-x-[-20deg] -translate-x-2">
           SECURE_LINE
        </div>
        <marquee className="text-[9px] text-slate-600 font-black italic tracking-[0.5em] flex-1">
          +++ MONITORING_SECTOR_PUNE +++ NODES_CONFIRMED: {id.slice(0,4)} +++ DATA_ENCRYPTION: AES_256_V2 +++ NO_UNAUTHORIZED_ACCESS +++ 
        </marquee>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(600%); }
        }
      `}</style>
    </div>
  );
}