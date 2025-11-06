"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

type Call = {
  call_id: string;
  execution_id: string;
  status: string;
  duration: number;
  cost: number;
  created_at: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function PatientCallHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""), []);

  async function fetchCalls() {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/call/patients/${id}/calls`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setCalls(data.calls || []);
    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      setErrorMsg(err?.message || "Failed to load call history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-gray-500 animate-pulse">Loading patient call history...</div>;
  }

  if (errorMsg) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 mb-3">{errorMsg}</p>
        <button
          onClick={fetchCalls}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          📞 Call History for Patient #{id}
        </h1>

        {calls.length === 0 ? (
          <p className="text-gray-500 italic">No calls made for this patient yet.</p>
        ) : (
          <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Cost</th>
                  <th className="text-center p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((c) => (
                  <tr
                    key={c.call_id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="p-4">
                      {new Date(c.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          c.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : c.status === "initiated"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">{c.duration ? `${c.duration}s` : "--"}</td>
                    <td className="p-4">₹{(c.cost || 0).toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          router.push(`/patients/${id}/calls/${c.execution_id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
