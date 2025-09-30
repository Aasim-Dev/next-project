// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Home, Users, Camera, Package, 
  Settings, LogOut, Menu, X, BarChart3
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.data.user.role !== "admin") {
          router.push("/");
          return;
        }
        setUser(data.data.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/sellers", icon: Camera, label: "Manage Sellers" },
    { href: "/admin/buyers", icon: Users, label: "Manage Buyers" },
    { href: "/admin/orders", icon: Package, label: "All Orders" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-indigo-500">
            <Link href="/" className="text-2xl font-bold text-white">
              📸 PhotoHire Admin
            </Link>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-indigo-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-xs text-indigo-200">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-indigo-700 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-indigo-500">
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-indigo-700 transition-colors mb-2"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}