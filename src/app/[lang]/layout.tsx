import "../globals.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToTop from "@/components/hooks/BackToTop";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DEFAULT_METADATA } from "@/_lib/constants";
import { SITE_URL } from "@/components/SEO/urls";
import { isLocale, localeMeta } from "@/i18n.config";
import { I18nProvider } from "@/i18n/client";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_METADATA.metaTitle,
  description: DEFAULT_METADATA.metaDescription,
  applicationName: DEFAULT_METADATA.siteName,
  verification: {
    google: "VxpGe4reZ6GyzQ7rxYRnbi-JSuQ2dWPptVo-jGTFbOg",
  },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={localeMeta[lang].htmlLang} className="scroll-smooth">
      <body id="mainHTML">
        <I18nProvider locale={lang}>
          <SpeedInsights />
          <BackToTop />
          <AuthProvider>
            <ClientProvider>
              <main>{children}</main>
            </ClientProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
