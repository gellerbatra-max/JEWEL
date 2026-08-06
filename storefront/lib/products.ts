export type Certification = {
  lab: "GIA" | "GRS" | "AGL";
  reportNumber: string;
  origin: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  collectionHandle: "ceylon-signature" | "fine-jewellery" | "bridal";
  metal: string;
  stone: string;
  price: number;
  currency: string;
  oneOfAKind: boolean;
  certification?: Certification;
  description: string;
  swatch: string;
  image: string;
  isRing: boolean;
};

// US ring sizes offered. Made-to-order sizing available on request.
export const RING_SIZES = [
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
];

export type Collection = {
  handle: Product["collectionHandle"];
  title: string;
  description: string;
};

export const collections: Collection[] = [
  {
    handle: "ceylon-signature",
    title: "Ceylon Signature",
    description:
      "Lab-verified Ceylon sapphires, sourced and cut in-house. Every piece ships with an origin report and a house provenance mark.",
  },
  {
    handle: "fine-jewellery",
    title: "Fine Jewellery",
    description:
      "Everyday gold, silver, and platinum pieces, catalog-priced and ready to ship.",
  },
  {
    handle: "bridal",
    title: "Bridal",
    description: "Engagement and wedding pieces, made to order or from stock.",
  },
];

// Mock catalog — shaped to make a future Shopify Storefront API swap
// straightforward (handle/title/price/images map near 1:1).
export const products: Product[] = [
  {
    id: "cs-1042",
    handle: "cornflower-solitaire-ring",
    title: "Cornflower Solitaire Ring",
    collectionHandle: "ceylon-signature",
    metal: "Platinum",
    stone: "2.14ct Ceylon Sapphire",
    price: 18400,
    currency: "USD",
    oneOfAKind: true,
    certification: { lab: "GIA", reportNumber: "GIA-2241897733", origin: "Ceylon (Sri Lanka)" },
    description:
      "A single cornflower-blue Ratnapura sapphire set in a hand-forged platinum band. Cut and set entirely in-house.",
    swatch: "#3B5A8C",
    image: "/images/cornflower-solitaire-ring.jpg",
    isRing: true,
  },
  {
    id: "cs-1043",
    handle: "ratnapura-drop-earrings",
    title: "Ratnapura Drop Earrings",
    collectionHandle: "ceylon-signature",
    metal: "18k Yellow Gold",
    stone: "Paired Ceylon Sapphires, 3.2ct total",
    price: 9800,
    currency: "USD",
    oneOfAKind: true,
    certification: { lab: "GRS", reportNumber: "GRS2026-084471", origin: "Ceylon (Sri Lanka)" },
    description:
      "A matched pair, hand-selected for color consistency — a rare match outside a private collection.",
    swatch: "#4A6DA8",
    image: "/images/ratnapura-drop-earrings.jpg",
    isRing: false,
  },
  {
    id: "fj-2210",
    handle: "facet-band-gold",
    title: "Facet Band",
    collectionHandle: "fine-jewellery",
    metal: "18k Gold",
    stone: "—",
    price: 1450,
    currency: "USD",
    oneOfAKind: false,
    description: "A step-cut faceted band, the house's signature line, in three widths.",
    swatch: "#C6A54D",
    image: "/images/facet-band-gold.jpg",
    isRing: true,
  },
  {
    id: "fj-2211",
    handle: "facet-band-silver",
    title: "Facet Band, Silver",
    collectionHandle: "fine-jewellery",
    metal: "Sterling Silver",
    stone: "—",
    price: 320,
    currency: "USD",
    oneOfAKind: false,
    description: "The entry point into the house's signature facet line.",
    swatch: "#9AA3AD",
    image: "/images/facet-band-silver.jpg",
    isRing: true,
  },
  {
    id: "br-3301",
    handle: "vow-solitaire",
    title: "Vow Solitaire",
    collectionHandle: "bridal",
    metal: "Platinum",
    stone: "1.5ct Ceylon White Sapphire",
    price: 12600,
    currency: "USD",
    oneOfAKind: false,
    certification: { lab: "GIA", reportNumber: "GIA-6601883321", origin: "Ceylon (Sri Lanka)" },
    description: "Made to order, 3–4 week lead time. Ceylon white sapphire in place of a diamond, by request.",
    swatch: "#E7E3D8",
    image: "/images/vow-solitaire.jpg",
    isRing: true,
  },
  {
    id: "br-3302",
    handle: "vow-band-pair",
    title: "Vow Band Pair",
    collectionHandle: "bridal",
    metal: "18k Gold / Platinum",
    stone: "Pavé accent, optional",
    price: 2900,
    currency: "USD",
    oneOfAKind: false,
    description: "A matched pair of wedding bands, sized to order.",
    swatch: "#B98F3E",
    image: "/images/vow-band-pair.jpg",
    isRing: true,
  },
];

export function getProduct(handle: string) {
  return products.find((p) => p.handle === handle);
}

export function getCollection(handle: string) {
  return collections.find((c) => c.handle === handle);
}

export function getProductsByCollection(handle: string) {
  return products.filter((p) => p.collectionHandle === handle);
}

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
