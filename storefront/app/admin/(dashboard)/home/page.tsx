import { getAllProducts } from "@/lib/catalog-store";
import { getCollection, MAX_SIGNATURE } from "@/lib/products";
import {
  getBespokeImages,
  getBridalImages,
  getInstagramImages,
  getPressItems,
} from "@/lib/site-config-store";
import { getUgcPosts } from "@/lib/ugc-store";
import { getPromoBanners } from "@/lib/promo-store";
import { HomeSelectGrid } from "@/app/admin/HomeSelectGrid";
import { SectionImagesManager } from "@/app/admin/SectionImagesManager";
import { PressManager } from "@/app/admin/PressManager";
import { UgcManager } from "@/app/admin/UgcManager";
import { PromoManager } from "@/app/admin/PromoManager";
import {
  saveBespokeImagesAction,
  saveBridalImagesAction,
  saveInstagramImagesAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, bespoke, bridal, instagram, press, ugcPosts, promos] = await Promise.all([
    getAllProducts(),
    getBespokeImages(),
    getBridalImages(),
    getInstagramImages(),
    getPressItems(),
    getUgcPosts(),
    getPromoBanners(),
  ]);
  const titleByHandle = new Map(products.map((p) => [p.handle, p.title]));
  const ugcRows = ugcPosts.map((p) => ({
    id: p.id,
    media: p.media,
    name: p.name,
    productTitle: titleByHandle.get(p.productHandle) ?? "(removed piece)",
  }));
  const prodOptions = products
    .map((p) => ({ handle: p.handle, title: p.title }))
    .sort((a, b) => a.title.localeCompare(b.title));
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

      {/* Promotional banners */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">Promotional banners</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          Banners shown <strong className="text-ink">above Signature Pieces</strong> — offers,
          competitions, announcements (e.g. &ldquo;Follow us &amp; win a gift voucher&rdquo;). Add
          several and they rotate. Hidden until you add one.
        </p>
        <PromoManager banners={promos} />
      </section>

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

      {/* Loved by Influencers */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">Loved by Influencers</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          A shoppable carousel of influencer / client <strong className="text-ink">videos and
          photos</strong>, each linked to a piece. Add your real content — the section stays hidden
          on the home page until you add at least one post.
        </p>
        <UgcManager posts={ugcRows} products={prodOptions} />
      </section>

      {/* Instagram grid */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">Instagram grid</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          Photos for the <strong className="text-ink">&ldquo;Follow us on Instagram&rdquo;</strong>{" "}
          grid on the home page. Choose from your catalogue or upload Instagram-style shots. Leave
          empty to show a default set of your pieces.
        </p>
        <SectionImagesManager
          initial={instagram}
          catalog={catalog}
          action={saveInstagramImagesAction}
        />
      </section>

      {/* Press / "As featured in" */}
      <section>
        <h2 className="mb-1 font-display text-xl text-ink">Press — &ldquo;As featured in&rdquo;</h2>
        <p className="mb-4 max-w-2xl text-sm text-stone">
          Publications that have featured you. This strip appears under the hero{" "}
          <strong className="text-ink">only when you add names here</strong> — so nothing shows until
          you have real press.
        </p>
        <PressManager initial={press} />
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
