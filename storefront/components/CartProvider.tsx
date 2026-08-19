"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type CartLine = {
  lineId: string;
  handle: string;
  title: string;
  price: number;
  currency: string;
  qty: number;
  size?: string;
  image?: string;
  oneOfAKind?: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  add: (line: Omit<CartLine, "qty" | "lineId">) => void;
  remove: (lineId: string) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "taygerian:cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cached: CartLine[] | null = null;

function newLineId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `l_${Math.random().toString(36).slice(2)}`;
}

function readFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: CartLine[] = raw ? JSON.parse(raw) : [];
    // Backfill lineId for any lines saved before per-line ids existed.
    return parsed.map((l) => (l.lineId ? l : { ...l, lineId: newLineId() }));
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
  const [isOpen, setIsOpen] = useState(false);

  // Every add is its own line item — no merging into quantity, so the same
  // piece added twice (or in two sizes) shows as two distinct lines. Adding a
  // piece slides the bag open.
  const add = useCallback((line: Omit<CartLine, "qty" | "lineId">) => {
    setLines([...getSnapshot(), { ...line, lineId: newLineId(), qty: 1 }]);
    setIsOpen(true);
  }, []);

  const remove = useCallback((lineId: string) => {
    setLines(getSnapshot().filter((l) => l.lineId !== lineId));
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <CartContext.Provider value={{ lines, count, add, remove, isOpen, open, close }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
