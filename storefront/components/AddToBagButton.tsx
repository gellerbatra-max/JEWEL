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
      className="w-full bg-ink text-porcelain py-3.5 font-sans text-[12px] tracking-[0.16em] uppercase hover:bg-gold transition-colors"
    >
      {added ? "Added to Bag" : product.oneOfAKind ? "Reserve — Request Callback" : "Add to Bag"}
    </button>
  );
}
