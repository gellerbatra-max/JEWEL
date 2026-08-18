"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { setCategoryCoverAction } from "./actions";

type Item = { id: string; title: string; image: string };

// Grid of a category's pieces. Click one to make its photo the category cover on
// the Jewellery page. "Reset to automatic" clears the choice (falls back to the
// first piece).
export function CategoryCoverPicker({
  handle,
  items,
  initialCoverId,
}: {
  handle: string;
  items: Item[];
  initialCoverId: string;
}) {
  const [coverId, setCoverId] = useState(initialCoverId);
  const [pending, start] = useTransition();

  const choose = (id: string) => {
    setCoverId(id);
    start(() => setCategoryCoverAction(handle, id));
  };

  const effectiveId = coverId || items[0]?.id;

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {items.map((it) => {
          const isEffective = it.id === effectiveId;
          const badge = isEffective ? (coverId ? "Cover" : "Auto") : null;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => choose(it.id)}
              disabled={pending}
              title={it.title}
              className={`relative aspect-square overflow-hidden border transition-shadow ${
                isEffective ? "border-gold ring-2 ring-gold" : "border-line hover:border-stone"
              }`}
            >
              <Image src={it.image} alt={it.title} fill sizes="110px" className="object-cover" />
              {badge && (
                <span className="absolute inset-x-0 bottom-0 bg-gold/90 py-0.5 text-center text-[9px] uppercase tracking-[0.1em] text-porcelain">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {coverId && (
        <button
          type="button"
          onClick={() => choose("")}
          disabled={pending}
          className="mt-3 text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink disabled:opacity-50"
        >
          Reset to automatic
        </button>
      )}
    </div>
  );
}
