import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Repeat2, Heart, Share2, 
  BadgeCheck, 
  MoreHorizontal 
} from 'lucide-react';
export default function AllNews() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/all-news');
        setNews(res.data);
      } catch (err) {
        console.error("Fetch Error", err);
      }
    };
    fetchAllNews();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-2xl mx-auto border-x border-white/10 min-h-screen">
        
        {/* HEADER */}
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-8 z-50">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Global Feed</h2>
            <p className="text-xs text-slate-500 font-mono italic uppercase tracking-widest">{news.length} Reports_Live</p>
          </div>
        </header>

        {/* FEED */}
        <div className="divide-y divide-white/10">
          {news.length > 0 ? news.map((item) => (
            <article key={item._id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4">
              {/* Fake Avatar */}
              <div className="w-12 h-12 bg-red-600 rounded-full shrink-0 flex items-center justify-center font-black italic text-sm shadow-lg shadow-red-600/20">
                CG
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold hover:underline">Citizen_Node_{item._id.slice(-3)}</span>
                  <span className="text-blue-400"><BadgeCheck size={14} /></span>
                  <span className="text-slate-500 text-sm ml-1">@{item.category || 'global'} · {new Date(item.createdAt).toLocaleDateString()}</span>
                  <button className="ml-auto text-slate-500"><MoreHorizontal size={16}/></button>
                </div>

                <p className="text-[14px] leading-normal mb-3 text-slate-200">
                  {item.title}
                  <span className="block mt-2 text-slate-400 font-normal italic text-sm lowercase tracking-normal">
                    {item.description}
                  </span>
                </p>

                {/* X-Style Interaction Bar */}
                <div className="flex justify-between text-slate-500 max-w-md mt-4">
                  <div className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <div className="p-2 group-hover:bg-blue-400/10 rounded-full"><MessageSquare size={18} /></div>
                    <span className="text-xs">24</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors group">
                    <div className="p-2 group-hover:bg-emerald-400/10 rounded-full"><Repeat2 size={18} /></div>
                    <span className="text-xs">12</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-pink-400 transition-colors group">
                    <div className="p-2 group-hover:bg-pink-400/10 rounded-full"><Heart size={18} /></div>
                    <span className="text-xs">154</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-blue-400 transition-colors group">
                    <div className="p-2 group-hover:bg-blue-400/10 rounded-full"><Share2 size={18} /></div>
                  </div>
                </div>
              </div>
            </article>
          )) : (
            <div className="p-20 text-center text-slate-600 animate-pulse font-black italic tracking-[0.5em]">
              UPLINKING_FROM_SATELLITE...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}