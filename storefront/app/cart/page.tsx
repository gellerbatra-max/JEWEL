"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { lines, remove } = useCart();
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="font-display text-2xl mb-4">Your bag is empty</h1>
        <Link href="/collections/fine-jewellery" className="text-sapphire hover:text-ivory transition-colors">
          Browse Fine Jewellery →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-2xl mb-8">Your Bag</h1>
      <div className="divide-y divide-line border-y border-line">
        {lines.map((line) => (
          <div key={line.handle} className="flex items-center justify-between py-4">
            <div>
              <p>{line.title}</p>
              <p className="text-[12px] text-ivory-dim">Qty {line.qty}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="tabular-nums text-gold">{formatPrice(line.price * line.qty, line.currency)}</p>
              <button onClick={() => remove(line.handle)} className="text-[12px] text-ivory-dim hover:text-risk transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 mb-8">
        <p className="text-ivory-dim">Estimated total</p>
        <p className="font-display text-xl text-gold tabular-nums">{formatPrice(total, lines[0]?.currency ?? "USD")}</p>
      </div>
      <button
        disabled
        title="Connects to Shopify Checkout once a live store exists — see docs/03-technical-architecture.md"
        className="w-full rounded-sm bg-panel border border-line text-ivory-dim py-3 text-[13px] tracking-[0.08em] uppercase cursor-not-allowed"
      >
        Proceed to Checkout — connects once store is live
      </button>
    </div>
  );
}
