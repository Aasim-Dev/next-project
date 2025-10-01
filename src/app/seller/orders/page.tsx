// src/app/seller/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Eye, Check, X } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: { url: string }[];
    category: string;
  };
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderId: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== "all" ? `?status=${filterStatus}` : "";
      const res = await fetch(`/api/orders/seller${params}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        fetchOrders();
        alert(`Order ${status} successfully`);
      } else {
        alert(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order");
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, "confirmed");
  };

  const handleRejectOrder = (orderId: string) => {
    if (confirm("Are you sure you want to reject this order?")) {
      updateOrderStatus(orderId, "cancelled");
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    if (confirm("Mark this order as completed?")) {
      updateOrderStatus(orderId, "completed");
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    "in-progress": orders.filter(o => o.status === "in-progress").length,
    completed: orders.filter(o => o.status === "completed").length,
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
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">
          Track and manage orders from your customers
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <Package className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <Clock className="text-yellow-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{statusCounts.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">In Progress</p>
            <Package className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statusCounts.confirmed + statusCounts["in-progress"]}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Completed</p>
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{statusCounts.completed}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          <FilterTab
            label="All Orders"
            count={statusCounts.all}
            isActive={filterStatus === "all"}
            onClick={() => setFilterStatus("all")}
          />
          <FilterTab
            label="Pending"
            count={statusCounts.pending}
            isActive={filterStatus === "pending"}
            onClick={() => setFilterStatus("pending")}
          />
          <FilterTab
            label="Confirmed"
            count={statusCounts.confirmed}
            isActive={filterStatus === "confirmed"}
            onClick={() => setFilterStatus("confirmed")}
          />
          <FilterTab
            label="In Progress"
            count={statusCounts["in-progress"]}
            isActive={filterStatus === "in-progress"}
            onClick={() => setFilterStatus("in-progress")}
          />
          <FilterTab
            label="Completed"
            count={statusCounts.completed}
            isActive={filterStatus === "completed"}
            onClick={() => setFilterStatus("completed")}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <OrderCard 
            key={order._id} 
            order={order}
            onAccept={handleAcceptOrder}
            onReject={handleRejectOrder}
            onComplete={handleCompleteOrder}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 mt-2">
            {filterStatus === "all" 
              ? "You haven't received any orders yet"
              : `No ${filterStatus} orders`}
          </p>
        </div>
      )}
    </div>
  );
}

function FilterTab({ label, count, isActive, onClick }: any) {
  const activeClass = isActive ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-600";
  
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 font-medium transition-colors hover:text-purple-600 ${activeClass}`}
    >
      {label} ({count})
    </button>
  );
}

function OrderCard({ order, onAccept, onReject, onComplete }: {
  order: Order;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}) {
  const statusConfig: Record<Order["status"], {
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    borderColor: string;
    label: string;
  }> = {
    pending: {
      icon: <Clock className="text-yellow-600" size={20} />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      label: "Pending"
    },
    confirmed: {
      icon: <CheckCircle className="text-blue-600" size={20} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      label: "Confirmed"
    },
    "in-progress": {
      icon: <Package className="text-purple-600" size={20} />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      borderColor: "border-purple-200",
      label: "In Progress"
    },
    completed: {
      icon: <CheckCircle className="text-green-600" size={20} />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      label: "Completed"
    },
    cancelled: {
      icon: <XCircle className="text-red-600" size={20} />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      label: "Cancelled"
    },
  };

  const config = statusConfig[order.status];
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Order #{order.orderId}
          </h3>
          <p className="text-sm text-gray-600">Customer: {order.buyer.name}</p>
          <p className="text-sm text-gray-500">Placed on {orderDate}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
          {config.icon}
          <span className={`font-medium ${config.textColor}`}>{config.label}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4 space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 pb-3 border-b last:border-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">
                {item.product.images && item.product.images.length > 0 
                  ? item.product.images[0].url 
                  : "📸"}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{item.product.title}</h4>
              <p className="text-sm text-gray-500 capitalize">
                {item.product.category} • Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/seller/orders/${order._id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Eye size={18} />
            <span>View Details</span>
          </Link>
          
          {order.status === "pending" && (
            <>
              <button 
                onClick={() => onAccept(order._id)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check size={18} />
                <span>Accept</span>
              </button>
              <button 
                onClick={() => onReject(order._id)}
                className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <X size={18} />
                <span>Reject</span>
              </button>
            </>
          )}
          
          {(order.status === "confirmed" || order.status === "in-progress") && (
            <button 
              onClick={() => onComplete(order._id)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} />
              <span>Mark Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}