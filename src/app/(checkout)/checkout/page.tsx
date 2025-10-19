"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, Product, getValidImage } from "@/_lib/helpers";
import { supabase } from "@/_lib/supabaseClient";

interface CartItem extends Product {
  quantityInCart: number;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      if (fetchedProducts) setProducts(fetchedProducts);
    };
    loadProducts();
  }, []);

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

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
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
          cardNumber: "**** **** **** " + formData.cardNumber.slice(-4), // Only store last 4 digits
          cardHolderName: formData.cardHolderName,
        },
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(error.message);
      }

      // Update product quantities in Supabase
      for (const item of cartItems) {
        const newQuantity = item.quantity - item.quantityInCart;
        await supabase
          .from("products")
          .update({ quantity: newQuantity })
          .eq("id", item.id);
      }

      setIsSubmitted(true);
      setCartItems([]);
      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading checkout...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-green-50 p-8 rounded-xl border border-green-200">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Order Placed Successfully!</h2>
          <p className="text-green-700 mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
          <div className="space-y-3">
            <Link href="/products">
              <button className="w-full bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors">
                Continue Shopping
              </button>
            </Link>
            <Link href="/">
              <button className="w-full border-2 border-amber-500 text-amber-500 font-semibold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
        <nav className="text-sm text-gray-600">
          <Link href="/cart" className="hover:text-amber-600 transition-colors">
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Checkout</span>
        </nav>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to continue with checkout.</p>
            <div className="space-y-3">
              <Link href="/products">
                <button className="w-full bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors">
                  Shop Products
                </button>
              </Link>
              <Link href="/cart">
                <button className="w-full border-2 border-amber-500 text-amber-500 font-semibold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors">
                  Go to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <Link href={'/'} className="bg-black w-12 h-12"></Link>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-white">
                      <Image
                        src={getValidImage(item.image_url)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantityInCart - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantityInCart}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantityInCart + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-amber-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your phone number"
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your street address"
                    />
                    {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your city"
                    />
                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter zip code"
                    />
                    {formErrors.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.zipCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name *</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      value={formData.cardHolderName}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.cardHolderName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Name on card"
                    />
                    {formErrors.cardHolderName && <p className="text-red-500 text-sm mt-1">{formErrors.cardHolderName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {formErrors.expiryDate && <p className="text-red-500 text-sm mt-1">{formErrors.expiryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="123"
                      maxLength={3}
                    />
                    {formErrors.cvv && <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cart" className="flex-1">
                  <button
                    type="button"
                    className="w-full border-2 border-amber-500 text-amber-500 font-semibold py-4 px-8 rounded-lg hover:bg-amber-50 transition-colors duration-200 text-lg"
                  >
                    Back to Cart
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg"
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