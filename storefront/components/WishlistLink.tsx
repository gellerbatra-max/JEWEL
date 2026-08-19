"use client";

import Link from "next/link";
import { useWishlist } from "./WishlistProvider";

export function WishlistLink({ light = false }: { light?: boolean }) {
  const { count, ready } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label={`Saved pieces${ready && count ? ` (${count})` : ""}`}
      className={`relative transition-colors ${
        light ? "text-ink/75 hover:text-ink" : "text-stone hover:text-ink"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.04 3 5.5l7 7Z" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] leading-none text-porcelain">
          {count}
        </span>
      )}
    </Link>
  );
}
