"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export function AddToBagButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        add({ handle: product.handle, title: product.title, price: product.price, currency: product.currency });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
      className="w-full rounded-sm bg-ivory text-ink py-3 text-[13px] tracking-[0.08em] uppercase font-medium hover:bg-gold transition-colors"
    >
      {added ? "Added to Bag" : product.oneOfAKind ? "Reserve — Request Callback" : "Add to Bag"}
    </button>
  );
}
