import type { Metadata } from "next";
import Link from "@/components/LocaleLink/LocaleLink";
import { getT } from "@/i18n/server";
import { getConfirmationStatus } from "@/_lib/backend/newsletter/action";
import ConfirmSubscriptionForm from "./ConfirmSubscriptionForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return { title: t("newsletter.metaTitle") };
}

export default async function NewsletterConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ lang }, { token }] = await Promise.all([params, searchParams]);
  const t = await getT(lang);
  const status = await getConfirmationStatus(token);

  return (
    <div className="container mx-auto px-4 py-24 max-w-lg text-center text-vintage-green">
      <p className="tracking-[0.3em] text-lg mb-10">METHYS</p>

      {status === "pending" && token ? (
        <ConfirmSubscriptionForm token={token} />
      ) : (
        <>
          <h1 className="text-2xl md:text-3xl mb-3">
            {status === "confirmed"
              ? t("newsletter.alreadyConfirmed")
              : t("newsletter.confirmPageTitle")}
          </h1>
          {status === "invalid" && (
            <p className="text-sm text-gray-500 mb-10">
              {t("newsletter.invalidLink")}
            </p>
          )}
          <Link
            href="/collections"
            className="inline-block mt-6 bg-vintage-green text-white px-8 py-3 text-sm hover:bg-vintage-brown transition-colors"
          >
            {t("common.continueShopping")}
          </Link>
        </>
      )}
    </div>
  );
}
