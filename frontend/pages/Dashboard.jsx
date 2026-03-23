import MapView from '../components/MapView'; // Pehle jo banaya tha

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
          <h1 className="text-xl font-bold text-white tracking-tighter">GCI SYSTEM</h1>
        </div>

        <div className="flex-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Active Crises</h3>
          {/* Loop for events will go here */}
          <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-red-500 mb-3 hover:bg-slate-750 transition-all cursor-pointer">
            <h4 className="text-sm font-bold text-white">Forest Fire - California</h4>
            <p className="text-xs text-slate-400 mt-1 italic">Reported 2m ago</p>
          </div>
        </div>

        <button className="mt-auto p-3 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-all text-sm font-medium">
          Settings
        </button>
      </aside>

      {/* Map Section */}
      <main className="flex-1 relative">
        <div className="absolute top-4 right-4 z-[1000] bg-slate-900/80 p-2 rounded-lg border border-slate-700 backdrop-blur-md">
            <span className="text-xs font-bold text-emerald-400 px-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                SYSTEM LIVE
            </span>
        </div>
        {/* <MapView /> component yahan aayega */}
        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
           [ MAP LOADING... ]
        </div>
      </main>
    </div>
  );
}