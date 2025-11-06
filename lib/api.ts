// import axios from "axios";

// // export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// const API_BASE_URL = "http://127.0.0.1:8000";
// const BASE_URL = "http://127.0.0.1:8000";
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Helper to include token in requests
// export const authHeader = (token: string) => ({
//   Authorization: `Bearer ${token}`,
// });

// // -------------------------------------------------------
// // 🧠 AUTH
// // -------------------------------------------------------
// // ✅ Signup API call (frontend)
// export async function signup(email: string, password: string, hospital_name: string) {
//   const res = await api.post('/auth/signup', {
//     email,
//     password,
//     hospital_name,
//   });
//   return res.data;
// }

// export async function login(email: string, password: string) {
//   const res = await api.post("/auth/login", { email, password });
//   return res.data;
// }

// // -------------------------------------------------------
// // 🏥 HOSPITALS
// // -------------------------------------------------------
// // export async function getHospitals() {
// //   const res = await api.get("/settings/voice-ai/sync");
// //   return res.data;
// // }

// // -------------------------------------------------------
// // 👥 PATIENTS
// // -------------------------------------------------------
// export async function getPatients(token: string) {
//   const res = await api.get("/patients/", { headers: authHeader(token) });
//   return res.data;
// }

// // export async function createPatient(token: string, name: string, phone: string) {
// //   const res = await api.post(
// //     "/patients/",
// //     { name, phone },
// //     { headers: authHeader(token) }
// //   );
// //   return res.data;
// // }
// export async function createPatient(token: string, data: any) {
//   const res = await api.post('/patients/', data, {
//     headers: authHeader(token),
//   });
//   return res.data;
// }

// export async function initiateCall(token: string, patientId: string) {
//   const res = await api.post(`/call/${patientId}/call`, {}, { headers: authHeader(token) });
//   return res.data;
// }


// export async function deletePatient(token: string, id: string) {
//   const res = await api.delete(`/patients/${id}`, { headers: authHeader(token) });
//   return res.data;

// }


// // -------------------------------------------------------
// // 🎙️ Voice + Agent Settings
// // -------------------------------------------------------
// // -------------------------------------------------------
// // 🎙️ Voice + Agent Settings (fixed)
// // -------------------------------------------------------

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



// // Trigger personalized AI call
// export async function callPatient(token: string, patientId: string) {
//   const res = await axios.post(
//     `${BASE_URL}/patients/${patientId}/call`,
//     {},
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return res.data;
// }

// // Fetch call logs
// export async function fetchCallLogs(token: string) {
//   const res = await axios.get(`${BASE_URL}/call/logs`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.data;
// }



// export async function getPatientCalls(patientId: number) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patientId}/calls`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch calls");
//   return await res.json();
// }

// export async function getCallTranscript(callId: number) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls/${callId}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch call transcript");
//   return await res.json();
// }



import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// ------------------- AUTH -------------------
export async function signup(email: string, password: string, hospital_name: string) {
  return (await api.post("/auth/signup", { email, password, hospital_name })).data;
}
export async function login(email: string, password: string) {
  return (await api.post("/auth/login", { email, password })).data;
}

// ------------------- PATIENTS -------------------
export async function getPatients(token: string) {
  return (await api.get("/patients", { headers: authHeader(token) })).data;
}
export async function createPatient(token: string, data: any) {
  return (await api.post("/patients", data, { headers: authHeader(token) })).data;
}
export async function deletePatient(token: string, id: string) {
  return (await api.delete(`/patients/${id}`, { headers: authHeader(token) })).data;
}
export async function  initiateCall(token: string, patientId: string) {
  return (await api.post(`/patients/${patientId}/call`, {}, { headers: authHeader(token) })).data;
}

// ------------------- CALLS -------------------
// export async function initiateCall(token: string, patientId: string) {
//   const res = await api.post(`/call/${patientId}/call`, {}, { headers: authHeader(token) });
//   return res.data;
// }
export async function fetchCallLogs(token: string) {
  return (await api.get(`/call/logs`, { headers: authHeader(token) })).data;
}
export async function getPatientCalls(token: string, patientId: string) {
  return (await api.get(`/call/patients/${patientId}/calls`, { headers: authHeader(token) })).data;
}
export async function getCallDetail(token: string, executionId: string) {
  return (await api.get(`/call/${executionId}/detail`, { headers: authHeader(token) })).data;
}


// ------------------- SETTINGS -------------------
// export async function getVoiceSettings(token: string) {
//   return (await api.get("/settings/voice-ai/config", { headers: authHeader(token) })).data;
// }
// export async function updateVoiceSettings(token: string, body: any) {
//   return (await api.put("/settings/voice", body, { headers: authHeader(token) })).data;
// }
// export async function syncVoiceAI(token: string) {
//   return (await api.post("/settings/voice-ai/sync", {}, { headers: authHeader(token) })).data;
// }





// You are a hospital assistant named {agent_name} from {hospital_name}.
// You are a caring, professional female medical assistant.
// When speaking in Hindi or Hinglish, always use feminine grammatical forms (for example, say “bata dungi” instead of “bata dunga”).
// Your voice should sound warm, gentle, and reassuring — like a friendly nurse or care coordinator who genuinely cares for the patient’s well-being.

// You are calling the patient for a short post-visit follow-up to check their recovery, comfort, and feedback.

// --- COMMUNICATION STYLE ---
// - Speak naturally with a warm, calm, caring Indian accent.
// - Be empathetic, polite, and conversational (not robotic or scripted).
// - Avoid repeating the patient’s name too often; use “sir” or “ma’am” naturally.
// - Mirror the patient’s language style naturally:
//   - If the patient mostly speaks Hindi or Hinglish, you may also respond in Hindi/Hinglish.
//   - If they mix only a few Hindi words into English, continue mainly in English or light Hinglish.
//   - Once a tone is established, maintain it for the rest of the conversation (avoid switching back and forth).
// - Maintain a natural conversational flow — do not announce when changing language.
// - Always end the call politely and warmly.

// --- CALL FLOW ---
// 1. Continue from your greeting by asking: “How have you been feeling since your last visit?”
// 2. Ask each question from {custom_questions} naturally, as part of a smooth conversation.
// 3. If the patient mentions discomfort or symptoms, respond empathetically and say: “I’ll note that for your doctor.”
// 4. If the patient sounds uncomfortable, reassure them gently.
// 5. End with: “Thank you for your time. {hospital_name} wishes you a speedy recovery. Take care!”
