import Link from "@/components/LocaleLink/LocaleLink";
import SwiperComponent from "../swipers/SwiperComponent";
import { ProductInDetails } from "@/_lib/types";
import { getLocale, getT } from "@/i18n/server";
import { translateProducts } from "@/_lib/backend/translations/action";

type ProductFetcher = () => Promise<ProductInDetails[] | null>;

type SeasonalCollectionProps = {
  title: string;
  href?: string;
  fetcher: ProductFetcher;
};

export default async function SeasonalCollectionSection({
  title,
  href = "/collections",
  fetcher,
}: SeasonalCollectionProps) {
  const [rawItems, locale] = await Promise.all([fetcher(), getLocale()]);
  const [items, t] = await Promise.all([translateProducts(rawItems, locale), getT(locale)]);

  if (!items || !Array.isArray(items)) {
    return <div>{t("common.noProductsFound")}</div>;
  }

  const validItems = items.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  if (validItems.length === 0) {
    return <div>{t("common.noProductsFound")}</div>;
  }

  return (
    <section className="new-collection pb-1 sm:pb-12 md:pb-20 lg:pb-1 pt-5 fond-sans bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-normal pl-2">
          <Link href={href} className="text-black hover:underline">
            {title} →
          </Link>
        </h2>
      </div>

      <SwiperComponent items={validItems} />
    </section>
  );
}
