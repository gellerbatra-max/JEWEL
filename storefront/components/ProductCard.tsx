import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-cloud border border-line-soft">
        <div
          className="aspect-[4/5] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{
            background: `radial-gradient(circle at 50% 42%, ${product.swatch}40, ${product.swatch}12 45%, transparent 72%)`,
          }}
        />
        {product.oneOfAKind && (
          <span className="absolute top-3 left-3 bg-porcelain/90 text-ink text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 font-sans">
            One of a Kind
          </span>
        )}
      </div>
      <div className="pt-4 text-center">
        <p className="font-display text-lg text-ink group-hover:text-gold transition-colors">
          {product.title}
        </p>
        <p className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone mt-1.5">
          {product.metal}
          {product.stone !== "—" ? ` · ${product.stone}` : ""}
        </p>
        <p className="font-sans text-[13px] text-ink mt-2 tabular-nums">
          {product.oneOfAKind ? "Price on Request" : formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
