import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/catalog-store";
import { getCollection } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.q;
  const q = (typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "").trim();

  const all = await getAllProducts();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = q
    ? all.filter((p) => {
        const hay = [
          p.title,
          p.metal,
          p.stone,
          getCollection(p.collectionHandle)?.title ?? p.collectionHandle,
          p.description,
        ]
          .join(" ")
          .toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
    : [];

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-16">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <p className="mb-4 text-[11px] tracking-[0.2em] uppercase text-gold">Search</p>
        <h1 className="mb-6 font-display text-4xl text-ink">Find your piece</h1>
        <SearchBox initial={q} />
      </div>

      {q === "" ? (
        <p className="text-center text-stone">
          Search by name, gemstone, or metal — or{" "}
          <Link href="/jewellery" className="text-gold underline underline-offset-2">
            browse the collection
          </Link>
          .
        </p>
      ) : results.length === 0 ? (
        <div className="text-center">
          <p className="text-ink">No pieces match &ldquo;{q}&rdquo;.</p>
          <p className="mt-2 text-[15px] text-stone">
            Try a different word, or{" "}
            <Link href="/contact" className="text-gold underline underline-offset-2">
              ask us
            </Link>{" "}
            — we may have it, or can make it.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-8 text-center text-[13px] uppercase tracking-[0.12em] text-stone">
            {results.length} {results.length === 1 ? "piece" : "pieces"} for &ldquo;{q}&rdquo;
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
