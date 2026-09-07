import React from 'react';
import { Activity, Radio, Cpu, Wifi, Battery, Droplet, Wind, ArrowRight } from 'lucide-react';

export default function LiveMonitoringView({ devices, loading, onSelectDevice }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Multi-Node SCADA Live Stream
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> REST STREAM
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-node surveillance matrix displaying active packet telemetry.
          </p>
        </div>
      </div>

      {/* Grid of Nodes */}
      {!devices || devices.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center text-slate-500 font-mono text-xs">
          Waiting for Device... (No registered IoT nodes transmitting live telemetry)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((dev) => (
            <div key={dev.device_id} className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between">
              <div>
                {/* Node Top Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold font-mono text-slate-100 text-sm">{dev.device_id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    dev.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    dev.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {dev.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-200">{dev.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{dev.location}</div>
                </div>

                {/* Packet Stream Matrix */}
                <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-blue-400" /> Water Level:</span>
                    <span className="text-slate-200 font-bold">{dev.water_level !== undefined && dev.water_level !== null ? `${dev.water_level} cm` : 'Waiting for Sensor...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-teal-400" /> Gas Level:</span>
                    <span className="text-slate-200 font-bold">{dev.gas_level !== undefined && dev.gas_level !== null ? `${dev.gas_level} PPM` : 'Waiting for Sensor...'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1"><Battery className="w-3.5 h-3.5 text-emerald-400" /> Battery:</span>
                    <span className="text-slate-200">{dev.battery !== null && dev.battery !== undefined ? `${dev.battery}%` : 'Waiting for Device'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">
                  {dev.last_seen ? `Seen: ${dev.last_seen.slice(11, 19)}` : 'Waiting for Device'}
                </span>
                <button
                  onClick={() => onSelectDevice(dev.device_id)}
                  className="px-3 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono flex items-center gap-1"
                >
                  Detail <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
