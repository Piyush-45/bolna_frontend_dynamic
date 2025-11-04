import axios from "axios";

// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE_URL = "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Helper to include token in requests
export const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// -------------------------------------------------------
// 🧠 AUTH
// -------------------------------------------------------
// ✅ Signup API call (frontend)
export async function signup(email: string, password: string, hospital_name: string) {
  const res = await api.post('/auth/signup', {
    email,
    password,
    hospital_name,
  });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// -------------------------------------------------------
// 🏥 HOSPITALS
// -------------------------------------------------------
// export async function getHospitals() {
//   const res = await api.get("/settings/voice-ai/sync");
//   return res.data;
// }

// -------------------------------------------------------
// 👥 PATIENTS
// -------------------------------------------------------
export async function getPatients(token: string) {
  const res = await api.get("/patients/", { headers: authHeader(token) });
  return res.data;
}

// export async function createPatient(token: string, name: string, phone: string) {
//   const res = await api.post(
//     "/patients/",
//     { name, phone },
//     { headers: authHeader(token) }
//   );
//   return res.data;
// }
export async function createPatient(token: string, data: any) {
  const res = await api.post('/patients/', data, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function initiateCall(token: string, patientId: string) {
  const res = await api.post(`/patients/${patientId}/call`, {}, { headers: authHeader(token) });
  return res.data;
}


export async function deletePatient(token: string, id: string) {
  const res = await api.delete(`/patients/${id}`, { headers: authHeader(token) });
  return res.data;

}


// -------------------------------------------------------
// 🎙️ Voice + Agent Settings
// -------------------------------------------------------
// -------------------------------------------------------
// 🎙️ Voice + Agent Settings (fixed)
// -------------------------------------------------------

  export async function getVoiceSettings(token: string) {
    const res = await api.get("/settings/voice-ai/config", {
      headers: authHeader(token),
    });
    return res.data;
  }

export async function updateVoiceSettings(token: string, body: any) {
  const res = await api.put("/settings/voice", body, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function syncVoiceAI(token: string) {
  const res = await api.post("/settings/voice-ai/sync", {}, {
    headers: authHeader(token),
  });
  return res.data;
}
