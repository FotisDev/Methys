"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ProductInDetails } from "@/_lib/types";

interface WishlistContextType {
  wishlist: ProductInDetails[];
  addToWishlist: (item: ProductInDetails) => void;
  removeFromWishlist: (itemId: number) => void;
  isInWishlist: (itemId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<ProductInDetails[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wishlistItems");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlist([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  }, [wishlist, isLoaded]);

  const addToWishlist = (product: ProductInDetails) => {
    if (!product) return;

    setWishlist((prev) => {
      const exists = prev.find((item) => item?.id === product.id);
      if (exists) {
        // Toggle - remove if already exists
        return prev.filter((item) => item?.id !== product.id);
      }
      // Add new item
      return [...prev, product];
    });
  };

  const removeFromWishlist = (itemId: number) => {
    setWishlist((prev) => prev.filter((item) => item?.id !== itemId));
  };

  const isInWishlist = (itemId: number) => {
    return wishlist.some((item) => item?.id === itemId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}