import getPrivacyPolicy, {
  PrivacyPolicyBackendType,
} from "@/_lib/backend/privacyPolicy/action";
import Footer from "@/components/footer/Footer";
import DropDownMenu from "@/components/header/DropDownMenu";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { createMetadata } from "@/components/SEO/metadata";
import { notFound } from "next/navigation";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [privacyPolicy, t] = await Promise.all([getPrivacyPolicy(locale), getT(locale)]);

  return createMetadata({
    locale,
    MetaTitle: t("privacy.metaTitle"),
    MetaDescription: t("privacy.metaDescription"),
    OpenGraphImageUrl:
      "/storage/v1/object/public/OpenGraphImages/privacy-policy.jpg",
    canonical: "/privacy-policy",
    dateModified: privacyPolicy?.updated_at,
    datePublished: privacyPolicy?.created_at,
  });
}

export default async function PrivacyPolicy({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);
  const privacyPolicy: PrivacyPolicyBackendType | null = await getPrivacyPolicy(locale);

  if (!privacyPolicy) notFound();

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu/>}>
      <section
        aria-label={t("privacy.title")}
        className="mt-16 font-serif custom-container-4xl padding-x padding-y"
      >
        <div className=" whitespace-pre-line flex flex-col items-center ">
          <h1 className="text-vintage-green text-lg  flex mb-10">
            {privacyPolicy.title}
          </h1>
          <div
            className="max-w-4xl leading-snug text-vintage-green"
            dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
          />
          <p className="text-sm opacity-70 pt-10">
            {t("privacy.lastUpdated")}{" "}
            <time dateTime={privacyPolicy.updated_at}>
              {new Date(privacyPolicy.updated_at).toLocaleDateString(locale)}
            </time>
          </p>
        </div>
      </section>
      <Footer />
    </HeaderProvider>
  );
}
