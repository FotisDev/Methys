"use client";

import CartSvg from "@/svgs/cartSvg";
import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { useState, MouseEvent } from "react";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { ProductInDetails } from "@/_lib/types";
import { HeartSvg } from "@/svgs/hearthIcon";
import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import { useFormatPrice, useT } from "@/i18n/client";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import { getStockStatus } from "@/_lib/utils/stock";
import { cn } from "@/_lib/utils/cn";

interface SeasonalCollectionCardProps {
  item: ProductInDetails;
  priority?: boolean;
  offer?: ProductWithDiscount;
}

export default function SeasonalCollectionCard({
  item,
  priority = false,
}: SeasonalCollectionCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { addToCart } = useCart();
  const t = useT();
  const formatPrice = useFormatPrice();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(item.id);
  const pricing = getProductPricing(item);
  const stock = getStockStatus(item.product_variants);

  const availableSizes = (item.product_variants ?? [])
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

    if (!selectedSize && availableSizes.length > 0) {
      alert(t("wishlist.selectSizeFirst"));
      return;
    }

    addToCart(item, selectedSize || undefined);

    alert(
      selectedSize
        ? t("product.addedToCartWithSize", {
            name: item.name,
            size: selectedSize,
          })
        : t("product.addedToCart", { name: item.name }),
    );
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(item);
  };

  const buildCategoryHref = (): string => {
    const category = item.categoryformen;
    const parent = category?.parent;
    if (parent?.slug && category?.slug) {
      return `${parent.slug}/${category.slug}`;
    }
    return category?.slug ?? "uncategorized";
  };

  const defaultImg = item.image_url?.[0] ?? "/Articles.jpg";
  const hoverImg = item.image_url?.[1] ?? defaultImg;

  const isNew = true;

  return (
    <Link
      href={`/collections/${buildCategoryHref()}/${item.slug ?? ""}`}
      className={cn("font-serif")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn("relative w-full overflow-hidden bg-[#f5f4f0]")}
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={hovered ? hoverImg : defaultImg}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={cn(
            "object-cover object-center transition duration-500 ease-in-out",
          )}
          quality={75}
          priority={priority}
          placeholder={item.blur_data_url ? "blur" : "empty"}
          blurDataURL={item.blur_data_url ?? undefined}
        />
        {isNew && (
          <span
            className={cn(
              "absolute top-2 left-2 text-[10px] uppercase tracking-widest text-default-color z-10",
            )}
          >
            {t("product.newIn")}
          </span>
        )}
        {stock.isLowStock && (
          <span
            className={cn(
              "absolute bottom-2 left-2 z-10 bg-white/90 text-red-700 text-[10px] uppercase tracking-widest px-2 py-1",
            )}
          >
            {t("product.onlyLeft", { count: stock.total })}
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          className={cn("absolute top-2 right-2 p-1.5 z-10")}
          aria-label={
            inWishlist
              ? t("product.removeFromWishlist")
              : t("product.addToWishlist")
          }
        >
          <HeartSvg
            filled={inWishlist}
            className={cn(
              "w-5 h-5 transition-colors drop-shadow-sm",
              inWishlist ? "text-red-500" : "text-white hover:text-red-400",
            )}
          />
        </button>
      </div>

      <div className={cn("pt-2 pb-3 px-2 sm:px-5 text-vintage-green")}>
        {/* On phones the name gets its own line so it isn't cut short. */}
        <div
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5",
          )}
        >
          <h3
            className={cn(
              "text-sm font-medium line-clamp-1 leading-snug basis-full sm:basis-0 sm:flex-1",
            )}
          >
            {item.name}
          </h3>
          <p className={cn("text-sm shrink-0 flex items-center gap-1")}>
            {pricing.isDiscounted && (
              <span className={cn("line-through text-gray-400 text-xs")}>
                {formatPrice(pricing.originalPrice)}
              </span>
            )}
            <span className={cn(pricing.isDiscounted && "font-bold")}>
              {formatPrice(pricing.finalPrice)}
            </span>
          </p>
          <button
            onClick={handleAddToCart}
            aria-label={t("common.addToCart")}
            className={cn(
              "shrink-0 text-gray-aca hover:text-black transition-opacity cursor-pointer",
            )}
          >
            <CartSvg className={cn("w-4 h-4")} />
          </button>
        </div>

        <div className={cn("mt-1 h-5 overflow-hidden")}>
          {hovered ? (
            availableSizes.length > 0 ? (
              <div className={cn("flex gap-1 flex-wrap")}>
                {availableSizes.map((size) => (
                  <span
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={cn(
                      "cursor-pointer text-[11px] px-1 py-0.5 transition-all duration-150 border",
                      selectedSize === size
                        ? "border-vintage-green bg-vintage-green text-white"
                        : "border-transparent text-vintage-green/70 hover:border-vintage-green/50",
                    )}
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : (
              <span className={cn("text-xs text-red-500")}>
                {t("product.soldOut")}
              </span>
            )
          ) : item.size_description ? (
            <p className={cn("text-xs text-vintage-green/60 line-clamp-1")}>
              {item.size_description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
