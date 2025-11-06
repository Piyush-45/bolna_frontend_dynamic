// 'use client';

// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Phone, Loader2, Pencil, Trash2, Clock } from 'lucide-react';
// import { deletePatient, initiateCall } from '@/lib/api';
// import EditPatientModal from './EditPatientModal';

// interface Patient {
//   id: string;
//   name: string;
//   phone: string;
//   category?: string; // OPD / discharged
//   call_count?: number;
//   created_at: string;
//   custom_questions?: string[];
// }

// interface PatientTableProps {
//   patients: Patient[];
//   onRefresh: () => void;
//   token: string;
// }

// export default function PatientTable({ patients, onRefresh, token }: PatientTableProps) {
//   const [callingPatientId, setCallingPatientId] = useState<string | null>(null);
//   const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

//   // --- Trigger AI Call ---

//   const handleCall = async (id: string) => {
//     try {
//       const result = await initiateCall(token, id);
//       toast.success(result.message || 'Call triggered!');
//     } catch (error: any) {
//       toast.error(error.response?.data?.detail || 'Failed to trigger call');
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this patient?')) return;
//     try {
//       await deletePatient(token, id);
//       toast.success('Patient deleted successfully');
//       onRefresh();
//     } catch (error) {
//       toast.error('Failed to delete patient');
//     }
//   };
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Name
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Phone
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Type
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Calls
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Added On
//             </th>
//             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>

//         <tbody className="bg-white divide-y divide-gray-200">
//           {patients.length === 0 ? (
//             <tr>
//               <td colSpan={6} className="text-center py-6 text-gray-500">
//                 No patients found
//               </td>
//             </tr>
//           ) : (
//             patients.map((patient) => (
//               <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {patient.name}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                   {patient.phone}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.category === 'discharged'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-blue-100 text-blue-800'
//                       }`}
//                   >
//                     {patient.category?.toUpperCase() || 'N/A'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                   {patient.call_count || 0}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                   {new Date(patient.created_at).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
//                   {/* ✏️ Edit */}
//                   {/* 🕒 History */}
// <button
//   onClick={() => toast.info(`Viewing history for ${patient.name}`)}
//   className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
//   title="View Call History"
// >
//   <Clock className="h-4 w-4 text-gray-600" />
// </button>
//                   <button
//                     onClick={() => setEditingPatient(patient)}
//                     className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
//                     title="Edit Patient"
//                   >
//                     <Pencil className="h-4 w-4 text-gray-700" />
//                   </button>
//                   {/* 🗑️ Delete */}
//                   <button
//                     onClick={() => handleDelete(patient.id)}
//                     className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
//                     title="Delete Patient"
//                   >
//                     <Trash2 className="h-4 w-4 text-red-600" />
//                   </button>
//                   {/* 📞 Dial */}
//                   <button
//                     onClick={() => handleCall(patient.id)}
//                     disabled={callingPatientId === patient.id}
//                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                   >
//                     {callingPatientId === patient.id ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-1 animate-spin" />
//                         Calling...
//                       </>
//                     ) : (
//                       <>
//                         <Phone className="h-4 w-4 mr-1" />
//                         Dial
//                       </>
//                     )}
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* 🧩 Edit Modal */}
//       {editingPatient && (
//         <EditPatientModal
//           patient={editingPatient}
//           isOpen={!!editingPatient}
//           onClose={() => setEditingPatient(null)}
//           onSuccess={() => {
//             setEditingPatient(null);
//             onRefresh();
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, Loader2, Pencil, Trash2, Clock } from "lucide-react";
import { deletePatient, initiateCall } from "@/lib/api";
import EditPatientModal from "./EditPatientModal";

interface Patient {
  id: string;
  name: string;
  phone: string;
  category?: string;
  call_count?: number;
  created_at: string;
  custom_questions?: string[];
}

interface PatientTableProps {
  patients: Patient[];
  onRefresh: () => void;
  token: string;
}

export default function PatientTable({
  patients,
  onRefresh,
  token,
}: PatientTableProps) {
  const [callingPatientId, setCallingPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // --- Trigger AI Call ---
  const handleCall = async (id: string) => {
    setCallingPatientId(id);
    try {
      const result = await initiateCall(token, id);
      toast.success(result.message || "Call triggered!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to trigger call");
    } finally {
      setCallingPatientId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      await deletePatient(token, id);
      toast.success("Patient deleted successfully");
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete patient");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calls</th> */}
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th> */}
            <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase text-center items-center  tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {patients.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                No patients found
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 transition-colors items-center"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {patient.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.category === "discharged"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {patient.category?.toUpperCase() || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center  gap-2">
                  {/* ✏️ Edit */}
                  <button
                    onClick={() => setEditingPatient(patient)}
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                    title="Edit Patient"
                  >
                    <Pencil className="h-4 w-4 text-gray-700" />
                  </button>

                  {/* 🕒 History */}
                  <button
                    onClick={() =>
                      (window.location.href = `/patients/${patient.id}/calls`)
                    }
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                    title="View Call History"
                  >
                    <Clock className="h-4 w-4 text-gray-600" />
                  </button>

                  {/* 🗑️ Delete */}
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                    title="Delete Patient"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>

                  {/* 📞 Dial */}
                  <button
                    onClick={() => handleCall(patient.id)}
                    disabled={callingPatientId === patient.id}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {callingPatientId === patient.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />{" "}
                        Calling...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-1" /> Dial
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🧩 Edit Modal */}
      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          isOpen={!!editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={() => {
            setEditingPatient(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
