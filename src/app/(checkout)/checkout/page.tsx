"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CartProvider";
import { supabase } from "@/_lib/supabaseClient";

const Checkout = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getItemPrice, 
  } = useCart();

  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cart, getCartTotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdateQuantity = (
    productId: number,
    selectedSize: string | undefined,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    const item = cart.find(
      (i) => i.id === productId && i.selectedSize === selectedSize
    );

    if (item && newQuantity > item.quantity!) {
      const variant = item.product_variants.find((v) => v.size === selectedSize);
      if (variant && newQuantity > variant.quantity) {
        alert("Not enough stock available!");
        return;
      }
    }

    updateQuantity(productId, selectedSize, newQuantity);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
    if (!formData.cardNumber.trim()) errors.cardNumber = "Card number required";
    else if (formData.cardNumber.replace(/\s/g, "").length !== 16)
      errors.cardNumber = "Card number must be 16 digits";
    if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date required";
    if (!formData.cvv.trim()) errors.cvv = "CVV required";
    else if (formData.cvv.length !== 3) errors.cvv = "CVV must be 3 digits";
    if (!formData.cardHolderName.trim())
      errors.cardHolderName = "Card holder name required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: "guest-checkout", 
        items: cart.map((item) => {
          const { finalPrice } = getItemPrice(item);
          return {
            product_id: item.id,
            name: item.name,
            quantity: item.quantity || 1,
            price: finalPrice,
            selectedSize: item.selectedSize,
            image_url: item.image_url,
          };
        }),
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
          last4: formData.cardNumber.slice(-4),
          cardHolderName: formData.cardHolderName,
        },
        status: "pending",
      });

      if (error) throw error;

      setIsSubmitted(true);
      clearCart();
    } catch (err: any) {
      console.error(err);
      alert("Order failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-green-50 border border-vintage-green rounded-xl p-8">
          <div className="w-16 h-16 bg-vintage-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl text-vintage-green mb-2">Order Confirmed!</h2>
          <p className="text-vintage-green mb-6">Thank you for your purchase.</p>
          <div className="space-y-3">
            <Link href="/products">
              <button className="w-full bg-vintage-brown hover:bg-default-cold text-white py-3 rounded-lg">
                Continue Shopping
              </button>
            </Link>
            <Link href="/" className="block text-vintage-brown hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <Link href="/products">
          <button className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-poppins max-w-7xl">
      <h1 className="text-3xl md:text-4xl text-vintage-green mb-2">Checkout</h1>
      <p className="text-sm text-vintage-green mb-8">
        <Link href="/cart" className="hover:text-vintage-brown text-vintage-green">Cart</Link> / Checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form - Left Side */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl mb-5 text-vintage-green">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-vintage-green focus:border-vintage-green"
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-vintage-green"
                    required
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm  mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm  mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm  mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl mb-5 text-vintage-green">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm  mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                  {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm  mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-2.5 border rounded-lg"
                      required
                    />
                    {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm  mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full hover-colors hover:bg-default-cold py-4 rounded-lg text-lg transition"
            >
              {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary - Right Side (Sticky on Desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 lg:sticky lg:top-6 border">
            <h3 className="text-xl  mb-5 text-gray-800">Order Summary</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => {
                const { finalPrice, originalPrice, isDiscounted } = getItemPrice(item);
                const lineTotal = finalPrice * (item.quantity || 1);

                return (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3 pb-4 border-b last:border-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image
                        src={getValidImage(item.image_url)}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className=" text-gray-800 truncate">{item.name}</h4>
                      {item.selectedSize && <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="">${finalPrice.toFixed(2)}</span>
                        {isDiscounted && <del className="text-xs text-gray-400">${originalPrice.toFixed(2)}</del>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.selectedSize, (item.quantity || 1) - 1)}
                          className="w-7 h-7 rounded-full border hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.selectedSize, (item.quantity || 1) + 1)}
                          className="w-7 h-7 rounded-full border hover:bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2.375 2.375 0 0116.138 21H7.862a2.375 2.375 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      ${lineTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between text-xl  text-gray-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;