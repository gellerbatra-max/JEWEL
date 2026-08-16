"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartLink({ light = false }: { light?: boolean }) {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className={`uppercase transition-colors ${
        light
          ? "text-[15px] tracking-[0.14em] text-white/90 hover:text-white"
          : "text-[13px] tracking-[0.12em] text-stone hover:text-ink"
      }`}
    >
      Bag{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
