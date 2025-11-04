// 'use client';

// import { useEffect, useState } from 'react';
// import { usePathname, useRouter } from 'next/navigation';

// export default function AuthGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [checked, setChecked] = useState(false);

//   useEffect(() => {
//     // Wait until we're in the browser (localStorage is available)
//     if (typeof window === 'undefined') return;

//     const token = localStorage.getItem('access_token');
//     const isAuthPage = pathname === '/login' || pathname === '/signup';

//     if (!token && !isAuthPage) {
//       // ❌ Not logged in → send to login
//       router.replace('/login');
//     } else if (token && isAuthPage) {
//       // ✅ Already logged in → prevent access to login/signup
//       router.replace('/');
//     } else {
//       // ✅ Valid state → allow rendering
//       setChecked(true);
//     }
//   }, [pathname, router]);

//   // Prevent flicker before we check auth state
//   if (!checked) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-gray-600 text-sm">Checking session...</div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }



'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait until we're in the browser
    if (typeof window === 'undefined') return;

    // ✅ FIXED: Look for 'token' not 'access_token'
    const token = localStorage.getItem('token');
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    console.log('🔐 AuthGuard Check:', {
      pathname,
      hasToken: !!token,
      isAuthPage,
    });

    if (!token && !isAuthPage) {
      // ❌ Not logged in → send to login
      console.log('→ Redirecting to /login (no token)');
      router.replace('/login');
    } else if (token && isAuthPage) {
      // ✅ Already logged in → prevent access to login/signup
      console.log('→ Redirecting to / (already logged in)');
      router.replace('/');
    } else {
      // ✅ Valid state → allow rendering
      console.log('✅ Auth state valid, rendering page');
      setChecked(true);
    }
  }, [pathname, router]);

  // Prevent flicker before we check auth state
  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600 text-sm">Checking session...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
