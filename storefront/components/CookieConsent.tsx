"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "tay_consent_v1";

// Reads the saved choice: "all" | "essential" | null (undecided). Analytics
// should only load when this returns "all".
export function getConsent(): "all" | "essential" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(KEY);
  return v === "all" || v === "essential" ? v : null;
}

// Slim, privacy-first cookie notice. Defaults to essential-only (nothing extra
// loads unless the visitor chooses "Accept all"). Remembers the choice.
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!getConsent()) setShow(true);
  }, []);

  const choose = (v: "all" | "essential") => {
    try {
      window.localStorage.setItem(KEY, v);
      window.dispatchEvent(new CustomEvent("tay:consent", { detail: v }));
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  // A small, quiet card in the bottom-left corner — it stays out of the way of
  // the content and never blocks the page. Sits below modals (z-40).
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="consent-enter fixed bottom-4 left-4 right-4 z-40 max-w-sm border border-line bg-white/95 p-4 shadow-[0_20px_50px_-24px_rgba(28,27,25,0.5)] backdrop-blur sm:right-auto"
    >
      <p className="text-[12.5px] leading-relaxed text-stone">
        We use essential cookies to run the site, and — only if you agree — analytics to improve it.{" "}
        <Link href="/cookie-policy" className="text-gold underline underline-offset-2">
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex gap-2.5">
        <button
          type="button"
          onClick={() => choose("all")}
          className="flex-1 bg-ink px-3 py-2 text-[10.5px] tracking-[0.12em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="flex-1 border border-line px-3 py-2 text-[10.5px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
