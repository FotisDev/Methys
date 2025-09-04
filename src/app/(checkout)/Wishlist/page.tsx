"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, getValidImage } from "@/_lib/helpers";

interface WishlistItem extends Product {
  addedToWishlist?: string; // timestamp when added
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    if (savedWishlist) {
      const parsedWishlist = JSON.parse(savedWishlist) as WishlistItem[];
      setWishlistItems(parsedWishlist);
    }
    setIsLoading(false);
  }, []);

  // Save wishlist to localStorage
  const saveWishlist = (updatedWishlist: WishlistItem[]) => {
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    // Dispatch custom event to update wishlist count in other components
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    saveWishlist(updatedWishlist);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      saveWishlist([]);
    }
  };

  // Add to cart from wishlist
  const addToCart = (product: WishlistItem) => {
    // Get existing cart from localStorage
    const savedCart = localStorage.getItem("cartItems");
    const existingCart = savedCart ? JSON.parse(savedCart) : [];

    // Check if product is already in cart
    const existingItem = existingCart.find((item: Product & {quantityInCart: number}) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantityInCart < product.quantity) {
        existingItem.quantityInCart += 1;
      } else {
        alert("Cannot add more than available stock!");
        return;
      }
    } else {
      existingCart.push({ ...product, quantityInCart: 1 });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert("Item added to cart!");
  };

  // Move all items to cart
  const moveAllToCart = () => {
    if (wishlistItems.length === 0) return;

    const savedCart = localStorage.getItem("cartItems");
    const existingCart = savedCart ? JSON.parse(savedCart) : [];

    let addedCount = 0;
    wishlistItems.forEach(item => {
      const existingItem = existingCart.find((cartItem: Product & {quantityInCart: number}) => cartItem.id === item.id);
      if (existingItem) {
        if (existingItem.quantityInCart < item.quantity) {
          existingItem.quantityInCart += 1;
          addedCount++;
        }
      } else {
        existingCart.push({ ...item, quantityInCart: 1 });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      localStorage.setItem("cartItems", JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));
      alert(`${addedCount} items added to cart!`);
    } else {
      alert("All items are already in your cart with maximum quantities!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
        <nav className="text-sm text-gray-600">
          <Link href="/products" className="hover:text-amber-600 transition-colors">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Wishlist</span>
        </nav>
      </div>

      {wishlistItems.length === 0 ? (
        /* Empty Wishlist State */
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save your favorite products to your wishlist and shop them later.</p>
            <Link href="/products">
              <button className="bg-amber-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-amber-600 transition-colors duration-200 text-lg">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      ) : (
        /* Wishlist with Items */
        <div>
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={moveAllToCart}
                className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                Add All to Cart
              </button>
              <button
                onClick={clearWishlist}
                className="px-6 py-2 border border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear Wishlist
              </button>
            </div>
          </div>

          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <Image
                    src={getValidImage(item.image_url)}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  {item.is_offer && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors group"
                    title="Remove from wishlist"
                  >
                    <svg className="w-4 h-4 text-red-500 group-hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-amber-600">
                        ${item.price?.toFixed(2) || '0.00'}
                      </span>
                      {item.is_offer && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                          On Sale
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.quantity === 0}
                      className="w-full bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    {/* Link to Product Detail */}
                    <Link 
                      href={`/products/${item.category_men_id}/${item.id}`}
                      className="block w-full text-center border border-amber-500 text-amber-500 font-semibold py-2 px-4 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Added Date */}
                  {item.addedToWishlist && (
                    <p className="text-xs text-gray-400 mt-3">
                      Added {new Date(item.addedToWishlist).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Back to Shopping */}
          <div className="text-center mt-12">
            <Link href="/products">
              <button className="bg-gray-100 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;