import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import { MediaProtection } from "@/components/MediaProtection";

// Display: Cinzel — squared, chiseled Roman capitals (the free relative of
// Trajan, the classic luxury-packaging / film-title typeface). Structured
// and architectural rather than delicate. This is the finalised wordmark +
// heading font. Everything else uses the system sans (set in globals.css).
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Philosopher — humanist serif with a subtle art-nouveau character, used for
// the wordmark logo only (loaded locally, OFL). Single weight (400).
const philosopher = localFont({
  variable: "--font-philosopher",
  src: [{ path: "./fonts/Philosopher-Regular.ttf", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Taygerian — Fine Jewellery (working prototype)",
  description:
    "Storefront prototype for Taygerian — Ceylon-provenance fine jewellery. Mock data, not a live store.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${philosopher.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-porcelain text-ink font-sans antialiased">
        <CartProvider>
          <MediaProtection />
          <SiteChrome>
            <Header />
          </SiteChrome>
          <main className="flex-1">{children}</main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
