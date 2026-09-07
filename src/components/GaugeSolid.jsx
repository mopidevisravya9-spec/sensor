import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';

export default function GaugeSolid({ value, max = 50, unit = "cm", status = "Clear", lastUpdated }) {
  const hasValue = value !== null && value !== undefined;
  const numValue = hasValue ? Number(value) : 0;
  const fillPct = Math.min(Math.max((numValue / max) * 100, 0), 100);

  let barColor = "from-cyan-500 to-blue-600";
  let statusBadge = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

  if (numValue > 35) {
    barColor = "from-rose-500 to-red-600";
    statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (numValue > 20) {
    barColor = "from-amber-500 to-yellow-600";
    statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Solid / Silt Level</span>
        </div>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${statusBadge}`}>
          {hasValue ? status : 'Sensor Offline'}
        </span>
      </div>

      {hasValue ? (
        <div className="my-4 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-mono text-slate-100">{numValue}</span>
              <span className="text-xs font-mono text-slate-400">{unit}</span>
            </div>
            <span className="text-xs font-mono text-slate-400">{fillPct.toFixed(0)}% Accumulation</span>
          </div>

          {/* Linear Meter Gauge */}
          <div className="w-full bg-slate-800/80 h-4 rounded-full p-0.5 border border-slate-700/50 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
              style={{ width: `${fillPct}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="my-6 py-4 flex flex-col items-center justify-center text-center bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
          <AlertCircle className="w-6 h-6 text-slate-500 mb-1 animate-pulse" />
          <span className="text-xs font-medium text-slate-400 font-mono">Waiting for Sensor...</span>
          <span className="text-[10px] text-slate-600 mt-0.5">Silt Data Unavailable</span>
        </div>
      )}

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Max Clearance: {max} {unit}</span>
        <span>{lastUpdated ? `Updated: ${lastUpdated.slice(11, 19)}` : 'Waiting for Device'}</span>
      </div>
    </div>
  );
}
