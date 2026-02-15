"use client";

import SeasonalCollectionCard from "@/components/cards/SeasonalCollectionCard";
import { ProductInDetails } from "@/_lib/types";

interface SeasonalCollectionPageProps {
  products: ProductInDetails[] | null;
  title?:string;
}

export function SeasonalCollectionPageComponent({
  products,
}: SeasonalCollectionPageProps) {
  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6">
        Seasonal Collection
      </h2>

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
