"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CartProvider";
import { DISCOUNT_PERCENT } from "@/_lib/utils/discountUtil/discountUtils";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartTotal,
    getItemPrice, // ← Now properly used!
  } = useCart();

  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cart, getCartTotal]);

  const handleUpdateQuantity = (
    productId: number,
    selectedSize: string | undefined,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    const item = cart.find(
      (i) => i?.id === productId && i.selectedSize === selectedSize
    );

    if (item) {
      const variant = item.selectedSize
        ? item.product_variants.find((v) => v.size === item.selectedSize)
        : null;

      const availableStock = variant ? variant.quantity : item.quantity;

      if (newQuantity > availableStock) {
        alert("Cannot add more than available stock!");
        return;
      }
    }

    updateQuantity(productId, selectedSize, newQuantity);
  };

  const handleRemoveItem = (
    productId: number,
    selectedSize: string | undefined
  ) => {
    removeFromCart(productId, selectedSize);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 font-poppins text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl text-gray-900 mb-3 sm:mb-4">
            Your cart is empty
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Looks like you havent added any items to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-default-color text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-base sm:text-lg hover:bg-default-cold"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 font-poppins">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-vintage-green mb-3 sm:mb-4">
          Shopping Cart
        </h1>
        <nav className="text-xs sm:text-sm text-vintage-green">
          <Link
            href="/products"
            className="hover:text-vintage-brown transition-colors"
          >
            Products
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span>Cart</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 relative z-0">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-vintage-green overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-vintage-green">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg text-vintage-green">
                  Cart Items ({cart.length})
                </h3>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="hover-colors hover:bg-default-cold rounded-full h-8 sm:h-10 w-24 sm:w-32 text-xs sm:text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-vintage-green">
              {cart.map((item) => {
                if (!item) return null;

                const uniqueKey = `${item.id}-${item.selectedSize || "nosize"}`;

                const { finalPrice, originalPrice, isDiscounted } =
                  getItemPrice(item);

                const availableQuantity = item.selectedSize
                  ? item.product_variants.find(
                      (v) => v.size === item.selectedSize
                    )?.quantity || 0
                  : item.quantity || 0;

                return (
                  <div key={uniqueKey} className="p-3 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="flex flex-col sm:hidden space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-vintage-green flex-shrink-0">
                          <Image
                            src={getValidImage(item.image_url?.[0])}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {isDiscounted && (
                            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs  px-2 py-0.5 rounded">
                              -{DISCOUNT_PERCENT}%
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm  text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500 mt-1">
                              Size: {item.selectedSize}
                            </p>
                          )}

                          {/* Price with discount */}
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-base  text-vintage-brown">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {isDiscounted && (
                              <del className="text-sm text-gray-400">
                                ${originalPrice.toFixed(2)}
                              </del>
                            )}
                            {isDiscounted && (
                              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                                Sale
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveItem(item.id, item.selectedSize)
                          }
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
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

                      {/* Quantity & Subtotal - Mobile */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1.5">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.selectedSize,
                                (item.quantity || 1) - 1
                              )
                            }
                            disabled={(item.quantity || 1) <= 1}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-10 text-center f">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.selectedSize,
                                (item.quantity || 1) + 1
                              )
                            }
                            disabled={(item.quantity || 1) >= availableQuantity}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {availableQuantity} available
                          </p>
                          <p className="text-lg  text-default-cold">
                            ${(finalPrice * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        <Image
                          src={getValidImage(item.image_url?.[0])}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        {isDiscounted && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            -{DISCOUNT_PERCENT}%
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg  text-gray-900">{item.name}</h4>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500 mt-1">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-xl  text-amber-600">
                            ${finalPrice.toFixed(2)}
                          </span>
                          {isDiscounted && (
                            <>
                              <del className="text-gray-400">
                                ${originalPrice.toFixed(2)}
                              </del>
                              <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full">
                                On Sale
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.selectedSize,
                                (item.quantity || 1) - 1
                              )
                            }
                            disabled={(item.quantity || 1) <= 1}
                            className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-12 text-center ">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.selectedSize,
                                (item.quantity || 1) + 1
                              )
                            }
                            disabled={(item.quantity || 1) >= availableQuantity}
                            className="w-9 h-9 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {availableQuantity} available
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl  text-default-cold">
                          ${(finalPrice * (item.quantity || 1)).toFixed(2)}
                        </p>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.id, item.selectedSize)
                          }
                          className="mt-3 text-red-500 hover:text-red-700"
                          title="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
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
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white rounded-xl border border-default-cold p-5 sm:p-6 text-default-cold">
            <h3 className="text-xl  mb-5">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl ">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3  flex flex-col">
              <Link
                href="/checkout"
                className="w-full hover-colors hover:bg-default-cold hover:text-white  py-3.5 rounded-lg transition"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/products"
                className="w-full border-2 hover-colors hover:bg-default-cold hover:text-white py-3 rounded-lg transition"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="block text-center text-default-cold hover:underline text-sm"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
