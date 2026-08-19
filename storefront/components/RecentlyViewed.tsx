"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import type { WishItem } from "@/lib/wishlist";

const KEY = "tay_recent_v1";
const MAX = 8;

// Records the current piece as "recently viewed" (browser-side, no login) and
// shows the others the visitor looked at — the "items they watch" the owner
// asked for, working today without an account.
export function RecentlyViewed({ current }: { current: WishItem }) {
  const [others, setOthers] = useState<WishItem[]>([]);

  useEffect(() => {
    let list: WishItem[] = [];
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) list = JSON.parse(raw) as WishItem[];
    } catch {
      /* ignore */
    }
    setOthers(list.filter((i) => i.handle !== current.handle).slice(0, 4));
    const next = [current, ...list.filter((i) => i.handle !== current.handle)].slice(0, MAX);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, [current.handle]); // eslint-disable-line react-hooks/exhaustive-deps

  if (others.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-6 pb-16">
      <div className="mb-8 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold">Recently viewed</p>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {others.map((item) => (
          <Link key={item.handle} href={`/products/${item.handle}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : null}
            </div>
            <div className="pt-3 text-center">
              <p className="font-display text-[16px] text-ink transition-colors group-hover:text-gold">
                {item.title}
              </p>
              <p className="mt-1 text-[12px] tabular-nums text-stone">
                {item.oneOfAKind ? "Price on Request" : formatPrice(item.price, item.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
