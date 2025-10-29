"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, Product, getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CardProvider";
import { supabase } from "@/_lib/supabaseClient";

interface CartItem extends Product {
  quantityInCart: number;
  selectedSize?: string | null;
}

const Checkout = () => {
  const { cartItems: contextCartItems, updateItemQuantity, removeItem, clearCart } = useCart();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use cart items from context
  const cartItems = contextCartItems as CartItem[];

  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      if (fetchedProducts) setProducts(fetchedProducts);
    };
    loadProducts();
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

  // Update quantity in cart
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.email.includes("@")) errors.email = "Please enter a valid email";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required";
    if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
    if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
    if (!formData.cvv.trim()) errors.cvv = "CVV is required";
    if (!formData.cardHolderName.trim()) errors.cardHolderName = "Card holder name is required";

    // Basic card number validation (should be 16 digits)
    if (formData.cardNumber && formData.cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    // Basic CVV validation (should be 3 digits)
    if (formData.cvv && formData.cvv.length !== 3) {
      errors.cvv = "CVV must be 3 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: "user-id-placeholder", // Replace with authenticated user ID
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantityInCart,
          price: item.price,
          name: item.name,
          selectedSize: item.selectedSize,
        })),
        total_amount: total,
        customer_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        payment_info: {
          cardNumber: "**** **** **** " + formData.cardNumber.slice(-4), 
          cardHolderName: formData.cardHolderName,
        },
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(error.message);
      }

      for (const item of cartItems) {
        const newQuantity = item.quantity - item.quantityInCart;
        await supabase
          .from("products")
          .update({ quantity: newQuantity })
          .eq("id", item.id);
      }
      setIsSubmitted(true);
      clearCart();
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-poppins">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-vintage-brown"></div>
        <p className="mt-4 text-base sm:text-lg">Loading checkout...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
        <div className="max-w-md mx-auto bg-green-50 p-6 sm:p-8 rounded-xl border border-vintage-green">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-vintage-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl text-green-800 mb-3 sm:mb-4">Order Placed Successfully!</h2>
          <p className="text-sm sm:text-base text-green-700 mb-4 sm:mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <div className="space-y-2 sm:space-y-3">
            <Link href="/products">
              <button className="w-full bg-vintage-brown text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-vintage-brown transition-colors text-sm sm:text-base">
                Continue Shopping
              </button>
            </Link>
            <Link href="/">
              <button className="w-full border-2 border-vintage-brown text-vintage-brown py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-vintage-brown transition-colors text-sm sm:text-base">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 font-poppins">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-vintage-green mb-3 sm:mb-4">Checkout</h1>
        <nav className="text-xs sm:text-sm text-gray-600">
          <Link href="/cart" className="hover:text-vintage-brown transition-colors">
            Cart
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span>Checkout</span>
        </nav>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-default-color rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Add some products to your cart to continue with checkout.</p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <Link href="/products">
                <button className="w-full bg-amber-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base">
                  Shop Products
                </button>
              </Link>
              <Link href="/cart">
                <button className="w-full border-2 border-amber-500 text-amber-500 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-amber-50 transition-colors text-sm sm:text-base">
                  Go to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 font-poppins">
          {/* Order Summary - Mobile First, Desktop Right */}
          <div className="lg:col-span-1 lg:order-2">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 lg:sticky lg:top-6">
              <h3 className="text-lg sm:text-xl text-vintage-green mb-4 sm:mb-6">Order Summary</h3>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {cartItems.map((item) => {
                  const uniqueKey = `${item.id}-${item.selectedSize || "nosize"}`;
                  return (
                    <div key={uniqueKey} className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 relative overflow-hidden rounded flex-shrink-0">
                        <Image
                          src={getValidImage(item.image_url)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base text-vintage-green truncate">{item.name}</h4>
                        {item.selectedSize && (
                          <p className="text-xs text-vintage-green">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-xs sm:text-sm text-vintage-green">${item.price?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center hover-colors text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantityInCart}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize || null, item.quantityInCart + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center hover-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize || null)}
                        className="text-red-700 hover:text-red-500 transition-colors p-1"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between items-center text-lg sm:text-xl text-vintage-green">
                  <span>Total:</span>
                  <span className="text-vintage-green">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-xl border border-vintage-green p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl text-vintage-green mb-4 sm:mb-6">Shipping Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.name ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.email ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.phone ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.address ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter your street address"
                    />
                    {formErrors.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.city ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.zipCode ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Enter zip code"
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.zipCode}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-vintage-green p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl text-vintage-green mb-4 sm:mb-6">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Card Holder Name *</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={formData.cardHolderName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.cardHolderName ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="Name on card"
                    />
                    {formErrors.cardHolderName && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.cardHolderName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.cardNumber ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.expiryDate ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {formErrors.expiryDate && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-vintage-green mb-1.5 sm:mb-2">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vintage-green transition-colors text-sm sm:text-base ${formErrors.cvv ? 'border-red-500' : 'border-vintage-green'}`}
                      placeholder="123"
                      maxLength={3}
                    />
                    {formErrors.cvv && <p className="text-red-500 text-xs sm:text-sm mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/cart" className="flex-1">
                  <button
                    type="button"
                    className="w-full border-2 py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg hover-colors hover:bg-default-cold"
                  >
                    Back to Cart
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg hover-colors hover:bg-default-cold"
                >
                  {isSubmitting ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;