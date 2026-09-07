import React, { useState } from 'react';
import { MapPin, Cpu, ArrowRight, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function MapView({ devices, loading, onSelectDevice }) {
  const [selectedDevice, setSelectedDevice] = useState(devices?.[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Geographic Municipal Drain Map
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              GPS SCADA MESH
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial status markers loaded dynamically from backend APIs.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs font-mono bg-slate-900/80 border border-slate-800 p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Online
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warning
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span> Offline
          </div>
        </div>
      </div>

      {/* Main Map Container & Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SCADA City Grid Canvas */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-2xl relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Map Title Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-slate-950/80 backdrop-blur border border-slate-800 p-3 rounded-xl">
            <span className="text-xs font-mono text-cyan-400 font-bold block">SMART CITY DRAIN GRID</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Nodes fetched from REST API: {devices?.length || 0}
            </span>
          </div>

          {/* Grid Canvas Map Representation */}
          <div className="w-full h-[480px] bg-slate-950/90 rounded-xl relative overflow-hidden border border-slate-800/80 flex items-center justify-center">
            {/* Grid Pattern Lines */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#38bdf8 1px, #090d14 1px)`,
                backgroundSize: `30px 30px`,
                backgroundPosition: `0 0, 15px 15px`
              }}
            />

            {/* City Drainage Vector Channel Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/20 stroke-2">
              <line x1="10%" y1="20%" x2="50%" y2="50%" strokeDasharray="6 6" />
              <line x1="50%" y1="50%" x2="85%" y2="70%" strokeDasharray="6 6" />
              <line x1="20%" y1="80%" x2="50%" y2="50%" strokeDasharray="6 6" />
            </svg>

            {!devices || devices.length === 0 ? (
              <div className="text-center font-mono text-slate-500 text-xs z-10">
                Waiting for Device... (No GPS markers available in backend API)
              </div>
            ) : (
              devices.map((dev, idx) => {
                // Position markers consistently when the API does not provide map projection data.
                const leftPct = 25 + (idx * 28) % 60;
                const topPct = 30 + (idx * 35) % 55;

                let markerBg = "bg-slate-500 text-slate-900 border-slate-300";
                let pulseColor = "bg-slate-400";
                if (dev.status === 'ONLINE') {
                  markerBg = "bg-emerald-500 text-slate-950 border-emerald-300 glow-emerald";
                  pulseColor = "bg-emerald-400";
                } else if (dev.status === 'WARNING') {
                  markerBg = "bg-amber-500 text-slate-950 border-amber-300 glow-amber";
                  pulseColor = "bg-amber-400";
                } else if (dev.status === 'CRITICAL') {
                  markerBg = "bg-rose-500 text-slate-950 border-rose-300 glow-rose";
                  pulseColor = "bg-rose-400";
                }

                return (
                  <div
                    key={dev.device_id}
                    onClick={() => setSelectedDevice(dev)}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full ${pulseColor} opacity-50`}></span>
                      <div className={`p-2.5 rounded-full border-2 font-bold shadow-xl transition-all group-hover:scale-125 ${markerBg}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Node Hover Badge */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-slate-950 border border-slate-800 p-2 rounded-lg text-[10px] font-mono text-slate-200 whitespace-nowrap shadow-2xl z-30">
                      <div className="font-bold text-cyan-400">{dev.device_id}</div>
                      <div>{dev.location}</div>
                      <div className="text-slate-400">Status: {dev.status}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Marker Detail Inspector Panel */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              Node Inspector Panel
            </h3>

            {selectedDevice ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold font-mono text-cyan-400 text-sm">{selectedDevice.device_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      selectedDevice.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      selectedDevice.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {selectedDevice.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-semibold">{selectedDevice.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{selectedDevice.location}</div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Latitude:</span>
                    <span className="text-slate-200">{selectedDevice.latitude}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Longitude:</span>
                    <span className="text-slate-200">{selectedDevice.longitude}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Firmware:</span>
                    <span className="text-slate-200">{selectedDevice.firmware_version}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Battery:</span>
                    <span className="text-slate-200">{selectedDevice.battery ? `${selectedDevice.battery}%` : 'Waiting for Device'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Last Seen:</span>
                    <span className="text-slate-200">{selectedDevice.last_seen ? selectedDevice.last_seen.slice(11, 19) : 'Waiting for Device'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Click any map marker to inspect IoT drain node telemetry details.
              </div>
            )}
          </div>

          {selectedDevice && (
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => onSelectDevice(selectedDevice.device_id)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-sans transition-colors flex items-center justify-center gap-2 glow-cyan"
              >
                Open Full Device Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
