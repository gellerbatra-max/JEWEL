import { ProductForm } from "@/app/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-3xl text-ink">Add a piece</h1>
      <p className="mb-8 text-sm text-stone">
        Fill in the details and add photos. It appears on your site as soon as you save.
      </p>
      <ProductForm />
    </div>
  );
}
