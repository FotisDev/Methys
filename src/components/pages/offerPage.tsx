"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { useState, MouseEvent } from "react";
import CartSvg from "@/svgs/cartSvg";
import { HeartSvg } from "@/svgs/hearthIcon";
import { useFormatPrice, useLocale, useT } from "@/i18n/client";

type OffersListProps = {
  offerProduct: ProductWithDiscount[];
};

export default function OffersPageComponent({ offerProduct }: OffersListProps) {
  const t = useT();
  const locale = useLocale();

  if (offerProduct.length === 0) {
    return (
      <section className="font-serif text-vintage-green pt-16 min-h-[50vh]">
        <h1 className="text-lg py-2">
          {t("offers.title")}
        </h1>
        <p className="text-gray-500">{t("offers.loginRequired")}</p>
      </section>
    );
  }

  const breadcrumbs = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("offers.title"), slug: "/offers" },
  ];

  return (
    <section className="font-serif text-vintage-green pt-16 ">
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <h1 className="text-lg  py-2">{t("offers.heading")}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8">
        {offerProduct.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: ProductWithDiscount }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { addToCart } = useCart();
  const t = useT();
  const formatPrice = useFormatPrice();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(offer.id);

  const availableSizes = (offer.product_variants ?? [])
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

    addToCart(offer, selectedSize);
    alert(t("product.addedToCartWithSize", { name: offer.name, size: selectedSize }));
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(offer);
  };

  const defaultImg = offer.image_url?.[0] ?? "/AuthClothPhoto.jpg";
  const hoverImg = offer.image_url?.[1] ?? defaultImg;

  return (
    <Link
      href={`/collections/${offer.categoryformen?.parent?.slug}/${offer.categoryformen?.slug}/${offer.slug}`}
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
          alt={offer.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition duration-500 ease-in-out"
          quality={75}
        />

        <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest bg-ext-vintage-green text-vintage-white px-2 py-1 z-10">
          {t("product.offer")}
        </span>

        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 z-10"
          aria-label={inWishlist ? t("product.removeFromWishlist") : t("product.addToWishlist")}
        >
          <HeartSvg
            filled={inWishlist}
            className={`w-5 h-5 transition-colors drop-shadow-sm ${
              inWishlist ? "text-red-500" : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="pt-2 pb-3 px-5 text-vintage-green">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium line-clamp-1 leading-snug flex-1">
            {offer.name}
          </h3>
          <p className="text-sm shrink-0 flex items-center gap-1">
            <span className="line-through text-gray-400 text-xs">
              {formatPrice(offer.price)}
            </span>
            <span className="font-bold">
              {formatPrice(offer.discountedPrice)}
            </span>
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
              <span className="text-xs text-red-500">{t("product.soldOut")}</span>
            )
          ) : offer.size_description ? (
            <p className="text-xs text-vintage-green/60 line-clamp-1">
              {offer.size_description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
