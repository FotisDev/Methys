import Link from "next/link";
import SwiperComponent from "../swipers/SwiperComponent";
import { ProductInDetails } from "@/_lib/types";

type ProductFetcher = () => Promise<ProductInDetails[] | null>;

type SeasonalCollectionProps = {
  title: string;
  href?: string;
  fetcher: ProductFetcher;
};

export default async function SeasonalCollectionSection({
  title,
  href = "/product",
  fetcher,
}: SeasonalCollectionProps) {
  const items = await fetcher();

  if (!items || !Array.isArray(items)) {
    return <div>No products found</div>;
  }

  const validItems = items.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  if (validItems.length === 0) {
    return <div>No valid products found</div>;
  }

  return (
    <section className="new-collection pt-5 font-poppins bg-white">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`${href}`}
          className="text-sm pl-2  text-black hover:underline"
        >
          {` ${title}  →`}
        </Link>
      </div>

      <SwiperComponent items={validItems} />
    </section>
  );
}
