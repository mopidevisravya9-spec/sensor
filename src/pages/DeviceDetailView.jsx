import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  MapPin, 
  Thermometer, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import GaugeCircular from '../components/GaugeCircular';
import GaugeSolid from '../components/GaugeSolid';
import GasCard from '../components/GasCard';
import AICameraCard from '../components/AICameraCard';
import { fetchDeviceSensors, fetchDeviceCamera, fetchDeviceDetail } from '../services/api';
import { POLLING_INTERVAL_MS } from '../config';

export default function DeviceDetailView({ deviceId, onBack, onSelectDevice }) {
  const [device, setDevice] = useState(null);
  const [sensors, setSensors] = useState(null);
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!deviceId) return;
    setLoading(true);
    const [devRes, sensRes, camRes] = await Promise.all([
      fetchDeviceDetail(deviceId),
      fetchDeviceSensors(deviceId),
      fetchDeviceCamera(deviceId)
    ]);
    setDevice(devRes);
    setSensors(sensRes);
    setCamera(camRes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [deviceId]);

  const sensorObj = sensors?.sensors;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Back to Devices list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-100 font-mono tracking-wide">
                {device?.name || 'IoT Municipal Drain Monitoring Node'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                device?.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                device?.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {device?.status || 'Waiting for Device'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{device?.name || 'IoT Municipal Drain Monitoring Node'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-cyan-400" /> {device?.location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Sensor Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Water Level */}
        <GaugeCircular 
          value={sensorObj?.water_level?.value}
          status={sensorObj?.water_level?.status}
          lastUpdated={sensors?.last_updated}
          connectionStatus={sensors?.connection_status}
        />

        {/* 2. Solid Level */}
        <GaugeSolid 
          value={sensorObj?.solid_level?.value}
          status={sensorObj?.solid_level?.status}
          lastUpdated={sensors?.last_updated}
        />

        {/* 3. Gas Sensor */}
        <GasCard 
          value={sensorObj?.gas_sensor?.value}
          status={sensorObj?.gas_sensor?.status}
          lastUpdated={sensors?.last_updated}
        />

        {/* 4. Temperature Card */}
        <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <Thermometer className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-200">Temperature</span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {sensorObj?.temperature ? 'Good' : 'Sensor Offline'}
            </span>
          </div>

          <div className="my-4">
            {sensorObj?.temperature?.value !== null && sensorObj?.temperature?.value !== undefined ? (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-slate-100">{sensorObj.temperature.value}</span>
                <span className="text-xs font-mono text-orange-400 font-semibold">{sensorObj.temperature.unit}</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1 py-2">
                <AlertTriangle className="w-4 h-4 animate-pulse" /> Waiting for Sensor...
              </span>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Status: {sensorObj?.temperature?.status || 'N/A'}</span>
            <span>{sensors?.last_updated ? sensors.last_updated.slice(11, 19) : 'Waiting for Device'}</span>
          </div>
        </div>

      </div>

      {/* AI Camera Section for opened device */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AICameraCard cameraData={camera} />

        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Device Technical Metadata
            </h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Firmware Release:</span>
                <span className="text-slate-200">{device?.firmware_version || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="text-slate-200">{device?.latitude ?? 'N/A'}, {device?.longitude ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Rest API Ingestion:</span>
                <span className="text-emerald-400">POST /api/telemetry/</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Last Database Record:</span>
                <span className="text-slate-200">{sensors?.last_updated || 'No Telemetry Sent Yet'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 font-mono">
            Live values are read from the selected device APIs.
          </div>
        </div>
      </div>
    </div>
  );
}
