"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import ProductGridCard from "../products/ProductGridCard";
import { useLocale, useT } from "@/i18n/client";
import { cn } from "@/_lib/utils/cn";

type OffersListProps = {
  offerProduct: ProductWithDiscount[];
};

export default function OffersPageComponent({ offerProduct }: OffersListProps) {
  const t = useT();
  const locale = useLocale();

  if (offerProduct.length === 0) {
    return (
      <section
        className={cn(
          "font-serif text-vintage-green pt-16 px-4 sm:px-6 min-h-[50vh]",
        )}
      >
        <h1 className={cn("text-lg py-2")}>{t("offers.title")}</h1>
        <p className={cn("text-gray-500")}>{t("offers.loginRequired")}</p>
      </section>
    );
  }

  const breadcrumbs = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("offers.title"), slug: "/offers" },
  ];

  return (
    <section className={cn("font-serif text-vintage-green pt-16")}>
      <div className={cn("px-4 sm:px-6")}>
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <h1 className={cn("text-lg py-2")}>{t("offers.heading")}</h1>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8",
        )}
      >
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
