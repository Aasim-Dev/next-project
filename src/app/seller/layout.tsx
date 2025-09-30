// app/seller/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Home, Package, ShoppingBag, Camera,
  Settings, LogOut, Menu, X, PlusCircle
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "seller";
}

export default function SellerLayout({
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
        if (data.data.user.role !== "seller") {
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
    { href: "/seller/dashboard", icon: Home, label: "Dashboard" },
    { href: "/seller/products", icon: Camera, label: "My Products" },
    { href: "/seller/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/seller/add-product", icon: PlusCircle, label: "Add Product" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu size={24} />
              </button>
              <Link href="/seller/dashboard" className="text-2xl font-bold text-purple-600">
                📸 PhotoHire Seller
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Seller Account</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t">
                <Link
                  href="/seller/settings"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors mb-2"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}