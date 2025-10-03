import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/hooks/BackToTop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
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
      <body
        id="mainHTML"
        className=" "
      >
        <BackToTop />
        <main>{children}</main>
      </body>
    </html>
  );
}
