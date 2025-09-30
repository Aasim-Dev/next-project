// src/app/buyer/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: { url: string }[];
    category: string;
    seller: {
      name: string;
      email: string;
    };
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalAmount: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cart');
      const data = await res.json();

      if (data.success) {
        setCart(data.data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      setUpdating(productId);
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.data.cart);
      } else {
        alert(data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      setUpdating(productId);
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setCart(data.data.cart);
      } else {
        alert(data.error || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Remove item error:', error);
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const proceedToCheckout = () => {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/buyer/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        <button
          onClick={() => router.push('/buyer/marketplace')}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Browse Marketplace</span>
          <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">{cart.items.length} item(s) in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
              isUpdating={updating === item.product._id}
            />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>${(cart.totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${(cart.totalAmount * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => router.push('/buyer/marketplace')}
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({ item, onUpdateQuantity, onRemove, isUpdating }: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating: boolean;
}) {
  const imageUrl = item.product.images && item.product.images.length > 0
    ? item.product.images[0].url
    : '/placeholder-image.jpg';

  const subtotal = item.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {imageUrl !== '/placeholder-image.jpg' ? (
            <img src={imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">📸</span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.product.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">by {item.product.seller.name}</p>
          <p className="text-sm text-gray-500 capitalize">{item.product.category}</p>
        </div>

        {/* Price and Actions */}
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900 mb-3">
            ${subtotal.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            ${item.price.toFixed(2)} each
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-end space-x-2 mb-3">
            <button
              onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
              disabled={isUpdating}
              className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.product._id)}
            disabled={isUpdating}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}