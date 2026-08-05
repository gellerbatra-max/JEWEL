"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      className="text-[11.5px] tracking-[0.05em] uppercase text-ivory-dim hover:text-ivory transition-colors"
    >
      Bag{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
