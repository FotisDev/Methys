"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  getValidImage: (imageUrl: string) => string;
}

interface CartItem extends Product {
  quantityInCart: number;
}

const WishlistSidebar: React.FC<WishlistSidebarProps> = ({
  isOpen,
  onClose,
  getValidImage,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = localStorage.getItem("wishlistItems");
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist) as Product[];
          setWishlistItems(parsedWishlist);
        } catch (error) {
          console.error("Error parsing wishlist:", error);
          setWishlistItems([]);
        }
      }
    };

    loadWishlist();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wishlistItems") {
        loadWishlist();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.id !== productId
    );
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const addToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItem = cartItems.find(
      (item: CartItem) => item.id === product.id
    );

    if (existingItem) {
      const updatedCart = cartItems.map((item: CartItem) =>
        item.id === product.id
          ? { ...item, quantityInCart: (item.quantityInCart || 1) + 1 }
          : item
      );
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    } else {
      const newCartItem = { ...product, quantityInCart: 1 };
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...cartItems, newCartItem])
      );
    }

    window.dispatchEvent(new Event("cartUpdated"));

    const productName =
      product.name.length > 20
        ? product.name.substring(0, 20) + "..."
        : product.name;
    alert(`${productName} added to cart!`);
  };

  const clearWishlist = () => {
    if (
      wishlistItems.length > 0 &&
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      setWishlistItems([]);
      localStorage.removeItem("wishlistItems");
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">My Wishlist</h2>
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {wishlistItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-full">
          {wishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Save your favorite products to review them later.
              </p>
              <button
                onClick={onClose}
                className="bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={clearWishlist}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Clear All ({wishlistItems.length} items)
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        <Image
                          src={getValidImage(item.image_url)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-lg font-bold text-amber-600 mb-3">
                          ${item.price?.toFixed(2) || "0.00"}
                        </p>

                        <p className="text-xs text-gray-500 mb-3">
                          {item.quantity > 0 ? (
                            <span className="text-green-600">
                              ✓ In Stock ({item.quantity} available)
                            </span>
                          ) : (
                            <span className="text-red-600">✗ Out of Stock</span>
                          )}
                        </p>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => addToCart(item)}
                            disabled={item.quantity === 0}
                            className="flex-1 bg-amber-500 text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            {item.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show "and X more items" message if items are truncated */}
                {wishlistItems.length >= 6 && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-600 font-medium">
                      and {wishlistItems.length - 5} more items...
                    </p>
                    <Link
                      href={"/Wishlist"}
                      className="text-sm text-gray-500 mt-1"
                    >
                      View your full wishlist to see all items
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 border border-amber-500 text-amber-500 font-semibold py-3 px-4 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <Link href="/cart" className="flex-1">
                    <button
                      onClick={onClose}
                      className="w-full bg-amber-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      View Cart
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSidebar;
