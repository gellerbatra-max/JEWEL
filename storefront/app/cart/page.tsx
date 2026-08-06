"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { lines, remove } = useCart();
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-4">Your bag is empty</h1>
        <Link
          href="/collections/fine-jewellery"
          className="font-sans text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
        >
          Browse Fine Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink mb-10 text-center">Your Bag</h1>
      <div className="divide-y divide-line border-y border-line">
        {lines.map((line) => (
          <div key={line.handle} className="flex items-center justify-between py-5">
            <div>
              <p className="font-display text-lg text-ink">{line.title}</p>
              <p className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone mt-1">
                {line.size ? `Size ${line.size} · ` : ""}Qty {line.qty}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <p className="tabular-nums text-ink">{formatPrice(line.price * line.qty, line.currency)}</p>
              <button
                onClick={() => remove(line.handle)}
                className="font-sans text-[11px] tracking-[0.08em] uppercase text-stone hover:text-risk transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6 mb-8">
        <p className="font-sans text-[11px] tracking-[0.12em] uppercase text-stone">Estimated total</p>
        <p className="font-display text-2xl text-ink tabular-nums">{formatPrice(total, lines[0]?.currency ?? "USD")}</p>
      </div>
      <button
        disabled
        title="Connects to checkout once a live payment backend exists — see docs/03-technical-architecture.md"
        className="w-full bg-cloud border border-line text-stone py-3.5 font-sans text-[12px] tracking-[0.16em] uppercase cursor-not-allowed"
      >
        Checkout — connects once store is live
      </button>
    </div>
  );
}
