"use client";

import { useEffect, useState } from "react";
import { SearchBox } from "./SearchBox";

// A search icon in the header that opens a centred search overlay (the pattern
// most luxury houses use), keeping the masthead uncluttered.
export function HeaderSearch({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className={`transition-colors ${light ? "text-ink/75 hover:text-ink" : "text-stone hover:text-ink"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mt-[14vh] w-full max-w-xl px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/80">Search</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="text-xl leading-none text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <SearchBox autoFocus onSubmitted={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
