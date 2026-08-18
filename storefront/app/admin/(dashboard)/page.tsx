import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/lib/catalog-store";
import { formatPrice, getCollection, MAX_SIGNATURE } from "@/lib/products";
import { HomeToggle } from "@/app/admin/HomeToggle";
import { DeleteButton } from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function ManageDashboard() {
  const products = await getAllProducts();
  const onHome = products.filter((p) => p.showOnHome).length;
  const atLimit = onHome >= MAX_SIGNATURE;

  // Home-page pieces first, then alphabetical — the owner's picks stay at the top.
  const sorted = [...products].sort(
    (a, b) =>
      Number(b.showOnHome ?? false) - Number(a.showOnHome ?? false) ||
      a.title.localeCompare(b.title)
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Your jewellery</h1>
          <p className="mt-1 text-sm text-stone">
            {products.length} {products.length === 1 ? "piece" : "pieces"} · {onHome}/{MAX_SIGNATURE}{" "}
            shown on the home page
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          ＋ Add piece
        </Link>
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        Tick <span className="text-gold">“Show on home”</span> on any piece to feature it in the{" "}
        <strong className="text-ink">Signature Pieces</strong> section of the home page.
      </div>

      {sorted.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No pieces yet.</p>
          <p className="mt-1 text-sm text-stone">Add your first piece to get started.</p>
          <Link
            href="/admin/products/new"
            className="mt-5 inline-block bg-ink px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase text-porcelain hover:bg-gold"
          >
            ＋ Add piece
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-line bg-white px-4 py-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-cloud">
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ink">{p.title}</p>
                <p className="text-[12px] text-stone">
                  {getCollection(p.collectionHandle)?.title ?? p.collectionHandle} ·{" "}
                  {p.oneOfAKind ? "Price on request" : formatPrice(p.price, p.currency)}
                </p>
              </div>
              <HomeToggle id={p.id} initial={!!p.showOnHome} atLimit={atLimit} />
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/products/${p.handle}/edit`}
                  className="text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink"
                >
                  Edit
                </Link>
                <DeleteButton id={p.id} title={p.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
