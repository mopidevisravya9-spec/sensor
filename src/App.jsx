import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import DashboardView from './pages/DashboardView';
import DevicesView from './pages/DevicesView';
import DeviceDetailView from './pages/DeviceDetailView';
import MapView from './pages/MapView';
import LiveMonitoringView from './pages/LiveMonitoringView';
import AICameraView from './pages/AICameraView';
import AnalyticsView from './pages/AnalyticsView';
import AlertsView from './pages/AlertsView';
import ReportsView from './pages/ReportsView';
import SettingsView from './pages/SettingsView';

import {
  fetchDashboardSummary,
  fetchDevices,
  fetchAlerts,
  fetchDeviceCamera
} from './services/api';

import {
  ACTIVE_DEVICE_ID,
  POLLING_INTERVAL_MS
} from './config';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDeviceId, setActiveDeviceId] = useState(ACTIVE_DEVICE_ID);

  // API Driven States
  const [summary, setSummary] = useState(null);
  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cameraData, setCameraData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAllData = async () => {
    setIsRefreshing(true);

    try {
      const [sumRes, devRes, altRes] = await Promise.all([
        fetchDashboardSummary(),
        fetchDevices(),
        fetchAlerts()
      ]);

      const activeDevices = devRes
        .filter((device) => device.device_id === ACTIVE_DEVICE_ID)
        .map((device) => ({
          ...device,
          name: 'Drain 1'
        }));

      const activeAlerts = altRes.filter(
        (alert) =>
          alert.device === ACTIVE_DEVICE_ID ||
          alert.device_id === ACTIVE_DEVICE_ID
      );

      setDevices(activeDevices);
      setAlerts(activeAlerts);

      // Camera data from API
      if (activeDeviceId) {
        try {
          const camRes = await fetchDeviceCamera(activeDeviceId);
          setCameraData(camRes);

          const activeDevice = activeDevices[0];

          setSummary({
            ...sumRes,

            total_devices: activeDevices.length,

            online_devices: activeDevices.filter(
              (device) => device.status === 'ONLINE'
            ).length,

            offline_devices: activeDevices.filter(
              (device) => device.status === 'OFFLINE'
            ).length,

            warning_devices: activeDevices.filter(
              (device) => device.status === 'WARNING'
            ).length,

            critical_devices: activeDevices.filter(
              (device) => device.status === 'CRITICAL'
            ).length,

            critical_alerts: activeAlerts.filter(
              (alert) =>
                alert.severity === 'CRITICAL' &&
                !alert.acknowledged
            ).length,

            active_cameras:
              camRes?.camera_status === 'ACTIVE' ||
              camRes?.camera_status === 'BLOCKED'
                ? 1
                : 0,

            healthy_devices:
              activeDevice?.status === 'ONLINE' ||
              activeDevice?.status === 'WARNING'
                ? 1
                : 0
          });
        } catch (cameraError) {
          console.error('Camera API error:', cameraError);
          setCameraData(null);
        }
      }
    } catch (error) {
      console.error('Dashboard API error:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();

    const interval = setInterval(
      loadAllData,
      POLLING_INTERVAL_MS
    );

    return () => clearInterval(interval);
  }, [activeDeviceId]);

  const handleSelectDevice = (deviceId) => {
    if (deviceId === ACTIVE_DEVICE_ID) {
      setActiveDeviceId(ACTIVE_DEVICE_ID);
    }

    setActiveTab('device-detail');
  };

  return (
    <div className="flex min-h-screen bg-[#090d14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">

      {/* Sidebar */}
      <Sidebar
        activeTab={
          activeTab === 'device-detail'
            ? 'devices'
            : activeTab
        }
        setActiveTab={setActiveTab}
        deviceCount={devices.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar */}
        <Navbar
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
          activeDevice={activeDeviceId}
          onSelectDevice={handleSelectDevice}
          devices={devices}
        />

        {/* Main Page */}
        <main className="p-6 flex-1 overflow-y-auto">

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              summary={summary}
              loading={loading}
              devices={devices}
              alerts={alerts}
              onSelectDevice={handleSelectDevice}
              cameraData={cameraData}
              activeDeviceId={activeDeviceId}
            />
          )}

          {/* DEVICES */}
          {activeTab === 'devices' && (
            <DevicesView
              devices={devices}
              loading={loading}
              onSelectDevice={handleSelectDevice}
              onRefresh={loadAllData}
            />
          )}

          {/* DEVICE DETAIL */}
          {activeTab === 'device-detail' && (
            <DeviceDetailView
              deviceId={activeDeviceId}
              onBack={() => setActiveTab('devices')}
              onSelectDevice={handleSelectDevice}
            />
          )}

          {/* MAP */}
          {activeTab === 'map' && (
            <MapView
              devices={devices}
              loading={loading}
              onSelectDevice={handleSelectDevice}
            />
          )}

          {/* LIVE MONITORING */}
          {activeTab === 'live' && (
            <LiveMonitoringView
              devices={devices}
              loading={loading}
              onSelectDevice={handleSelectDevice}
            />
          )}

          {/* AI CAMERA */}
          {activeTab === 'camera' && (
            <AICameraView
              activeDeviceId={activeDeviceId}
              devices={devices}
            />
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              activeDeviceId={activeDeviceId}
            />
          )}

          {/* ALERTS */}
          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              loading={loading}
              onRefresh={loadAllData}
            />
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <ReportsView
              devices={devices}
            />
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsView />
          )}

        </main>
      </div>
    </div>
  );
}