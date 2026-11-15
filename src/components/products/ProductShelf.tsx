import ProductGridCard from "./ProductGridCard";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import type { ProductInDetails } from "@/_lib/types";
import { cn } from "@/_lib/utils/cn";

// A titled product grid ("Shop the look" on journal posts and drops).
export default function ProductShelf({
  title,
  products,
}: {
  title: string;
  products: ProductInDetails[];
}) {
  if (products.length === 0) return null;

  return (
    <section className={cn("mt-16")}>
      <h2 className={cn("text-lg font-normal mb-6")}>{title}</h2>
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-0.5 gap-y-8",
        )}
      >
        {products.map((product) => {
          const pricing = getProductPricing(product);
          return (
            <ProductGridCard
              key={product.id}
              product={product}
              finalPrice={pricing.finalPrice}
              originalPrice={
                pricing.isDiscounted ? pricing.originalPrice : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
