import BackToTop from "@/components/hooks/BackToTop";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import { getDictionary } from "@/i18n";

export default async function LangLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  // params: { lang: string };
}) {
  return (
    //  const t = await getDictionary(params.lang);
    <>
      <SpeedInsights />
      <BackToTop />
      <AuthProvider>
        <ClientProvider>
          <main>{children}</main>
        </ClientProvider>
      </AuthProvider>
    </>
  );
}
