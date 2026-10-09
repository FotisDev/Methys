"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import ProductGridCard from "../products/ProductGridCard";
import { useLocale, useT } from "@/i18n/client";

type OffersListProps = {
  offerProduct: ProductWithDiscount[];
};

export default function OffersPageComponent({ offerProduct }: OffersListProps) {
  const t = useT();
  const locale = useLocale();

  if (offerProduct.length === 0) {
    return (
      <section className="font-serif text-vintage-green pt-16 px-4 sm:px-6 min-h-[50vh]">
        <h1 className="text-lg py-2">{t("offers.title")}</h1>
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
      <div className="px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <h1 className="text-lg  py-2">{t("offers.heading")}</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8">
        {offerProduct.map((offer) => (
          <ProductGridCard
            key={offer.id}
            product={offer}
            originalPrice={offer.price}
            finalPrice={offer.discountedPrice}
            badge={t("product.offer")}
          />
        ))}
      </div>
    </section>
  );
}
