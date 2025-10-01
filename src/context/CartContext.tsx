"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  cartItems: string[]; // Array of product IDs in cart
  setCartCount: (count: number) => void;
  refreshCartCount: () => Promise<void>;
  addToCartItems: (productId: string) => void;
  removeFromCartItems: (productId: string) => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Fetch cart count and items from API
  const refreshCartCount = async () => {
    try {
      const res = await fetch("/api/cart", { method: "GET" });
      const data = await res.json();

      if (data.success && data.data?.items) {
        const count = data.data.items.length;
        const itemIds = data.data.items.map((item: any) => item.product._id || item.product);
        setCartCount(count);
        setCartItems(itemIds);
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartCount(0);
      setCartItems([]);
    }
  };

  const addToCartItems = (productId: string) => {
    if (!cartItems.includes(productId)) {
      setCartItems(prev => [...prev, productId]);
      setCartCount(prev => prev + 1);
    }
  };

  const removeFromCartItems = (productId: string) => {
    setCartItems(prev => prev.filter(id => id !== productId));
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const isInCart = (productId: string) => {
    return cartItems.includes(productId);
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems,
      setCartCount, 
      refreshCartCount,
      addToCartItems,
      removeFromCartItems,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}