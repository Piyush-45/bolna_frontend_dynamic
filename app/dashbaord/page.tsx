// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function DashboardPage() {
//   const [user, setUser] = useState<{ email: string; hospital_name?: string } | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user');
//     router.push('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">
//           Account Details
//         </h1>

//         {user ? (
//           <>
//             <div className="text-left mb-6 space-y-2">
//               <p className="text-gray-700">
//                 <strong>Hospital:</strong> {user.hospital_name || '—'}
//               </p>
//               <p className="text-gray-700">
//                 <strong>Email:</strong> {user.email}
//               </p>
//             </div>

//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => router.push('/')}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Back to Patients
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Logout
//               </button>
//             </div>
//           </>
//         ) : (
//           <p className="text-gray-600">Loading account...</p>
//         )}


//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hospital, setHospital] = useState<any>(null);

  useEffect(() => {
    // Just load user data (AuthGuard already checked auth)
    const userData = localStorage.getItem('user');
    const hospitalData = localStorage.getItem('hospital');

    if (userData) setUser(JSON.parse(userData));
    if (hospitalData) setHospital(JSON.parse(hospitalData));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {hospital && (
              <p className="text-sm text-gray-600 mt-1">
                {hospital.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={() => {
                localStorage.clear();
                router.push('/login');
              }}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Settings Card */}
          <div
            onClick={() => router.push('/settings')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">⚙️ Settings</h2>
            </div>
            <p className="text-gray-600">
              Configure TTS/STT providers and voice settings
            </p>
          </div>

          {/* Patients Card */}
          <div
            onClick={() => router.push('/patients')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">👥 Patients</h2>
            </div>
            <p className="text-gray-600">
              View and manage patients, initiate calls
            </p>
          </div>

          {/* Calls Card */}
          <div
            onClick={() => router.push('/calls')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">📞 Calls</h2>
            </div>
            <p className="text-gray-600">
              View call history and transcripts
            </p>
          </div>

        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-600">Hospital</p>
              <p className="text-lg font-semibold">{hospital?.name || 'Loading...'}</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-600">Account</p>
              <p className="text-lg font-semibold">{user?.email || 'Loading...'}</p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Quick Start Guide</h3>
          <ol className="space-y-2 text-blue-800">
            <li>1. Go to <strong>Settings</strong> to configure your voice agent (TTS/STT)</li>
            <li>2. Add patients in the <strong>Patients</strong> section</li>
            <li>3. Click <strong>Dial</strong> to initiate your first call</li>
            <li>4. View call transcripts and analytics in <strong>Calls</strong></li>
          </ol>
        </div>
      </main>
    </div>
  );
}
