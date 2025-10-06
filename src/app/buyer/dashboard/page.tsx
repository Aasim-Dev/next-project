// src/app/buyer/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Eye,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  cartItems: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: {
      title: string;
      images: { url: string }[];
    };
    quantity: number;
  }>;
}

export default function BuyerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    cartItems: 0,
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
      
      // Fetch orders
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      
      // Fetch cart
      const cartRes = await fetch("/api/cart");
      const cartData = await cartRes.json();

      if (ordersData.success && cartData.success) {
        const orders = ordersData.data.orders || [];
        const cart = cartData.data;

        // Calculate stats
        const totalSpent = orders.reduce((sum: number, order: any) => 
          sum + order.totalAmount, 0
        );
        
        const pendingOrders = orders.filter((o: any) => 
          o.status === 'pending' || o.status === 'confirmed'
        ).length;
        
        const completedOrders = orders.filter((o: any) => 
          o.status === 'completed'
        ).length;

        setStats({
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          totalSpent,
          cartItems: cart.items?.length || 0,
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your photography service activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package size={32} />
            <TrendingUp size={24} className="opacity-75" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
          <Link href="/buyer/orders" className="text-sm text-blue-100 hover:text-white mt-2 inline-block">
            View all orders →
          </Link>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} />
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-yellow-100 text-sm font-medium mb-1">Pending Orders</p>
          <p className="text-4xl font-bold">{stats.pendingOrders}</p>
          <Link href="/buyer/orders?status=pending" className="text-sm text-yellow-100 hover:text-white mt-2 inline-block">
            Track orders →
          </Link>
        </div>

        {/* Completed Orders */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} />
            <Star size={24} className="opacity-75" />
          </div>
          <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
          <p className="text-4xl font-bold">{stats.completedOrders}</p>
          <Link href="/buyer/orders?status=completed" className="text-sm text-green-100 hover:text-white mt-2 inline-block">
            Leave reviews →
          </Link>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <ShoppingCart size={24} className="opacity-75" />
          </div>
          <p className="text-purple-100 text-sm font-medium mb-1">Total Spent</p>
          <p className="text-4xl font-bold">${stats.totalSpent.toFixed(0)}</p>
          <p className="text-sm text-purple-100 mt-2">
            {stats.cartItems} items in cart
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/buyer/marketplace"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Eye className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Marketplace</h3>
              <p className="text-sm text-gray-600">Find photographers</p>
            </div>
          </div>
        </Link>

        <Link
          href="/buyer/cart"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors relative">
              <ShoppingCart className="text-green-600" size={24} />
              {stats.cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.cartItems}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Cart</h3>
              <p className="text-sm text-gray-600">{stats.cartItems} items</p>
            </div>
          </div>
        </Link>

        <Link
          href="/buyer/orders"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Package className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-600">{stats.totalOrders} total orders</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/buyer/orders" className="text-blue-600 hover:underline text-sm">
              View all
            </Link>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start exploring our marketplace to find photographers</p>
            <Link
              href="/buyer/marketplace"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Marketplace
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

                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-sm">📸</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>

                <Link
                  href={`/buyer/orders/${order._id}`}
                  className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center space-x-1"
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