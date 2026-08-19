import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/products";
import { getAllProducts } from "@/lib/catalog-store";
import { getCategoryCovers } from "@/lib/site-config-store";

export const metadata: Metadata = {
  title: "Jewellery — Taygerian",
  description: "Explore Taygerian jewellery by category: rings, necklaces, pendants, earrings, bracelets, and bangles.",
};

// Static: this only changes when the owner edits pieces/covers, and every admin
// write calls revalidatePath("/", "layout"), which refreshes it on demand — no
// need to re-render (and re-read the store) on every visitor request.

export default async function JewelleryPage() {
  const [all, covers] = await Promise.all([getAllProducts(), getCategoryCovers()]);
  // Representative image + count per category. The owner picks the cover piece
  // per category in Manage; if unset, fall back to the first piece.
  const categoryMeta = (handle: string) => {
    const items = all.filter((p) => p.collectionHandle === handle);
    const chosenId = covers[handle as keyof typeof covers];
    const chosen = chosenId ? items.find((p) => p.id === chosenId) : undefined;
    return {
      image: chosen?.image ?? items[0]?.image ?? "/images/hero-sapphire.jpg",
      count: items.length,
    };
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">The Collections</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4">Jewellery</h1>
        <p className="text-lg text-stone leading-relaxed">
          Gold, silver, and platinum set with lab-verified Ceylon gemstones. Choose a category to
          explore the pieces within.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const { image, count } = categoryMeta(c.handle);
          return (
            <Link
              key={c.handle}
              href={`/collections/${c.handle}`}
              className="group block p-3 border border-transparent hover:border-line hover:bg-porcelain hover:shadow-[0_20px_46px_-28px_rgba(28,27,25,0.45)] hover:-translate-y-0.5 transition-all duration-300 ease-out"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
                <Image
                  src={image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
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
