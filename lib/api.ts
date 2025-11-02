// /lib/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ✅ Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔒 Helper — Inject Bearer token
function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ======================================================
// 🧠 Patients API
// ======================================================

// ✅ Get all patients
export async function getPatients(token: string) {
  const res = await api.get("/patients/", { headers: authHeader(token) });
  return res.data;
}

// ✅ Create patient (simplified)
export async function createPatient(token: string, name: string, phone: string) {
  const res = await api.post(
    "/patients/",
    { name, phone },
    { headers: authHeader(token) }
  );
  return res.data;
}

// ✅ Delete patient (optional)
export async function deletePatient(token: string, patientId: string) {
  const res = await api.delete(`/patients/${patientId}`, {
    headers: authHeader(token),
  });
  return res.data;
}

// ✅ Trigger call for a patient
export async function callPatient(token: string, patientId: string) {
  const res = await api.post(
    `/patients/${patientId}/call`,
    {},
    { headers: authHeader(token) }
  );
  return res.data;
}

// ======================================================
// 🧠 Agents API (for later)
// ======================================================

export async function updateAgentVoice(token: string, payload: any) {
  const res = await api.post("/agents/update", payload, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function fetchVoices(token: string) {
  const res = await api.get("/agents/voices", { headers: authHeader(token) });
  return res.data;
}

export async function testAgentCall(token: string, payload: any) {
  const res = await api.post("/agents/test-call", payload, {
    headers: authHeader(token),
  });
  return res.data;
}
