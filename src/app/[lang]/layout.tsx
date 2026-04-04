import BackToTop from "@/components/hooks/BackToTop";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
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