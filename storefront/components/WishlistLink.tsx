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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 20.5s-7-4.4-9.2-8.6C1.3 8.9 2.7 5.5 6 5.5c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.3 0 4.7 3.4 3.2 6.4C19 16.1 12 20.5 12 20.5z" />
      </svg>
      {ready && count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] leading-none text-porcelain">
          {count}
        </span>
      )}
    </Link>
  );
}
