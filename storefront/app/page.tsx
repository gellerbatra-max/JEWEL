import Link from "next/link";
import { FacetMark } from "@/components/FacetMark";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCollection } from "@/lib/products";

export default function Home() {
  const signature = getProductsByCollection("ceylon-signature");

  return (
    <div>
      {/* Hero — airy, light, editorial */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-center">
        <FacetMark size={34} className="text-gold mx-auto mb-8" />
        <p className="font-sans text-[11px] tracking-[0.24em] uppercase text-gold mb-6">
          Mine to Masterpiece, Verified
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-balance text-ink">
          Ceylon sapphires, sourced and cut in-house.
        </h1>
        <p className="max-w-xl mx-auto mt-7 text-lg text-stone leading-relaxed">
          Certified, not just claimed. Gold, silver, and platinum set with lab-verified
          Ceylon gemstones — every signature piece ships with its own origin report.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/collections/ceylon-signature"
            className="bg-ink text-porcelain px-8 py-3.5 font-sans text-[12px] tracking-[0.16em] uppercase hover:bg-gold transition-colors"
          >
            Discover the Collection
          </Link>
        </div>
      </section>

      {/* Hairline-framed signature grid */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
        <div className="text-center mb-10">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Ceylon Signature</p>
          <h2 className="font-display text-3xl text-ink">The house sapphires</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {signature.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/collections/ceylon-signature"
            className="font-sans text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            View all Ceylon Signature
          </Link>
        </div>
      </section>

      {/* Differentiator — editorial band */}
      <section className="mt-24 border-y border-line bg-cloud">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-5">The Difference</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight text-balance text-ink">
            No house buying on the open market can claim what we can.
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-stone leading-relaxed">
            Cartier, Bulgari, and Van Cleef &amp; Arpels buy their colored stones from dealers.
            We own the relationship with the Ratnapura miners and our in-house cutters — so every
            signature piece carries a lab origin report, not just a provenance story.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-10 max-w-md mx-auto">
            <div>
              <p className="font-display text-4xl text-gold">20–50%</p>
              <p className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone mt-2">
                Ceylon origin premium
              </p>
            </div>
            <div>
              <p className="font-display text-4xl text-gold">GIA · GRS</p>
              <p className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone mt-2">
                Certified on every piece
              </p>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/our-story"
              className="font-sans text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
