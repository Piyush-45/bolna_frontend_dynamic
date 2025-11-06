"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BASE_URL = "http://127.0.0.1:8000";

export default function AccountPage() {

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // ✅ Load token + fetch account
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      toast.error("You are not logged in");
      router.push("/login");
      return;
    }
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    async function fetchAccount() {
      try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        toast.success("✅ Account loaded");
      } catch (err) {
        console.error("❌ Failed to fetch account:", err);
        toast.error("Failed to load account info");
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, [token]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("👋 Logged out");
    setTimeout(() => router.push("/login"), 500);
  };

  // === UI ===
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <div className="animate-pulse">Loading account...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        <p>No account data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-md mx-auto bg-white shadow rounded-xl border border-gray-200 p-6 space-y-6">
        <motion.h1
          layout
          className="text-2xl font-bold text-gray-800 text-center"
        >
          🏥 Hospital Account
        </motion.h1>

        <motion.div layout className="space-y-4">
          <AccountField label="Hospital Name" value={user.hospital_name} />
          <AccountField label="Hospital ID" value={user.id} />
          {user.email && <AccountField label="Email" value={user.email} />}
          {user.created_at && (
            <AccountField
              label="Joined On"
              value={new Date(user.created_at).toLocaleDateString()}
            />
          )}
        </motion.div>

        <motion.button
          layout
          onClick={handleLogout}
          whileTap={{ scale: 0.96 }}
          className="w-full py-2 rounded-md font-semibold text-white bg-red-500 hover:bg-red-600 transition"
        >
          Logout
        </motion.button>
        <button
onClick={() => router.push(`/`)}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Patients
          </button>
      </div>
    </div>
  );
}

// ✅ Reusable display component
function AccountField({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 break-all">{value}</span>
    </div>
  );
}
