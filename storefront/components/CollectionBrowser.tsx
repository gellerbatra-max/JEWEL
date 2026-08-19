"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const selectCls =
  "border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-gold";

// Filter + sort for a collection. All client-side over the already-loaded items,
// so it's instant. Options are derived from the pieces actually present.
export function CollectionBrowser({ items }: { items: Product[] }) {
  const metals = useMemo(
    () => [...new Set(items.map((p) => p.metal).filter((m) => m && m !== "—"))].sort(),
    [items]
  );
  const stones = useMemo(
    () => [...new Set(items.map((p) => p.stone).filter((s) => s && s !== "—"))].sort(),
    [items]
  );
  const colours = useMemo(
    () => [...new Set(items.map((p) => p.colour).filter((c): c is string => !!c))].sort(),
    [items]
  );

  const [metal, setMetal] = useState("");
  const [stone, setStone] = useState("");
  const [colour, setColour] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    let list = items.filter(
      (p) =>
        (!metal || p.metal === metal) &&
        (!stone || p.stone === stone) &&
        (!colour || p.colour === colour)
    );
    const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
      // one-of-a-kind (price on request) always sinks to the bottom
      if (a.oneOfAKind !== b.oneOfAKind) return a.oneOfAKind ? 1 : -1;
      return (a.price - b.price) * dir;
    };
    if (sort === "price-asc") list = [...list].sort(byPrice(1));
    else if (sort === "price-desc") list = [...list].sort(byPrice(-1));
    else if (sort === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [items, metal, stone, colour, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-3">
        <p className="text-[12px] tracking-[0.12em] uppercase text-stone">
          {shown.length} {shown.length === 1 ? "piece" : "pieces"}
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          {metals.length > 1 && (
            <select
              aria-label="Filter by metal"
              value={metal}
              onChange={(e) => setMetal(e.target.value)}
              className={selectCls}
            >
              <option value="">All metals</option>
              {metals.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}
          {stones.length > 1 && (
            <select
              aria-label="Filter by stone"
              value={stone}
              onChange={(e) => setStone(e.target.value)}
              className={selectCls}
            >
              <option value="">All stones</option>
              {stones.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          {colours.length > 1 && (
            <select
              aria-label="Filter by colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className={selectCls}
            >
              <option value="">All colours</option>
              {colours.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <select
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={selectCls}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-stone">
          No pieces match those filters.{" "}
          <button
            type="button"
            onClick={() => {
              setMetal("");
              setStone("");
              setColour("");
            }}
            className="text-gold underline underline-offset-2"
          >
            Clear filters
          </button>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
