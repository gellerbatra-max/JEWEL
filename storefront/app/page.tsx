import Link from "next/link";
import { FacetMark } from "@/components/FacetMark";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCollection } from "@/lib/products";

export default function Home() {
  const signature = getProductsByCollection("ceylon-signature");

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
        <FacetMark size={40} className="text-gold mx-auto mb-8" />
        <p className="text-[11px] tracking-[0.18em] uppercase text-gold mb-5">
          Mine to Masterpiece, Verified
        </p>
        <h1 className="font-display text-4xl sm:text-5xl max-w-2xl mx-auto leading-tight text-balance">
          Ceylon sapphires, sourced and cut in-house — certified, not just claimed.
        </h1>
        <p className="max-w-xl mx-auto mt-6 text-ivory-dim">
          Working prototype storefront for Cassian. Gold, silver, and platinum, set with
          lab-verified Ceylon gemstones — every signature piece ships with an origin report.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <Link
            href="/collections/ceylon-signature"
            className="rounded-sm bg-ivory text-ink px-6 py-3 text-[13px] tracking-[0.08em] uppercase hover:bg-gold transition-colors"
          >
            Discover Ceylon Signature
          </Link>
          <Link
            href="/our-story"
            className="rounded-sm border border-line px-6 py-3 text-[13px] tracking-[0.08em] uppercase text-ivory-dim hover:text-ivory hover:border-gold/60 transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl">Ceylon Signature</h2>
          <Link href="/collections/ceylon-signature" className="text-[12px] uppercase tracking-[0.06em] text-sapphire hover:text-ivory transition-colors">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {signature.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 grid sm:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-gold mb-4">The Differentiator</p>
            <h2 className="font-display text-2xl mb-4 text-balance">
              No house buying on the open market can claim what we can.
            </h2>
            <p className="text-ivory-dim">
              Cartier, Bulgari, and Van Cleef &amp; Arpels buy colored stones from dealers. We own the
              relationship with Ratnapura miners and in-house cutters — every signature piece carries
              a lab origin report, not just a provenance story.
            </p>
          </div>
          <div className="rounded-sm border border-line bg-panel p-8">
            <dl className="grid grid-cols-2 gap-6 text-center">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.06em] text-ivory-dim">Origin premium</dt>
                <dd className="font-display text-3xl text-gold mt-2">20–50%</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.06em] text-ivory-dim">Cert on every piece</dt>
                <dd className="font-display text-3xl text-gold mt-2">GIA / GRS</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
