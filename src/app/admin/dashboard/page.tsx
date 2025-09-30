// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Users, Camera, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";

interface AdminStats {
  totalSellers: number;
  totalBuyers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalSellers: 0,
    totalBuyers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const res = await fetch("/api/admin/stats");
      // const data = await res.json();
      
      // Mock data for now
      setStats({
        totalSellers: 245,
        totalBuyers: 1823,
        totalOrders: 4567,
        totalRevenue: 234500,
        pendingOrders: 67,
        completedOrders: 4321,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Camera className="text-purple-600" size={32} />}
          title="Total Sellers"
          value={stats.totalSellers}
          change="+12.5%"
          changeType="positive"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<Users className="text-blue-600" size={32} />}
          title="Total Buyers"
          value={stats.totalBuyers}
          change="+18.3%"
          changeType="positive"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<ShoppingBag className="text-orange-600" size={32} />}
          title="Total Orders"
          value={stats.totalOrders}
          change="+23.7%"
          changeType="positive"
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={32} />}
          title="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()}`}
          change="+31.2%"
          changeType="positive"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Package className="text-yellow-600" size={32} />}
          title="Pending Orders"
          value={stats.pendingOrders}
          change="Requires attention"
          changeType="neutral"
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<TrendingUp className="text-indigo-600" size={32} />}
          title="Completed Orders"
          value={stats.completedOrders}
          change="+15.8%"
          changeType="positive"
          bgColor="bg-indigo-50"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sellers</h2>
          <div className="space-y-4">
            <ActivityItem 
              name="John Photography"
              email="john@example.com"
              time="2 hours ago"
              type="seller"
            />
            <ActivityItem 
              name="Sarah Studios"
              email="sarah@example.com"
              time="5 hours ago"
              type="seller"
            />
            <ActivityItem 
              name="Mike Captures"
              email="mike@example.com"
              time="1 day ago"
              type="seller"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            <OrderItem 
              orderId="ORD-12345"
              buyer="Emma Wilson"
              seller="John Photography"
              amount={450}
              status="pending"
            />
            <OrderItem 
              orderId="ORD-12344"
              buyer="David Brown"
              seller="Sarah Studios"
              amount={680}
              status="completed"
            />
            <OrderItem 
              orderId="ORD-12343"
              buyer="Lisa Johnson"
              seller="Mike Captures"
              amount={320}
              status="in-progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, change, changeType, bgColor }: any) {
  const changeColor = 
    changeType === "positive" ? "text-green-600" : 
    changeType === "negative" ? "text-red-600" : 
    "text-gray-600";

  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <span className={`text-sm font-medium ${changeColor}`}>
          {change}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActivityItem({ name, email, time, type }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === 'seller' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

function OrderItem({ orderId, buyer, seller, amount, status }: any) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium text-gray-900">{orderId}</p>
        <p className="text-sm text-gray-600">{buyer} → {seller}</p>
        <p className="text-sm font-medium text-green-600">${amount}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
    </div>
  );
}