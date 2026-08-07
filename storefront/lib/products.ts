import { products as catalogProducts } from "./catalog-data";

export type Certification = {
  lab: "GIA" | "GRS" | "AGL";
  reportNumber: string;
  origin: string;
};

export type CollectionHandle =
  | "rings"
  | "necklaces"
  | "pendants"
  | "earrings"
  | "bracelets"
  | "bangles";

export type Product = {
  id: string;
  handle: string;
  title: string;
  sku: string;
  collectionHandle: CollectionHandle;
  metal: string;
  stone: string;
  price: number;
  currency: string;
  oneOfAKind: boolean;
  certification?: Certification | null;
  description: string;
  swatch: string;
  image: string;
  images: string[];
  isRing: boolean;
};

// US ring sizes offered. Made-to-order sizing available on request.
export const RING_SIZES = [
  "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9",
];

export type Collection = {
  handle: CollectionHandle;
  title: string;
  description: string;
};

export const collections: Collection[] = [
  {
    handle: "rings",
    title: "Rings",
    description:
      "Solitaires, cocktail rings, and bands — set with Ceylon sapphires and coloured gemstones, hand-finished in our atelier.",
  },
  {
    handle: "necklaces",
    title: "Necklaces",
    description: "Statement and everyday necklaces in gold, rose gold, and white gold.",
  },
  {
    handle: "pendants",
    title: "Pendants",
    description: "Single-stone and motif pendants, suspended on fine chains.",
  },
  {
    handle: "earrings",
    title: "Earrings",
    description: "Drops, hoops, and studs, matched for colour and cut.",
  },
  {
    handle: "bracelets",
    title: "Bracelets",
    description: "Line bracelets and charm designs to layer or wear alone.",
  },
  {
    handle: "bangles",
    title: "Bangles",
    description: "Sculptural bangles and cuffs, in gold and mixed metals.",
  },
];

export const products: Product[] = catalogProducts;

export function getProduct(handle: string) {
  return products.find((p) => p.handle === handle);
}

export function getCollection(handle: string) {
  return collections.find((c) => c.handle === handle);
}

export function getProductsByCollection(handle: string) {
  return products.filter((p) => p.collectionHandle === handle);
}

// A curated spread across categories for the homepage.
export function getFeatured(count = 8) {
  const out: Product[] = [];
  const byCat = collections.map((c) => getProductsByCollection(c.handle));
  let round = 0;
  while (out.length < count && round < 12) {
    for (const list of byCat) {
      if (list[round]) out.push(list[round]);
      if (out.length >= count) break;
    }
    round++;
  }
  return out;
}

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
