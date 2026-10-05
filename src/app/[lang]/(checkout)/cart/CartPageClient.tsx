"use client";

import { useEffect, useState } from "react";
import Link from "@/components/LocaleLink/LocaleLink";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { useCart, type CartItem } from "@/components/providers/CartProvider";
import { DISCOUNT_PERCENT } from "@/_lib/utils/discountUtil/discountUtils";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { useFormatPrice, useLocale, useT } from "@/i18n/client";
import { translateCount } from "@/i18n/translate";
import { FREE_SHIPPING_THRESHOLD, getShipping } from "@/_lib/utils/shipping";
import FreeShippingProgress from "@/components/cart/FreeShippingProgress";

function productHref(item: CartItem) {
  const category = item.categoryformen;
  const parentSlug = category?.parent?.slug;
  if (!parentSlug || !category?.slug || !item.slug) return "/collections";
  return `/collections/${parentSlug}/${category.slug}/${item.slug}`;
}

export default function CartPageClient() {
  const {
    cart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartTotal,
    getItemPrice,
  } = useCart();

  const [total, setTotal] = useState(0);
  const t = useT();
  const locale = useLocale();
  const formatPrice = useFormatPrice();

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cart, getCartTotal]);

  const shipping = getShipping(total);

  const handleUpdateQuantity = (
    productId: number,
    selectedSize: string | undefined,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;

    const item = cart.find(
      (i) => i?.id === productId && i.selectedSize === selectedSize,
    );

    if (item) {
      const variant = item.selectedSize
        ? item.product_variants.find((v) => v.size === item.selectedSize)
        : null;

      const availableStock = variant ? variant.quantity : item.quantity;

      if (newQuantity > availableStock) {
        alert(t("cart.stockLimit"));
        return;
      }
    }

    updateQuantity(productId, selectedSize, newQuantity);
  };

  const handleClearCart = () => {
    if (window.confirm(t("cart.confirmClear"))) {
      clearCart();
    }
  };

  const items = cart.filter((item): item is CartItem => item !== null);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("cart.title"), slug: "/cart" },
  ];

  if (items.length === 0) {
    return (
      <section className="w-full min-h-[70vh] pt-20 px-4 sm:px-6 font-roboto text-vintage-green">
        <Breadcrumbs items={breadcrumbItems} locale={locale} />
        <div className="flex flex-col items-center justify-center text-center py-24">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-3">
            {t("cart.empty")}
          </h1>
          <p className="text-sm text-gray-500 mb-10 max-w-sm">
            {t("cart.emptyHint")}
          </p>
          <Link
            href="/collections"
            className="inline-block bg-vintage-green text-white px-10 py-4 text-sm font-medium tracking-wider uppercase hover:bg-vintage-green/90 transition-colors"
          >
            {t("common.startShopping")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-20 pb-16 px-4 sm:px-6 font-roboto text-vintage-green">
      <Breadcrumbs items={breadcrumbItems} locale={locale} />

      <header className="flex items-end justify-between gap-4 mt-4 mb-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">
            {t("cart.pageTitle")}
          </h1>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            ({translateCount(t, "common.items", itemCount)})
          </span>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          className="shrink-0 whitespace-nowrap text-xs underline underline-offset-2 text-gray-500 hover:text-vintage-green transition-colors cursor-pointer"
        >
          {t("cart.clear")}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">
        {/* Items */}
        <ul className="border-t border-gray-200">
          {items.map((item) => {
            const { finalPrice, originalPrice, isDiscounted } =
              getItemPrice(item);
            const quantity = item.quantity || 1;
            const availableQuantity = item.selectedSize
              ? item.product_variants.find((v) => v.size === item.selectedSize)
                  ?.quantity || 0
              : item.quantity || 0;
            const href = productHref(item);

            return (
              <li
                key={`${item.id}-${item.selectedSize ?? "no-size"}`}
                className="flex gap-4 sm:gap-6 py-6 border-b border-gray-200"
              >
                <Link
                  href={href}
                  className="relative w-24 sm:w-32 shrink-0 bg-gray-50 overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={getValidImage(item.image_url?.[0])}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover object-center"
                  />
                  {isDiscounted && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] uppercase tracking-wider px-2 py-1">
                      -{DISCOUNT_PERCENT}%
                    </span>
                  )}
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={href}
                        className="block text-sm sm:text-base font-light tracking-wide hover:underline underline-offset-2"
                      >
                        {item.name}
                      </Link>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t("product.sizeLabel", { size: item.selectedSize })}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mt-2 text-sm">
                        <span>{formatPrice(finalPrice)}</span>
                        {isDiscounted && (
                          <>
                            <del className="text-xs text-gray-400">
                              {formatPrice(originalPrice)}
                            </del>
                            <span className="text-[10px] uppercase tracking-wider text-red-600">
                              {t("cart.sale")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-sm sm:text-base shrink-0">
                      {formatPrice(finalPrice * quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              quantity - 1,
                            )
                          }
                          disabled={quantity <= 1}
                          aria-label={t("cart.decreaseQuantity")}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.selectedSize,
                              quantity + 1,
                            )
                          }
                          disabled={quantity >= availableQuantity}
                          aria-label={t("cart.increaseQuantity")}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="hidden sm:inline text-xs text-gray-500">
                        {t("cart.available", { count: availableQuantity })}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-xs underline underline-offset-2 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-32 border border-gray-200 p-6 space-y-6">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            {t("cart.orderSummary")}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("cart.subtotal")}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("cart.shipping")}</span>
              <span className={shipping.isFree ? "text-vintage-green" : ""}>
                {shipping.isFree ? t("cart.free") : formatPrice(shipping.fee)}
              </span>
            </div>
            <div className="flex justify-between text-base pt-4 border-t border-gray-200">
              <span>{t("cart.total")}</span>
              <span className="font-medium">
                {formatPrice(total + shipping.fee)}
              </span>
            </div>
          </div>

          <FreeShippingProgress subtotal={total} />

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full bg-vintage-green text-white py-4 text-center text-sm font-medium tracking-wider uppercase hover:bg-vintage-green/90 transition-colors"
            >
              {t("cart.proceedToCheckout")}
            </Link>
            <Link
              href="/collections"
              className="block w-full border border-vintage-green py-4 text-center text-sm font-medium tracking-wider uppercase hover:bg-vintage-green hover:text-white transition-colors"
            >
              {t("common.continueShopping")}
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-5 space-y-4 text-xs text-gray-500">
            <p>
              {t("product.freeDelivery", {
                amount: formatPrice(FREE_SHIPPING_THRESHOLD),
              })}
            </p>
            <div>
              <p className="text-vintage-green mb-0.5">
                {t("checkout.freeReturns")}
              </p>
              <p>{t("checkout.freeReturnsText")}</p>
            </div>
            <div>
              <p className="text-vintage-green mb-0.5">
                {t("checkout.secureCheckout")}
              </p>
              <p>{t("checkout.secureCheckoutText")}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
