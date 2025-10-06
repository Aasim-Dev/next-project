// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Users, Shield, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardRoute = () => {
    if (!user) return "/login";
    const routes = {
      admin: "/admin/dashboard",
      seller: "/seller/dashboard",
      buyer: "/buyer/dashboard",
    };
    return routes[user.role];
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with Professional
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Photographers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find and hire talented photographers for your special events, portraits, and commercial projects. Join our community of photography professionals.
            </p>
            
            {/* Dynamic CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <Link
                      href={getDashboardRoute()}
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
                    >
                      <span>Go to My Dashboard</span>
                      <ArrowRight size={20} />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl text-lg font-semibold"
                      >
                        <span>Get Started</span>
                        <ArrowRight size={20} />
                      </Link>
                      <Link
                        href="/login"
                        className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors border-2 border-blue-600 text-lg font-semibold"
                      >
                        <span>Sign In</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {!user && (
              <p className="mt-6 text-gray-500 text-sm">
                Join as a <Link href="/register?role=buyer" className="text-blue-600 hover:underline font-medium">Buyer</Link> or <Link href="/register?role=seller" className="text-purple-600 hover:underline font-medium">Photographer</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PhotoHire?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to connect talented photographers with clients who need their services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Camera className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Photographers</h3>
              <p className="text-gray-700">
                Browse through verified professional photographers with diverse specialties and portfolios to find the perfect match for your project.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Transactions</h3>
              <p className="text-gray-700">
                All payments are processed securely through our platform. Book with confidence knowing your money is protected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Management</h3>
              <p className="text-gray-700">
                Manage your bookings, communicate with photographers, and track your orders all in one convenient dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started with PhotoHire
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Buyers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                <Users className="mr-3" size={28} />
                For Clients
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Browse & Search</h4>
                    <p className="text-gray-600 text-sm">Find photographers by specialty, location, and budget</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Book Services</h4>
                    <p className="text-gray-600 text-sm">Add services to cart and complete secure checkout</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Get Results</h4>
                    <p className="text-gray-600 text-sm">Receive professional photos and leave reviews</p>
                  </div>
                </div>
              </div>
              <Link
                href={user?.role === "buyer" ? "/buyer/marketplace" : "/register?role=buyer"}
                className="mt-6 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Start browsing</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* For Sellers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-purple-600 mb-6 flex items-center">
                <Camera className="mr-3" size={28} />
                For Photographers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Create Profile</h4>
                    <p className="text-gray-600 text-sm">Set up your profile, portfolio, and services</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">List Services</h4>
                    <p className="text-gray-600 text-sm">Add your photography services and set your rates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Earn Money</h4>
                    <p className="text-gray-600 text-sm">Receive bookings and grow your photography business</p>
                  </div>
                </div>
              </div>
              <Link
                href={user?.role === "seller" ? "/seller/dashboard" : "/register?role=seller"}
                className="mt-6 inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>Start selling</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Professional Photographers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="text-blue-100">Completed Projects</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {user 
              ? `Welcome back, ${user.name}! Continue managing your account.`
              : "Join thousands of photographers and clients on PhotoHire today"
            }
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href={getDashboardRoute()}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  href="/register?role=buyer"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold"
                >
                  <span>I need a photographer</span>
                </Link>
                <Link
                  href="/register?role=seller"
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg text-lg font-semibold"
                >
                  <span>I'm a photographer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}