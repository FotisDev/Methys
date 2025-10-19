// hooks/useWishlist.ts
import { useState, useEffect } from 'react';

export const useWishlist = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateWishlistCount = () => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlistCount(parsedWishlist.length);
      } catch{
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateWishlistCount();

    const handleWishlistUpdate = () => {
      updateWishlistCount();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);
  const toggleWishlist = () => setIsWishlistOpen(!isWishlistOpen);

  return {
    isWishlistOpen,
    wishlistCount,
    openWishlist,
    closeWishlist,
    toggleWishlist,
  };
};