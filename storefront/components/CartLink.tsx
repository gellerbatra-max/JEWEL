"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="text-[13px] tracking-[0.12em] uppercase text-stone hover:text-ink transition-colors"
    >
      Bag{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
