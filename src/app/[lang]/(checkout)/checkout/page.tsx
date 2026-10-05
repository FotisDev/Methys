"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/LocaleLink/LocaleLink";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CartProvider";
import {
  createCheckoutSession,
  validateDiscountCode,
} from "@/_lib/backend/stripe/action";
import { useParams } from "next/navigation";
import { useFormatPrice, useT } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { getShipping } from "@/_lib/utils/shipping";

const Checkout = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getItemPrice } =
    useCart();

  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useT();
  const formatPrice = useFormatPrice();

  const params = useParams();
  const locale = params.lang as string;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  type AppliedPromo = {
    id: string;
    code: string;
    percentOff?: number;
    amountOff?: number;
  };

  const [discountCode, setDiscountCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cart, getCartTotal]);

  const discountAmount = appliedPromo
    ? appliedPromo.percentOff
      ? (total * appliedPromo.percentOff) / 100
      : (appliedPromo.amountOff ?? 0)
    : 0;
  // Discount codes apply to products only; shipping is added on top.
  const shipping = getShipping(total);
  const payableTotal = Math.max(total - discountAmount, 0) + shipping.fee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const promo = await validateDiscountCode(discountCode.trim());
      if (!promo) {
        setDiscountError(t("checkout.discountInvalid"));
        setAppliedPromo(null);
        return;
      }
      setAppliedPromo(promo);
    } catch (err) {
      console.error("Discount validation failed:", err);
      setDiscountError(t("auth.genericError"));
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedPromo(null);
    setDiscountCode("");
    setDiscountError(null);
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
        alert(t("cart.stockLimit"));
        return;
      }
    }

    updateQuantity(productId, selectedSize, newQuantity);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = t("checkout.errors.nameRequired");
    if (!formData.email.trim()) errors.email = t("validation.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = t("validation.emailInvalid");
    if (!formData.phone.trim())
      errors.phone = t("validation.telephoneRequired");
    if (!formData.address.trim())
      errors.address = t("checkout.errors.addressRequired");
    if (!formData.city.trim()) errors.city = t("checkout.errors.cityRequired");
    if (!formData.zipCode.trim())
      errors.zipCode = t("checkout.errors.zipRequired");
    if (!termsAccepted) errors.terms = t("checkout.errors.termsRequired");

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { url } = await createCheckoutSession(
        cart,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        locale,
        appliedPromo?.id,
      );

      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(t("auth.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-2xl text-vintage-green mb-4">{t("cart.empty")}</p>
        <Link
          href="/collections"
          className="inline-block bg-vintage-green text-white px-8 py-3 rounded-full hover:bg-vintage-brown transition-colors"
        >
          {t("home.shopNow")}
        </Link>
      </div>
    );
  }

  const FIELDS: {
    name: keyof typeof formData;
    label: string;
    type: string;
    span?: "full";
    autoComplete?: string;
  }[] = [
    {
      name: "name",
      label: t("checkout.fields.name"),
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: t("checkout.fields.email"),
      type: "email",
      autoComplete: "email",
    },
    {
      name: "phone",
      label: t("checkout.fields.phone"),
      type: "tel",
      autoComplete: "tel",
    },
    {
      name: "address",
      label: t("checkout.fields.address"),
      type: "text",
      span: "full",
      autoComplete: "street-address",
    },
    {
      name: "city",
      label: t("checkout.fields.city"),
      type: "text",
      autoComplete: "address-level2",
    },
    {
      name: "zipCode",
      label: t("checkout.fields.zipCode"),
      type: "text",
      autoComplete: "postal-code",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl text-vintage-green tracking-tight">
          {t("checkout.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          <Link href="/cart" className="hover:text-vintage-brown">
            {t("cart.title")}
          </Link>
          <span className="mx-1.5">/</span>
          <span>{t("checkout.title")}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <h2 className="text-lg text-vintage-green mb-5">
                {t("checkout.personalInfo")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                {FIELDS.map((field) => (
                  <div
                    key={field.name}
                    className={field.span === "full" ? "sm:col-span-2" : ""}
                  >
                    <label
                      htmlFor={field.name}
                      className="block text-xs uppercase tracking-wide text-gray-500 mb-1.5"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      autoComplete={field.autoComplete}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(formErrors[field.name])}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-md text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-2 focus:ring-vintage-green/30 focus:border-vintage-green ${
                        formErrors[field.name]
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg text-vintage-green mb-1">
                {t("checkout.payment")}
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                {t("checkout.secureText")}
              </p>

              <div className="flex items-center justify-between gap-3 px-4 py-3.5 border border-gray-300 rounded-md bg-gray-50">
                <span className="text-sm text-gray-700">
                  {t("checkout.stripeText")}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                  <span className="border rounded px-1.5 py-0.5">Visa</span>
                  <span className="border rounded px-1.5 py-0.5">
                    Mastercard
                  </span>
                  <span className="border rounded px-1.5 py-0.5">Amex</span>
                </span>
              </div>
            </section>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (formErrors.terms) {
                      setFormErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
                  className="mt-0.5 accent-vintage-green"
                />
                <span className="text-sm text-gray-600">
                  {rich(t("checkout.acceptTerms"), {
                    terms: (
                      <Link
                        href="/terms-conditions"
                        className="underline hover:text-vintage-brown"
                      >
                        {t("checkout.termsLink")}
                      </Link>
                    ),
                  })}
                </span>
              </label>
              {formErrors.terms && (
                <p className="text-red-500 text-xs mt-1">{formErrors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-vintage-green text-white rounded-md py-3.5 text-sm tracking-wide hover:bg-vintage-brown transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("checkout.redirecting")
                : t("checkout.pay", { amount: formatPrice(payableTotal) })}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-1 text-xs text-gray-400">
              <Link href="/help" className="hover:text-vintage-brown">
                {t("checkout.links.refund")}
              </Link>
              <Link href="/help" className="hover:text-vintage-brown">
                {t("checkout.links.shipping")}
              </Link>
              <Link href="/privacy-policy" className="hover:text-vintage-brown">
                {t("checkout.links.privacy")}
              </Link>
              <Link
                href="/terms-conditions"
                className="hover:text-vintage-brown"
              >
                {t("checkout.links.terms")}
              </Link>
              <Link
                href="/customer-support"
                className="hover:text-vintage-brown"
              >
                {t("checkout.links.contact")}
              </Link>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 lg:sticky lg:top-6">
            <h2 className="text-lg text-gray-800 mb-5">
              {t("cart.orderSummary")}
            </h2>

            {appliedPromo ? (
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 mb-6 border border-vintage-green/40 bg-vintage-green/5 rounded-md">
                <span className="text-sm text-vintage-green">
                  {rich(t("checkout.codeApplied"), {
                    code: <strong>{appliedPromo.code}</strong>,
                  })}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveDiscount}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  {t("common.remove")}
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      if (discountError) setDiscountError(null);
                    }}
                    placeholder={t("checkout.discountPlaceholder")}
                    className="flex-1 min-w-0 px-3.5 py-2.5 bg-white border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-vintage-green/30 focus:border-vintage-green"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount}
                    className="shrink-0 px-4 py-2.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:border-vintage-green hover:text-vintage-green transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isApplyingDiscount
                      ? t("checkout.checking")
                      : t("checkout.apply")}
                  </button>
                </div>
                {discountError && (
                  <p className="text-red-500 text-xs mt-1.5">{discountError}</p>
                )}
              </div>
            )}

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {cart.map((item) => {
                const { finalPrice, originalPrice, isDiscounted } =
                  getItemPrice(item);
                const lineTotal = finalPrice * (item.quantity || 1);

                return (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-200">
                      <Image
                        src={getValidImage(item.image_url?.[0])}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-gray-800 truncate">
                        {item.name}
                      </h3>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">
                          {t("product.sizeLabel", { size: item.selectedSize })}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-800">
                          {formatPrice(finalPrice)}
                        </span>
                        {isDiscounted && (
                          <del className="text-xs text-gray-400">
                            {formatPrice(originalPrice)}
                          </del>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          aria-label={t("cart.decreaseQuantity")}
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              (item.quantity || 1) - 1,
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-vintage-green hover:text-vintage-green transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={t("cart.increaseQuantity")}
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              (item.quantity || 1) + 1,
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-vintage-green hover:text-vintage-green transition-colors"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          aria-label={t("cart.removeItem")}
                          onClick={() =>
                            removeFromCart(item.id, item.selectedSize)
                          }
                          className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
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
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2.375 2.375 0 0116.138 21H7.862a2.375 2.375 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-800 shrink-0">
                      {formatPrice(lineTotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("cart.subtotal")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-sm text-vintage-green">
                  <span>
                    {t("checkout.discount", { code: appliedPromo.code })}
                  </span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("cart.shipping")}</span>
                <span className={shipping.isFree ? "text-vintage-green" : ""}>
                  {shipping.isFree ? t("cart.free") : formatPrice(shipping.fee)}
                </span>
              </div>
              <div className="flex justify-between text-base text-gray-900 pt-2 border-t border-gray-200">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(payableTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-gray-800 mb-0.5">
                {t("checkout.freeReturns")}
              </p>
              <p>{t("checkout.freeReturnsText")}</p>
            </div>
            <div className="border border-gray-200 rounded-md p-3">
              <p className="text-gray-800 mb-0.5">
                {t("checkout.secureCheckout")}
              </p>
              <p>{t("checkout.secureCheckoutText")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
