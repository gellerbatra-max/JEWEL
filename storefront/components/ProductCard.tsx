import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { toWishItem } from "@/lib/wishlist";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative border border-transparent transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-porcelain hover:shadow-[0_20px_46px_-28px_rgba(28,27,25,0.45)]">
      {/* Heart overlays the card as a sibling of the link (never nested in an anchor) */}
      <WishlistButton
        item={toWishItem(product)}
        className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 aria-pressed:opacity-100"
      />
      <Link href={`/products/${product.handle}`} className="block p-3">
        <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : null}
          {product.oneOfAKind && (
            <span className="absolute left-3 top-3 bg-porcelain/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
              One of a Kind
            </span>
          )}
        </div>
        <div className="pt-4 text-center">
          <p className="font-display text-lg text-ink transition-colors group-hover:text-gold">
            {product.title}
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.08em] text-stone">
            {product.metal}
            {product.stone !== "—" ? ` · ${product.stone}` : ""}
          </p>
          <p className="mt-2 text-[13px] tabular-nums text-ink">
            {product.oneOfAKind ? "Price on Request" : formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </div>
  );
}
