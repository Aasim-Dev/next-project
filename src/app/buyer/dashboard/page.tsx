// app/buyer/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Clock, CheckCircle, Store } from "lucide-react";

interface BuyerStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

export default function BuyerDashboard() {
  const [stats, setStats] = useState<BuyerStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      setStats({
        totalOrders: 12,
        pendingOrders: 2,
        completedOrders: 8,
        totalSpent: 3450,
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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your orders and discover amazing photography services
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<ShoppingBag className="text-blue-600" size={28} />}
          title="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="text-yellow-600" size={28} />}
          title="Pending Orders"
          value={stats.pendingOrders}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" size={28} />}
          title="Completed"
          value={stats.completedOrders}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Package className="text-purple-600" size={28} />}
          title="Total Spent"
          value={`$${stats.totalSpent}`}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Explore Photography Services</h2>
        <p className="mb-6 text-blue-50">
          Find the perfect photographer for your next project
        </p>
        <Link
          href="/buyer/marketplace"
          className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          <Store size={20} />
          <span>Browse Marketplace</span>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/buyer/orders"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          <OrderItem 
            orderId="ORD-001"
            seller="John Photography"
            service="Wedding Photography Package"
            amount={1200}
            status="completed"
            date="May 15, 2025"
          />
          <OrderItem 
            orderId="ORD-002"
            seller="Sarah Studios"
            service="Portrait Session"
            amount={350}
            status="pending"
            date="June 1, 2025"
          />
          <OrderItem 
            orderId="ORD-003"
            seller="Mike Captures"
            service="Event Coverage"
            amount={800}
            status="in-progress"
            date="May 28, 2025"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor }: any) {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center space-x-4 mb-3">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function OrderItem({ orderId, seller, service, amount, status, date }: any) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    "in-progress": "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-1">
          <p className="font-medium text-gray-900">{orderId}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{service}</p>
        <p className="text-sm text-gray-500">by {seller} • {date}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">${amount}</p>
        <Link
          href={`/buyer/orders/${orderId}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}