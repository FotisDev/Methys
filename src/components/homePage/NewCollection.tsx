import { getNewCollection } from "@/_lib/helpers";
import NewCollectionCard from "../cards/NewCollectionCard";
import Link from "next/link";


export default async function NewCollectionClothes() {
  const items = await getNewCollection();
  const limitedItems = items.slice(0, 4); 

  return (
    <section className="new-collection px-4 py-8 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/products"
          className="text-sm  text-gray-600 hover:underline"
        >
        Autumn New Collection Just Droped →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {limitedItems.map((item) => (
          <NewCollectionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
