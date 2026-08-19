"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/products";
import { waLink } from "@/lib/site";

type Suggestion = {
  handle: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  oneOfAKind: boolean;
};

// Slide-out bag (right drawer) — opens when a piece is added, or from the bag
// icon. Enquiry-first: the primary action starts a WhatsApp enquiry with the
// selection; secure checkout will slot in here once the gateway is live.
export function CartDrawer({ suggestions = [] }: { suggestions?: Suggestion[] }) {
  const { lines, remove, isOpen, close, count } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  const currency = lines.find((l) => !l.oneOfAKind)?.currency || "USD";
  const subtotal = lines.reduce((s, l) => s + (l.oneOfAKind ? 0 : l.price * l.qty), 0);
  const hasOnRequest = lines.some((l) => l.oneOfAKind);

  const enquiry = lines.length
    ? waLink(
        `Hi Taygerian, I'd like to enquire about my selection:\n${lines
          .map((l) => `• ${l.title}${l.size ? ` (size ${l.size})` : ""}`)
          .join("\n")}`
      )
    : waLink("Hi Taygerian, I'd like to enquire about a piece.");

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-porcelain shadow-[0_0_60px_-15px_rgba(28,27,25,0.5)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg tracking-[0.12em] uppercase text-ink">
            Your Bag{count > 0 && <span className="ml-2 text-stone">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close bag"
            className="text-xl leading-none text-stone transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="text-ink">Your bag is empty.</p>
              <p className="mt-1 text-[14px] text-stone">Add a piece, or start with a favourite.</p>
              <Link
                href="/jewellery"
                onClick={close}
                className="mt-6 inline-block bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
              >
                Browse the collection
              </Link>
            </div>
          ) : (
            <div className="px-6">
              {lines.map((l) => (
                <div key={l.lineId} className="flex gap-4 border-b border-line-soft py-4">
                  <Link
                    href={`/products/${l.handle}`}
                    onClick={close}
                    className="relative h-24 w-20 shrink-0 overflow-hidden bg-cloud"
                  >
                    {l.image ? (
                      <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                    ) : null}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${l.handle}`}
                      onClick={close}
                      className="font-display text-[15px] text-ink transition-colors hover:text-gold"
                    >
                      {l.title}
                    </Link>
                    {l.size && <p className="mt-0.5 text-[12px] text-stone">Size {l.size}</p>}
                    <p className="mt-1 text-[13px] tabular-nums text-ink">
                      {l.oneOfAKind ? "Price on request" : formatPrice(l.price, l.currency)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(l.lineId)}
                      className="mt-2 text-[11px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-risk"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* You may also like */}
          {suggestions.length > 0 && (
            <div className="border-t border-line px-6 py-5">
              <p className="mb-3 text-[11px] tracking-[0.14em] uppercase text-gold">You may also like</p>
              <div className="space-y-3">
                {suggestions.slice(0, 3).map((s) => (
                  <Link
                    key={s.handle}
                    href={`/products/${s.handle}`}
                    onClick={close}
                    className="group flex items-center gap-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-cloud">
                      {s.image ? (
                        <Image src={s.image} alt="" fill sizes="48px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[14px] text-ink transition-colors group-hover:text-gold">
                        {s.title}
                      </p>
                      <p className="text-[12px] tabular-nums text-stone">
                        {s.oneOfAKind ? "On request" : formatPrice(s.price, s.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer (only with items) */}
        {lines.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between text-[15px] text-ink">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {formatPrice(subtotal, currency)}
                {hasOnRequest && " +"}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-stone">
              Secure online checkout is coming soon — for now, every piece is arranged personally.
            </p>
            <a
              href={enquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block bg-ink py-3.5 text-center text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
            >
              Enquire about your bag
            </a>
            <Link
              href="/cart"
              onClick={close}
              className="mt-2 block border border-ink py-3 text-center text-[11px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
            >
              View full bag
            </Link>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line-soft pt-4 text-center text-[10px] uppercase tracking-[0.06em] text-stone">
              <span>Lifetime warranty</span>
              <span>Insured shipping</span>
              <span>Certified stones</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
