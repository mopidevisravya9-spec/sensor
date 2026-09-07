import React from 'react';
import { Droplet, AlertTriangle } from 'lucide-react';

export default function GaugeCircular({ value, max = 100, unit = "cm", status = "Normal", lastUpdated, connectionStatus }) {
  // If value is null or undefined, display clean "Waiting for Sensor..."
  const hasValue = value !== null && value !== undefined;
  const numValue = hasValue ? Number(value) : 0;
  const percentage = Math.min(Math.max((numValue / max) * 100, 0), 100);

  // SVG Gauge calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on value
  let strokeColor = "#10b981"; // Emerald Normal
  let glowClass = "glow-emerald";
  let statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

  if (numValue > 75) {
    strokeColor = "#ef4444"; // Rose Critical
    glowClass = "glow-rose";
    statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  } else if (numValue > 45) {
    strokeColor = "#f59e0b"; // Amber Warning
    glowClass = "glow-amber";
    statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col items-center justify-between relative overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Droplet className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Water Level</span>
        </div>
        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${statusBadge}`}>
          {hasValue ? status : 'Sensor Offline'}
        </span>
      </div>

      {/* Main Gauge Graphic */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          {hasValue && (
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          {hasValue ? (
            <>
              <span className="text-3xl font-bold font-mono text-slate-100 tracking-tight">
                {numValue}
              </span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                {unit} ({percentage.toFixed(0)}%)
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center p-2 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-400/80 mb-1 animate-pulse" />
              <span className="text-xs font-medium text-amber-300 font-mono">
                Waiting for Sensor...
              </span>
              <span className="text-[10px] text-slate-500 mt-1">No API Telemetry</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Capacity: {max} {unit}</span>
        <span>{lastUpdated ? `Updated: ${lastUpdated.slice(11, 19)}` : 'Waiting for Device'}</span>
      </div>
    </div>
  );
}
