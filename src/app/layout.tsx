import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`scroll-smooth ${poppins.variable} ${roboto.variable}`}>
      <body id="mainHTML">{children}</body>
    </html>
  );
}