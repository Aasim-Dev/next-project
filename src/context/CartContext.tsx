"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from API
  const refreshCartCount = async () => {
    try {
      const res = await fetch("/api/cart/count", { method: "GET" });
      const data = await res.json();

      if (data.success) {
        setCartCount(data.data.count);
      } else {
        console.error("Failed to fetch cart count:", data.error);
        setCartCount(0);
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, refreshCartCount }}>
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
