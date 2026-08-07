"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { RING_SIZES, type Product } from "@/lib/products";

export function PurchasePanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // Reserve/callback pieces don't require a size up front — it's confirmed
  // during the consultation. Catalogue rings do.
  const requiresSize = product.isRing && !product.oneOfAKind;
  const blocked = requiresSize && !size;

  function handleAdd() {
    if (blocked) return;
    add({
      handle: product.handle,
      title: product.title,
      price: product.price,
      currency: product.currency,
      size: size ?? undefined,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-4">
      {product.isRing && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] tracking-[0.12em] uppercase text-ink">
              Ring Size{requiresSize ? "" : " (optional)"}
            </span>
            <a
              href="/taygerian-ring-size-guide.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.06em] uppercase text-stone underline underline-offset-2 hover:text-gold transition-colors"
            >
              Size guide
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {RING_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`min-w-[44px] h-10 px-2 text-[13px] tabular-nums border transition-colors ${
                  size === s
                    ? "border-ink bg-ink text-porcelain"
                    : "border-line text-ink hover:border-gold"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={blocked}
        className={`w-full py-3.5 text-[12px] tracking-[0.16em] uppercase transition-colors ${
          blocked
            ? "bg-cloud border border-line text-stone cursor-not-allowed"
            : "bg-ink text-porcelain hover:bg-gold"
        }`}
      >
        {added
          ? "Added to Bag"
          : blocked
            ? "Select a Size"
            : product.oneOfAKind
              ? "Reserve — Request Callback"
              : "Add to Bag"}
      </button>
    </div>
  );
}
