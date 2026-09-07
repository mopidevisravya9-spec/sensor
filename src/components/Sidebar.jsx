import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  MapPin, 
  Activity, 
  Camera, 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  Settings,
  Waves
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Cpu },
  { id: 'map', label: 'Map View', icon: MapPin },
  { id: 'live', label: 'Live Monitoring', icon: Activity },
  { id: 'camera', label: 'AI Camera', icon: Camera },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, deviceCount }) {
  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 shadow-2xl">
      <div>
        {/* SCADA Brand Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 glow-cyan">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-wider flex items-center gap-1.5">
              HYDRO<span className="text-cyan-400">SENSE</span>
            </h1>
            <p className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-widest">
              Smart City SCADA v2.4
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-950/50 glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border hover:border-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'devices' && deviceCount !== undefined && (
                  <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {deviceCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="font-mono text-[11px]">POC MODE</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            LIVE API
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-full"></div>
        </div>
        <p className="mt-2 text-[10px] text-slate-500 text-center font-mono">
          Municipal Drain Network
        </p>
      </div>
    </aside>
  );
}
