// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
      }
    } catch (error) {
      // User not authenticated
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    const routes = {
      admin: "/admin/dashboard",
      seller: "/seller/dashboard",
      buyer: "/buyer/dashboard",
    };
    return routes[user.role];
  };

  // Don't show navbar on dashboard pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/seller") || pathname?.startsWith("/buyer")) {
    return null;
  }

  const publicLinks = [
    { href: "/", label: "Home" },
  ];

  const authLinks = user ? [
    { href: getDashboardRoute(), label: "My Dashboard", icon: LayoutDashboard },
  ] : [
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          📸 PhotoHire
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 rounded"></span>
              )}
            </Link>
          ))}
          
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href={getDashboardRoute()}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                  >
                    <LayoutDashboard size={18} />
                    <span>My Dashboard</span>
                  </Link>
                  
                  <div className="flex items-center space-x-3 pl-3 border-l">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 rounded"></span>
                    )}
                  </Link>
                ))
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner px-4 py-3 space-y-3">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block font-medium ${
                pathname === link.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {!loading && (
            <>
              {user ? (
                <>
                  <div className="border-t pt-3">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium w-full justify-center mb-2"
                    >
                      <LayoutDashboard size={18} />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors w-full font-medium"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block font-medium ${
                        pathname === link.href
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}