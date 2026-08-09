"use client";

import React, { useState } from "react";
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
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});

  const handleSizeSelect = (itemId: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = (item: ProductInDetails, availableSizes: string[]) => {
    if (!item) return;

    if (availableSizes.length > 0 && !selectedSizes[item.id]) {
      alert("Please select a size first.");
      return;
    }

    addToCart(item, selectedSizes[item.id]);

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
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white overflow-hidden transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <span className="text-lg text-vintage-green">
            Wishlist{validWishlistItems.length > 0 ? ` (${validWishlistItems.length})` : ""}
          </span>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1 hover:opacity-60 transition-opacity cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {validWishlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg text-gray-900 mb-2">Your wishlist is empty</p>
              <p className="text-sm text-gray-600 mb-6">
                Save your favorite products to review them later.
              </p>
              <button
                onClick={onClose}
                className="py-3 px-6 border border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-white transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <button
                  onClick={handleClearWishlist}
                  className="text-xs underline text-vintage-green hover:text-vintage-brown transition-colors cursor-pointer"
                >
                  Clear All ({validWishlistItems.length} item{validWishlistItems.length > 1 ? "s" : ""})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain px-6">
                {validWishlistItems.map((item) => {
                  const availableSizes = (item.product_variants ?? [])
                    .filter((variant) => variant.quantity > 0)
                    .map((variant) => variant.size);

                  return (
                    <div key={item.id} className="flex gap-4 py-6 border-b border-gray-200">
                      <div className="w-20 h-24 relative flex-shrink-0 bg-gray-100">
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

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm text-vintage-green leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <span className="text-sm text-vintage-green shrink-0">
                            €{item.price.toFixed(2)}
                          </span>
                        </div>

                        {availableSizes.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap mt-2">
                            {availableSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(item.id, size)}
                                className={`text-[11px] px-2 py-1 border transition-colors cursor-pointer ${
                                  selectedSizes[item.id] === size
                                    ? "border-vintage-green bg-vintage-green text-white"
                                    : "border-gray-300 text-vintage-green hover:border-vintage-green"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={() => handleAddToCart(item, availableSizes)}
                            className="text-xs uppercase tracking-wide border border-vintage-green text-vintage-green px-3 py-1.5 hover:bg-vintage-green hover:text-white transition-colors cursor-pointer"
                          >
                            Add to Cart
                          </button>

                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="text-xs underline text-vintage-green hover:text-vintage-brown transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 border border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-white transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <Link href="/Wishlist" className="flex-1" onClick={onClose}>
                    <button className="w-full bg-vintage-green text-white py-3 px-4 hover:opacity-90 transition-opacity cursor-pointer">
                      View All
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