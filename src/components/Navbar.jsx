import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, Radio, Search, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing, activeDevice, onSelectDevice, devices }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search & Active Node Selection */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select 
            value={activeDevice || ''} 
            onChange={(e) => onSelectDevice && onSelectDevice(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 appearance-none font-mono"
          >
            <option value="">-- All Node Selection --</option>
            {devices && devices.map(d => (
              <option key={d.device_id} value={d.device_id}>
                {d.name} [{d.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center SCADA Status Badge */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-mono text-slate-300">SCADA NODE MESH</span>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          REST API LINKED
        </span>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-3">
        {/* Manual Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          title="Refresh Backend Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Clock */}
        <div className="hidden sm:block text-right font-mono border-l border-slate-800 pl-3">
          <div className="text-xs font-bold text-slate-200">{time}</div>
          <div className="text-[10px] text-slate-500">UTC REALTIME</div>
        </div>
      </div>
    </header>
  );
}
