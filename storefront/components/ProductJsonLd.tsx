import type { Product } from "@/lib/products";
import { getCollection } from "@/lib/products";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getApprovedForProduct } from "@/lib/review-store";
import { averageRating } from "@/lib/review";

const abs = (src: string) => (src?.startsWith("http") ? src : `${SITE_URL}${src}`);

// Product structured data for Google rich results. Only asserts a price for
// fixed-price pieces; one-of-a-kind ("price on request") items omit the offer.
// Adds an aggregate star rating when the piece has approved reviews.
export async function ProductJsonLd({ product }: { product: Product }) {
  const reviews = await getApprovedForProduct(product.handle);
  const { count, avg } = averageRating(reviews);
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: (product.images?.length ? product.images : [product.image])
      .filter(Boolean)
      .map(abs),
    sku: product.sku,
    category: getCollection(product.collectionHandle)?.title ?? product.collectionHandle,
    material: product.metal,
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/products/${product.handle}`,
  };

  if (count > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avg,
      reviewCount: count,
      bestRating: 5,
      worstRating: 1,
    };
    data.review = reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      author: { "@type": "Person", name: r.name },
      reviewBody: r.body,
      datePublished: r.createdAt,
    }));
  }

  if (product.certification) {
    data.additionalProperty = {
      "@type": "PropertyValue",
      name: "Certification",
      value: `${product.certification.lab} · ${product.certification.reportNumber}`,
    };
  }

  if (!product.oneOfAKind && product.price > 0) {
    data.offers = {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/products/${product.handle}`,
    };
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
