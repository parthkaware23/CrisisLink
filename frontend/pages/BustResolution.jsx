import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, ArrowLeft, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function BustResolution() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/responder/request/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setRequest(res.data);
      } catch (err) {
        alert("Error fetching details");
      }
    };
    fetchDetails();
  }, [id]);

  const handleAction = async (verdict) => {
    if (!note) return alert("Write Notes");
    try {
      await axios.post(`http://localhost:5000/api/responder/resolve/${id}`, {
        status: verdict === 'FACTUAL' ? 'VERIFIED' : 'DEBUNKED',
        resolutionNote: note
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      alert("TRUTH_BROADCASTED: Result updated on blockchain/DB.");
      navigate('/responder/dashboard');
    } catch (err) {
      alert("Resolution failed!");
    }
  };

  if (!request) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading_Uplink...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all">
          <ArrowLeft size={18} /> BACK_TO_QUEUE
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Request Details */}
          <div className="space-y-8">
            <div>
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Analysis_Target</span>
              <h1 className="text-3xl font-black italic mt-4">"{request.query}"</h1>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Evidence_Files</label>
              <div className="grid grid-cols-2 gap-4">
                {request.evidenceLinks?.map((link, idx) => (
                  <div key={idx} className="aspect-video bg-black rounded-xl border border-white/10 overflow-hidden">
                    <img src={link.url} alt="evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Resolution Desk */}
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 flex flex-col h-fit sticky top-10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-blue-500" size={20}/> Resolution_Report
            </h2>
            
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-blue-500 min-h-[200px] resize-none mb-8"
              placeholder="Provide detailed analysis here..."
            />

            <div className="flex flex-col gap-4">
              <button onClick={() => handleAction('FACTUAL')} className="w-full py-5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3">
                <CheckCircle2 size={20} /> MARK_AS_FACTUAL
              </button>
              <button onClick={() => handleAction('FAKE')} className="w-full py-5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3">
                <ShieldAlert size={20} /> MARK_AS_MISINFORMATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}