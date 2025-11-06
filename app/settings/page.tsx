// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { toast } from "sonner";

// // // === BACKEND ROUTES (LOCALHOST) ===
// // const BASE_URL = "http://127.0.0.1:8000";

// // export default function SettingsPage() {
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [token, setToken] = useState<string | null>(null);

// //   const [hospitalName, setHospitalName] = useState<string>("");

// //   const [config, setConfig] = useState({
// //     stt_provider: "deepgram",
// //     tts_provider: "sarvam",
// //     tts_voice: "Vidya",
// //     agent_name: "Arya",
// //     greeting_template:
// //       "Namaste {patient_name}, this is {agent_name} from {hospital_name}. How are you feeling today?",
// //   });

// //   // ✅ Load token from localStorage
// //   useEffect(() => {
// //     const storedToken = localStorage.getItem("token");
// //     if (!storedToken) {
// //       toast.error("You are not logged in");
// //       return;
// //     }
// //     setToken(storedToken);
// //   }, []);

// //   // ✅ Fetch hospital name + voice config
// //   useEffect(() => {
// //     if (!token) return;

// //     async function fetchData() {
// //       try {
// //         // 1️⃣ Fetch user info
// //         const meRes = await axios.get(`${BASE_URL}/auth/me`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const hospital = meRes.data?.hospital_name || "Your Hospital";
// //         setHospitalName(hospital);

// //         // 2️⃣ Fetch voice settings
// //         const voiceRes = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         const local = voiceRes.data.local_settings || {};
// //         setConfig({
// //           stt_provider: "deepgram",
// //           tts_provider: local.tts_provider || "sarvam",
// //           tts_voice: local.tts_voice || "Vidya",
// //           agent_name: local.agent_name || "Arya",
// //           greeting_template:
// //             local.greeting_template ||
// //             `Namaste {patient_name}, this is {agent_name} from ${hospital}. How are you feeling today?`,
// //         });

// //         toast.success("✅ Loaded settings");
// //       } catch (err) {
// //         console.error("❌ Failed to fetch settings:", err);
// //         toast.error("Could not fetch settings");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     fetchData();
// //   }, [token]);

// //   // ✅ Save & Sync
// //   const handleSave = async () => {
// //     if (!token) return toast.error("Missing auth token");
// //     setSaving(true);
// //     try {
// //       // update local DB
// //       await axios.put(`${BASE_URL}/settings/voice`, config, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       toast.success("✅ Settings updated locally");

// //       // sync with Bolna
// //       const res = await axios.post(`${BASE_URL}/settings/voice-ai/sync`, null, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       toast.success(`🔁 Synced with Bolna (Agent: ${res.data.agent_id})`);
// //       console.log("✅ Sync Result:", res.data);
// //     } catch (err: any) {
// //       console.error("❌ Error saving config:", err);
// //       toast.error(err.message || "Failed to update or sync");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const ttsProviders = ["elevenlabs", "sarvam"];
// //   const voiceOptions: Record<string, string[]> = {
// //     elevenlabs: ["Vikram", "Monika Sogam"],
// //     sarvam: ["Vidya", "Manisha", "Arya", "Anushka"],
// //   };
// //   const currentVoices = voiceOptions[config.tts_provider] || [];

// //   if (loading) {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center text-gray-600">
// //         <div className="animate-pulse text-lg">Loading settings...</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 px-6 py-10">
// //       <h1 className="text-3xl font-bold mb-6 text-gray-800">
// //         🎙️ Voice Assistant Settings
// //       </h1>

// //       <div className="bg-white rounded-lg shadow p-6 space-y-5 border border-gray-200">
// //         {/* Hospital Name (read-only) */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Hospital Name
// //           </label>
// //           <input
// //             type="text"
// //             value={hospitalName}
// //             disabled
// //             className="border rounded-md p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
// //           />
// //         </div>

// //         {/* Assistant Name */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Assistant Name
// //           </label>
// //           <input
// //             type="text"
// //             value={config.agent_name}
// //             onChange={(e) =>
// //               setConfig((prev) => ({ ...prev, agent_name: e.target.value }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           />
// //         </div>

// //         {/* Greeting Template */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Greeting Template
// //           </label>
// //           <textarea
// //             rows={3}
// //             value={config.greeting_template}
// //             onChange={(e) =>
// //               setConfig((prev) => ({
// //                 ...prev,
// //                 greeting_template: e.target.value,
// //               }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           />
// //           <p className="text-xs text-gray-500 mt-1">
// //             Example:{" "}
// //             <span className="italic">
// //               {config.greeting_template
// //                 .replace("{patient_name}", "Rahul")
// //                 .replace("{agent_name}", config.agent_name)
// //                 .replace("{hospital_name}", hospitalName)}
// //             </span>
// //           </p>
// //         </div>

// //         {/* TTS Provider */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             TTS Provider
// //           </label>
// //           <select
// //             value={config.tts_provider}
// //             onChange={(e) => {
// //               const newProvider = e.target.value;
// //               const defaultVoice = voiceOptions[newProvider]?.[0] || "Vikram";
// //               setConfig((prev) => ({
// //                 ...prev,
// //                 tts_provider: newProvider,
// //                 tts_voice: defaultVoice,
// //               }));
// //             }}
// //             className="border rounded-md p-2 w-full"
// //           >
// //             {ttsProviders.map((p) => (
// //               <option key={p} value={p}>
// //                 {p}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* TTS Voice */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             TTS Voice
// //           </label>
// //           <select
// //             value={config.tts_voice}
// //             onChange={(e) =>
// //               setConfig((prev) => ({ ...prev, tts_voice: e.target.value }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           >
// //             {currentVoices.map((v) => (
// //               <option key={v} value={v}>
// //                 {v}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Save Button */}
// //         <button
// //           onClick={handleSave}
// //           disabled={saving}
// //           className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
// //             saving
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-blue-600 hover:bg-blue-700"
// //           }`}
// //         >
// //           {saving ? "Saving..." : "Save & Sync to Bolna"}
// //         </button>
// //       </div>

// //       {/* Debug Section */}
// //       <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
// //         <p className="text-sm font-semibold mb-2 text-gray-600">
// //           Debug — Current Config
// //         </p>
// //         <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
// //           {JSON.stringify(config, null, 2)}
// //         </pre>
// //       </div>
// //     </div>
// //   );
// // }


// // "use client";

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { toast } from "sonner";
// // import CostBar from "@/components/CostBar";

// // const BASE_URL = "http://127.0.0.1:8000";

// // export default function SettingsPage() {
// //   // 🧠 States
// //   const [loading, setLoading] = useState(true); // for fetching initial data
// //   const [saving, setSaving] = useState(false); // for save button
// //   const [token, setToken] = useState<string | null>(null);
// //   const [hospitalName, setHospitalName] = useState<string>("");
// //   const [estimatedCost, setEstimatedCost] = useState<number | null>(null);


// //   const [config, setConfig] = useState({
// //     stt_provider: "deepgram",
// //     tts_provider: "sarvam",
// //     tts_voice: "Vidya",
// //     agent_name: "Arya",
// //     greeting_template:
// //       "Namaste {patient_name}, this is {agent_name} from {hospital_name}. How are you feeling today?",
// //     llm_provider: "openai",
// //     llm_model: "gpt-4o-mini",
// //   });

// //   // ✅ Load token
// //   useEffect(() => {
// //     const stored = localStorage.getItem("token");
// //     if (!stored) {
// //       toast.error("You are not logged in");
// //       return;
// //     }
// //     setToken(stored);
// //   }, []);

// //   // ✅ Fetch hospital name + settings
// //   useEffect(() => {
// //     if (!token) return;

// //     async function fetchData() {
// //       try {
// //         // 1️⃣ Fetch user info (hospital name)
// //         const meRes = await axios.get(`${BASE_URL}/auth/me`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         const hospital = meRes.data?.hospital_name || "Your Hospital";
// //         setHospitalName(hospital);

// //         // 2️⃣ Fetch voice + LLM settings
// //         const settingsRes = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         const local = settingsRes.data.local_settings || {};
// //         setConfig({
// //           stt_provider: local.stt_provider || "deepgram",
// //           tts_provider: local.tts_provider || "sarvam",
// //           tts_voice: local.tts_voice || "Vidya",
// //           agent_name: local.agent_name || "Arya",
// //           greeting_template:
// //             local.greeting_template ||
// //             `Namaste {patient_name}, this is {agent_name} from ${hospital}. How are you feeling today?`,
// //           llm_provider: local.llm_provider || "openai",
// //           llm_model: local.llm_model || "gpt-4o-mini",
// //         });

// //         toast.success("✅ Loaded settings");
// //       } catch (err) {
// //         console.error("❌ Failed to fetch settings:", err);
// //         toast.error("Could not fetch settings");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }


// //     fetchData();
// //   }, [token]);


// //   // ✅ Save + Sync
// //   const handleSave = async () => {
// //     if (!token) return toast.error("Missing auth token");
// //     setSaving(true);
// //     try {
// //       // 1️⃣ Save locally
// //       await axios.put(`${BASE_URL}/settings/voice`, config, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       toast.success("✅ Settings updated locally");

// //       // 2️⃣ Sync with Bolna
// //       const res = await axios.post(`${BASE_URL}/settings/voice-ai/sync`, null, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       toast.success(`🔁 Synced with Bolna (Agent: ${res.data.agent_id})`);
// //       console.log("✅ Sync Result:", res.data);
// //     } catch (err: any) {
// //       console.error("❌ Error saving config:", err);
// //       toast.error(err.message || "Failed to update or sync");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ✅ Model cost estimation (client-side)
// //   const modelCosts: Record<string, number> = {
// //     "gpt-3.5-turbo": 0.020,
// //     "gpt-4": 0.060,
// //     "gpt-4.1": 0.045,
// //     "gpt-4o-mini": 0.030,
// //     "gpt-4o": 0.055,
// //   };

// //   useEffect(() => {
// //     const c = modelCosts[config.llm_model] || 0.03;
// //     setEstimatedCost(c);
// //   }, [config.llm_model]);

// //   // 🎤 Providers and Voices
// //   const ttsProviders = ["elevenlabs", "sarvam"];
// //   const voiceOptions: Record<string, string[]> = {
// //     elevenlabs: ["Vikram", "Monika Sogam"],
// //     sarvam: ["Vidya", "Manisha", "Arya", "Anushka"],
// //   };
// //   const currentVoices = voiceOptions[config.tts_provider] || [];

// //   // 🧠 Available OpenAI models
// //   const openAIModels = [
// //     "gpt-4o-mini",
// //     "gpt-4o",
// //     "gpt-4.1",
// //     "gpt-4",
// //     "gpt-3.5-turbo",
// //   ];

// //   // 🌀 Loading state
// //   if (loading) {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center text-gray-600">
// //         <div className="animate-pulse text-lg">Loading settings...</div>
// //       </div>
// //     );
// //   }

// //   // === UI ===
// //   return (
// //     <div className="min-h-screen bg-gray-50 px-6 py-10">
// //       <h1 className="text-3xl font-bold mb-6 text-gray-800">
// //         ⚙️ Voice + AI Assistant Settings
// //       </h1>

// //       <div className="bg-white rounded-lg shadow p-6 space-y-5 border border-gray-200">
// //         {/* Hospital Name (read-only) */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Hospital Name
// //           </label>
// //           <input
// //             type="text"
// //             value={hospitalName}
// //             disabled
// //             className="border rounded-md p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
// //           />
// //         </div>

// //         {/* Assistant Name */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Assistant Name
// //           </label>
// //           <input
// //             type="text"
// //             value={config.agent_name}
// //             onChange={(e) =>
// //               setConfig((prev) => ({ ...prev, agent_name: e.target.value }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           />
// //         </div>

// //         {/* Greeting Template */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             Greeting Template
// //           </label>
// //           <textarea
// //             rows={3}
// //             value={config.greeting_template}
// //             onChange={(e) =>
// //               setConfig((prev) => ({
// //                 ...prev,
// //                 greeting_template: e.target.value,
// //               }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           />
// //           <p className="text-xs text-gray-500 mt-1 italic">
// //             Example:{" "}
// //             {config.greeting_template
// //               .replace("{patient_name}", "Rahul")
// //               .replace("{agent_name}", config.agent_name)
// //               .replace("{hospital_name}", hospitalName)}
// //           </p>
// //         </div>

// //         {/* TTS Provider */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             TTS Provider
// //           </label>
// //           <select
// //             value={config.tts_provider}
// //             onChange={(e) => {
// //               const newProvider = e.target.value;
// //               const defaultVoice = voiceOptions[newProvider]?.[0] || "Vikram";
// //               setConfig((prev) => ({
// //                 ...prev,
// //                 tts_provider: newProvider,
// //                 tts_voice: defaultVoice,
// //               }));
// //             }}
// //             className="border rounded-md p-2 w-full"
// //           >
// //             {ttsProviders.map((p) => (
// //               <option key={p} value={p}>
// //                 {p}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* TTS Voice */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             TTS Voice
// //           </label>
// //           <select
// //             value={config.tts_voice}
// //             onChange={(e) =>
// //               setConfig((prev) => ({ ...prev, tts_voice: e.target.value }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           >
// //             {currentVoices.map((v) => (
// //               <option key={v} value={v}>
// //                 {v}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* LLM Model (OpenAI) */}
// //         <div>
// //           <label className="block text-sm font-semibold text-gray-700 mb-2">
// //             LLM Model (OpenAI)
// //           </label>
// //           <select
// //             value={config.llm_model}
// //             onChange={(e) =>
// //               setConfig((prev) => ({ ...prev, llm_model: e.target.value }))
// //             }
// //             className="border rounded-md p-2 w-full"
// //           >
// //             {openAIModels.map((m) => (
// //               <option key={m} value={m}>
// //                 {m}
// //               </option>
// //             ))}
// //           </select>

// //           {estimatedCost && (
// //             <p className="text-xs mt-1 text-gray-500">
// //               💰 Estimated LLM Cost: ${estimatedCost.toFixed(3)} / minute
// //             </p>
// //           )}
// //         </div>
// // {}
// //         {/* Save Button */}
// //         <button
// //           onClick={handleSave}
// //           disabled={saving}
// //           className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
// //             saving
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-blue-600 hover:bg-blue-700"
// //           }`}
// //         >
// //           {saving ? "Saving..." : "Save & Sync to Bolna"}
// //         </button>
// //       </div>

// //       {/* Debug Section */}
// //       <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
// //         <p className="text-sm font-semibold mb-2 text-gray-600">
// //           Debug — Current Config
// //         </p>
// //         <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
// //           {JSON.stringify(config, null, 2)}
// //         </pre>
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import CostBar from "@/components/CostBar"; // ✅ ensure this points to the CostBar we built earlier

// const BASE_URL = "http://127.0.0.1:8000";

// export default function SettingsPage() {
//   // 🧠 States
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [token, setToken] = useState<string | null>(null);
//   const [hospitalName, setHospitalName] = useState<string>("Your Hospital");
//   const [cost, setCost] = useState<any>(null);

//   const [config, setConfig] = useState({
//     stt_provider: "deepgram",
//     tts_provider: "sarvam",
//     tts_voice: "Vidya",
//     agent_name: "Arya",
//     greeting_template:
//       "Namaste {patient_name}, this is {agent_name} from {hospital_name}. How are you feeling today?",
//     llm_provider: "openai",
//     llm_model: "gpt-4o-mini",
//   });

//   // ✅ Load token once
//   useEffect(() => {
//     const stored = localStorage.getItem("token");
//     if (!stored) {
//       toast.error("You are not logged in");
//       return;
//     }
//     setToken(stored);
//   }, []);

//   // ✅ Fetch user + config once
//   useEffect(() => {
//     if (!token) return;

//     async function fetchData() {
//       try {
//         // Get hospital name
//         const meRes = await axios.get(`${BASE_URL}/auth/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const hospital = meRes.data?.hospital_name || "Your Hospital";
//         setHospitalName(hospital);

//         // Get voice settings
//         const settingsRes = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const local = settingsRes.data.local_settings || {};
//         const updated = {
//           stt_provider: local.stt_provider || "deepgram",
//           tts_provider: local.tts_provider || "sarvam",
//           tts_voice: local.tts_voice || "Vidya",
//           agent_name: local.agent_name || "Arya",
//           greeting_template:
//             local.greeting_template ||
//             `Namaste {patient_name}, this is {agent_name} from ${hospital}. How are you feeling today?`,
//           llm_provider: local.llm_provider || "openai",
//           llm_model: local.llm_model || "gpt-4o-mini",
//         };
//         setConfig(updated);

//         // Fetch initial cost
//         await fetchLiveCost(updated);

//         toast.success("✅ Settings loaded");
//       } catch (err) {
//         console.error("❌ Failed to fetch settings:", err);
//         toast.error("Could not load settings");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [token]);

//   // ✅ Live cost fetcher
//   const fetchLiveCost = async (partialConfig = config) => {
//     if (!token) return;
//     try {
//       const res = await axios.get(`${BASE_URL}/settings/voice-ai/cost`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: {
//           llm_model: partialConfig.llm_model,
//           tts_provider: partialConfig.tts_provider,
//           stt_provider: partialConfig.stt_provider,
//         },
//       });
//       setCost(res.data);
//     } catch (err) {
//       console.error("⚠️ Live cost fetch failed:", err);
//     }
//   };

//   // ✅ Save and sync (manual action)
//   const handleSave = async () => {
//     if (!token) return toast.error("Missing auth token");
//     setSaving(true);
//     try {
//       await axios.put(`${BASE_URL}/settings/voice`, config, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("✅ Local settings updated");

//       const res = await axios.post(`${BASE_URL}/settings/voice-ai/sync`, null, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success(`🔁 Synced with Bolna (Agent: ${res.data.agent_id})`);
//       console.log("✅ Sync:", res.data);
//     } catch (err: any) {
//       console.error("❌ Sync failed:", err);
//       toast.error(err.message || "Failed to update or sync");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🧩 Dropdown options
//   const ttsProviders = ["elevenlabs", "sarvam"];
//   const voiceOptions: Record<string, string[]> = {
//     elevenlabs: ["Vikram", "Monika Sogam"],
//     sarvam: ["Vidya", "Manisha", "Arya", "Anushka"],
//   };
//   const currentVoices = voiceOptions[config.tts_provider] || [];
//   const openAIModels = ["gpt-4o-mini", "gpt-4o", "gpt-4.1", "gpt-4", "gpt-3.5-turbo"];

//   // 🌀 Loading screen
//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center text-gray-600">
//         <div className="animate-pulse text-lg">Loading settings...</div>
//       </div>
//     );
//   }

//   // === MAIN UI ===
//   return (
//     <div className="min-h-screen bg-gray-50 px-6 py-10">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         ⚙️ Voice AI Configuration
//       </h1>

//       <div className="bg-white rounded-lg shadow p-6 space-y-5 border border-gray-200">
//         {/* Hospital Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Hospital Name
//           </label>
//           <input
//             type="text"
//             value={hospitalName}
//             disabled
//             className="border rounded-md p-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
//           />
//         </div>

//         {/* Assistant Name */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Assistant Name
//           </label>
//           <input
//             type="text"
//             value={config.agent_name}
//             onChange={(e) =>
//               setConfig((prev) => ({ ...prev, agent_name: e.target.value }))
//             }
//             className="border rounded-md p-2 w-full"
//           />
//         </div>

//         {/* Greeting Template */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Greeting Template
//           </label>
//           <textarea
//             rows={3}
//             value={config.greeting_template}
//             onChange={(e) =>
//               setConfig((prev) => ({
//                 ...prev,
//                 greeting_template: e.target.value,
//               }))
//             }
//             className="border rounded-md p-2 w-full"
//           />
//           <p className="text-xs text-gray-500 mt-1 italic">
//             Example:{" "}
//             {config.greeting_template
//               .replace("{patient_name}", "Rahul")
//               .replace("{agent_name}", config.agent_name)
//               .replace("{hospital_name}", hospitalName)}
//           </p>
//         </div>

//         {/* TTS Provider */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             TTS Provider
//           </label>
//           <select
//             value={config.tts_provider}
//             onChange={(e) => {
//               const newProvider = e.target.value;
//               const defaultVoice = voiceOptions[newProvider]?.[0] || "Vikram";
//               const updated = {
//                 ...config,
//                 tts_provider: newProvider,
//                 tts_voice: defaultVoice,
//               };
//               setConfig(updated);
//               fetchLiveCost(updated); // 🔥 live update
//             }}
//             className="border rounded-md p-2 w-full"
//           >
//             {ttsProviders.map((p) => (
//               <option key={p} value={p}>
//                 {p}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* TTS Voice */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             TTS Voice
//           </label>
//           <select
//             value={config.tts_voice}
//             onChange={(e) =>
//               setConfig((prev) => ({ ...prev, tts_voice: e.target.value }))
//             }
//             className="border rounded-md p-2 w-full"
//           >
//             {currentVoices.map((v) => (
//               <option key={v} value={v}>
//                 {v}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* LLM Model */}
//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             LLM Model
//           </label>
//           <select
//             value={config.llm_model}
//             onChange={(e) => {
//               const updated = { ...config, llm_model: e.target.value };
//               setConfig(updated);
//               fetchLiveCost(updated); // 🔥 live update
//             }}
//             className="border rounded-md p-2 w-full"
//           >
//             {openAIModels.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Cost Breakdown */}
//         <CostBar cost={cost} />

//         {/* Save Button */}
//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className={`w-full mt-6 py-2 rounded-md text-white font-semibold transition ${
//             saving
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {saving ? "Saving..." : "Save & Sync to Bolna"}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import CostBar from "@/components/CostBar";
import { motion } from "framer-motion";
import { Settings, Save, RefreshCcw } from "lucide-react";
import {  useRouter } from "next/navigation"

const BASE_URL = "http://127.0.0.1:8000";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string>("Your Hospital");
  const [cost, setCost] = useState<any>(null);

  const [config, setConfig] = useState({
    stt_provider: "deepgram",
    tts_provider: "sarvam",
    tts_voice: "Vidya",
    agent_name: "Arya",
    greeting_template:
      "Namaste {patient_name}, this is {agent_name} from {hospital_name}. How are you feeling today?",
    llm_provider: "openai",
    llm_model: "gpt-4o-mini",
  });

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      toast.error("You are not logged in");
      return;
    }
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      try {
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hospital = meRes.data?.hospital_name || "Your Hospital";
        setHospitalName(hospital);

        const settingsRes = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const local = settingsRes.data.local_settings || {};
        const updated = {
          stt_provider: local.stt_provider || "deepgram",
          tts_provider: local.tts_provider || "sarvam",
          tts_voice: local.tts_voice || "Vidya",
          agent_name: local.agent_name || "Arya",
          greeting_template:
            local.greeting_template ||
            `Namaste {patient_name}, this is {agent_name} from ${hospital}. How are you feeling today?`,
          llm_provider: local.llm_provider || "openai",
          llm_model: local.llm_model || "gpt-4o-mini",
        };
        setConfig(updated);
        await fetchLiveCost(updated);
        toast.success("✅ Settings loaded");
      } catch {
        toast.error("Could not load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const fetchLiveCost = async (partialConfig = config) => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/settings/voice-ai/cost`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          llm_model: partialConfig.llm_model,
          tts_provider: partialConfig.tts_provider,
          stt_provider: partialConfig.stt_provider,
        },
      });
      setCost(res.data);
    } catch {
      console.error("⚠️ Cost fetch failed");
    }
  };
const router = useRouter()

  const handleSave = async () => {
    if (!token) return toast.error("Missing auth token");
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/settings/voice`, config, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Local settings updated");
      const res = await axios.post(`${BASE_URL}/settings/voice-ai/sync`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`🔁 Synced with Bolna (Agent: ${res.data.agent_id})`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update or sync");
    } finally {
      setSaving(false);
    }
  };

  const ttsProviders = ["elevenlabs", "sarvam"];
  const voiceOptions: Record<string, string[]> = {
    elevenlabs: ["Vikram", "Monika Sogam"],
    sarvam: ["Vidya", "Manisha", "Arya", "Anushka"],
  };
  const currentVoices = voiceOptions[config.tts_provider] || [];
  const openAIModels = ["gpt-4o-mini", "gpt-4o", "gpt-4.1", "gpt-4", "gpt-3.5-turbo"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500 text-lg">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Settings className="text-indigo-600 w-7 h-7" />
          <h1 className="text-3xl font-bold text-gray-800">
            Voice AI Configuration
          </h1>
        </div>
        <button
onClick={() => router.push(`/`)}  // ✅ correct template literal
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Patients
          </button>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <InputBlock
              label="Hospital Name"
              value={hospitalName}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <InputBlock
              label="Assistant Name"
              value={config.agent_name}
              onChange={(e) =>
                setConfig((p) => ({ ...p, agent_name: e.target.value }))
              }
            />
          </div>

          <TextareaBlock
            label="Greeting Template"
            value={config.greeting_template}
            onChange={(e) =>
              setConfig((p) => ({ ...p, greeting_template: e.target.value }))
            }
            example={config.greeting_template
              .replace("{patient_name}", "Rahul")
              .replace("{agent_name}", config.agent_name)
              .replace("{hospital_name}", hospitalName)}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <SelectBlock
              label="TTS Provider"
              value={config.tts_provider}
              options={ttsProviders}
              onChange={(e) => {
                const newProv = e.target.value;
                const defVoice = voiceOptions[newProv]?.[0] || "Vikram";
                const updated = {
                  ...config,
                  tts_provider: newProv,
                  tts_voice: defVoice,
                };
                setConfig(updated);
                fetchLiveCost(updated);
              }}
            />
            <SelectBlock
              label="TTS Voice"
              value={config.tts_voice}
              options={currentVoices}
              onChange={(e) =>
                setConfig((p) => ({ ...p, tts_voice: e.target.value }))
              }
            />
          </div>

          <SelectBlock
            label="LLM Model (OpenAI)"
            value={config.llm_model}
            options={openAIModels}
            onChange={(e) => {
              const updated = { ...config, llm_model: e.target.value };
              setConfig(updated);
              fetchLiveCost(updated);
            }}
          />

          <CostBar cost={cost} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving ? (
              <>
                <RefreshCcw className="animate-spin w-5 h-5" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save & Sync
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ✅ Small reusable UI components for clarity */

function InputBlock({
  label,
  value,
  onChange,
  disabled = false,
  className = "",
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-lg px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none ${className}`}
      />
    </div>
  );
}

function TextareaBlock({ label, value, onChange, example }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      {example && (
        <p className="text-xs text-gray-500 mt-1 italic">Example: {example}</p>
      )}
    </div>
  );
}

function SelectBlock({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 w-full text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
