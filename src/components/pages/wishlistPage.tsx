"use client";

import Link from "@/components/LocaleLink/LocaleLink";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import ProductGridCard from "../products/ProductGridCard";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { useLocale, useT } from "@/i18n/client";
import { translateCount } from "@/i18n/translate";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import type { ProductInDetails } from "@/_lib/types";

const isInStock = (item: ProductInDetails) =>
  (item.product_variants ?? []).some((v) => v.quantity > 0);

export default function WishlistPageComponent() {
  const t = useT();
  const locale = useLocale();
  const { wishlist, isLoaded, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const breadcrumbs = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("wishlist.title"), slug: "/Wishlist" },
  ];

  // Nothing to show until the saved wishlist is read from localStorage.
  if (!isLoaded) {
    return <section className="pt-16 min-h-[50vh]" />;
  }

  if (wishlist.length === 0) {
    return (
      <section className="font-roboto text-vintage-green pt-16 min-h-[70vh]">
        <div className="px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} locale={locale} />
        </div>
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mb-3">
            {t("wishlist.empty")}
          </h1>
          <p className="text-sm text-gray-500 mb-10 max-w-sm">
            {t("wishlist.emptyHint")}
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

  const moveAllToCart = () => {
    const toAdd = wishlist.filter(
      (item) => isInStock(item) && !isInCart(item.id),
    );
    toAdd.forEach((item) => addToCart(item));
    alert(
      toAdd.length > 0
        ? t("wishlist.addedAllToCart", {
            items: translateCount(t, "common.items", toAdd.length),
          })
        : t("wishlist.nothingToAdd"),
    );
  };

  const handleClear = () => {
    if (confirm(t("wishlist.confirmClear"))) clearWishlist();
  };

  return (
    <section className="font-serif text-vintage-green pt-16">
      <div className="px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-2 px-4 sm:px-6">
        <h1 className="text-lg">
          {t("wishlist.myWishlist")}{" "}
          <span className="text-sm text-gray-500">
            ({translateCount(t, "common.items", wishlist.length)})
          </span>
        </h1>
        <div className="flex gap-5 text-xs uppercase tracking-wider">
          <button
            onClick={moveAllToCart}
            className="underline underline-offset-4 hover:text-default-cold cursor-pointer"
          >
            {t("wishlist.addAllToCart")}
          </button>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:text-red-600 cursor-pointer"
          >
            {t("wishlist.clear")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8">
        {wishlist.map((item) => {
          const pricing = getProductPricing(item);
          return (
            <ProductGridCard
              key={item.id}
              product={item}
              finalPrice={pricing.finalPrice}
              originalPrice={
                pricing.isDiscounted ? pricing.originalPrice : undefined
              }
              badge={pricing.isDiscounted ? t("product.offer") : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
