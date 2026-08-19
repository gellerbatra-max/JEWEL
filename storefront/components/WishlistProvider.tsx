"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { WishItem } from "@/lib/wishlist";

const KEY = "tay_wishlist_v1";

type Ctx = {
  items: WishItem[];
  count: number;
  ready: boolean;
  has: (handle: string) => boolean;
  toggle: (item: WishItem) => void;
  remove: (handle: string) => void;
};

const WishlistContext = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (keeps SSR markup stable).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as WishItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  // Sync with the signed-in customer's profile: on load, merge the server's
  // saved pieces with this device's, then keep the server copy updated. If the
  // visitor isn't signed in, the endpoint reports authed:false and we do nothing.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/account/wishlist");
        const data = (await res.json()) as { authed?: boolean; items?: WishItem[] };
        if (!cancelled && data.authed && Array.isArray(data.items)) {
          const map = new Map(itemsRef.current.map((i) => [i.handle, i]));
          for (const it of data.items) if (!map.has(it.handle)) map.set(it.handle, it);
          const merged = [...map.values()];
          setItems(merged);
          fetch("/api/account/wishlist", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ items: merged }),
          }).catch(() => {});
        }
      } catch {
        /* not signed in / offline — ignore */
      } finally {
        if (!cancelled) syncedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  // After the initial merge, push later changes to the profile (no-op if not signed in).
  useEffect(() => {
    if (!ready || !syncedRef.current) return;
    fetch("/api/account/wishlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ items }),
    }).catch(() => {});
  }, [items, ready]);

  // Keep other tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          setItems(e.newValue ? (JSON.parse(e.newValue) as WishItem[]) : []);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback((handle: string) => items.some((i) => i.handle === handle), [items]);
  const toggle = useCallback(
    (item: WishItem) =>
      setItems((prev) =>
        prev.some((i) => i.handle === item.handle)
          ? prev.filter((i) => i.handle !== item.handle)
          : [item, ...prev]
      ),
    []
  );
  const remove = useCallback(
    (handle: string) => setItems((prev) => prev.filter((i) => i.handle !== handle)),
    []
  );

  return (
    <WishlistContext.Provider value={{ items, count: items.length, ready, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): Ctx {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
