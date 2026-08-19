"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { Action } from "./ProductActionModals";

// The enquiry modals (Drop a Hint / Book an Appointment / Customise Me) are the
// heavy part of this feature — three full forms plus long country/dial-code
// lists. They're split into their own chunk and only fetched the first time a
// shopper opens one, so the product page's initial JS stays light.
const ProductActionModals = dynamic(() => import("./ProductActionModals"), { ssr: false });

const ENVELOPE = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3.5 6.5 12 13l8.5-6.5" /></svg>
);
const CALENDAR = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="1.5" /><path d="M3 9.5h18M8 3v4M16 3v4" /></svg>
);
const GEM = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3.5h12l3 5-9 12-9-12z" /><path d="M3 8.5h18M9.5 3.5 6 8.5l6 12 6-12-3.5-5" /></svg>
);
const TRIGGERS: { key: Action; label: string; icon: ReactNode }[] = [
  { key: "hint", label: "Drop a Hint", icon: ENVELOPE },
  { key: "appointment", label: "Book an Appointment", icon: CALENDAR },
  { key: "customise", label: "Customise Me", icon: GEM },
];

export function ProductActions({ productTitle, productHandle, productImage, productSku }: { productTitle: string; productHandle?: string; productImage?: string; productSku?: string }) {
  const [active, setActive] = useState<Action | null>(null);
  const close = () => setActive(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        {TRIGGERS.map((t) => (
          <button key={t.key} type="button" onClick={() => setActive(t.key)} className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-stone transition-colors hover:text-ink">
            <span className="text-gold">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {active && (
        <ProductActionModals
          action={active}
          productTitle={productTitle}
          productHandle={productHandle}
          productImage={productImage}
          productSku={productSku}
          onClose={close}
        />
      )}
    </>
  );
}
