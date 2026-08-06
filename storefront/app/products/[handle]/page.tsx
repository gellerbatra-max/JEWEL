import { notFound } from "next/navigation";
import Image from "next/image";
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
    <div className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 gap-12 lg:gap-16">
      <div className="relative aspect-[4/5] bg-cloud overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="sm:pt-6">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
          {product.collectionHandle.replace("-", " ")}
        </p>
        <h1 className="font-display text-4xl text-ink mb-3 leading-tight">{product.title}</h1>
        <p className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone mb-6">
          {product.metal}
          {product.stone !== "—" ? ` · ${product.stone}` : ""}
        </p>

        <p className="font-display text-2xl text-ink mb-8 tabular-nums">
          {product.oneOfAKind ? "Price on Request" : formatPrice(product.price, product.currency)}
        </p>

        {product.certification && (
          <div className="border border-line bg-cloud/60 p-5 mb-7">
            <p className="font-sans text-[10px] tracking-[0.14em] uppercase text-sapphire mb-3">
              Certified Provenance
            </p>
            <dl className="grid grid-cols-2 gap-y-1.5 text-[14px]">
              <dt className="text-stone">Laboratory</dt>
              <dd className="text-right tabular-nums">{product.certification.lab}</dd>
              <dt className="text-stone">Report No.</dt>
              <dd className="text-right tabular-nums">{product.certification.reportNumber}</dd>
              <dt className="text-stone">Verified origin</dt>
              <dd className="text-right">{product.certification.origin}</dd>
            </dl>
          </div>
        )}

        <p className="text-stone leading-relaxed mb-8">{product.description}</p>

        <div className="space-y-3">
          <AddToBagButton product={product} />
          <ConsultationCTA productTitle={product.title} />
        </div>
      </div>
    </div>
  );
}
