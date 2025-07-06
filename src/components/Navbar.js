"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Optional utility if you use class merging

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          console.log(decoded);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Run initially
    syncUser();

    // Listen to changes from other tabs/windows or same tab
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Available Rides", href: "/available" },
    { label: "Nearby Rides", href: "/nearby-rides" },
    ...(isLoggedIn
      ? [
          { label: "Create Ride", href: "/create-ride" },
          { label: "My Created", href: "/my-created-rides" },
          { label: "My Joined", href: "/my-joined-rides" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-50 border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-semibold text-blue-700 tracking-tight"
        >
          PoolMate
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-blue-600 transition-colors duration-150 border-b-2 border-transparent pb-1",
                pathname === item.href &&
                  "text-blue-700 border-blue-700 font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Logout
              </Button>

              {user && (
                <div className="ml-2 text-sm text-gray-600 flex flex-col items-end">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs">{user.email}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "hover:text-blue-600 transition",
                  pathname === "/login" &&
                    "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  "hover:text-blue-600 transition",
                  pathname === "/register" &&
                    "text-blue-700 font-semibold border-b-2 border-blue-700 pb-1"
                )}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
