import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PurchasePanel } from "@/components/PurchasePanel";
import { ConsultationCTA } from "@/components/ConsultationCTA";
import { ProductActions } from "@/components/ProductActions";
import { ProductAccordion } from "@/components/ProductAccordion";
import { ProductAssurances } from "@/components/ProductAssurances";
import { ShareButtons } from "@/components/ShareButtons";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductJsonLd } from "@/components/ProductJsonLd";
import { RelatedProducts } from "@/components/RelatedProducts";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { ProductReviews } from "@/components/ProductReviews";
import { WishlistButton } from "@/components/WishlistButton";
import { getCollection, formatPrice } from "@/lib/products";
import { toWishItem } from "@/lib/wishlist";
import { getProduct, getAllProducts } from "@/lib/catalog-store";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(
  props: PageProps<"/products/[handle]">
): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);
  if (!product) return {};
  const ogTitle = `${product.title} — Taygerian`;
  const description = product.description;
  return {
    title: product.title, // brand appended by the root title template
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title: ogTitle,
      description,
      images: product.image ? [{ url: product.image }] : undefined,
      url: `/products/${product.handle}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <>
    <div className="mx-auto max-w-[1500px] px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:gap-16">
      <ProductJsonLd product={product} />
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

        <div className="mt-6 flex items-center gap-6">
          <WishlistButton item={toWishItem(product)} withLabel />
          <ShareButtons title={product.title} />
        </div>

        <ProductAccordion product={product} />

        <ProductAssurances />
      </div>
    </div>

      <ProductReviews handle={product.handle} title={product.title} />
      <RecentlyViewed current={toWishItem(product)} />
      <RelatedProducts product={product} />
    </>
  );
}
