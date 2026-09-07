import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, CheckCircle2, Cpu } from 'lucide-react';

export default function ReportsView({ devices }) {
  const [selectedDevice, setSelectedDevice] = useState('ALL');
  const [reportType, setReportType] = useState('TELEMETRY_DAILY');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportCSV = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Municipal SCADA Telemetry Log CSV generated and ready for export.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Municipal Drainage Audit & Reports
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              CSV / PDF EXPORT
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal environmental compliance and water level monitoring audit reports.
          </p>
        </div>
      </div>

      {/* Report Generator Controls */}
      <div className="glass-panel p-6 rounded-2xl max-w-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <FileText className="w-4 h-4 text-cyan-400" /> Report Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1.5">SELECT DRAIN NODE</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Municipal Drain Nodes</option>
              {devices && devices.map(d => (
                <option key={d.device_id} value={d.device_id}>
                  {d.device_id} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5">REPORT CATEGORY</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="TELEMETRY_DAILY">24-Hour Telemetry Audit</option>
              <option value="ALERTS_SUMMARY">Critical Obstruction & Alert Log</option>
              <option value="BATTERY_HEALTH">IoT Battery & Signal Diagnostic</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-sans flex items-center gap-2 transition-all glow-cyan"
          >
            <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
            {isGenerating ? 'Generating Report...' : 'Export Municipal CSV Log'}
          </button>
        </div>
      </div>
    </div>
  );
}
