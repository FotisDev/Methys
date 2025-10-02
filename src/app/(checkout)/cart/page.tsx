"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, getValidImage } from "@/_lib/helpers";

interface CartItem extends Product {
  quantityInCart: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart) as CartItem[];
      // Ensure all items have quantityInCart property
      const validatedCart = parsedCart.map(item => ({
        ...item,
        quantityInCart: item.quantityInCart || 1
      }));
      setCartItems(validatedCart);
    }
    setIsLoading(false);
  }, []);

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantityInCart || 1),
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  // Save cart to localStorage whenever it changes
  const saveCart = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Update quantity in cart
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        // Check if new quantity exceeds available stock
        if (newQuantity > item.quantity) {
          alert("Cannot add more than available stock!");
          return item;
        }
        return { ...item, quantityInCart: newQuantity };
      }
      return item;
    });

    saveCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    saveCart(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      saveCart([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
        <nav className="text-sm text-gray-600">
          <Link href="/products" className="hover:text-amber-600 transition-colors">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Cart</span>
        </nav>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <button className="bg-amber-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-amber-600 transition-colors duration-200 text-lg">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h3>
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 relative overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                        <Image
                          src={getValidImage(item.image_url)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        {item.is_offer && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                            SALE
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate mb-1">
                          {item.name}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {item.description}
                        </p>
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
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantityInCart - 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={item.quantityInCart <= 1}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                            </svg>
                          </button>
                          <span className="w-12 text-center font-semibold text-gray-900">
                            {item.quantityInCart}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantityInCart + 1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={item.quantityInCart >= item.quantity}
                          >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {item.quantity} available
                        </p>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-lg font-bold text-gray-900">
                          ${((item.price || 0) * item.quantityInCart).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/checkout">
                  <button className="w-full bg-amber-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-amber-600 transition-colors duration-200 text-lg">
                    Proceed to Checkout
                  </button>
                </Link>
                <Link href="/products">
                  <button className="w-full border-2 border-amber-500 text-amber-500 font-semibold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                    Continue Shopping
                  </button>
                </Link>
                <Link href={'/'}>back to home...</Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;