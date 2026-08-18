import { collections } from "@/lib/products";
import { getAllProducts } from "@/lib/catalog-store";
import { getCategoryCovers } from "@/lib/site-config-store";
import { CategoryCoverPicker } from "@/app/admin/CategoryCoverPicker";

export const dynamic = "force-dynamic";

export default async function CategoryImagesPage() {
  const [all, covers] = await Promise.all([getAllProducts(), getCategoryCovers()]);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl text-ink">Category images</h1>
      <p className="mb-8 text-sm text-stone">
        Choose which piece’s photo represents each category on the Jewellery page. Click a photo to
        set it as the cover.
      </p>

      <div className="space-y-12">
        {collections.map((c) => {
          const items = all
            .filter((p) => p.collectionHandle === c.handle)
            .map((p) => ({ id: p.id, title: p.title, image: p.image }))
            .filter((p) => p.image);

          return (
            <section key={c.handle}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-xl text-ink">{c.title}</h2>
                <span className="text-[12px] text-stone">
                  {items.length} {items.length === 1 ? "piece" : "pieces"}
                </span>
              </div>
              {items.length > 0 ? (
                <CategoryCoverPicker
                  handle={c.handle}
                  items={items}
                  initialCoverId={covers[c.handle] ?? ""}
                />
              ) : (
                <p className="text-sm text-stone">No pieces in this category yet.</p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
