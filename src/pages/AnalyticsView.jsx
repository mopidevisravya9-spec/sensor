import React, { useState, useEffect } from 'react';
import { BarChart3, Droplet, Wind, Thermometer, CloudRain, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { fetchAnalytics } from '../services/api';
import { POLLING_INTERVAL_MS } from '../config';

export default function AnalyticsView({ activeDeviceId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    const history = await fetchAnalytics(activeDeviceId);
    setData(history);
    setLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [activeDeviceId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Historical Sensor Telemetry Analytics
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              TIME-SERIES API
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time charts fed dynamically from backend REST database records. No mock datasets.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          Refresh Dataset
        </button>
      </div>

      {data.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center text-slate-500 font-mono text-xs">
          Waiting for Device... (No historical telemetry records found in REST API)
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Water Level History */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-400" /> Water Level History (cm)
              </span>
              <span className="text-xs font-mono text-cyan-400">GET /api/analytics/</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="water_level" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Gas History */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" /> Gas Level History (PPM)
              </span>
              <span className="text-xs font-mono text-teal-400">H2S / Methane</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="gas_level" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#gasGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Temperature History */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-400" /> Temperature History (°C)
              </span>
              <span className="text-xs font-mono text-orange-400">Ambient Sensor</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Rain Detection Log */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-400" /> Rain Detection Log
              </span>
              <span className="text-xs font-mono text-sky-400">Precipitation Events</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} ticks={[0, 1]} domain={[0, 1]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  />
                  <Area type="stepAfter" dataKey="rain" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#rainGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
