// // wishlistUtils.ts
// import { Product } from "@/_lib/helpers";

// export interface WishlistItem extends Product {
//   addedToWishlist?: string;
// }

// // Add item to wishlist
// export const addToWishlist = (product: Product): boolean => {
//   try {
//     const savedWishlist = localStorage.getItem("wishlistItems");
//     const existingWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
    
//     // Check if item already exists in wishlist
//     const existingItem = existingWishlist.find(item => item.id === product.id);
    
//     if (existingItem) {
//       // Item already in wishlist
//       return false;
//     }
    
//     // Add item to wishlist with timestamp
//     const wishlistItem: WishlistItem = {
//       ...product,
//       addedToWishlist: new Date().toISOString()
//     };
    
//     existingWishlist.push(wishlistItem);
//     localStorage.setItem("wishlistItems", JSON.stringify(existingWishlist));
    
//     // Dispatch custom event to update wishlist count
//     window.dispatchEvent(new Event('wishlistUpdated'));
    
//     return true;
//   } catch (error) {
//     console.error("Error adding to wishlist:", error);
//     return false;
//   }
// };

// // Remove item from wishlist
// export const removeFromWishlist = (productId: number): boolean => {
//   try {
//     const savedWishlist = localStorage.getItem("wishlistItems");
//     const existingWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
    
//     const updatedWishlist = existingWishlist.filter(item => item.id !== productId);
//     localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    
//     // Dispatch custom event to update wishlist count
//     window.dispatchEvent(new Event('wishlistUpdated'));
    
//     return true;
//   } catch (error) {
//     console.error("Error removing from wishlist:", error);
//     return false;
//   }
// };

// // Check if item is in wishlist
// export const isInWishlist = (productId: number): boolean => {
//   try {
//     const savedWishlist = localStorage.getItem("wishlistItems");
//     const existingWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
    
//     return existingWishlist.some(item => item.id === productId);
//   } catch (error) {
//     console.error("Error checking wishlist:", error);
//     return false;
//   }
// };

// // Get wishlist count
// export const getWishlistCount = (): number => {
//   try {
//     const savedWishlist = localStorage.getItem("wishlistItems");
//     const existingWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
//     return existingWishlist.length;
//   } catch (error) {
//     console.error("Error getting wishlist count:", error);
//     return 0;
//   }
// };

// // Get all wishlist items
// export const getWishlistItems = (): WishlistItem[] => {
//   try {
//     const savedWishlist = localStorage.getItem("wishlistItems");
//     return savedWishlist ? JSON.parse(savedWishlist) : [];
//   } catch (error) {
//     console.error("Error getting wishlist items:", error);
//     return [];
//   }
// };

// // Clear entire wishlist
// export const clearWishlist = (): boolean => {
//   try {
//     localStorage.removeItem("wishlistItems");
//     window.dispatchEvent(new Event('wishlistUpdated'));
//     return true;
//   } catch (error) {
//     console.error("Error clearing wishlist:", error);
//     return false;
//   }
// };

// utils/wishlistUtils.ts

export const addToWishlist = (product: any) => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  const existingItem = wishlistItems.find((item: any) => item.id === product.id);
  
  if (!existingItem) {
    const updatedWishlist = [...wishlistItems, product];
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    return true; // Added successfully
  }
  
  return false; // Already exists
};

export const removeFromWishlist = (productId: number) => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  const updatedWishlist = wishlistItems.filter((item: any) => item.id !== productId);
  localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export const isInWishlist = (productId: number): boolean => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  return wishlistItems.some((item: any) => item.id === productId);
};

export const toggleWishlistItem = (product: any): boolean => {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
  const existingItem = wishlistItems.find((item: any) => item.id === product.id);
  
  if (existingItem) {
    removeFromWishlist(product.id);
    return false; // Removed
  } else {
    addToWishlist(product);
    return true; // Added
  }
};