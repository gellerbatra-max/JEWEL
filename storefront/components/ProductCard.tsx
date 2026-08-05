import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block rounded-sm border border-line bg-panel overflow-hidden transition-colors hover:border-gold/60"
    >
      <div
        className="aspect-square"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${product.swatch}55, ${product.swatch}15 60%, transparent 80%)`,
        }}
      />
      <div className="p-4">
        <p className="font-display text-base">{product.title}</p>
        <p className="text-[12px] text-ivory-dim mt-1">
          {product.metal}
          {product.stone !== "—" ? ` · ${product.stone}` : ""}
        </p>
        <p className="text-[13px] text-gold mt-2 tabular-nums">
          {product.oneOfAKind ? "Price on request" : formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
