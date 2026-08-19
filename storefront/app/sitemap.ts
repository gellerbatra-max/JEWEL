import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog-store";
import { getPublishedPosts } from "@/lib/journal-store";
import { collections } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

// Public URLs for search engines. Excludes /admin, /api, /cart and /lab.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "",
    "/jewellery",
    "/gemstones",
    "/dynasty",
    "/contact",
    "/how-to-order",
    "/faq",
    "/shipping",
    "/returns",
    "/care",
    "/size-guide",
    "/bespoke",
    "/certification",
    "/sourcing",
    "/guide/sapphires",
    "/journal",
    "/reviews",
    "/privacy",
    "/terms",
    "/cookie-policy",
  ];

  const [products, posts] = await Promise.all([getAllProducts(), getPublishedPosts()]);

  return [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now })),
    ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.handle}`, lastModified: now })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.handle}`, lastModified: now })),
    ...posts.map((p) => ({ url: `${SITE_URL}/journal/${p.slug}`, lastModified: now })),
  ];
}
