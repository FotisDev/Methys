"use client";
import { ProductInDetails } from "@/_lib/types";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import SeasonalCollectionCard from "../cards/SeasonalCollectionCard";
import { useLocale, useT } from "@/i18n/client";

type OnlineProductProps = {
  products: ProductInDetails[] | null;
  title?: string;
};

export function OnlineProductsPageComponent({ products }: OnlineProductProps) {
  const t = useT();
  const locale = useLocale();
  const breadcrumbs = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("onlineExclusive.title"), slug: "/online-exclusive" },
  ];

  return (
    <section className="font-serif text-vintage-green pt-16 ">
      <Breadcrumbs items={breadcrumbs} locale={locale} />
      <h1 className="text-lg  py-2">{t("onlineExclusive.title")}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <SeasonalCollectionCard key={product.id} item={product} />
          ))}
      </div>
    </section>
  );
}
