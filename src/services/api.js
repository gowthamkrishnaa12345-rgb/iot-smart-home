/**
 * API Service for communicating with FastAPI Backend
 */

const API_BASE = '/api';

export async function fetchSystemStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  return await res.json();
}

export async function controlAppliance(applianceId, updates) {
  const res = await fetch(`${API_BASE}/appliances/${applianceId}/control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Control action failed');
  }
  return await res.json();
}

export async function setSystemMode(mode) {
  const res = await fetch(`${API_BASE}/mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  if (!res.ok) throw new Error('Mode change failed');
  return await res.json();
}

export async function sendChatMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Chat message failed');
  return await res.json();
}

export async function triggerScenario(scenarioId) {
  const res = await fetch(`${API_BASE}/demo/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario_id: scenarioId }),
  });
  if (!res.ok) throw new Error('Scenario trigger failed');
  return await res.json();
}

export async function overrideSensor(updates) {
  const res = await fetch(`${API_BASE}/iot/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Override failed');
  return await res.json();
}

export async function resetSimulation() {
  const res = await fetch(`${API_BASE}/iot/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Reset failed');
  return await res.json();
}

export async function fetchTelemetryHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return await res.json();
}

export async function fetchSafetyAudit() {
  const res = await fetch(`${API_BASE}/safety/audit`);
  if (!res.ok) throw new Error('Failed to fetch safety audit');
  return await res.json();
}
