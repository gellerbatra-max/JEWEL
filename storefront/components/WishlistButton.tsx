"use client";

import { useWishlist } from "./WishlistProvider";
import { track } from "@/lib/analytics";
import type { WishItem } from "@/lib/wishlist";

// Heart toggle. On product cards it overlays the image (as a sibling of the
// card's link, never nested inside it), and on the product page it sits inline.
export function WishlistButton({
  item,
  className = "",
  size = 18,
  withLabel = false,
}: {
  item: WishItem;
  className?: string;
  size?: number;
  withLabel?: boolean;
}) {
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(item.handle);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!active) track("add_to_wishlist", { piece: item.title });
    toggle(item);
  };

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase transition-colors ${
          active ? "text-gold" : "text-stone hover:text-ink"
        } ${className}`}
      >
        <Heart size={size} filled={active} />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? "Remove from saved pieces" : "Save this piece"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-colors hover:bg-white ${
        active ? "text-gold" : "text-ink"
      } ${className}`}
    >
      <Heart size={size} filled={active} />
    </button>
  );
}

function Heart({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.04 3 5.5l7 7Z" />
    </svg>
  );
}
