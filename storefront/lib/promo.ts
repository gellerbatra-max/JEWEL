// Client-safe types for owner-managed promotional banners shown on the home
// page (e.g. "Follow us & win a gift voucher"). Store lives in ./promo-store.ts.

export type PromoBanner = {
  id: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  href: string; // where the CTA / banner links (internal path or full URL)
  image: string; // optional background image
  createdAt: string;
};
