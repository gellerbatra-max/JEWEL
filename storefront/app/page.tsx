import Link from "next/link";
import Image from "next/image";
import { FacetMark } from "@/components/FacetMark";
import { ProductCard } from "@/components/ProductCard";
import { getFeatured } from "@/lib/products";

export default function Home() {
  const signature = getFeatured(4);

  return (
    <div>
      {/* Split hero — editorial text beside a dramatic sapphire image */}
      <section className="grid md:grid-cols-2 min-h-[74vh]">
        <div className="flex items-center justify-center order-2 md:order-1 px-6 py-16">
          <div className="max-w-md text-center md:text-left">
            <FacetMark size={30} className="text-gold mb-7 mx-auto md:mx-0" />
            <p className="text-[11px] tracking-[0.24em] uppercase text-gold mb-6">
              Mine to Masterpiece, Verified
            </p>
            <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] text-balance text-ink">
              Ceylon Sapphires, Sourced and Cut In-House
            </h1>
            <p className="mt-6 text-lg text-stone leading-relaxed">
              Certified, not just claimed. Gold, silver, and platinum set with lab-verified
              Ceylon gemstones — every signature piece ships with its own origin report.
            </p>
            <div className="mt-9">
              <Link
                href="/jewellery"
                className="inline-block bg-ink text-porcelain px-8 py-3.5 text-[12px] tracking-[0.16em] uppercase hover:bg-gold transition-colors"
              >
                Explore the Jewellery
              </Link>
            </div>
          </div>
        </div>
        <div className="relative order-1 md:order-2 min-h-[52vh] md:min-h-0 bg-porcelain">
          <Image
            src="/images/hero-ring.jpg"
            alt="Ceylon ruby and diamond ring"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Signature grid */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-3">The House</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Signature Pieces</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {signature.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/jewellery"
            className="text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
          >
            Explore all jewellery
          </Link>
        </div>
      </section>

      {/* Differentiator — split editorial band with image */}
      <section className="mt-24 border-y border-line grid md:grid-cols-2">
        <div className="relative min-h-[52vh]">
          <Image
            src="/images/editorial-provenance.jpg"
            alt="A Ceylon sapphire ring, worn"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center bg-cloud px-6 py-20">
          <div className="max-w-md mx-auto">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-5">The Difference</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight text-balance text-ink">
              No House Buying on the Open Market Can Claim What We Can
            </h2>
            <p className="mt-6 text-lg text-stone leading-relaxed">
              Cartier, Bulgari, and Van Cleef &amp; Arpels buy their colored stones from dealers.
              We own the relationship with the Ratnapura miners and our in-house cutters — so every
              signature piece carries a lab origin report, not just a provenance story.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <p className="font-display text-4xl text-gold">20–50%</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-stone mt-2">
                  Ceylon origin premium
                </p>
              </div>
              <div>
                <p className="font-display text-4xl text-gold">GIA · GRS</p>
                <p className="text-[11px] tracking-[0.08em] uppercase text-stone mt-2">
                  Certified on signature pieces
                </p>
              </div>
            </div>
            <div className="mt-10">
              <Link
                href="/our-story"
                className="text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
              >
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
