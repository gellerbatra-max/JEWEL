import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog-store";
import { ProductForm } from "@/app/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-3xl text-ink">Edit piece</h1>
      <p className="mb-8 text-sm text-stone">{product.title}</p>
      <ProductForm product={product} />
    </div>
  );
}
