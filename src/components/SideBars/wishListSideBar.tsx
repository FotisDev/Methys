"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "../providers/WishListProvider";
import { useCart } from "../providers/CartProvider";
import { ProductInDetails } from "@/_lib/types";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  getValidImage: (imageUrl: string | undefined) => string;
}
const WishlistSidebar: React.FC<WishlistSidebarProps> = ({
  isOpen,
  onClose,
  getValidImage,
}) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: ProductInDetails) => {
    if (!item) return;

    addToCart(item);

    const productName =
      item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name;
    alert(`${productName} added to cart!`);
  };

  const handleClearWishlist = () => {
    if (
      wishlist.length > 0 &&
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      clearWishlist();
    }
  };

  const handleRemoveFromWishlist = (itemId: number) => {
    removeFromWishlist(itemId);
  };

  const validWishlistItems = wishlist.filter(
    (item): item is NonNullable<ProductInDetails> => item !== null
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-opacity-50 transition-opacity duration-300 z-50 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 text-vintage-green"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 className="text-xl text-vintage-green">My Wishlist</h2>
            <span className="bg-white text-vintage-green text-xs font-semibold px-2 py-1 rounded-full">
              {validWishlistItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-vintage-green rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
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
          {validWishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-vintage-green"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Save your favorite products to review them later.
              </p>
              <button onClick={onClose} className="py-3 px-6 hover-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={handleClearWishlist}
                  className="text-sm text-vintage-green hover:text-vintage-brown font-medium transition-colors"
                >
                  Clear All ({validWishlistItems.length} items)
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {validWishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-vintage-green rounded-lg p-4"
                  >
                    <div className="flex space-x-4">
                      <div className="w-20 h-26 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        {item.image_url && (
                          <Image
                            src={getValidImage(item.image_url?.[0])}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <p className="text-lg font-bold text-vintage-green mb-3">
                          ${item.price.toFixed(2)}
                        </p>

                        {/* Display available sizes if any */}
                        {item.product_variants &&
                          item.product_variants.length > 0 && (
                            <div className="text-xs text-gray-600 mb-2">
                              Available sizes:{" "}
                              {item.product_variants
                                .filter((variant) => variant.quantity > 0)
                                .map((variant) => variant.size)
                                .join(", ")}
                            </div>
                          )}

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 hover-colors py-2 px-3 rounded-md"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="p-2 hover-colors rounded"
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

                <Link
                  className="rounded-lg p-4 hover-colors block text-center"
                  href={"/Wishlist"}
                >
                  See Full Wishlist
                </Link>

                {validWishlistItems.length >= 6 && (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-600 font-medium">
                      and {validWishlistItems.length - 5} more items...
                    </p>
                    <Link
                      href={"/Wishlist"}
                      className="text-sm text-vintage-green mt-1 block"
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
                    className="flex-1 hover-colors py-3 px-4"
                  >
                    Continue Shopping
                  </button>
                  <Link href="/cart" className="flex-1">
                    <button
                      onClick={onClose}
                      className="w-full text-white py-3 px-4 hover-colors"
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
