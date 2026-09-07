import { API_BASE } from '../config';

const API_BASE_URL = API_BASE;

/**
 * Fetch summary stats for overview dashboard
 */
export async function fetchDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/dashboard/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Failed to fetch dashboard summary from API:', err);
    return null;
  }
}

/**
 * Fetch all registered IoT devices
 */
export async function fetchDevices() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/devices/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('Failed to fetch devices from API:', err);
    return [];
  }
}

/**
 * Fetch single device metadata by device_id
 */
export async function fetchDeviceDetail(deviceId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/device/${deviceId}/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`Failed to fetch device detail for ${deviceId}:`, err);
    return null;
  }
}

/**
 * Fetch real-time sensor metrics for specific device
 */
export async function fetchDeviceSensors(deviceId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/device/${deviceId}/sensors/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn(`Failed to fetch sensors for device ${deviceId}:`, err);
    return null;
  }
}

/**
 * Fetch AI camera feed and object blockage analysis
 */
export async function fetchDeviceCamera(deviceId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/device/${deviceId}/camera/`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn(`Failed to fetch camera for device ${deviceId}:`, err);
    return null;
  }
}

/**
 * Fetch alerts (system-wide or device-specific)
 */
export async function fetchAlerts(deviceId = null) {
  try {
    const url = deviceId ? `${API_BASE_URL}/api/device/${deviceId}/alerts/` : `${API_BASE_URL}/api/alerts/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch alerts:', err);
    return [];
  }
}

/**
 * Fetch historic telemetry series for charts
 */
export async function fetchAnalytics(deviceId = null) {
  try {
    const url = deviceId ? `${API_BASE_URL}/api/analytics/?device_id=${deviceId}` : `${API_BASE_URL}/api/analytics/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Failed to fetch analytics dataset:', err);
    return [];
  }
}

/**
 * Register a new device node
 */
export async function registerNewDevice(deviceData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/device/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to register device:', err);
    return { status: 'error', message: err.message };
  }
}
