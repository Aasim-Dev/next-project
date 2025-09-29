"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Camera, Package, DollarSign, 
  TrendingUp, Calendar, Star, Eye 
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
}

interface DashboardStats {
  totalUsers?: number;
  totalSellers?: number;
  totalBuyers?: number;
  totalBookings?: number;
  totalRevenue?: number;
  pendingBookings?: number;
  completedBookings?: number;
  earnings?: number;
  profileViews?: number;
  rating?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data.user);
        // Mock stats - Replace with actual API calls
        generateMockStats(data.data.user.role);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockStats = (role: string) => {
    if (role === "admin") {
      setStats({
        totalUsers: 1250,
        totalSellers: 450,
        totalBuyers: 800,
        totalBookings: 3420,
        totalRevenue: 125000,
        pendingBookings: 45,
      });
    } else if (role === "seller") {
      setStats({
        totalBookings: 156,
        completedBookings: 142,
        pendingBookings: 8,
        earnings: 45230,
        profileViews: 2340,
        rating: 4.8,
      });
    } else {
      setStats({
        totalBookings: 12,
        completedBookings: 8,
        pendingBookings: 2,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  // Admin Dashboard
  if (user.role === "admin") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.name}! Here's your platform overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="text-blue-600" size={32} />}
            title="Total Users"
            value={stats.totalUsers || 0}
            change="+12.5%"
            changeType="positive"
          />
          <StatCard
            icon={<Camera className="text-purple-600" size={32} />}
            title="Total Sellers"
            value={stats.totalSellers || 0}
            change="+8.2%"
            changeType="positive"
          />
          <StatCard
            icon={<Users className="text-green-600" size={32} />}
            title="Total Buyers"
            value={stats.totalBuyers || 0}
            change="+15.3%"
            changeType="positive"
          />
          <StatCard
            icon={<Package className="text-orange-600" size={32} />}
            title="Total Bookings"
            value={stats.totalBookings || 0}
            change="+23.1%"
            changeType="positive"
          />
          <StatCard
            icon={<DollarSign className="text-emerald-600" size={32} />}
            title="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
            change="+18.7%"
            changeType="positive"
          />
          <StatCard
            icon={<TrendingUp className="text-red-600" size={32} />}
            title="Pending Bookings"
            value={stats.pendingBookings || 0}
            change="-5.4%"
            changeType="negative"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ActionButton href="/dashboard/users" label="Manage Users" />
            <ActionButton href="/dashboard/photographers" label="Review Photographers" />
            <ActionButton href="/dashboard/bookings" label="View Bookings" />
            <ActionButton href="/dashboard/analytics" label="View Analytics" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem 
              text="New photographer registered: John Smith"
              time="2 hours ago"
            />
            <ActivityItem 
              text="Booking completed: Wedding Photography"
              time="5 hours ago"
            />
            <ActivityItem 
              text="New user joined: Sarah Johnson"
              time="1 day ago"
            />
          </div>
        </div>
      </div>
    );
  }

  // Seller Dashboard
  if (user.role === "seller") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Photographer Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.name}! Here's your business overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Package className="text-blue-600" size={32} />}
            title="Total Bookings"
            value={stats.totalBookings || 0}
            change="+15.3%"
            changeType="positive"
          />
          <StatCard
            icon={<DollarSign className="text-green-600" size={32} />}
            title="Total Earnings"
            value={`$${(stats.earnings || 0).toLocaleString()}`}
            change="+22.5%"
            changeType="positive"
          />
          <StatCard
            icon={<TrendingUp className="text-orange-600" size={32} />}
            title="Pending Requests"
            value={stats.pendingBookings || 0}
            change="+5.0%"
            changeType="positive"
          />
          <StatCard
            icon={<Calendar className="text-purple-600" size={32} />}
            title="Completed"
            value={stats.completedBookings || 0}
            change="+18.2%"
            changeType="positive"
          />
          <StatCard
            icon={<Eye className="text-indigo-600" size={32} />}
            title="Profile Views"
            value={stats.profileViews || 0}
            change="+12.8%"
            changeType="positive"
          />
          <StatCard
            icon={<Star className="text-yellow-500" size={32} />}
            title="Rating"
            value={stats.rating?.toFixed(1) || "0.0"}
            change="Excellent"
            changeType="positive"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ActionButton href="/dashboard/profile" label="Edit Profile" />
            <ActionButton href="/dashboard/portfolio" label="Manage Portfolio" />
            <ActionButton href="/dashboard/bookings" label="View Bookings" />
            <ActionButton href="/dashboard/earnings" label="Track Earnings" />
          </div>
        </div>

        {/* Booking Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Booking Requests</h2>
          <div className="space-y-4">
            <BookingRequestItem 
              client="Emma Wilson"
              type="Wedding Photography"
              date="June 15, 2025"
              status="pending"
            />
            <BookingRequestItem 
              client="Michael Brown"
              type="Portrait Session"
              date="June 20, 2025"
              status="accepted"
            />
            <BookingRequestItem 
              client="Lisa Anderson"
              type="Event Coverage"
              date="June 25, 2025"
              status="pending"
            />
          </div>
        </div>
      </div>
    );
  }

  // Buyer Dashboard
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.name}! Find photographers and manage your bookings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Package className="text-blue-600" size={32} />}
          title="Total Bookings"
          value={stats.totalBookings || 0}
          change="+3 this month"
          changeType="positive"
        />
        <StatCard
          icon={<Calendar className="text-green-600" size={32} />}
          title="Completed"
          value={stats.completedBookings || 0}
          change="Great experience"
          changeType="positive"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={32} />}
          title="Pending"
          value={stats.pendingBookings || 0}
          change="Awaiting confirmation"
          changeType="neutral"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton href="/dashboard/photographers" label="Find Photographers" />
          <ActionButton href="/dashboard/bookings" label="My Bookings" />
          <ActionButton href="/dashboard/messages" label="Messages" />
        </div>
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Recent Bookings</h2>
        <div className="space-y-4">
          <MyBookingItem 
            photographer="John Smith"
            type="Wedding Photography"
            date="July 10, 2025"
            status="confirmed"
          />
          <MyBookingItem 
            photographer="Sarah Davis"
            type="Portrait Session"
            date="June 28, 2025"
            status="pending"
          />
          <MyBookingItem 
            photographer="Mike Johnson"
            type="Family Photos"
            date="June 5, 2025"
            status="completed"
          />
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, change, changeType }: any) {
  const changeColor = changeType === "positive" ? "text-green-600" : 
                      changeType === "negative" ? "text-red-600" : 
                      "text-gray-600";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`text-sm font-medium ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {label}
    </a>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <p className="text-gray-700">{text}</p>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

function BookingRequestItem({ client, type, date, status }: any) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium text-gray-900">{client}</p>
        <p className="text-sm text-gray-600">{type} • {date}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
    </div>
  );
}

function MyBookingItem({ photographer, type, date, status }: any) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium text-gray-900">{photographer}</p>
        <p className="text-sm text-gray-600">{type} • {date}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
    </div>
  );
}