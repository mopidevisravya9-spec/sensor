import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Filter, Bell, CheckCircle2 } from 'lucide-react';

export default function AlertsView({ alerts, loading, onRefresh }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = alerts ? alerts.filter(a => {
    return severityFilter === 'ALL' || a.severity === severityFilter;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Municipal Emergency Alert Feed
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono">
              REAL-TIME ALARM
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated threshold violation alerts & AI camera blockage notifications fetched from backend API.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                severityFilter === sev
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 glow-rose'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            Fetching system alerts from REST API...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 text-emerald-500/40 mb-2" />
            No system alerts matching filter. All municipal drain nodes are operating safely.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="p-4 font-medium">TIME</th>
                  <th className="p-4 font-medium">DEVICE NODE</th>
                  <th className="p-4 font-medium">SEVERITY</th>
                  <th className="p-4 font-medium">ALERT TYPE</th>
                  <th className="p-4 font-medium">DESCRIPTION</th>
                  <th className="p-4 text-right font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 text-slate-400">{alert.time}</td>
                    <td className="p-4 font-bold text-cyan-400">{alert.device}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-800' :
                        alert.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-800' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="p-4 font-sans font-semibold text-slate-100">{alert.alert_type}</td>
                    <td className="p-4 text-slate-300 font-sans">{alert.description}</td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                        {alert.acknowledged ? 'ACKNOWLEDGED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
