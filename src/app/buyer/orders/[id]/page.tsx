// src/app/buyer/orders/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, Package, Clock, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Order {
  _id: string;
  orderId: string;
  buyer: {
    name: string;
    email: string;
  };
  items: Array<{
    _id: string;
    product: {
      _id: string;
      title: string;
      images: { url: string }[];
      category: string;
    };
    seller: {
      name: string;
      email: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setOrder(data.data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
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
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Link href="/buyer/orders" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div>
      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={32} />
            <div>
              <h3 className="text-lg font-bold text-green-900">Order Placed Successfully!</h3>
              <p className="text-green-700">
                Your order #{order.orderId} has been received and is being processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link
          href="/buyer/orders"
          className="flex items-center space-x-2 text-blue-600 hover:underline mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Orders</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.orderId}</h2>
                <p className="text-sm text-gray-600">Placed on {orderDate}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status.replace('-', ' ')}
              </span>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 pb-4 border-b last:border-0">
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

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.product.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">by {item.seller.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {item.product.category} • Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">${item.subtotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-blue-600" size={24} />
                <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
              </div>
              <div className="text-gray-700">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                  {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Order Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee (5%)</span>
                <span>${(order.totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${(order.totalAmount * 1.05).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4 mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="text-gray-600" size={20} />
                <span className="font-semibold text-gray-900">Payment</span>
              </div>
              <p className="text-gray-700 capitalize mb-2">
                Method: {order.paymentMethod.replace('-', ' ')}
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentStatus}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {order.status === 'completed' && (
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Leave Review
                </button>
              )}
              {order.status === 'pending' && (
                <button className="w-full bg-red-100 text-red-600 py-3 rounded-lg hover:bg-red-200 transition-colors">
                  Cancel Order
                </button>
              )}
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}