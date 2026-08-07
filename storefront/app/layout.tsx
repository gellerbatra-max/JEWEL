import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MediaProtection } from "@/components/MediaProtection";

// Display: Cinzel — squared, chiseled Roman capitals (the free relative of
// Trajan, the classic luxury-packaging / film-title typeface). Structured
// and architectural rather than delicate. Everything else = system sans.
const cinzel = Cinzel({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Taygerian — Fine Jewellery (working prototype)",
  description:
    "Storefront prototype for Taygerian — Ceylon-provenance fine jewellery. Mock data, not a live store.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-porcelain text-ink font-sans antialiased">
        <CartProvider>
          <MediaProtection />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
