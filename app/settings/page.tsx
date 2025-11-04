"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// === BACKEND ROUTES (LOCALHOST) ===
const BASE_URL = "http://127.0.0.1:8000";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [config, setConfig] = useState({
    stt_provider: "deepgram",
    tts_provider: "sarvam",
    tts_voice: "Vidya",
    agent_name: "DynamicBolnaFinal Hospital",
    greeting_template:
      "Namaste {patient_name}, this is {agent_name} calling from DynamicBolnaFinal Hospital. How are you feeling today?",
  });

  // ✅ Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      toast.error("You are not logged in");
      return;
    }
    setToken(storedToken);
  }, []);

  // ✅ Fetch Voice Settings from backend (/settings/voice-ai/config)
  useEffect(() => {
    if (!token) return;
    async function fetchSettings() {
      try {
        const res = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const local = res.data.local_settings || {};
        setConfig({
          stt_provider: local.stt_provider || "deepgram",
          tts_provider: local.tts_provider || "sarvam",
          tts_voice: local.tts_voice || "Vidya",
          agent_name: local.agent_name || "DynamicBolnaFinal Hospital",
          greeting_template:
            local.greeting_template ||
            "Namaste {patient_name}, this is {agent_name} calling from DynamicBolnaFinal Hospital. How are you feeling today?",
        });

        toast.success("✅ Loaded current settings");
      } catch (err) {
        console.error("❌ Failed to fetch config:", err);
        toast.error("Could not fetch settings");
      }
    }
    fetchSettings();
  }, [token]);

  // ✅ Save & Sync (PUT local + POST sync)
  const handleSave = async () => {
    if (!token) {
      toast.error("Missing auth token");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Update local DB
      await axios.put(`${BASE_URL}/settings/voice`, config, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Settings updated locally");

      // 2️⃣ Sync with Bolna
      const res = await axios.post(`${BASE_URL}/settings/voice-ai/sync`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`🔁 Synced with Bolna (Agent: ${res.data.agent_id})`);
      console.log("✅ Sync Result:", res.data);
    } catch (err: any) {
      console.error("❌ Error saving config:", err);
      toast.error(
        err.response?.data?.detail?.message ||
          err.message ||
          "Failed to update or sync"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🎤 Providers and Voices
  const sttProviders = ["deepgram", "azure"];
  const ttsProviders = ["elevenlabs", "sarvam"];
  const elevenVoices = ["Bella", "Rachel", "Josh"];
  const sarvamVoices = ["Vidya", "Anushka", "Manisha", "Arya"];
  const currentVoices =
    config.tts_provider === "elevenlabs" ? elevenVoices : sarvamVoices;

  // ✅ View Live Config (GET /settings/voice-ai/config)
  const viewLiveConfig = async () => {
    if (!token) return toast.error("No token found");
    try {
      const res = await axios.get(`${BASE_URL}/settings/voice-ai/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Live Bolna Config:", res.data);
      toast.success("Fetched live config — check console");
    } catch (err: any) {
      console.error("❌ Failed to fetch live config:", err);
      toast.error("Failed to fetch live config");
    }
  };

  // === UI ===
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🎙️ Voice Agent Settings
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-5 border border-gray-200">
        {/* Agent Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={config.agent_name}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, agent_name: e.target.value }))
            }
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Greeting Template */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Greeting Template
          </label>
          <textarea
            rows={3}
            value={config.greeting_template}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                greeting_template: e.target.value,
              }))
            }
            className="border rounded-md p-2 w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example:{" "}
            <span className="italic">
              {config.greeting_template
                .replace("{patient_name}", "Rahul")
                .replace(
                  "{agent_name}",
                  config.agent_name || "Hospital AI Agent"
                )}
            </span>
          </p>
        </div>

        {/* STT Provider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            STT Provider
          </label>
          <select
            value={config.stt_provider}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, stt_provider: e.target.value }))
            }
            className="border rounded-md p-2 w-full"
          >
            {sttProviders.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Provider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            TTS Provider
          </label>
          <select
            value={config.tts_provider}
            onChange={(e) => {
              const newProvider = e.target.value;
              const defaultVoice =
                newProvider === "sarvam" ? "Vidya" : "Bella";
              setConfig((prev) => ({
                ...prev,
                tts_provider: newProvider,
                tts_voice: defaultVoice,
              }));
            }}
            className="border rounded-md p-2 w-full"
          >
            {ttsProviders.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* TTS Voice */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            TTS Voice
          </label>
          <select
            value={config.tts_voice}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, tts_voice: e.target.value }))
            }
            className="border rounded-md p-2 w-full"
          >
            {currentVoices.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full mt-4 py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save & Sync to Bolna"}
        </button>
      </div>

      {/* View Live Config */}
      <div className="mt-4">
        <button
          className="border px-3 py-2 rounded-md text-sm hover:bg-gray-100"
          onClick={viewLiveConfig}
        >
          View Live Config (Bolna)
        </button>
      </div>

      {/* Debug Section */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-semibold mb-2 text-gray-600">
          Debug — Current Config
        </p>
        <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
}
