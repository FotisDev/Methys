"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ProductInDetails } from "@/_lib/types";
import { calculateDiscountPrice } from "@/_lib/utils/discountUtil/discountUtils";

export type CartItem = ProductInDetails & {
  selectedSize?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: ProductInDetails,
    selectedSize?: string,
    quantity?: number
  ) => void;
  updateQuantity: (
    itemId: number,
    selectedSize: string | undefined,
    quantity: number
  ) => void;
  removeFromCart: (itemId: number, selectedSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (itemId: number, selectedSize?: string) => boolean;
  getItemPrice: (item: CartItem) => {
    originalPrice: number;
    finalPrice: number;
    isDiscounted: boolean;
  }; 
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cartItems", e);
        setCart([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cartItems", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cart, isLoaded]);

  const getItemPrice = (item: CartItem) => {
    const basePrice = item.selectedSize
      ? item.product_variants.find((v) => v.size === item.selectedSize)
          ?.price || item.price
      : item.price;

    const originalPrice = parseFloat(String(basePrice)) || 0;
    const finalPrice = calculateDiscountPrice(originalPrice, item.is_offer);

    return {
      originalPrice,
      finalPrice,
      isDiscounted: !!item.is_offer,
    };
  };

  const addToCart = (
    product: ProductInDetails,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    if (!product) return;

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item?.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex]?.quantity || 0) + quantity,
        };
        return updatedCart;
      } else {
        const newItem: CartItem = {
          ...product,
          selectedSize,
          quantity,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (
    itemId: number,
    selectedSize: string | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item?.id === itemId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (itemId: number, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item?.id === itemId && item.selectedSize === selectedSize)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item) return total;
      const { finalPrice } = getItemPrice(item);
      return total + finalPrice * (item.quantity || 1);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + (item?.quantity || 0), 0);
  };

  const isInCart = (itemId: number, selectedSize?: string) => {
    return cart.some(
      (item) => item?.id === itemId && item.selectedSize === selectedSize
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getItemPrice,
      }}
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
