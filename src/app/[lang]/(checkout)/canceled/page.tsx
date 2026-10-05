import Link from "@/components/LocaleLink/LocaleLink";
import { getT } from "@/i18n/server";

export default async function CanceledPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = await getT(lang);
  return (
    <div className="container mx-auto px-4 py-24 max-w-lg text-center">
      <div className="w-14 h-14 mx-auto mb-6 rounded-full border-2 border-vintage-green flex items-center justify-center">
        <svg
          className="w-7 h-7 text-vintage-green"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl text-vintage-green mb-2">
        {t("canceled.title")}
      </h1>
      <p className="text-sm text-gray-500 mb-10">{t("canceled.text")}</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/cart"
          className="w-full sm:w-auto bg-vintage-green text-white px-8 py-3 rounded-md text-sm hover:bg-vintage-brown transition-colors"
        >
          {t("canceled.returnToCart")}
        </Link>
        <Link
          href="/collections"
          className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-sm hover:border-vintage-green hover:text-vintage-green transition-colors"
        >
          {t("common.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
