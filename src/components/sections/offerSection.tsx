"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import Image from "next/image";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
type OffersListProps = {
  offers: ProductWithDiscount[];
};

export default function OffersList({ offers }: OffersListProps) {
  if (offers.length === 0) {
    return (
      <section className="p-36">
        <h1 className="text-2xl font-semibold mb-4 text-vintage-green">
          Offers
        </h1>
        <p className="text-gray-500">Login is required to See our Offers..</p>
      </section>
    );
  }

  const breadcrumbs = [
    { name: "Home", slug: "home",  },
    { name: "Offers", slug: "offers" },
  ];

  return (
    <section className=" font-roboto text-vintage-green pt-16">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-semibold py-2">
        Explore our Limited Offers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
        {offers.map((offer) => {
          const discountedPrice = offer.discountedPrice ?? 0;
          const originalPrice = Number(offer.price) || 0;
          const discountPercent = offer.discountPercent ?? 0;

          return (
            <div
              key={offer.id}
              className="group relative block overflow-hidden  transition-all duration-300  bg-white"
            >
              {/* Εικόνα */}
              <div className="relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[75vh] overflow-hidden">
                <Image
                  src={offer.image_url[0]}
                  alt={offer.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                  fill
                />

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-ext-vintage-green rounded-full text-white text-sm px-3 py-1.5  z-10  flex items-center gap-2">
                  <p className="text-gray-800 line-through text-sm">
                    €{originalPrice.toFixed(2)}
                  </p>
                  <span className="text-xs  text-vintage-white font-bold rounded-full px-2 py-0.5 ">
                    €{discountedPrice.toFixed(2)}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
              </div>

              {/* Πληροφορίες */}
              <div className="relative pt-2 pb-5 px-1 text-vintage-green">
                <h3 className="text-base md:text-lg  line-clamp-1">
                  {offer.name}
                </h3>

                <div className="flex items-center gap-2 mt-2">
                  <p className="text-vintage-green font-bold text-sm">
                    €{discountedPrice.toFixed(2)}
                  </p>
                  <span>-{discountPercent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
