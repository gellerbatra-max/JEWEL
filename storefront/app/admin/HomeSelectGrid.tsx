"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MAX_SIGNATURE } from "@/lib/products";
import { toggleHomeAction } from "./actions";

type Item = { id: string; title: string; image: string; category: string; showOnHome: boolean };

// A compact, all-at-once grid for choosing which pieces appear in the home-page
// Signature Pieces carousel. Tap to toggle; a running counter enforces the cap.
export function HomeSelectGrid({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(items.filter((i) => i.showOnHome).map((i) => i.id))
  );
  const [pending, start] = useTransition();
  const count = selected.size;
  const full = count >= MAX_SIGNATURE;

  const toggle = (id: string) => {
    const isOn = selected.has(id);
    if (!isOn && full) {
      alert(`You can feature up to ${MAX_SIGNATURE} pieces on the home page. Remove one first.`);
      return;
    }
    const next = new Set(selected);
    if (isOn) next.delete(id);
    else next.add(id);
    setSelected(next);
    start(async () => {
      const res = await toggleHomeAction(id, !isOn);
      if (!isOn && res?.atLimit) {
        setSelected((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        });
      }
    });
  };

  return (
    <div>
      <div className="sticky top-[61px] z-10 -mx-6 mb-5 border-b border-line bg-porcelain/95 px-6 py-3 backdrop-blur">
        <p className="text-sm text-stone">
          <span className="font-medium text-ink">
            {count}/{MAX_SIGNATURE}
          </span>{" "}
          selected for the home-page carousel
          {full && <span className="ml-2 text-gold">· full — remove one to swap</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it) => {
          const on = selected.has(it.id);
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              disabled={pending && !on}
              aria-pressed={on}
              className={`group relative overflow-hidden border bg-white text-left transition-all ${
                on ? "border-gold ring-1 ring-gold" : "border-line hover:border-stone"
              } ${!on && full ? "opacity-60" : ""}`}
            >
              <div className="relative aspect-square bg-cloud">
                {it.image ? (
                  <Image src={it.image} alt={it.title} fill sizes="240px" className="object-cover" />
                ) : null}
                {/* Always-visible corner checkbox: empty circle → gold check. */}
                <span
                  className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[13px] shadow-sm transition-all ${
                    on
                      ? "border-gold bg-gold text-porcelain"
                      : "border-stone/40 bg-white/90 text-transparent group-hover:text-stone/50"
                  }`}
                >
                  ✓
                </span>
              </div>
              <div className="px-2.5 py-2">
                <p className="truncate text-[13px] text-ink">{it.title}</p>
                <p className="text-[11px] uppercase tracking-[0.08em] text-stone">{it.category}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
