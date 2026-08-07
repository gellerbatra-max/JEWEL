import type { ReactNode } from "react";
import type { Product } from "@/lib/products";

function Row({ icon, title, children, open }: { icon: ReactNode; title: string; children: ReactNode; open?: boolean }) {
  return (
    <details name="pdp" open={open} className="group border-b border-line">
      <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3">
          <span className="text-gold">{icon}</span>
          <span className="text-[13px] tracking-[0.06em] uppercase text-ink">{title}</span>
        </span>
        {/* plus that becomes a minus when open */}
        <span className="relative h-3 w-3 shrink-0 text-stone">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-opacity group-open:opacity-0" />
        </span>
      </summary>
      <div className="pb-5 pr-8 text-[15px] text-stone leading-relaxed">{children}</div>
    </details>
  );
}

const IconDoc = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M6 3h9l3 3v15H6z" /><path d="M9 9h6M9 13h6M9 17h4" />
  </svg>
);
const IconBox = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M3 8l9-4 9 4-9 4-9-4z" /><path d="M3 8v8l9 4 9-4V8" /><path d="M12 12v8" />
  </svg>
);
const IconHeart = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
  </svg>
);
const IconShip = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
  </svg>
);
const IconRuler = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M4 8l12-4 4 12-12 4z" /><path d="M8 8.5l1 2M11 7.5l1.5 3M14 6.5l1 2" />
  </svg>
);

export function ProductAccordion({ product }: { product: Product }) {
  const finalSale = product.oneOfAKind || product.collectionHandle === "bridal";

  return (
    <div className="mt-8" id="size-fit">
      <div className="border-t border-line">
        <Row icon={IconDoc} title="Description" open>
          {product.description}
        </Row>

        {product.isRing && (
          <Row icon={IconRuler} title="Size & Fit">
            Sizes shown are US ring sizes. Every ring is made to your chosen size, and we offer one
            complimentary resizing within the first year on catalogue pieces. Unsure of your size?
            Book a video consultation and we&rsquo;ll measure you together, or use our printable guide.
            One-of-a-kind pieces are hand-finished to your exact size to order.
            <a
              href="/taygerian-ring-size-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[12px] tracking-[0.08em] uppercase text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
            >
              {IconRuler}
              Download Ring Size Guide (PDF)
            </a>
          </Row>
        )}

        <Row icon={IconBox} title="The Taygerian Box">
          Every piece arrives in the Taygerian presentation box — a lacquered case bearing the house
          facet seal — accompanied by its lab origin report and a certificate of authenticity.
        </Row>

        <Row icon={IconHeart} title="Jewellery Care">
          Store each piece separately in its pouch, away from other jewellery. Avoid contact with
          perfume, lotion, and water, and remove before swimming or sleeping. Clean gently with a
          soft, dry cloth. We offer complimentary professional cleaning and prong inspection for the
          life of the piece.
        </Row>

        <Row icon={IconShip} title="Shipping & Returns">
          Complimentary insured, signature-required shipping worldwide, fully covered in transit.
          {finalSale
            ? " As a one-of-a-kind or made-to-order piece, this item is final sale."
            : " Catalogue pieces may be returned within 30 days in original, unworn condition with all documentation."}
        </Row>
      </div>

      <p className="mt-6 text-[14px] text-stone leading-relaxed">
        Our jewellery is handcrafted, so slight variations from the photographs are natural — part
        of what makes each piece uniquely yours.
      </p>
    </div>
  );
}
