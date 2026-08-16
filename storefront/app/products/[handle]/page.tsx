import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PurchasePanel } from "@/components/PurchasePanel";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { ProductActions } from "@/components/ProductActions";
import { ProductAccordion } from "@/components/ProductAccordion";
import { ProductAssurances } from "@/components/ProductAssurances";
import { ShareButtons } from "@/components/ShareButtons";
import { ProductGallery } from "@/components/ProductGallery";
import { getProduct, getCollection, formatPrice, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(
  props: PageProps<"/products/[handle]">
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = getProduct(handle);
  if (!product) return {};
  const title = `${product.title} — Taygerian`;
  const description = product.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [product.image] },
  };
}

export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = getProduct(handle);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 grid sm:grid-cols-2 gap-12 lg:gap-16">
      <ProductGallery images={product.images} alt={product.title} />

      <div className="sm:pt-6">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
          {getCollection(product.collectionHandle)?.title ?? product.collectionHandle}
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

        <div className="space-y-3">
          <PurchasePanel product={product} />
          <ConsultationCTA productTitle={product.title} />
        </div>

        <div className="mt-5 border-y border-line-soft py-5">
          <ProductActions
            productTitle={product.title}
            productHandle={product.handle}
            productImage={product.image}
            productSku={product.sku}
          />
        </div>

        <div className="mt-6">
          <ShareButtons title={product.title} />
        </div>

        <ProductAccordion product={product} />

        <ProductAssurances />
      </div>
    </div>
  );
}
