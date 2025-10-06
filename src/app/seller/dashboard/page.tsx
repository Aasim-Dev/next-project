// src/app/seller/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Eye,
  Camera,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  buyer: {
    name: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      title: string;
    };
    quantity: number;
  }>;
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user data to get seller ID
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      const sellerId = userData.data.user.id;

      // Fetch products
      const productsRes = await fetch(`/api/product?sellerId=${sellerId}&status=all`);
      const productsData = await productsRes.json();

      // Fetch orders
      const ordersRes = await fetch("/api/orders/seller");
      const ordersData = await ordersRes.json();

      if (productsData.success && ordersData.success) {
        const products = productsData.data || [];
        const orders = ordersData.data || [];

        // Calculate stats
        const totalRevenue = orders.reduce((sum: number, order: any) =>
          sum + order.totalAmount, 0
        );

        const currentMonth = new Date().getMonth();
        const monthlyRevenue = orders
          .filter((order: any) => new Date(order.createdAt).getMonth() === currentMonth)
          .reduce((sum: number, order: any) => sum + order.totalAmount, 0);

        const pendingOrders = orders.filter((o: any) =>
          o.status === 'pending'
        ).length;

        const completedOrders = orders.filter((o: any) =>
          o.status === 'completed'
        ).length;

        const activeProducts = products.filter((p: any) => p.isActive).length;

        setStats({
          totalProducts: products.length,
          activeProducts,
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          totalRevenue,
          monthlyRevenue,
        });

        // Set recent orders (last 5)
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your photography services and track your business performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-4xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
          <p className="text-sm text-green-100 mt-2">
            ${stats.monthlyRevenue.toFixed(0)} this month
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag size={32} />
            <Package size={24} className="opacity-75" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
          <Link href="/seller/orders" className="text-sm text-blue-100 hover:text-white mt-2 inline-block">
            View all orders →
          </Link>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
            {stats.pendingOrders > 0 && (
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            )}
          </div>
          <p className="text-yellow-100 text-sm font-medium mb-1">Pending Orders</p>
          <p className="text-4xl font-bold">{stats.pendingOrders}</p>
          <Link href="/seller/orders?status=pending" className="text-sm text-yellow-100 hover:text-white mt-2 inline-block">
            Review orders →
          </Link>
        </div>

        {/* Active Products */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Camera size={32} />
            <Package size={24} className="opacity-75" />
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Active Products</p>
          <p className="text-4xl font-bold">{stats.activeProducts}</p>
          <p className="text-sm text-purple-100 mt-2">
            {stats.totalProducts} total products
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link
          href="/seller/add-product"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors mb-3">
              <Camera className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Add Product</h3>
            <p className="text-sm text-gray-600">List new service</p>
          </div>
        </Link>

        <Link
          href="/seller/products"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors mb-3">
              <Package className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">My Products</h3>
            <p className="text-sm text-gray-600">{stats.totalProducts} products</p>
          </div>
        </Link>

        <Link
          href="/seller/orders"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors mb-3 relative">
              <ShoppingBag className="text-green-600" size={24} />
              {stats.pendingOrders > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pendingOrders}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Orders</h3>
            <p className="text-sm text-gray-600">{stats.pendingOrders} pending</p>
          </div>
        </Link>

        <Link
          href="/seller/settings"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors mb-3">
              <Eye className="text-gray-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
            <p className="text-sm text-gray-600">Manage profile</p>
          </div>
        </Link>
      </div>

      {/* Alerts */}
      {stats.pendingOrders > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-600 mr-3" size={24} />
            <div>
              <p className="font-semibold text-yellow-900">
                You have {stats.pendingOrders} pending order{stats.pendingOrders > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-yellow-700">
                Review and accept orders to start earning
              </p>
            </div>
            <Link
              href="/seller/orders?status=pending"
              className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Review Orders
            </Link>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/seller/orders" className="text-purple-600 hover:underline text-sm">
              View all
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your photography services</p>
            <Link
              href="/seller/add-product"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.orderId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    Customer: <span className="font-medium text-gray-900">{order.buyer.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}: {order.items[0]?.product.title}
                    {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                  </p>
                </div>

                <Link
                  href={`/seller/orders/${order._id}`}
                  className="text-purple-600 hover:underline text-sm font-medium inline-flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <Eye size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}