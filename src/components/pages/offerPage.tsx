"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { useState, MouseEvent } from "react";
import CartSvg from "@/svgs/cartSvg";
import { HeartSvg } from "@/svgs/hearthIcon";

type OffersListProps = {
  offerProduct: ProductWithDiscount[];
};

export default function OffersPageComponent({ offerProduct }: OffersListProps) {
  if (offerProduct.length === 0) {
    return (
      <section className="p-36">
        <h1 className="text-2xl font-semibold mb-4 text-vintage-green">
          Offers
        </h1>
        <p className="text-gray-500">Login is required to see our offers.</p>
      </section>
    );
  }

  const breadcrumbs = [
    { name: "Home", slug: "home" },
    { name: "Offers", slug: "offers" },
  ];

  return (
    <section className="font-serif text-vintage-green">
      <div className="pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <h1 className="text-2xl py-1">Explore our Limited Offers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {offerProduct.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

function OfferCard({ offer }: { offer: ProductWithDiscount }) {
  const [hovered, setHovered] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(offer.id);

  const availableSizes = (offer.product_variants ?? [])
    .filter((variant) => variant.quantity > 0)
    .map((variant) => variant.size);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(offer);
    alert(`Added "${offer.name}" to cart!`);
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
          Offer
        </span>

        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 z-10"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
              €{Number(offer.price).toFixed(2)}
            </span>
            <span className="font-bold">
              €{offer.discountedPrice.toFixed(2)}
            </span>
          </p>
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="shrink-0 text-gray-aca hover:text-black transition-opacity cursor-pointer"
          >
            <CartSvg className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1 h-5 overflow-hidden">
          {hovered && offer.size_description ? (
            <p className="text-xs text-vintage-green/60 line-clamp-1">
              {offer.size_description}
            </p>
          ) : availableSizes.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {availableSizes.map((size) => (
                <span
                  key={size}
                  className="text-[11px] px-1 py-0.5 border border-transparent text-vintage-green/70"
                >
                  {size}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-red-500">Sold Out</span>
          )}
        </div>
      </div>
    </Link>
  );
}
