"use client";

import SeasonalCollectionCard from "@/components/cards/SeasonalCollectionCard";
import { ProductInDetails } from "@/_lib/types";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import { useLocale, useT } from "@/i18n/client";

interface SeasonalCollectionPageProps {
  products: ProductInDetails[] | null;
  title?:string;
}

export function SeasonalCollectionPageComponent({
  products,
}: SeasonalCollectionPageProps) {
  const t = useT();
  const locale = useLocale();

  if (!products || products.length === 0) {
    return <p>{t("common.noProductsFound")}</p>;
  }

  const breadcrumbs = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("seasonalCollection.title"), slug: "/seasonal-collection" },
  ];

  return (
    <section className="font-roboto text-vintage-green pt-16">
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <h1 className="text-lg py-2">{t("seasonalCollection.title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <SeasonalCollectionCard
            key={product.id}
            item={product}
          />
        ))}
      </div>
    </section>
  );
}
