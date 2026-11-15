"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { ProductInDetails } from "@/_lib/types";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import { loadSavedCart, saveCart } from "@/_lib/backend/savedCart/action";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/i18n/client";

// How long to wait after the last cart change before saving it to the server.
const SAVE_DEBOUNCE_MS = 1500;

export type CartItem = ProductInDetails & {
  selectedSize?: string;
  quantity: number;
  discountedPrice?: number;
  discountPercent?: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    product: ProductInDetails,
    selectedSize?: string,
    quantity?: number,
  ) => void;
  updateQuantity: (
    itemId: number,
    selectedSize: string | undefined,
    quantity: number,
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
  const { user } = useAuth();
  // The id, not the user object: that object changes on every token refresh.
  const userId = user?.id ?? null;
  const locale = useLocale();
  // The user whose saved cart we've already merged in (once per sign-in).
  const syncedUserId = useRef<string | null>(null);
  // True while the saved cart is loading, so the empty local cart isn't saved
  // over it in the meantime.
  const isRestoring = useRef(false);

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

  // Signed in on a new device with an empty cart: bring back the saved one.
  useEffect(() => {
    if (!isLoaded || !userId) {
      if (!userId) syncedUserId.current = null;
      return;
    }
    if (syncedUserId.current === userId) return;
    syncedUserId.current = userId;

    if (cart.length > 0) return; // the save effect below uploads it instead
    isRestoring.current = true;
    loadSavedCart()
      .then((saved) => {
        isRestoring.current = false;
        if (saved.length > 0) {
          setCart((current) => (current.length > 0 ? current : saved));
        }
      })
      .catch((err) => {
        isRestoring.current = false;
        console.error("Loading saved cart failed:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs per sign-in, not per cart change
  }, [isLoaded, userId]);

  // Keep the server copy in step (debounced) while signed in.
  useEffect(() => {
    if (!isLoaded || !userId || syncedUserId.current !== userId) return;
    const timer = setTimeout(() => {
      if (isRestoring.current) return;
      saveCart(
        cart.map((item) => ({
          id: item.id,
          size: item.selectedSize,
          quantity: item.quantity,
        })),
        locale,
      ).catch((err) => console.error("Saving cart failed:", err));
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [cart, isLoaded, userId, locale]);

  const getItemPrice = (item: CartItem) =>
    getProductPricing(item, item.selectedSize);

  const addToCart = (
    product: ProductInDetails,
    selectedSize?: string,
    quantity: number = 1,
  ) => {
    if (!product) return;

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item?.id === product.id && item.selectedSize === selectedSize,
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
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item?.id === itemId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const removeFromCart = (itemId: number, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item?.id === itemId && item.selectedSize === selectedSize),
      ),
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
      (item) => item?.id === itemId && item.selectedSize === selectedSize,
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
