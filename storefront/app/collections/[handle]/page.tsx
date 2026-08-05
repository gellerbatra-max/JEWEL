import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCollection, getProductsByCollection, collections } from "@/lib/products";

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export default async function CollectionPage(props: PageProps<"/collections/[handle]">) {
  const { handle } = await props.params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const items = getProductsByCollection(handle);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-[11px] tracking-[0.16em] uppercase text-gold mb-4">Collection</p>
      <h1 className="font-display text-3xl mb-3">{collection.title}</h1>
      <p className="max-w-2xl text-ivory-dim mb-10">{collection.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
