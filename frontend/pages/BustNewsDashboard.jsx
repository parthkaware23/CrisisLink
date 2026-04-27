import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, X, ShieldAlert, 
  Send, FileVideo, FileImage, Trash2, Plus
} from 'lucide-react';
import axios from 'axios';

export default function BustNewsDashboard() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); 
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type
    }));
    setFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    console.log("DEBUG: Current Token found in Storage:", token);

    if (!token) {
      alert("SESSION_EXPIRED: Bhai, login toh kar le pehle!");
      return navigate('/login'); // Ya jo bhi tera login route hai
    }

    if (files.length === 0) return alert("EVIDENCE_MISSING: Upload files first.");
    
    setIsSubmitting(true);

    try {
      const requestData = {
        query: query,
        evidenceLinks: files.map(f => ({ url: f.preview, fileType: f.type })), 
        priority: 'MEDIUM'
      };

      const response = await axios.post('http://localhost:5000/bust-news/submit', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token 
        }
      });

      if (response.data.success) {
        alert("SIGNAL_BROADCASTED: Added to Responder Queue.");
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      console.error("UPLINK_ERROR:", err.response?.data || err.message);
      
      const errMsg = err.response?.data?.msg || "TRANSMISSION_FAILED";
      alert(`ERROR: ${errMsg}`);
      
      if (err.response?.status === 401) {
        console.log("Redirecting to login due to 401...");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-mono selection:bg-red-600/30">
      <nav className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 border border-white/5 text-red-600 mr-6">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <ShieldAlert size={20} className="text-red-600 animate-pulse" />
          <h1 className="text-lg font-black tracking-widest uppercase italic text-white">RUMOR_BUST_PROTOCOL</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-4 bg-red-600"></div>
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Evidence_Upload_Zone</h2>
               </div>
               <span className="text-[9px] text-slate-500 font-bold uppercase">Files_Attached: {files.length}</span>
            </div>

            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="relative group min-h-[250px] border-2 border-dashed border-white/10 hover:border-red-600/50 bg-white/[0.02] transition-all flex flex-col items-center justify-center p-8 rounded-sm"
            >
              <input 
                type="file" 
                multiple 
                className="hidden" 
                id="multi-upload" 
                onChange={(e) => handleFiles(e.target.files)} 
              />
              <label htmlFor="multi-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="p-5 bg-white/5 rounded-full text-slate-600 group-hover:text-red-600 group-hover:scale-110 transition-all">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Drop Multiple Evidence Files</p>
                  <p className="text-[10px] text-slate-500 mt-2 italic uppercase">Images or Videos</p>
                </div>
              </label>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {files.map((f) => (
                  <div key={f.id} className="group relative aspect-square bg-black border border-white/10 overflow-hidden rounded-sm">
                    {f.type.startsWith('video') ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <FileVideo size={24} className="text-red-600" />
                      </div>
                    ) : (
                      <img src={f.preview} alt="preview" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="absolute top-1 right-1 p-1.5 bg-black/80 text-red-500 border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <label htmlFor="multi-upload" className="flex items-center justify-center aspect-square border border-dashed border-white/10 hover:bg-white/5 cursor-pointer text-slate-600">
                  <Plus size={20} />
                </label>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-red-600"></div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Protocol_Inquiry</label>
            </div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="State the discrepancy or detail you want verified..."
              className="w-full h-40 bg-[#080808] border border-white/10 p-5 text-sm text-slate-200 focus:border-red-600 outline-none transition-all resize-none"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-6 flex items-center justify-center gap-4 transition-all relative border border-white/10 ${
              isSubmitting ? 'bg-slate-900 cursor-wait' : 'bg-red-600 hover:bg-white text-black'
            }`}
          >
            {isSubmitting ? (
              <span className="text-[11px] font-black animate-pulse tracking-[0.5em]">UPLINKING_TO_LAB...</span>
            ) : (
              <>
                <Send size={20} />
                <span className="text-sm font-[1000] tracking-[0.6em] uppercase italic">START_VERIFICATION</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}