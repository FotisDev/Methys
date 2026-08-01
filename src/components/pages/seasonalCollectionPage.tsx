"use client";

import SeasonalCollectionCard from "@/components/cards/SeasonalCollectionCard";
import { ProductInDetails } from "@/_lib/types";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";

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

   const breadcrumbs = [
    { name: "Home", slug: "/" },
    { name: "Online-Exclusive", slug: " Seasonal Collection" },
  ];
  
  return (
    <section className="font-roboto text-vintage-green pt-16"> 
    
    <Breadcrumbs items={breadcrumbs} />
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
