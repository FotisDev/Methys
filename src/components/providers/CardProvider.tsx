"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
  id: number | string; // Αλλαγή εδώ
  selectedSize?: string | null;
  quantityInCart: number;
  [key: string]: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: any) => void;
  updateItemQuantity: (id: number | string, size: string | null, quantity: number) => void; // Αλλαγή εδώ
  removeItem: (id: number | string, size: string | null) => void; // Αλλαγή εδώ
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cartItems]);

  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => String(i.id) === String(item.id) && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(item.id) && i.selectedSize === item.selectedSize
            ? { ...i, quantityInCart: i.quantityInCart + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantityInCart: 1 }];
    });
  };

  const updateItemQuantity = (id: number | string, size: string | null, quantity: number) => {
    if (quantity < 1) {
      removeItem(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        String(i.id) === String(id) && i.selectedSize === size
          ? { ...i, quantityInCart: quantity }
          : i
      )
    );
  };

  const removeItem = (id: number | string, size: string | null) => {
    setCartItems((prev) =>
      prev.filter((i) => !(String(i.id) === String(id) && i.selectedSize === size))
    );
  };

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