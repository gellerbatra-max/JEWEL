// Pure, client-safe catalog types + constants + formatting helpers.
//
// This module must stay free of any Node/filesystem code so it can be imported
// from client components (ProductCard, PurchasePanel, cart) without bloating the
// browser bundle. All product DATA (reads + owner edits) lives in the
// server-only store at ./catalog-store.ts.

import type { ProductSections } from "./product-sections";

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
  // Owner-controlled home-page placement (set from the Manage dashboard).
  // showOnHome = appears in the "Signature Pieces" section; homeOrder sorts them.
  showOnHome?: boolean;
  homeOrder?: number;
  // Per-item overrides for the product-page accordion sections. Any section left
  // unset falls back to the shared house default (see ./product-sections.ts).
  sections?: ProductSections;
};

// Maximum number of pieces that can be featured in the home "Signature Pieces"
// carousel at once.
export const MAX_SIGNATURE = 20;

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

export function getCollection(handle: string) {
  return collections.find((c) => c.handle === handle);
}

export function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    // Defensive: an invalid currency code would otherwise throw a RangeError and
    // crash every page that renders this price.
    return `${currency} ${Math.round(price).toLocaleString("en-US")}`;
  }
}
