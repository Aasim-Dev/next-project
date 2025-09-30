// src/app/buyer/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: { url: string }[];
    category: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(`/api/orders${params}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} className="text-yellow-600" />;
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Package size={20} className="text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your photography service orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? "You haven't placed any orders yet"
              : `No ${filter} orders found`}
          </p>
          <Link
            href="/buyer/marketplace"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, getStatusColor, getStatusIcon }: {
  order: Order;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="p-6 border-b">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {getStatusIcon(order.status)}
              <h3 className="text-xl font-bold text-gray-900">{order.orderId}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status.replace('-', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600">Placed on {orderDate}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-0">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.product.images && item.product.images.length > 0 ? (
                  <img 
                    src={item.product.images[0].url} 
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📸</span>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{item.product.title}</h4>
                <p className="text-sm text-gray-600 mb-1">by {item.seller.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {item.product.category} • Qty: {item.quantity}
                </p>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/buyer/orders/${order._id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye size={18} />
            <span>View Details</span>
          </Link>
          {order.status === 'completed' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Leave Review
            </button>
          )}
          {order.status === 'pending' && (
            <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}