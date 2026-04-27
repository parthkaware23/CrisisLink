import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, Activity, SearchCheck, Newspaper, 
  MessageSquare, Repeat2, Heart, Share2, BadgeCheck, Zap, Globe as GlobeIcon
} from 'lucide-react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

export default function UserDashboard() {
  const navigate = useNavigate();
  const globeEl = useRef();
  const [newsFeed, setNewsFeed] = useState([]);
  const [worldData, setWorldData] = useState({ features: [] });
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/citizen/news');
      setNewsFeed(response.data);
    } catch (err) {
      console.error("News Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    if (worldData.features.length === 0) {
      fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(data => setWorldData(data));
    }
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  const activeCountryCodes = useMemo(() => {
    return new Set(newsFeed.map(news => {
      const dbValue = (news.countryCode || news.country || "").trim();
      if (!dbValue) return null;
      return dbValue.length === 2 
        ? countries.alpha2ToAlpha3(dbValue.toUpperCase()) 
        : countries.getAlpha3Code(dbValue, "en");
    }).filter(Boolean));
  }, [newsFeed]);

  const displayNews = useMemo(() => {
    if (!selectedCountry) return newsFeed.slice(0, 20);
    return newsFeed.filter(news => {
      const dbValue = (news.country || news.countryCode || "").trim().toUpperCase();
      const iso3 = dbValue.length === 2 ? countries.alpha2ToAlpha3(dbValue) : countries.getAlpha3Code(dbValue, "en");
      return iso3 === selectedCountry;
    });
  }, [newsFeed, selectedCountry]);

  const handleNewsClick = (newsId) => {
    if (newsId) navigate(`/news/${newsId}`);
  };

  return (
    <div className="h-screen w-screen bg-[#020202] text-slate-300 font-mono overflow-hidden flex flex-col tracking-tighter">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc2626; }
        .glow-border:hover { box-shadow: 0 0 15px rgba(220, 38, 38, 0.2); }
      `}</style>

      {/* --- TOP HUD --- */}
      <header className="h-16 border-b-2 border-red-600/20 bg-black flex items-center justify-between px-8 z-[1001] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-red-600 font-black tracking-[0.3em]">OPERATIONAL_UNIT</span>
            <div className="flex items-center gap-3">
               <GlobeIcon size={20} className="text-white animate-spin-slow" />
               <h1 className="text-2xl font-[1000] tracking-tighter text-white italic uppercase">Citizen_<span className="text-red-600">Grid</span>_Terminal</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 border-l border-white/10 flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold">LATENCY: 24MS</span>
            <span className="text-[10px] text-green-500 font-bold">SIGNAL: ENCRYPTED</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }} 
            className="ml-4 p-3 bg-red-600/10 border border-red-600/40 rounded-full hover:bg-red-600 hover:text-white transition-all group"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative flex overflow-hidden">
        
        {/* --- MEGA SIDEBAR (500px) --- */}
        <aside className="w-[500px] bg-[#050505] border-r-2 border-white/5 flex flex-col z-[1000] shadow-[30px_0_60px_rgba(0,0,0,0.8)]">
          
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-red-900/10 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-black text-red-600 tracking-[0.5em] mb-1">INTEL_REPORTS</h2>
                <div className="text-2xl font-black text-white italic">
                  {selectedCountry ? `SECTOR_${selectedCountry}` : 'GLOBAL_STREAMS'}
                </div>
              </div>
              <Activity size={32} className="text-red-600/50 animate-pulse" />
            </div>

            <div className="flex gap-4">
               <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-sm">
                  <div className="text-[9px] text-slate-500 mb-1">NODES_ACTIVE</div>
                  <div className="text-xl font-bold text-white">{activeCountryCodes.size}</div>
               </div>
               <div className="flex-1 bg-white/5 border border-white/10 p-3 rounded-sm">
                  <div className="text-[9px] text-slate-500 mb-1">DATA_PACKETS</div>
                  <div className="text-xl font-bold text-white">{newsFeed.length}</div>
               </div>
            </div>

            {selectedCountry && (
              <button 
                onClick={() => setSelectedCountry(null)} 
                className="w-full mt-4 py-2 bg-blue-600/20 border border-blue-500/50 text-blue-400 text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all"
              >
                RETURN_TO_GLOBAL_SCAN [ESC]
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
            {displayNews.length > 0 ? displayNews.map(news => (
              <div 
                key={news._id} 
                onClick={() => handleNewsClick(news._id)}
                className="group relative p-6 bg-black border border-white/10 glow-border transition-all cursor-pointer rounded-sm overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <BadgeCheck size={16} className="text-blue-500" />
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 bg-red-600 text-black text-[9px] font-black uppercase tracking-tighter">
                    {news.countryCode || 'GLOBAL'}
                  </span>
                  <span className="h-[1px] flex-1 bg-white/10"></span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {new Date(news.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-slate-100 leading-snug uppercase group-hover:text-red-500 transition-colors">
                  {news.title}
                </h3>
                
                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                  DECRYPTED_MSG: Proceed with caution. Intelligence suggests high-level movement in the sector...
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-6 text-slate-600 group-hover:text-slate-300">
                    <MessageSquare size={16} className="hover:text-blue-500 transition-colors" />
                    <Repeat2 size={16} className="hover:text-green-500 transition-colors" />
                    <Heart size={16} className="hover:text-red-500 transition-colors" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 tracking-widest uppercase">
                    Ref_ID: {news._id.slice(-6)}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20">
                <Zap size={60} />
                <span className="mt-4 tracking-[1em] text-sm font-black animate-pulse">NO_SIGNAL</span>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#080808] border-t border-white/10">
            <button 
              onClick={() => navigate('/all-news')} 
              className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-sm flex items-center justify-center gap-4 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-red-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Newspaper size={20} className="relative z-10" />
              <span className="text-sm font-black tracking-[0.4em] relative z-10">OPEN_FULL_ARCHIVE</span>
            </button>
          </div>
        </aside>

        {/* --- GLOBE AREA --- */}
        <main className="flex-1 relative bg-black">
          <div className="absolute top-10 right-10 z-50">
             <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-sm flex flex-col gap-2">
                <div className="text-[9px] text-slate-500 tracking-widest font-black uppercase italic">Navigation_Tips</div>
                <div className="text-[10px] text-white/70 tracking-tighter">• Click Sector to filter</div>
                <div className="text-[10px] text-white/70 tracking-tighter">• Scroll to zoom intel</div>
             </div>
          </div>

          <div className="absolute bottom-10 left-10 z-50 pointer-events-none">
            <button 
              onClick={() => navigate('/bust-news')} 
              className="px-8 py-4 bg-blue-600 text-white font-[1000] italic text-sm tracking-widest shadow-[0_0_50px_rgba(37,99,235,0.4)] border-2 border-blue-400 flex items-center gap-4 hover:bg-blue-700 hover:scale-105 transition-all pointer-events-auto active:scale-95 uppercase"
            >
              <SearchCheck size={20} /> ANALYZE_RUMOR_STREAM
            </button>
          </div>

          <Globe
            ref={globeEl}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            polygonsData={worldData.features}
            
            polygonCapColor={(d) => {
              const iso = d?.properties?.ISO_A3;
              if (iso === selectedCountry) return 'rgba(59, 130, 246, 0.7)';
              if (activeCountryCodes.has(iso)) return 'rgba(220, 38, 38, 0.6)';
              return 'rgba(255, 255, 255, 0.04)';
            }}

            polygonSideColor={() => 'rgba(255, 255, 255, 0.05)'}
            polygonStrokeColor={(d) => {
              const iso = d?.properties?.ISO_A3;
              if (iso === selectedCountry) return '#3b82f6';
              return activeCountryCodes.has(iso) ? '#dc2626' : '#ffffff11';
            }}

            polygonAltitude={(d) => d?.properties?.ISO_A3 === selectedCountry ? 0.08 : 0.01} 
            polygonsTransitionDuration={800}

            onPolygonClick={(d) => {
              if (!d) return;
              const iso = d.properties.ISO_A3;
              setSelectedCountry(iso);
              globeEl.current.pointOfView({ 
                lat: d.properties.LABEL_Y, 
                lng: d.properties.LABEL_X, 
                altitude: 1.6 
              }, 1500);
            }}

            polygonLabel={(d) => `
              <div style="background: #000; border: 2px solid #dc2626; padding: 15px; color: #fff; font-family: monospace; text-transform: uppercase;">
                <div style="color: #dc2626; font-size: 14px; font-weight: 900; margin-bottom: 5px;">${d.properties.NAME}</div>
                <div style="font-size: 10px; color: #888;">ISO_CODE: ${d.properties.ISO_A3}</div>
                <div style="margin-top: 10px; font-size: 11px; background: #dc2626; color: #000; padding: 2px 5px; font-weight: bold;">
                   ${activeCountryCodes.has(d.properties.ISO_A3) ? '⚠️ ANOMALY_ALERT' : 'STABLE_NODE'}
                </div>
              </div>
            `}
          />
        </main>
      </div>

      <footer className="h-10 bg-black border-t-2 border-red-600/30 flex items-center overflow-hidden shrink-0">
        <div className="bg-red-600 h-full flex items-center px-10 font-[1000] italic text-black skew-x-[-25deg] translate-x-[-20deg] border-r-8 border-black shadow-[10px_0_30px_rgba(220,38,38,0.5)]">
          <span className="skew-x-[25deg] text-xs uppercase tracking-[0.2em]">Live_Intelligence_Stream</span>
        </div>
        <marquee className="flex-1 text-red-600 font-black italic tracking-[0.8em] text-xs uppercase">
          +++ SECURING DATA NODES +++ DECRYPTING {displayNews.length} SOURCES +++ MONITORING GLOBAL SECTORS +++ SYSTEM STATUS: OPTIMAL +++
        </marquee>
      </footer>
    </div>
  );
}