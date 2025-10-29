"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CardProvider";

export interface CartItem extends Product {
  quantityInCart: number;
  selectedSize?: string | null;
}

const CartPage = () => {
  const { cartItems: contextCartItems, removeItem, clearCart, updateItemQuantity } = useCart();
  const [total, setTotal] = useState(0);

  // Use context cartItems directly
  const cartItems = contextCartItems as CartItem[];

  // Calculate total
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantityInCart || 1),
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  // Update quantity
  const updateQuantity = (productId: number, selectedSize: string | null, newQuantity: number) => {
    const item = cartItems.find(
      (i) => i.id === productId && i.selectedSize === selectedSize
    );
    if (item && newQuantity > item.quantity) {
      alert("Cannot add more than available stock!");
      return;
    }

    updateItemQuantity(productId, selectedSize, newQuantity);
  };

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 font-poppins text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/products">
            <button className="bg-default-color text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-base sm:text-lg">
              Start Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 font-poppins">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-3 sm:mb-4">Shopping Cart</h1>
        <nav className="text-xs sm:text-sm text-gray-600">
          <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span>Cart</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg text-gray-900">Cart Items ({cartItems.length})</h3>
                <button 
                  onClick={handleClearCart}
                  className="hover-colors rounded-full h-8 sm:h-10 w-24 sm:w-32 text-xs sm:text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const uniqueKey = `${item.id}-${item.selectedSize || "nosize"}`;
                return (
                  <div key={uniqueKey} className="p-3 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="flex flex-col sm:hidden space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                          <Image
                            src={getValidImage(item.image_url)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {item.is_offer && (
                            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">SALE</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h4>
                          {item.selectedSize && (
                            <p className="text-xs text-gray-500 mb-1">Size: {item.selectedSize}</p>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="text-base text-amber-600">${item.price?.toFixed(2) || "0.00"}</span>
                            {item.is_offer && (
                              <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">Sale</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.selectedSize || null)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart - 1)}
                            className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantityInCart <= 1}
                          >
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center text-sm text-gray-900">{item.quantityInCart}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart + 1)}
                            className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantityInCart >= item.quantity}
                          >
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 text-right mb-1">{item.quantity} available</p>
                          <div className="text-base font-medium text-default-cold">
                            ${((item.price || 0) * item.quantityInCart).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center space-x-4">
                      <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        <Image
                          src={getValidImage(item.image_url)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        {item.is_offer && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">SALE</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg text-gray-900 truncate mb-1">{item.name}</h4>
                        {item.selectedSize && (
                          <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg text-amber-600">${item.price?.toFixed(2) || "0.00"}</span>
                          {item.is_offer && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">On Sale</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart - 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantityInCart <= 1}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center text-gray-900">{item.quantityInCart}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={item.quantityInCart >= item.quantity}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">{item.quantity} available</p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-lg text-default-cold">
                          ${((item.price || 0) * item.quantityInCart).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize || null)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        <div className="flex flex-col">
          <div className="bg-white rounded-xl border border-default-cold p-4 sm:p-6 text-default-cold lg:sticky lg:top-6">
            <h3 className="text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h3>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Tax</span>
                <span className="text-xs sm:text-base">Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between items-center text-lg sm:text-xl font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/checkout">
                <button className="w-full bg-default-color text-white hover:bg-default-cold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-base sm:text-lg">
                  Proceed to Checkout
                </button>
              </Link>
              <Link href="/products">
                <button className="w-full border-2 border-default-cold text-default-cold hover:bg-default-cold hover:text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base">
                  Continue Shopping
                </button>
              </Link>
              <Link href="/" className="w-full border-2 border-default-cold text-default-cold hover:bg-default-cold hover:text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-center transition-colors duration-200 text-sm sm:text-base">
                Back to home...
              </Link>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage