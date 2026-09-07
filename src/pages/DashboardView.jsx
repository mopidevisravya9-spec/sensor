import React from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff,
  AlertOctagon,
  Camera,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import AICameraCard from '../components/AICameraCard';
import { CardSkeleton } from '../components/SkeletonLoader';

export default function DashboardView({ 
  summary, 
  loading, 
  devices, 
  alerts, 
  onSelectDevice, 
  cameraData
}) {
  const cards = [
    {
      title: "Total Devices",
      value: summary?.total_devices,
      unit: "Registered",
      icon: Cpu,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      emptyText: "Waiting for Device"
    },
    {
      title: "Online Devices",
      value: summary?.online_devices,
      unit: "Active Nodes",
      icon: Wifi,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      emptyText: "Device Offline"
    },
    {
      title: "Offline Devices",
      value: summary?.offline_devices,
      unit: "Nodes Disconnected",
      icon: WifiOff,
      color: "text-slate-400",
      bg: "bg-slate-800 border-slate-700",
      emptyText: "No Offline Devices"
    },
    {
      title: "Critical Alerts",
      value: summary?.critical_alerts,
      unit: "Unresolved",
      icon: AlertOctagon,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      emptyText: "No Critical Alerts"
    },
    {
      title: "Active Cameras",
      value: summary?.active_cameras,
      unit: "Live Streams",
      icon: Camera,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
      emptyText: "Waiting for Camera..."
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Municipal SCADA Overview
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              POC LIVE API
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and status monitoring across municipal drain infrastructure.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array(5).fill(0).map((_, i) => <CardSkeleton key={i} />)
          : cards.map((card, idx) => {
              const Icon = card.icon;
              const hasData = card.value !== null && card.value !== undefined;

              return (
                <div 
                  key={idx} 
                  className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">{card.title}</span>
                    <div className={`p-2 rounded-xl border ${card.bg} ${card.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="my-3">
                    {hasData ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold font-mono text-slate-100">
                          {card.value}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-medium">
                          {card.unit}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm font-mono text-slate-500 font-medium py-1">
                        {card.emptyText}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>API SYNC: LIVE</span>
                    <span>{hasData ? 'STATUS OK' : 'NO BACKEND DATA'}</span>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Live Raspberry Pi camera and YOLO data */}
      <div className="grid grid-cols-1 gap-4">
        <AICameraCard cameraData={cameraData} />
      </div>

      {/* Device Quick Status Table & Recent Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Registered Devices Grid */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Registered Drain Monitoring Nodes
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Showing {devices?.length || 0} Nodes
            </span>
          </div>

          {!devices || devices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Waiting for Device... (No registered nodes found in API)
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2 font-medium">NAME & LOCATION</th>
                    <th className="pb-2 font-medium">STATUS</th>
                    <th className="pb-2 font-medium">BATTERY</th>
                    <th className="pb-2 font-medium">LAST SEEN</th>
                    <th className="pb-2 text-right font-medium">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {devices.map((dev) => (
                    <tr key={dev.device_id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3">
                        <div className="font-sans font-medium text-slate-200">{dev.name}</div>
                        <div className="text-[10px] text-slate-500">{dev.location}</div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                          dev.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          dev.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          dev.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {dev.status}
                        </span>
                      </td>
                      <td className="py-3">{dev.battery !== null && dev.battery !== undefined ? `${dev.battery}%` : 'N/A'}</td>
                      <td className="py-3 text-slate-400">
                        {dev.last_seen ? dev.last_seen.slice(11, 19) : 'Waiting for Device'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectDevice(dev.device_id)}
                          className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          Monitor <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Recent SCADA System Alerts */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Live System Alerts
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                REST FEED
              </span>
            </div>

            {!alerts || alerts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs flex flex-col items-center">
                <ShieldCheck className="w-8 h-8 text-emerald-500/40 mb-2" />
                No active alerts. All drain sensors operating normally.
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {alerts.slice(0, 5).map((a, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-cyan-400 font-mono">{a.device}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        a.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-800' :
                        a.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-800' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">{a.description}</p>
                    <div className="mt-1 text-[10px] text-slate-500 font-mono">{a.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 mt-4 border-t border-slate-800 text-right">
            <span className="text-[11px] font-mono text-cyan-400 cursor-pointer hover:underline">
              View All System Alerts →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
