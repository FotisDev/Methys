import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/hooks/BackToTop";
import { ClientProvider } from "@/components/providers/ClientProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BotLogger } from "@/components/bot/botLogger";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${poppins.variable} ${roboto.variable}`}
    >
      <head />
      <body id="mainHTML" className="">
        <SpeedInsights />
        <BackToTop />
        <AuthProvider>
          <ClientProvider>
            <main>
              {children}
              <BotLogger />
            </main>
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
