"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Routes to /search?q=…. Reused on the search page and inside the header overlay.
export function SearchBox({
  initial = "",
  autoFocus = false,
  onSubmitted,
}: {
  initial?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = q.trim();
        if (!t) return;
        router.push(`/search?q=${encodeURIComponent(t)}`);
        onSubmitted?.();
      }}
      role="search"
      className="flex w-full items-stretch border border-line bg-white focus-within:border-gold"
    >
      <span className="flex items-center pl-3.5 text-stone" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
      </span>
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <input
        id="site-search"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pieces, stones, metals…"
        className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] text-ink outline-none placeholder:text-stone/60"
      />
      <button
        type="submit"
        className="shrink-0 bg-ink px-5 text-[11px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
      >
        Search
      </button>
    </form>
  );
}
