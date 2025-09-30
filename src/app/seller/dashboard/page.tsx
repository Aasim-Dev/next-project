// app/seller/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ShoppingBag, DollarSign, TrendingUp, Eye, Star, PlusCircle } from "lucide-react";

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalEarnings: number;
  pendingOrders: number;
  completedOrders: number;
  profileViews: number;
  averageRating: number;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0,
    completedOrders: 0,
    profileViews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API call
      setStats({
        totalProducts: 15,
        totalOrders: 87,
        totalEarnings: 12450,
        pendingOrders: 5,
        completedOrders: 78,
        profileViews: 1234,
        averageRating: 4.8,
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
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your products and track your sales performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Camera className="text-purple-600" size={28} />}
          title="Total Products"
          value={stats.totalProducts}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<ShoppingBag className="text-blue-600" size={28} />}
          title="Total Orders"
          value={stats.totalOrders}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<DollarSign className="text-green-600" size={28} />}
          title="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={28} />}
          title="Pending Orders"
          value={stats.pendingOrders}
          bgColor="bg-orange-50"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Eye className="text-indigo-600" size={24} />
            <h3 className="text-gray-600 font-medium">Profile Views</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
          <p className="text-sm text-green-600 mt-1">+12.5% this week</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Star className="text-yellow-500" size={24} />
            <h3 className="text-gray-600 font-medium">Average Rating</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
          <p className="text-sm text-gray-500 mt-1">Based on {stats.completedOrders} reviews</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-2">
            <ShoppingBag className="text-green-600" size={24} />
            <h3 className="text-gray-600 font-medium">Completed Orders</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
          <p className="text-sm text-green-600 mt-1">89.7% completion rate</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-8 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Grow Your Photography Business</h2>
        <p className="mb-6 text-purple-50">
          Add new products to attract more customers
        </p>
        <Link
          href="/seller/add-product"
          className="inline-flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/seller/orders"
            className="text-purple-600 hover:underline text-sm font-medium"
          >
            View All Orders
          </Link>
        </div>
        <div className="space-y-4">
          <OrderItem 
            orderId="ORD-456"
            buyer="Emma Wilson"
            product="Wedding Photography Package"
            amount={1200}
            status="pending"
            date="June 2, 2025"
          />
          <OrderItem 
            orderId="ORD-455"
            buyer="Michael Brown"
            product="Portrait Session - Premium"
            amount={450}
            status="in-progress"
            date="June 1, 2025"
          />
          <OrderItem 
            orderId="ORD-454"
            buyer="Sarah Johnson"
            product="Event Photography"
            amount={680}
            status="completed"
            date="May 28, 2025"
          />
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Top Selling Products</h2>
          <Link
            href="/seller/products"
            className="text-purple-600 hover:underline text-sm font-medium"
          >
            Manage Products
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProductCard 
            name="Wedding Photography"
            sales={32}
            revenue={38400}
            image="📸"
          />
          <ProductCard 
            name="Portrait Session"
            sales={28}
            revenue={12600}
            image="🎭"
          />
          <ProductCard 
            name="Event Coverage"
            sales={18}
            revenue={14400}
            image="🎉"
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

function OrderItem({ orderId, buyer, product, amount, status, date }: any) {
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
        <p className="text-sm text-gray-600">{product}</p>
        <p className="text-sm text-gray-500">Customer: {buyer} • {date}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">${amount}</p>
        <Link
          href={`/seller/orders/${orderId}`}
          className="text-sm text-purple-600 hover:underline"
        >
          Manage Order
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ name, sales, revenue, image }: any) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{image}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{sales} sales</p>
        <p className="text-lg font-bold text-green-600">${revenue.toLocaleString()}</p>
      </div>
    </div>
  );
}