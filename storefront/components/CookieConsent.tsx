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

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-stone">
          We use essential cookies to run the site. With your consent we also use analytics to
          improve it. See our{" "}
          <Link href="/cookie-policy" className="text-gold underline underline-offset-2">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="border border-line px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="bg-ink px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-porcelain transition-colors hover:bg-gold"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
