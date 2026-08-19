// Small, client-safe site-wide constants. No Node/fs imports — safe anywhere.

// Public site origin, used for canonical URLs, sitemap, and share (OG) images.
// Set NEXT_PUBLIC_SITE_URL in the environment for production; the fallback keeps
// dev + the prototype working. No trailing slash.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.taygerian.com"
).replace(/\/$/, "");

export const SITE_NAME = "Taygerian";
export const SITE_TAGLINE = "Ceylon-provenance fine jewellery";
export const SITE_DESCRIPTION =
  "Taygerian — fine jewellery set with certified Ceylon (Sri Lankan) sapphires and coloured gemstones, handcrafted by our own goldsmiths in southern Sri Lanka in a family tradition spanning generations. Made to order, shipped insured to Sri Lanka, Australia, Europe, the UK and Japan.";

// Contact + atelier details. Placeholders — replace with the real ones before
// launch. Kept here so every page (footer, contact, structured data) stays in sync.
export const CONTACT = {
  email: "hello@taygerian.com",
  whatsapp: "94712280818", // digits only, international format
  phoneDisplay: "+94 71 228 0818",
  city: "Colombo, Sri Lanka",
  hours: "Mon–Sat · 10am – 6pm",
};

export const SOCIAL = {
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  x: "https://x.com/",
  tiktok: "https://tiktok.com/",
  youtube: "https://youtube.com/",
};

export const waLink = (text: string) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
