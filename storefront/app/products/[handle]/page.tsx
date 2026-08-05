import { notFound } from "next/navigation";
import { AddToBagButton } from "@/components/AddToBagButton";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { getProduct, formatPrice, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = getProduct(handle);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 gap-12">
      <div className="space-y-3">
        <div
          className="aspect-square rounded-sm border border-line"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${product.swatch}66, ${product.swatch}18 55%, transparent 80%)`,
          }}
        />
        <p className="text-[11px] text-ivory-dim text-center">
          Placeholder — production build swaps in 360° spin + macro zoom photography per docs/02-ux-design-patterns.md
        </p>
      </div>

      <div>
        <p className="text-[11px] tracking-[0.16em] uppercase text-gold mb-3">
          {product.collectionHandle.replace("-", " ")}
        </p>
        <h1 className="font-display text-3xl mb-2">{product.title}</h1>
        <p className="text-ivory-dim mb-5">
          {product.metal}
          {product.stone !== "—" ? ` · ${product.stone}` : ""}
        </p>

        <p className="font-display text-2xl text-gold mb-8 tabular-nums">
          {product.oneOfAKind ? "Price on Request" : formatPrice(product.price, product.currency)}
        </p>

        {product.certification && (
          <div className="rounded-sm border border-line bg-panel p-5 mb-6">
            <p className="text-[11px] tracking-[0.08em] uppercase text-sapphire mb-2">Certification</p>
            <dl className="grid grid-cols-2 gap-y-1 text-[13px]">
              <dt className="text-ivory-dim">Laboratory</dt>
              <dd className="text-right tabular-nums">{product.certification.lab}</dd>
              <dt className="text-ivory-dim">Report No.</dt>
              <dd className="text-right tabular-nums">{product.certification.reportNumber}</dd>
              <dt className="text-ivory-dim">Verified origin</dt>
              <dd className="text-right">{product.certification.origin}</dd>
            </dl>
          </div>
        )}

        <p className="text-ivory-dim mb-8">{product.description}</p>

        <div className="space-y-3">
          <AddToBagButton product={product} />
          <ConsultationCTA productTitle={product.title} />
        </div>
      </div>
    </div>
  );
}
