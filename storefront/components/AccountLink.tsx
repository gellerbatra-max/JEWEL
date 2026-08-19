"use client";

import Link from "next/link";

// Account (person) icon in the masthead. Links to /account, which shows the
// signed-in dashboard or redirects to sign in.
export function AccountLink({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/account"
      aria-label="Account"
      className={`transition-colors ${light ? "text-ink/75 hover:text-ink" : "text-stone hover:text-ink"}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    </Link>
  );
}
