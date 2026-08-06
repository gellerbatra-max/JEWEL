import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Libre_Franklin } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Display: high-contrast elegant serif for headlines.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Body: a true text serif — editorial, non-rounded, reads like a catalogue.
const ebGaramond = EB_Garamond({
  variable: "--font-eb",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Labels / nav / buttons: structured Franklin-Gothic sans, letter-spaced.
const libreFranklin = Libre_Franklin({
  variable: "--font-franklin",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Taygerian — Fine Jewellery (working prototype)",
  description:
    "Storefront prototype for Taygerian — Ceylon-provenance fine jewellery. Mock data, not a live store.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable} ${libreFranklin.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-porcelain text-ink antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
