// Client-safe wishlist types + helpers. The wishlist lives in the browser
// (localStorage) — no account needed — so we store a small snapshot of each
// saved piece rather than just an id.

import type { Product } from "./products";

export type WishItem = {
  handle: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  metal: string;
  stone: string;
  oneOfAKind: boolean;
};

export function toWishItem(p: Product): WishItem {
  return {
    handle: p.handle,
    title: p.title,
    image: p.image,
    price: p.price,
    currency: p.currency,
    metal: p.metal,
    stone: p.stone,
    oneOfAKind: p.oneOfAKind,
  };
}
