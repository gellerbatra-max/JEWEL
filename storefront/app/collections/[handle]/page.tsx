import { notFound } from "next/navigation";
import { CollectionBrowser } from "@/components/CollectionBrowser";
import { getCollection, collections } from "@/lib/products";
import { getProductsByCollection } from "@/lib/catalog-store";

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export default async function CollectionPage(props: PageProps<"/collections/[handle]">) {
  const { handle } = await props.params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const items = await getProductsByCollection(handle);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Collection</p>
        <h1 className="font-display text-4xl text-ink mb-4">{collection.title}</h1>
        <p className="text-lg text-stone leading-relaxed">{collection.description}</p>
      </div>
      <CollectionBrowser items={items} />
    </div>
  );
}
