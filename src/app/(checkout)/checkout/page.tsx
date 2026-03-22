"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CartProvider";
import { createCheckoutSession } from "@/_lib/backend/stripe/action";

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getItemPrice } =
    useCart();

  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
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
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    const item = cart.find(
      (i) => i.id === productId && i.selectedSize === selectedSize,
    );

    if (item && newQuantity > item.quantity!) {
      const variant = item.product_variants.find(
        (v) => v.size === selectedSize,
      );
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { url } = await createCheckoutSession(cart, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
      });

      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-4">Your cart is empty</p>
        <Link
          href="/products"
          className="bg-vintage-brown text-white px-8 py-3 rounded-lg hover:bg-vintage-brown"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-poppins max-w-7xl">
      <span className="text-3xl md:text-4xl text-vintage-green mb-2">
        Checkout
      </span>
      <p className="text-sm text-vintage-green mb-8">
        <Link
          href="/cart"
          className="hover:text-vintage-brown text-vintage-green"
        >
          Cart
        </Link>
        / Checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <p className="text-xl mb-5 text-vintage-green">
                Personal Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-vintage-green focus:border-vintage-green"
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
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
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
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
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg"
                    required
                  />
                  {formErrors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Redirecting to payment..."
                : `Pay €${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 lg:sticky lg:top-6 border">
            <h3 className="text-xl mb-5 text-gray-800">Order Summary</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => {
                const { finalPrice, originalPrice, isDiscounted } =
                  getItemPrice(item);
                const lineTotal = finalPrice * (item.quantity || 1);

                return (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-3 pb-4 border-b last:border-0"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image
                        src={getValidImage(item.image_url?.[0])}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 truncate">{item.name}</h4>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-600">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span>${finalPrice.toFixed(2)}</span>
                        {isDiscounted && (
                          <del className="text-xs text-gray-400">
                            ${originalPrice.toFixed(2)}
                          </del>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              (item.quantity || 1) - 1,
                            )
                          }
                          className="w-7 h-7 rounded-full border hover:bg-gray-200"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              (item.quantity || 1) + 1,
                            )
                          }
                          className="w-7 h-7 rounded-full border hover:bg-gray-200"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.selectedSize)
                          }
                          className="ml-auto text-red-500 hover:text-red-700"
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
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2.375 2.375 0 0116.138 21H7.862a2.375 2.375 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-right">${lineTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between text-xl text-gray-800">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;