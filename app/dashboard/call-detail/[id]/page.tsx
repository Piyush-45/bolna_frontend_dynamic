"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/** ---------- Types ---------- */
type TranscriptItem = { speaker: string; text: string };

type CallDetail = {
  execution_id: string;
  patient_id: string | null;
  patient_name?: string | null; // we’ll populate from /patients/:id
  status: string;
  duration: number; // seconds
  cost: number;     // number (credits or USD)
  transcript: TranscriptItem[] | null;
  summary?: string | null;
  recording_url?: string | null;
  raw_logs_count: number;
};

/** ---------- Helpers ---------- */
const API_BASE = "http://127.0.0.1:8000";

function fmtDuration(totalSeconds?: number) {
  const n = Number(totalSeconds ?? 0);
  if (!isFinite(n) || n <= 0) return "—";
  const m = Math.floor(n / 60);
  const s = n % 60;
  return `${m}m ${s}s`;
}

function statusChipClasses(status?: string) {
  const s = (status || "").toLowerCase();
  if (s === "completed")
    return "bg-green-100 text-green-700 border border-green-200";
  if (s === "failed" || s === "error")
    return "bg-red-100 text-red-700 border border-red-200";
  if (s === "queued" || s === "calling")
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
}

export default function CallDetailPage() {
  const { id } = useParams(); // execution_id
  const router = useRouter();
  const [detail, setDetail] = useState<CallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState<string>("Patient");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  }, []);

  async function fetchPatientName(pid?: string | null) {
    if (!pid) return;
    try {
      const res = await fetch(`${API_BASE}/patients/${pid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return; // silently fallback
      const data = await res.json();
      // Try common shapes: {name: "..."} or {patient: {name}}
      const name =
        data?.name ||
        data?.patient?.name ||
        data?.data?.name ||
        null;
      if (name) setPatientName(name);
    } catch {
      // ignore; we'll keep default
    }
  }

  async function fetchDetail() {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_BASE}/call/${id}/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed (${res.status})`);
      }
      const data: CallDetail = await res.json();

      // Defensive normalization
      const safeTranscript = Array.isArray(data?.transcript)
        ? data.transcript
        : [];

      const normalized: CallDetail = {
        execution_id: data?.execution_id || String(id),
        patient_id: data?.patient_id || null,
        patient_name: data?.patient_name || null,
        status: data?.status || "unknown",
        duration: Number.isFinite(Number(data?.duration))
          ? Number(data?.duration)
          : 0,
        cost: Number.isFinite(Number(data?.cost)) ? Number(data?.cost) : 0,
        transcript: safeTranscript,
        summary: data?.summary ?? null,
        recording_url: data?.recording_url ?? null,
        raw_logs_count: Number.isFinite(Number(data?.raw_logs_count))
          ? Number(data?.raw_logs_count)
          : (safeTranscript?.length || 0),
      };

      setDetail(normalized);

      // Patient name: prefer API value, else fetch
      if (normalized.patient_name) {
        setPatientName(normalized.patient_name);
      } else {
        await fetchPatientName(normalized.patient_id);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to load call details");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** ---------- UI ---------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="h-6 w-52 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-64 mt-6 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !detail) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/patients/${patient.id}/calls")}
            className="mb-4 text-blue-600 hover:underline text-sm"
          >
            ← Back to Call History
          </button>
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Couldn’t load call detail
            </h1>
            <p className="text-red-600 text-sm">
              {errorMsg || "Unknown error"}
            </p>
            <div className="mt-4">
              <button
                onClick={fetchDetail}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasTranscript = Array.isArray(detail.transcript) && detail.transcript.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/dashboard/call-history")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Call History
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDetail}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              title="Refresh"
            >
              ⟳ Refresh
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(detail.execution_id)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
              title="Copy execution id"
            >
              ⎘ Copy ID
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              🗂️ Call with {patientName || "Patient"}
            </h1>
            <p className="text-gray-500 text-sm">
              Execution ID: <span className="font-mono">{detail.execution_id}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
            <div>
              <span className="block text-gray-500">Status</span>
              <span
                className={`inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-full ${statusChipClasses(
                  detail.status
                )}`}
              >
                {detail.status}
              </span>
            </div>
            <div>
              <span className="block text-gray-500">Duration</span>
              <span className="font-medium mt-1 block">{fmtDuration(detail.duration)}</span>
            </div>
            <div>
              <span className="block text-gray-500">Total Cost</span>
              <span className="font-medium mt-1 block">
                ${Number(detail.cost || 0).toFixed(4)}
              </span>
            </div>
          </div>

          {/* Optional summary */}
          {detail.summary && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
              <h2 className="font-medium text-gray-800 mb-2">🧾 Summary</h2>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {detail.summary}
              </p>
            </div>
          )}

          {/* Transcript */}
          <div>
            <h2 className="font-semibold text-gray-800 mb-3">
              💬 Conversation Transcript
            </h2>

            {!hasTranscript ? (
              <p className="text-gray-500 italic text-sm">
                No transcript available.
              </p>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {detail.transcript!.map((t, i) => {
                  const isAgent = (t.speaker || "").toLowerCase() === "agent";
                  return (
                    <div
                      key={i}
                      className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm text-sm ${
                          isAgent
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-900 rounded-tl-none"
                        }`}
                      >
                        <span className="block text-xs opacity-80 mb-1">
                          {isAgent ? "AI Assistant" : "Patient"}
                        </span>
                        <p className="whitespace-pre-wrap">{t.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recording */}
          {detail.recording_url && (
            <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h2 className="font-semibold text-gray-800 mb-2">🎧 Call Recording</h2>
              <audio
                controls
                src={detail.recording_url}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Lightweight cost “breakdown” (visual only, uses total) */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h2 className="font-semibold text-gray-800 mb-2">🧾 Call Notes</h2>
              <p className="text-sm text-gray-700">
                Raw logs: {detail.raw_logs_count} • Status: {detail.status}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h2 className="font-semibold text-gray-800 mb-2">💰 Cost</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Total: ${Number(detail.cost || 0).toFixed(4)}</p>
                <p className="text-xs text-gray-500">
                  (Detailed provider breakdown can be added once your webhook stores it.)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center gap-2">
          <button
            onClick={fetchDetail}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
          >
            Refresh Details
          </button>
          <button
            onClick={() => router.push("/dashboard/call-history")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
          >
            Back to History
          </button>
        </div>
      </div>
    </div>
  );
}


// http://localhost:3000/dashboard/call-detail/1f36ebfd-70b0-4b34-8f89-7964353f6ae6
