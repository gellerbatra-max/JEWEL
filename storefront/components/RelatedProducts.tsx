import type { Product } from "@/lib/products";
import { getAllProducts } from "@/lib/catalog-store";
import { ProductCard } from "./ProductCard";

// "You may also like" — suggests similar pieces by shared collection, stone, and
// metal, filling to four with other pieces so the row is never sparse. No login
// needed; it's pure catalogue similarity.
export async function RelatedProducts({ product }: { product: Product }) {
  const all = await getAllProducts();
  const others = all.filter((p) => p.id !== product.id);

  const score = (p: Product) =>
    (p.collectionHandle === product.collectionHandle ? 2 : 0) +
    (p.stone !== "—" && p.stone === product.stone ? 2 : 0) +
    (p.metal !== "—" && p.metal === product.metal ? 1 : 0);

  const ranked = others
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  const picked = ranked.slice(0, 4);
  if (picked.length < 4) {
    const have = new Set(picked.map((p) => p.id));
    for (const p of others) {
      if (picked.length >= 4) break;
      if (!have.has(p.id)) picked.push(p);
    }
  }
  if (picked.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-6 pb-20">
      <div className="mb-8 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold">You may also like</p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Pieces in the same spirit</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {picked.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
