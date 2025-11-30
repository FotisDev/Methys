"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { ProductInDetails } from "@/_lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";

interface WishlistItem extends ProductInDetails {
  addedToWishlist?: string;
}

const WishlistPage = () => {
  const { addToCart, isInCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("wishlistItems");
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setIsLoading(false);
  }, []);

  const saveWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items);
    localStorage.setItem("wishlistItems", JSON.stringify(items));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const removeFromWishlist = (productId: number) => {
    saveWishlist(wishlistItems.filter((i) => i.id !== productId));
  };

  const clearWishlist = () => {
    if (confirm("Clear entire wishlist?")) {
      saveWishlist([]);
    }
  };

  const moveAllToCart = () => {
    let added = 0;
    wishlistItems.forEach((item) => {
      if (!isOutOfStock(item) && !isInCart(item.id)) {
        addToCart(item);
        added++;
      }
    });

    if (added > 0) {
      alert(`${added} item${added > 1 ? "s" : ""} added to cart!`);
    } else {
      alert("Nothing new to add — items are out of stock or already in cart.");
    }
  };

  const getTotalStock = (item: WishlistItem): number => {
    if (item.product_variants?.length > 0) {
      return item.product_variants.reduce(
        (sum, v) => sum + (v.quantity || 0),
        0
      );
    }
    return item.product_variants[0].quantity || 0;
  };

  const isOutOfStock = (item: WishlistItem): boolean =>
    getTotalStock(item) === 0;

  const hasSizes = (item: WishlistItem): boolean =>
    !!(item.product_variants?.length > 0);

  const getCategorySlug = (item: WishlistItem): string => {
    return item.categoryformen?.slug || "all";
  };
  const breadcrumbItems = [
    { name: "Home", slug: "/" },
    { name: "Wishlist", slug: `/Wishlist` },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-default-color"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center font-poppins">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items for later.
          </p>
          <Link
            href="/products"
            className="bg-default-color hover:bg-default-cold text-white font-medium py-3 px-10 rounded-lg transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto  px-4 py-12 font-poppins">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">My Wishlist</h1>
      <nav className="text-sm text-gray-600 mb-10">
        <Breadcrumbs
          items={breadcrumbItems}
        />
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <p className="text-lg">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={moveAllToCart}
            className="px-6 py-2.5 bg-default-color text-white rounded-lg hover:bg-default-cold transition"
          >
            Add All to Cart
          </button>
          <button
            onClick={clearWishlist}
            className="px-6 py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="flex flex-col paddig-x max-w-md">
        {wishlistItems.map((item) => {
          const stock = getTotalStock(item);
          const outOfStock = isOutOfStock(item);

          return (
            <div
              key={item.id}
              className="bg-white shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border  "
            >
              <div className=" relative w-full h-[50vh] sm:h-[55vh] ">
                <Image
                  src={getValidImage(item.image_url?.[0])}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

                {item.is_offer && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full">
                    −20% SALE
                  </div>
                )}

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition group"
                >
                  <svg
                    className="w-5 h-5 group-hover:hidden"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <svg
                    className="w-5 h-5 hidden group-hover:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-5 flex-col flex">
                <div className="flex flex-row gap-5">
                  <h3 className="text-vintage-green font-semibold text-lg line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-lg text-vintage-green line-clamp-2 mb-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-row justify-between items-center mb-5">
                  <div>
                    {item.is_offer ? (
                      <div className="flex items-center gap-2">
                        <del className="text-gray-400">
                          ${item.price.toFixed(2)}
                        </del>
                        <span className="text-xl  text-vintage-green">
                          ${(item.price * 0.8).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold">
                        ${item.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      outOfStock ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {outOfStock
                      ? "Out of stock"
                      : hasSizes(item)
                      ? item.product_variants[0].size
                      : `${stock} left`}
                  </span>
                </div>

                <div className="space-y-4">
                  <Link
                    href={`/products/${getCategorySlug(item)}/${item.id}`}
                    className="block text-center w-full py-3 border hover-colors border-gray-300 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>

                {item.addedToWishlist && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Added {new Date(item.addedToWishlist).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <Link
          href="/products"
          className="bg-default-color hover:bg-default-cold text-white font-medium py-4 px-12 rounded-lg text-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
};

export default WishlistPage;
