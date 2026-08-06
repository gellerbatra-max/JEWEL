"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";

type CartLine = { handle: string; title: string; price: number; currency: string; qty: number; size?: string };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (line: Omit<CartLine, "qty">) => void;
  remove: (handle: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "taigerian:cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cached: CartLine[] | null = null;

function readFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLines(next: CartLine[]) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (e.g. private mode) -- state still updates in-memory
  }
  listeners.forEach((notify) => notify());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function getSnapshot(): CartLine[] {
  if (cached === null) cached = readFromStorage();
  return cached;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((line: Omit<CartLine, "qty">) => {
    const current = getSnapshot();
    const existing = current.find((l) => l.handle === line.handle);
    const next = existing
      ? current.map((l) =>
          l.handle === line.handle ? { ...l, qty: l.qty + 1, size: line.size ?? l.size } : l
        )
      : [...current, { ...line, qty: 1 }];
    setLines(next);
  }, []);

  const remove = useCallback((handle: string) => {
    setLines(getSnapshot().filter((l) => l.handle !== handle));
  }, []);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider value={{ lines, count, add, remove }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
