import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { collections, getProductsByCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Jewellery — Taygerian",
  description: "Explore Taygerian jewellery by category: rings, necklaces, pendants, earrings, bracelets, and bangles.",
};

// Representative image + count per category.
function categoryMeta(handle: string) {
  const items = getProductsByCollection(handle);
  return { image: items[0]?.image ?? "/images/hero-sapphire.jpg", count: items.length };
}

export default function JewelleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">The Collections</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4">Jewellery</h1>
        <p className="text-lg text-stone leading-relaxed">
          Gold, silver, and platinum set with lab-verified Ceylon gemstones. Choose a category to
          explore the pieces within.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((c) => {
          const { image, count } = categoryMeta(c.handle);
          return (
            <Link key={c.handle} href={`/collections/${c.handle}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
                <Image
                  src={image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              {/* Label below the image, in ink — clean and always legible. */}
              <div className="mt-4 text-center">
                <h2 className="font-display text-2xl text-ink tracking-[0.06em] group-hover:text-gold transition-colors">
                  {c.title}
                </h2>
                <span className="block mt-1 text-[11px] tracking-[0.14em] uppercase text-stone">
                  {count} {count === 1 ? "piece" : "pieces"}
                </span>
                <p className="mt-2 text-[13px] text-stone">{c.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
