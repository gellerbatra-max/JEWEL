import { getAllProducts } from "@/lib/catalog-store";
import { getCollection, MAX_SIGNATURE } from "@/lib/products";
import { getBespokeImages, getBridalImages } from "@/lib/site-config-store";
import { HomeSelectGrid } from "@/app/admin/HomeSelectGrid";
import { SectionImagesManager } from "@/app/admin/SectionImagesManager";
import { saveBespokeImagesAction, saveBridalImagesAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, bespoke, bridal] = await Promise.all([
    getAllProducts(),
    getBespokeImages(),
    getBridalImages(),
  ]);
  const catalog = products
    .filter((p) => p.image)
    .map((p) => ({ title: p.title, image: p.image }))
    .sort((a, b) => a.title.localeCompare(b.title));
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
    <div className="space-y-14">
      <div>
        <h1 className="font-display text-3xl text-ink">Home page</h1>
        <p className="mt-1 text-sm text-stone">Manage what appears on your home page.</p>
      </div>

      {/* Made to Order rotating photos */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">“Made to Order” photos</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          Up to 5 photos that rotate automatically in the{" "}
          <strong className="text-ink">“Dare to Challenge Us?”</strong> section. Leave empty to use
          the default image.
        </p>
        <SectionImagesManager initial={bespoke} catalog={catalog} action={saveBespokeImagesAction} />
      </section>

      {/* Craftsmanship rotating photos */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">“Craftsmanship” photos</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          Up to 5 photos that rotate automatically in the{" "}
          <strong className="text-ink">“The Only One in the Universe”</strong> section. Leave empty
          to use the default image.
        </p>
        <SectionImagesManager initial={bridal} catalog={catalog} action={saveBridalImagesAction} />
      </section>

      {/* Signature Pieces selection */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">Signature Pieces</h2>
        <p className="mb-6 max-w-2xl text-sm text-stone">
          Tap any piece to feature it in the carousel on the home page — up to {MAX_SIGNATURE}.
          Selected pieces show a gold check and move to the top.
        </p>
        <HomeSelectGrid items={items} />
      </section>
    </div>
  );
}
