"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// The try-on modal is heavy (and camera mode pulls MediaPipe from a CDN), so it
// only loads when a shopper opens it.
const RingTryOn = dynamic(() => import("./RingTryOn").then((m) => m.RingTryOn), { ssr: false });

export function TryOnButton({ ringImage, ringTitle }: { ringImage: string; ringTitle: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 border border-line py-3 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <circle cx="12" cy="14" r="6" />
          <path d="M9.5 8.5 11 4h2l1.5 4.5" />
        </svg>
        Try it on
      </button>
      {open && <RingTryOn ringImage={ringImage} ringTitle={ringTitle} onClose={() => setOpen(false)} />}
    </>
  );
}
