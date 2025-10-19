import { Product } from "@/_lib/helpers";

export const addToWishlist = (product: Product): boolean => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  
  // Check if already in wishlist
  const isAlreadyInWishlist = wishlistItems.some((item: Product) => item.id === product.id);
  
  if (isAlreadyInWishlist) {
    return false;
  }
  
  wishlistItems.push(product);
  localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  window.dispatchEvent(new Event("wishlistUpdated"));
  return true;
};

export const removeFromWishlist = (productId: number) => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  const updatedWishlist = wishlistItems.filter((item: Product) => item.id !== productId);
  localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const isInWishlist = (productId: number): boolean => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  return wishlistItems.some((item: Product) => item.id === productId);
};

export const getWishlistItems = (): Product[] => {
  return JSON.parse(localStorage.getItem("wishlistItems") || "[]");
};

export const clearWishlist = () => {
  localStorage.removeItem("wishlistItems");
  window.dispatchEvent(new Event("wishlistUpdated"));
};