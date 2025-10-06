// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Users, Camera, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";

interface AdminStats {
  totalSellers: number;
  totalBuyers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentSellers: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentOrders: Array<{
    _id: string;
    orderId: string;
    buyer: {
      name: string;
      email: string;
    };
    items: Array<{
      seller: {
        name: string;
      };
    }>;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalSellers: 0,
    totalBuyers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentSellers: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<Users className="text-blue-600" size={32} />}
          title="Total Buyers"
          value={stats.totalBuyers}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<ShoppingBag className="text-orange-600" size={32} />}
          title="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={32} />}
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Package className="text-yellow-600" size={32} />}
          title="Pending Orders"
          value={stats.pendingOrders}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<TrendingUp className="text-indigo-600" size={32} />}
          title="Completed Orders"
          value={stats.completedOrders}
          bgColor="bg-indigo-50"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Products Listed</h3>
          <p className="text-4xl font-bold">{stats.totalProducts}</p>
          <p className="text-blue-100 mt-2">Active photography services</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
          <p className="text-4xl font-bold">
            {stats.totalOrders > 0
              ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
              : 0}
            %
          </p>
          <p className="text-green-100 mt-2">
            {stats.completedOrders} of {stats.totalOrders} orders completed
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sellers</h2>
          <div className="space-y-4">
            {stats.recentSellers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sellers yet</p>
            ) : (
              stats.recentSellers.map((seller) => (
                <ActivityItem
                  key={seller._id}
                  name={seller.name}
                  email={seller.email}
                  time={getTimeAgo(seller.createdAt)}
                  type="seller"
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <OrderItem
                  key={order._id}
                  orderId={order.orderId}
                  buyer={order.buyer.name}
                  seller={order.items[0]?.seller?.name || "N/A"}
                  amount={order.totalAmount}
                  status={order.status}
                  time={getTimeAgo(order.createdAt)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function StatCard({ icon, title, value, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
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
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            type === "seller"
              ? "bg-purple-100 text-purple-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {name.charAt(0).toUpperCase()}
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

function OrderItem({ orderId, buyer, seller, amount, status, time }: any) {
  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{orderId}</p>
        <p className="text-sm text-gray-600">
          {buyer} → {seller}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-medium text-green-600">${amount.toFixed(2)}</p>
          <span className="text-gray-400">•</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[status]
        }`}
      >
        {status}
      </span>
    </div>
  );
}