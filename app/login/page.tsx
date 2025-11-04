// 'use client';

// import { useState } from 'react';
// import { login } from '@/lib/api';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await login(email, password);
//       console.log("✅ Login success:", res);

//       if (res.user) {
//         localStorage.setItem('user', JSON.stringify(res.user));
//       }

//       router.push('/');
//     } catch (err: any) {
//       console.error("❌ Login error:", err);
//       alert("Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
//       >
//         <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

//         <label className="block mb-2 text-sm font-medium">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border px-3 py-2 rounded mb-4"
//           required
//         />

//         <label className="block mb-2 text-sm font-medium">Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border px-3 py-2 rounded mb-6"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>

//         <p className="text-center text-sm text-gray-500 mt-4">
//           Don’t have an account?{" "}
//           <a href="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { login } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await login(email, password);

      console.log('✅ Login successful:', result);

      // ✅ CRITICAL: Save with consistent key names
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('hospital', JSON.stringify(result.hospital));

      // ✅ Verify it was saved
      const savedToken = localStorage.getItem('token');
      console.log('✅ Token saved:', savedToken ? 'YES' : 'NO');
      console.log('Token preview:', savedToken?.substring(0, 20) + '...');

      toast.success('Login successful!');

      // ✅ Redirect to home/dashboard
      setTimeout(() => {
        router.push('/');
      }, 100);

    } catch (err: any) {
      console.error('❌ Login error:', err);
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Login</h2>
          <p className="mt-2 text-center text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@apollo.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
