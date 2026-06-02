"use client";
import { ProductInDetails } from "@/_lib/types";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import SeasonalCollectionCard from "../cards/SeasonalCollectionCard";

type OnlineProductProps = {
  products: ProductInDetails[] | null;
  title?: string;
};

export function OnlineProductsPageComponent({ products }: OnlineProductProps) {
  const breadcrumbs = [
    { name: "Home", slug: "Home" },
    { name: "Online-Exclusive", slug: "Online-Exclusive" },
  ];

  return (
    <section className="font-roboto text-vintage-green pt-16">
      <Breadcrumbs items={breadcrumbs} />
      <h2 className="text-2xl font-semibold py-2">Online Exclusive</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0 gap-y-8">
        {products &&
          products.length > 0 &&
          products.map((product) => (
            <SeasonalCollectionCard key={product.id} item={product} />
          ))}
      </div>
    </section>
  );
}
