import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import { MediaProtection } from "@/components/MediaProtection";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Ceylon sapphire",
    "Sri Lanka fine jewellery",
    "sapphire ring",
    "coloured gemstones",
    "bespoke jewellery",
    "certified gemstones",
    "handmade jewellery Sri Lanka",
    "sapphire jewellery Australia",
    "Ceylon sapphire UK",
    "fine jewellery Japan",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${philosopher.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-porcelain text-ink font-sans antialiased">
        <SiteJsonLd />
        <CartProvider>
          <MediaProtection />
          <SiteChrome>
            <Header />
          </SiteChrome>
          <main className="flex-1">{children}</main>
          <SiteChrome>
            <Footer />
          </SiteChrome>
          <SiteChrome>
            <CookieConsent />
          </SiteChrome>
          <SiteChrome>
            <Analytics />
          </SiteChrome>
        </CartProvider>
      </body>
    </html>
  );
}
