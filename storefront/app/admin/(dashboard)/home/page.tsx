import { getAllProducts } from "@/lib/catalog-store";
import { getCollection, MAX_SIGNATURE } from "@/lib/products";
import { HomeSelectGrid } from "@/app/admin/HomeSelectGrid";

export const dynamic = "force-dynamic";

export default async function HomePiecesPage() {
  const products = await getAllProducts();
  const items = products
    .slice()
    .sort(
      (a, b) =>
        Number(b.showOnHome ?? false) - Number(a.showOnHome ?? false) ||
        a.title.localeCompare(b.title)
    )
    .map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image,
      category: getCollection(p.collectionHandle)?.title ?? p.collectionHandle,
      showOnHome: !!p.showOnHome,
    }));

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl text-ink">Home-page pieces</h1>
      <p className="mb-6 max-w-2xl text-sm text-stone">
        Tap any piece to feature it in the <strong className="text-ink">Signature Pieces</strong>{" "}
        carousel on the home page — up to {MAX_SIGNATURE}. Selected pieces show a gold check and move
        to the top.
      </p>
      <HomeSelectGrid items={items} />
    </div>
  );
}
