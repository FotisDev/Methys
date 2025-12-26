import Link from "next/link";
import { getProductsWithStructure } from "@/_lib/backend/ProductWithStructure/action";
import SwiperComponent from "../swipers/SwiperComponent";

export default async function NewCollectionClothes() {
  const items = await getProductsWithStructure();

  if (!items || !Array.isArray(items)) {
    return <div>No products found</div>;
  }

  const validItems = items.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );

  if (validItems.length === 0) {
    return <div>No valid products found</div>;
  }

  return (
    <section className="new-collection pt-5 font-poppins bg-white">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/products"
          className="text-sm pl-2  text-black hover:underline"
        >
          Autumn New Collection Just Dropped →
        </Link>
      </div>

      <SwiperComponent items={validItems} />
    </section>
  );
}
