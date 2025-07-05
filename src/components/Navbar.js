'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          PoolMate 🚗
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-700">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/available" className="hover:text-blue-600">Available Rides</Link>
          <Link href="/nearby-rides" className="hover:text-blue-600">Nearby Rides</Link>

          {isLoggedIn ? (
            <>
              <Link href="/create-ride">Create Ride</Link>
              <Link href="/my-created-rides">My Created</Link>
              <Link href="/my-joined-rides">My Joined</Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>

              {user && (
                <div className="text-xs text-gray-600 ml-3 border-l pl-3">
                  <p className="font-medium">{user.name}</p>
                  <p>{user.email}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
