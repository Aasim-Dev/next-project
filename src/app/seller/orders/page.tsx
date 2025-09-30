// app/seller/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Eye, Check, X } from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  product: string;
  buyer: string;
  amount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  orderDate: string;
  deliveryDate: string;
  image: string;
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual API call
      const mockOrders: Order[] = [
        {
          id: "1",
          orderId: "ORD-456",
          product: "Wedding Photography Package",
          buyer: "Emma Wilson",
          amount: 1200,
          status: "pending",
          orderDate: "2025-06-02",
          deliveryDate: "2025-06-10",
          image: "📸"
        },
        {
          id: "2",
          orderId: "ORD-455",
          product: "Portrait Session - Premium",
          buyer: "Michael Brown",
          amount: 450,
          status: "in-progress",
          orderDate: "2025-06-01",
          deliveryDate: "2025-06-08",
          image: "🎭"
        },
        {
          id: "3",
          orderId: "ORD-454",
          product: "Corporate Event Photography",
          buyer: "Sarah Johnson",
          amount: 800,
          status: "completed",
          orderDate: "2025-05-28",
          deliveryDate: "2025-06-05",
          image: "🎉"
        },
        {
          id: "4",
          orderId: "ORD-453",
          product: "Wedding Photography Package",
          buyer: "David Lee",
          amount: 1200,
          status: "completed",
          orderDate: "2025-05-20",
          deliveryDate: "2025-05-28",
          image: "📸"
        },
        {
          id: "5",
          orderId: "ORD-452",
          product: "Portrait Session - Premium",
          buyer: "Lisa Anderson",
          amount: 450,
          status: "pending",
          orderDate: "2025-06-03",
          deliveryDate: "2025-06-12",
          image: "🎭"
        },
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: "in-progress" as any } : o
    ));
  };

  const handleRejectOrder = (orderId: string) => {
    if (confirm("Are you sure you want to reject this order?")) {
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: "cancelled" as any } : o
      ));
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: "completed" as any } : o
    ));
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
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
          <p className="text-3xl font-bold text-gray-900">{statusCounts["in-progress"]}</p>
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
            key={order.id} 
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

function OrderCard({order,onAccept,onReject,onComplete,}: {
        order: Order; onAccept: (id: string) => void; onReject: (id: string) => void; onComplete: (id: string) => void; }) {
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
        "in-progress": {
            icon: <Package className="text-blue-600" size={20} />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
            borderColor: "border-blue-200",
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

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">{order.image}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {order.product}
            </h3>
            <p className="text-sm text-gray-600 mb-1">Customer: {order.buyer}</p>
            <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
          {config.icon}
          <span className={`font-medium ${config.textColor}`}>{config.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Order Date</p>
          <p className="font-medium text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Delivery Date</p>
          <p className="font-medium text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="font-bold text-gray-900 text-lg">${order.amount}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t">
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Eye size={18} />
          <span>View Details</span>
        </button>
        
        {order.status === "pending" && (
          <>
            <button 
              onClick={() => onAccept(order.id)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Check size={18} />
              <span>Accept</span>
            </button>
            <button 
              onClick={() => onReject(order.id)}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={18} />
              <span>Reject</span>
            </button>
          </>
        )}
        
        {order.status === "in-progress" && (
          <button 
            onClick={() => onComplete(order.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={18} />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  );
}