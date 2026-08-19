"use client";

import { useCart } from "./CartProvider";

// Bag icon in the masthead — opens the slide-out bag, with a small count badge.
export function CartLink({ light = false }: { light?: boolean }) {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Bag (${count} item${count === 1 ? "" : "s"})` : "Bag"}
      className={`relative inline-flex items-center transition-colors ${
        light ? "text-ink/75 hover:text-ink" : "text-stone hover:text-ink"
      }`}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Tote body with rounded bottom corners */}
        <path d="M6.3 8.5h11.4a.6.6 0 0 1 .6.66l-.78 9.1A2 2 0 0 1 15.53 20.5H8.47a2 2 0 0 1-1.99-1.84l-.78-9.1a.6.6 0 0 1 .6-.66z" />
        {/* Soft arch handle */}
        <path d="M9 8.5V7.7a3 3 0 0 1 6 0v.8" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium leading-none text-porcelain">
          {count}
        </span>
      )}
    </button>
  );
}
