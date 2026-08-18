// Pure, client-safe. The "common structure" copy for the product-page accordion
// sections, plus a helper to resolve per-item overrides.
//
// Each product may override any section (stored in Product.sections). When no
// override is set, the shared default below is shown — so every piece has a
// sensible page out of the box, and the owner can amend any section per item.

export type SectionKey = "sizeAndFit" | "box" | "care" | "shipping";
export type ProductSections = Partial<Record<SectionKey, string>>;

type Ctx = { oneOfAKind: boolean };

export type SectionDef = {
  key: SectionKey;
  title: string;
  onlyRings?: boolean;
  defaultText: (ctx: Ctx) => string;
};

export const SECTION_DEFS: SectionDef[] = [
  {
    key: "sizeAndFit",
    title: "Size & Fit",
    onlyRings: true,
    defaultText: () =>
      "Sizes shown are US ring sizes. Every ring is made to your chosen size, and we offer one complimentary resizing within the first year on catalogue pieces. Unsure of your size? Book a video consultation and we’ll measure you together, or use our printable guide. One-of-a-kind pieces are hand-finished to your exact size to order.",
  },
  {
    key: "box",
    title: "The Taygerian Box",
    defaultText: () =>
      "Every piece arrives in the Taygerian presentation box — a lacquered case bearing the house facet seal — accompanied by its lab origin report and a certificate of authenticity.",
  },
  {
    key: "care",
    title: "Jewellery Care",
    defaultText: () =>
      "Store each piece separately in its pouch, away from other jewellery. Avoid contact with perfume, lotion, and water, and remove before swimming or sleeping. Clean gently with a soft, dry cloth. We offer complimentary professional cleaning and prong inspection for the life of the piece.\n\nMetal: Use a soft cloth to gently wipe clean, then remove any remaining impurities with mild diluted soap. Rinse with warm water and dry thoroughly before storing in the jewellery pouch. Do not use abrasive cleaners or steamers.\n\nGemstone: Use a soft cloth to gently wipe clean, then remove any remaining impurities with mild diluted soap and a soft bristled toothbrush. Rinse with warm water and dry thoroughly before storing in the jewellery pouch.",
  },
  {
    key: "shipping",
    title: "Shipping & Returns",
    defaultText: (ctx) =>
      "Complimentary insured, signature-required shipping worldwide, fully covered in transit." +
      (ctx.oneOfAKind
        ? " As a one-of-a-kind or made-to-order piece, this item is final sale."
        : " Catalogue pieces may be returned within 30 days in original, unworn condition with all documentation."),
  },
];

// The effective text for a section: the owner's override if set, else the
// shared default.
export function sectionText(
  product: { oneOfAKind: boolean; sections?: ProductSections },
  key: SectionKey
): string {
  const override = product.sections?.[key];
  if (override && override.trim()) return override;
  const def = SECTION_DEFS.find((s) => s.key === key);
  return def ? def.defaultText({ oneOfAKind: product.oneOfAKind }) : "";
}

// True when the owner has customised this section for this product.
export function hasOverride(sections: ProductSections | undefined, key: SectionKey): boolean {
  const v = sections?.[key];
  return Boolean(v && v.trim());
}
