"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
  id: number;
  selectedSize?: string | null;
  quantityInCart: number;
  [key: string]: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: any) => void;
  updateItemQuantity: (id: number, size: string | null, quantity: number) => void;
  removeItem: (id: number, size: string | null) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cartItems", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  // Add or increment
  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize === item.selectedSize
            ? { ...i, quantityInCart: i.quantityInCart + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantityInCart: 1 }];
    });
  };

  // Update quantity directly
  const updateItemQuantity = (id: number, size: string | null, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedSize === size
          ? { ...i, quantityInCart: quantity }
          : i
      )
    );
  };

  // Remove specific item
  const removeItem = (id: number, size: string | null) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize === size))
    );
  };

  // Clear all
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new Event("cartCleared"));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateItemQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};