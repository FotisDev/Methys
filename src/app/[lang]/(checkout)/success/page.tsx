
import { ClearCartOnSuccess } from "@/components/afterCheckoutUtils/ClearCartOnSuccess";
import Link from "@/components/LocaleLink/LocaleLink";
import Stripe from "stripe";
import { getT } from "@/i18n/server";
import { formatPrice } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";
import { rich } from "@/i18n/rich";


type SearchParams = Promise<{ session_id?: string }>;

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  if (!session_id) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center">
        <h1 className="text-2xl text-vintage-green mb-2">{t("success.invalidSession")}</h1>
        <p className="text-sm text-gray-500 mb-10">
          {t("success.invalidSessionText")}
        </p>
        <Link
          href="/collections"
          className="inline-block bg-vintage-green text-white px-8 py-3 rounded-md text-sm hover:bg-vintage-brown transition-colors"
        >
          {t("common.continueShopping")}
        </Link>
      </div>
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });

  const email = session.customer_details?.email;
  const currency = session.currency?.toUpperCase() ?? "EUR";
  const amountTotal =
    typeof session.amount_total === "number"
      ? formatPrice(session.amount_total / 100, locale, currency)
      : null;
  const orderReference = session.id.replace("cs_test_", "").slice(0, 10);
  const lineItems = session.line_items?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-20 max-w-lg">
      <ClearCartOnSuccess />
      <div className="text-center mb-10">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl text-vintage-green mb-2">
          {t("success.title")}
        </h1>
        {email ? (
          <p className="text-sm text-gray-500">
            {rich(t("success.confirmedFor"), { email: <span className="text-gray-800">{email}</span> })}
          </p>
        ) : (
          <p className="text-sm text-gray-500">{t("success.orderPlaced")}</p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t("success.orderReference")}</span>
          <span className="text-gray-900">#{orderReference}</span>
        </div>
        {amountTotal && (
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t("success.amountPaid")}</span>
            <span className="text-gray-900">{amountTotal}</span>
          </div>
        )}

        {lineItems.length > 0 && (
          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-600"
              >
                <span className="truncate pr-3">
                  {item.description} {item.quantity && item.quantity > 1 ? `× ${item.quantity}` : ""}
                </span>
                <span className="text-gray-900 shrink-0">
                  {formatPrice((item.amount_total ?? 0) / 100, locale, currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mb-8">
        {t("success.receiptSent")}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/collections"
          className="w-full sm:w-auto bg-vintage-green text-white px-8 py-3 rounded-md text-sm hover:bg-vintage-brown transition-colors"
        >
          {t("common.continueShopping")}
        </Link>
      </div>
    </div>
  );
}