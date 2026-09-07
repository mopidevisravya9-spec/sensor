import React from 'react';
import { Wind, ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function GasCard({ value, unit = "PPM", status = "Safe", lastUpdated }) {
  const hasValue = value !== null && value !== undefined;
  const numValue = hasValue ? Number(value) : 0;

  let statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = ShieldCheck;
  let glowClass = "glow-emerald";

  if (status === "Critical" || numValue > 450) {
    statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
    Icon = ShieldAlert;
    glowClass = "glow-rose";
  } else if (status === "Warning" || numValue > 250) {
    statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    Icon = AlertTriangle;
    glowClass = "glow-amber";
  }

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Wind className="w-4 h-4 animate-spin-slow" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Gas Concentration</span>
        </div>
        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusBadge}`}>
          <Icon className="w-3 h-3" />
          {hasValue ? status : 'Sensor Offline'}
        </span>
      </div>

      {hasValue ? (
        <div className="my-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold font-mono text-slate-100">{numValue}</span>
              <span className="text-xs font-mono text-teal-400 font-semibold">{unit}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">H2S / Methane Monitoring</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono block">THRESHOLD</span>
            <span className="text-xs font-bold font-mono text-slate-300">500 PPM MAX</span>
          </div>
        </div>
      ) : (
        <div className="my-6 py-4 flex flex-col items-center justify-center text-center bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
          <AlertCircle className="w-6 h-6 text-slate-500 mb-1 animate-pulse" />
          <span className="text-xs font-medium text-slate-400 font-mono">Waiting for Sensor...</span>
          <span className="text-[10px] text-slate-600 mt-0.5">Gas Data Unavailable</span>
        </div>
      )}

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Calibration: Auto 24h</span>
        <span>{lastUpdated ? `Updated: ${lastUpdated.slice(11, 19)}` : 'Waiting for Device'}</span>
      </div>
    </div>
  );
}
