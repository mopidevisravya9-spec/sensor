import React, { useState } from 'react';
import { Cpu, Plus, Search, Filter, ArrowRight, RefreshCw, Battery, Signal } from 'lucide-react';
import { registerNewDevice } from '../services/api';

export default function DevicesView({ devices, loading, onSelectDevice, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New device form state
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLat, setNewLat] = useState('17.385043');
  const [newLng, setNewLng] = useState('78.486671');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = devices ? devices.filter(dev => {
    const matchesSearch = dev.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dev.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || dev.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newDeviceId || !newName) return;

    setIsSubmitting(true);
    const res = await registerNewDevice({
      device_id: newDeviceId,
      name: newName,
      location: newLocation,
      latitude: parseFloat(newLat),
      longitude: parseFloat(newLng)
    });
    setIsSubmitting(false);

    if (res.status === 'success') {
      setShowAddModal(false);
      setNewDeviceId('');
      setNewName('');
      setNewLocation('');
      if (onRefresh) onRefresh();
    } else {
      alert(`Registration failed: ${res.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            IoT Drain Device Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              SCADA MESH
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage municipal IoT drain monitoring nodes, firmware versions, battery status, and telemetry endpoints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg glow-cyan"
        >
          <Plus className="w-4 h-4" />
          Register IoT Device
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Device ID, Name or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['ALL', 'ONLINE', 'OFFLINE', 'WARNING', 'CRITICAL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Device Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            Fetching registered IoT devices from REST API...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No registered devices found matching criteria. Click "Register IoT Device" to add nodes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="p-4 font-medium">NAME & LOCATION</th>
                  <th className="p-4 font-medium">STATUS</th>
                  <th className="p-4 font-medium">FIRMWARE</th>
                  <th className="p-4 font-medium">BATTERY</th>
                  <th className="p-4 font-medium">SIGNAL</th>
                  <th className="p-4 font-medium">LAST SEEN</th>
                  <th className="p-4 text-right font-medium">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map((dev) => (
                  <tr key={dev.device_id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="font-sans font-semibold text-slate-100">{dev.name}</div>
                      <div className="text-[10px] text-slate-400">{dev.location}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] border font-bold ${
                        dev.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        dev.status === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        dev.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {dev.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{dev.firmware_version}</td>
                    <td className="p-4">
                      {dev.battery !== null && dev.battery !== undefined ? (
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Battery className="w-3.5 h-3.5 text-emerald-400" />
                          {dev.battery}%
                        </div>
                      ) : (
                        <span className="text-slate-500">Waiting for Device</span>
                      )}
                    </td>
                    <td className="p-4">
                      {dev.signal_strength !== null && dev.signal_strength !== undefined ? (
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Signal className="w-3.5 h-3.5 text-cyan-400" />
                          {dev.signal_strength} dBm
                        </div>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">
                      {dev.last_seen ? dev.last_seen.slice(0, 19).replace('T', ' ') : 'Waiting for Device'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectDevice(dev.device_id)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-sans text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        Monitor Node <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-cyan-500/30 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Register New Drain Monitoring Device
            </h3>

            <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">DEVICE ID (e.g. ESP32-DRAIN-002)</label>
                <input
                  type="text"
                  required
                  placeholder="ESP32-DRAIN-002"
                  value={newDeviceId}
                  onChange={(e) => setNewDeviceId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">DEVICE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="North Catchment Drain Station B"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">LOCATION DESCRIPTION</label>
                <input
                  type="text"
                  placeholder="Sector 14 Main Sluice Gate"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">LATITUDE</label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">LONGITUDE</label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-sans flex items-center gap-2"
                >
                  {isSubmitting ? 'Registering...' : 'Register Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
