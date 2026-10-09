"use client";

import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { useState, MouseEvent } from "react";
import CartSvg from "@/svgs/cartSvg";
import { HeartSvg } from "@/svgs/hearthIcon";
import { useFormatPrice, useT } from "@/i18n/client";
import { getStockStatus } from "@/_lib/utils/stock";
import type { ProductInDetails } from "@/_lib/types";

type ProductGridCardProps = {
  product: ProductInDetails;
  finalPrice: number;
  // Shown struck through next to the final price when set.
  originalPrice?: number;
  badge?: string;
};

export function productUrl(product: ProductInDetails) {
  const category = product.categoryformen;
  return `/collections/${category?.parent?.slug ?? "all"}/${category?.slug ?? "all"}/${product.slug}`;
}

// Product tile used on the offers and wishlist grids.
export default function ProductGridCard({
  product,
  finalPrice,
  originalPrice,
  badge,
}: ProductGridCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { addToCart } = useCart();
  const t = useT();
  const formatPrice = useFormatPrice();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const stock = getStockStatus(product.product_variants);

  const availableSizes = (product.product_variants ?? [])
    .filter((variant) => variant.quantity > 0)
    .map((variant) => variant.size);

  const handleSizeClick = (e: MouseEvent<HTMLSpanElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (availableSizes.length === 0) {
      alert(t("product.outOfStock"));
      return;
    }

    if (!selectedSize) {
      setHovered(true);
      alert(t("wishlist.selectSizeFirst"));
      return;
    }

    addToCart(product, selectedSize);
    alert(
      t("product.addedToCartWithSize", {
        name: product.name,
        size: selectedSize,
      }),
    );
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const defaultImg = product.image_url?.[0] ?? "/AuthClothPhoto.jpg";
  const hoverImg = product.image_url?.[1] ?? defaultImg;

  return (
    <Link
      href={productUrl(product)}
      className="font-serif"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden bg-[#f5f4f0]"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={hovered ? hoverImg : defaultImg}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition duration-500 ease-in-out"
          quality={75}
        />

        {badge && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest bg-vintage-green text-vintage-white px-2 py-1 z-10">
            {badge}
          </span>
        )}

        {stock.isLowStock && (
          <span className="absolute bottom-2 left-2 z-10 bg-white/90 text-red-700 text-[10px] uppercase tracking-widest px-2 py-1">
            {t("product.onlyLeft", { count: stock.total })}
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 z-10"
          aria-label={
            inWishlist
              ? t("product.removeFromWishlist")
              : t("product.addToWishlist")
          }
        >
          <HeartSvg
            filled={inWishlist}
            className={`w-5 h-5 transition-colors drop-shadow-sm ${
              inWishlist ? "text-red-500" : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="pt-2 pb-3 px-2 sm:px-5 text-vintage-green">
        {/* On phones the name gets its own line so it isn't cut short. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-medium line-clamp-1 leading-snug basis-full sm:basis-0 sm:flex-1">
            {product.name}
          </h3>
          <p className="text-sm shrink-0 flex items-center gap-1">
            {originalPrice !== undefined && (
              <span className="line-through text-gray-400 text-xs">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="font-bold">{formatPrice(finalPrice)}</span>
          </p>
          <button
            onClick={handleAddToCart}
            aria-label={t("common.addToCart")}
            className="shrink-0 text-gray-aca hover:text-black transition-opacity cursor-pointer"
          >
            <CartSvg className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1 h-5 overflow-hidden">
          {hovered ? (
            availableSizes.length > 0 ? (
              <div className="flex gap-1 flex-wrap">
                {availableSizes.map((size) => (
                  <span
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`cursor-pointer text-[11px] px-1 py-0.5 transition-all duration-150 border ${
                      selectedSize === size
                        ? "border-vintage-green bg-vintage-green text-white"
                        : "border-transparent text-vintage-green/70 hover:border-vintage-green/50"
                    }`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-red-500">
                {t("product.soldOut")}
              </span>
            )
          ) : product.size_description ? (
            <p className="text-xs text-vintage-green/60 line-clamp-1">
              {product.size_description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
