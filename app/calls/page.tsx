"use client";

import { useEffect, useState } from "react";
import { fetchCallLogs } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCcw, Search, PhoneCall, CheckCircle2, XCircle } from "lucide-react";

export default function CallsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      toast.error("You are not logged in");
      return;
    }
    setToken(t);
    loadLogs(t);
  }, []);

  const loadLogs = async (t: string) => {
    setLoading(true);
    try {
      const res = await fetchCallLogs(t);
      setLogs(res);
    } catch (err) {
      toast.error("Failed to load call logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    await loadLogs(token);
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Logs refreshed");
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.patient_id.toLowerCase().includes(search.toLowerCase()) ||
      (l.call_status && l.call_status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PhoneCall className="h-7 w-7 text-blue-600" /> Call Logs
        </h1>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-sm ${
            refreshing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <RefreshCcw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by patient ID or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow">
        {loading ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">
            Loading call logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No call logs found.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-3">Call ID</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr
                  key={log.id}
                  className={`border-t hover:bg-gray-50 transition ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 font-mono text-gray-700">{log.id}</td>
                  <td className="p-3 font-mono text-gray-600">{log.patient_id}</td>
                  <td className="p-3">
                    <StatusBadge status={log.call_status} />
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* --- Status Badge --- */
function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();
  let color = "bg-gray-100 text-gray-700";
  let icon = null;

  if (normalized.includes("success") || normalized.includes("answered")) {
    color = "bg-green-100 text-green-800";
    icon = <CheckCircle2 className="h-4 w-4 mr-1" />;
  } else if (normalized.includes("failed") || normalized.includes("error")) {
    color = "bg-red-100 text-red-700";
    icon = <XCircle className="h-4 w-4 mr-1" />;
  } else if (normalized.includes("initiated")) {
    color = "bg-blue-100 text-blue-800";
    icon = <PhoneCall className="h-4 w-4 mr-1" />;
  }

  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${color}`}
    >
      {icon}
      {status}
    </span>
  );
}
