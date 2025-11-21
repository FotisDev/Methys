import Link from "next/link";
import { getProductsWithStructure } from "@/_lib/backend/newCollection/action";
import NewCollectionCard from "../cards/NewCollectionCard";

export default async function NewCollectionClothes() {
  const items = await getProductsWithStructure();

  if (!items || !Array.isArray(items)) {
    return <div>No products found</div>;
  }

  const validItems = items.filter((item): item is NonNullable<typeof item> => 
    item !== null
  );

  if (validItems.length === 0) {
    return <div>No valid products found</div>;
  }

  return (
    <section className="new-collection py-8 px-0.5 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/products"
          className="text-sm pl-2 text-gray-600 hover:underline"
        >
          Autumn New Collection Just Droped →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {validItems.map((item) => (
          <NewCollectionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}