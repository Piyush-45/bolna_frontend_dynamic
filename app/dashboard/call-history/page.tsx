// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface CallLog {
//   id: string;
//   patient_name: string;
//   call_status: string;
//   duration?: number;
//   cost?: number;
//   created_at: string;
// }

// export default function CallHistoryPage() {
//   const [calls, setCalls] = useState<CallLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchLogs() {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await fetch("http://127.0.0.1:8000/call/logs", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await res.json();
//         setCalls(data);
//       } catch (err) {
//         console.error("Failed to fetch call logs:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchLogs();
//   }, []);

//   if (loading)
//     return (
//       <div className="p-10 text-center text-gray-500 animate-pulse">
//         Loading call logs...
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-semibold mb-6 text-gray-800">
//           📞 Call History
//         </h1>

//         <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
//           <table className="w-full text-sm text-gray-700">
//             <thead className="bg-gray-100 text-gray-800">
//               <tr>
//                 <th className="text-left p-4 font-medium">Patient</th>
//                 <th className="text-left p-4 font-medium">Date</th>
//                 <th className="text-left p-4 font-medium">Status</th>
//                 <th className="text-left p-4 font-medium">Duration</th>
//                 <th className="text-left p-4 font-medium">Cost</th>
//                 <th className="text-center p-4 font-medium">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {calls.length > 0 ? (
//                 calls.map((c) => (
//                   <tr
//                     key={c.id}
//                     className="border-t border-gray-100 hover:bg-gray-50 transition-all"
//                   >
//                    <td className="p-4 font-medium text-gray-900 capitalize">
//   {c.patient_name || "—"}
// </td>
//                     <td className="p-4">
//                       {new Date(c.created_at).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                           c.call_status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : c.call_status === "initiated"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {c.call_status}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       {c.duration ? `${c.duration}s` : "--"}
//                     </td>
//                     <td className="p-4">₹{(c.cost || 0).toFixed(2)}</td>
//                     <td className="p-4 text-center">
//                       <button
//                         onClick={() =>
//                           router.push(`/dashboard/call-detail/${c.id}`)
//                         }
//                         className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition-all"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="text-center p-6 text-gray-500 italic"
//                   >
//                     No call logs available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCallLogs } from "@/lib/api";

interface CallLog {
  id: string;
  patient_name: string;
  call_status: string;
  duration?: number;
  cost?: number;
  created_at: string;
  execution_id?: string; // Add this field
}

export default function CallHistoryPage() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadLogs() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const data = await fetchCallLogs(token);
        setCalls(data);
      } catch (err) {
        console.error("❌ Failed to fetch call logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 animate-pulse">
        Loading call logs...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          📞 Call History
        </h1>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="text-left p-4 font-medium">Patient</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Duration</th>
                <th className="text-left p-4 font-medium">Cost</th>
                <th className="text-center p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {calls.length > 0 ? (
                calls.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 capitalize">
                      {c.patient_name || "—"}
                    </td>
                    <td className="p-4">
                      {new Date(c.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          c.call_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : c.call_status === "initiated"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.call_status}
                      </span>
                    </td>
                    <td className="p-4">{c.duration ? `${c.duration}s` : "--"}</td>
                    <td className="p-4">₹{(c.cost || 0).toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/call-detail/${c.execution_id || c.id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500 italic">
                    No call logs available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
