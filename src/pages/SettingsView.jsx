import React, { useState } from 'react';
import { Settings, Server, Key, Radio, Shield, Save } from 'lucide-react';

export default function SettingsView() {
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const [apiKey, setApiKey] = useState('WATER_LEVEL_2026');
  const [pollInterval, setPollInterval] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            System & API Preferences
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              POC CONFIG
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure REST API endpoints, polling refresh rates, and ESP32 authorization credentials.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1.5 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> BACKEND REST API SERVER URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-cyan-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> ESP32 INGESTION X-API-KEY
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" /> TELEMETRY REFRESH INTERVAL (SECONDS)
            </label>
            <select
              value={pollInterval}
              onChange={(e) => setPollInterval(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="1">1 Second (Realtime Burst)</option>
              <option value="5">5 Seconds (Standard SCADA)</option>
              <option value="10">10 Seconds</option>
              <option value="30">30 Seconds</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-emerald-400 font-mono text-[11px]">
              {saved ? '✓ SCADA Configuration Saved!' : ''}
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-sans text-xs flex items-center gap-2 transition-all glow-cyan"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
