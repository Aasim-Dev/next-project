// src/app/buyer/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, CheckCircle } from "lucide-react";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    paymentMethod: 'card',
    notes: '',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();

      if (data.success) {
        if (!data.data.cart || data.data.cart.items.length === 0) {
          router.push('/buyer/cart');
          return;
        }
        setCart(data.data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart) return;

    setProcessing(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to success page
        router.push(`/buyer/orders/${data.data.order._id}?success=true`);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading checkout...</div>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  const serviceFee = cart.totalAmount * 0.05;
  const totalAmount = cart.totalAmount + serviceFee;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {['card', 'paypal', 'bank-transfer'].map((method) => (
                  <label key={method} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="capitalize font-medium">{method.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes (Optional)</h2>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions or requirements..."
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-3 pb-3 border-b">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-2xl">📸</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:bg-blue-300"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}