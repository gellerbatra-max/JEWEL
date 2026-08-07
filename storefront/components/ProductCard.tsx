import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block p-3 border border-transparent hover:border-line hover:bg-porcelain hover:shadow-[0_20px_46px_-28px_rgba(28,27,25,0.45)] hover:-translate-y-0.5 transition-all duration-300 ease-out"
    >
      <div className="relative overflow-hidden bg-cloud aspect-[4/5]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.oneOfAKind && (
          <span className="absolute top-3 left-3 bg-porcelain/90 text-ink text-[10px] tracking-[0.14em] uppercase px-2.5 py-1">
            One of a Kind
          </span>
        )}
      </div>
      <div className="pt-4 text-center">
        <p className="font-display text-lg text-ink group-hover:text-gold transition-colors">
          {product.title}
        </p>
        <p className="text-[11px] tracking-[0.08em] uppercase text-stone mt-1.5">
          {product.metal}
          {product.stone !== "—" ? ` · ${product.stone}` : ""}
        </p>
        <p className="text-[13px] text-ink mt-2 tabular-nums">
          {product.oneOfAKind ? "Price on Request" : formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
