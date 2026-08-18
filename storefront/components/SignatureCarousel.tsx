"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";

export type CarouselItem = {
  handle: string;
  title: string;
  image: string;
  metal: string;
  stone: string;
  price: number;
  currency: string;
  oneOfAKind: boolean;
};

// Circular centre-highlight carousel for the home "Signature Pieces" row.
//
// It's a *ring*: the piece before the centred one always wraps around to fill
// the left, and the piece after fills the right — so neither side is ever empty,
// at first load or mid-rotation. Cards are positioned with CSS transforms (which
// run on the compositor), only a small window around the centre is visible, and
// auto-advance pauses off-screen / on hover / for reduced-motion. Light and smooth
// even at 20 pieces.
export function SignatureCarousel({ items }: { items: CarouselItem[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  // Coverflow: up to two graduated preview cards on each side of the centre.
  // With plenty of pieces this shows 5 (big centre, medium + small previews);
  // with few it gracefully drops to 3. Kept below n/2 so the wrap-around seam
  // always lands in the hidden zone.
  const side = Math.max(0, Math.min(2, Math.floor((n - 1) / 2)));

  // Graduated size + fade by distance from centre — this is what makes it read
  // as elegant depth rather than a crowded row.
  const scaleFor = (o: number) => (o === 0 ? 1 : Math.abs(o) === 1 ? 0.8 : 0.6);
  const opacityFor = (o: number) => (o === 0 ? 1 : Math.abs(o) === 1 ? 0.5 : 0.28);

  // Signed circular distance from the active card to card i, e.g. -2..+2.
  const offsetOf = (i: number) => {
    let d = ((i - active) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const go = (dir: number) => setActive((a) => ((a + dir) % n + n) % n);

  // Pause auto-advance while the row is scrolled out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance (respects reduced-motion, hover, and visibility).
  useEffect(() => {
    if (n <= 1 || hovering || !visible) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 3600);
    return () => clearInterval(id);
  }, [n, hovering, visible]);

  if (n === 0) return null;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[1600px] overflow-hidden"
      style={
        {
          "--cardw": "min(62vw, 280px)",
          "--step": "calc(var(--cardw) * 1.06)",
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Invisible sizer establishes the row height so the absolute cards can
          overlay it responsively. Mirrors a framed card's box (p-3 + border). */}
      <div className="mx-auto invisible border border-transparent p-3" style={{ width: "var(--cardw)" }} aria-hidden>
        <div className="aspect-[4/5]" />
        {/* min-h reserves room for a two-line title + two-line subtitle + price,
            so no card's price is ever clipped and the frame height stays steady. */}
        <div className="mt-4 min-h-[8rem]" />
      </div>

      {items.map((it, i) => {
        const off = offsetOf(i);
        const shown = Math.abs(off) <= side;
        const isCenter = off === 0;
        // Parked (hidden) cards sit just past the last visible slot, with no
        // transition, so the wrap-around never animates across the whole row.
        const slot = shown ? off : Math.sign(off) * (side + 1);
        return (
          <div
            key={it.handle}
            className="absolute left-1/2 top-0"
            style={{
              width: "var(--cardw)",
              transform: `translateX(calc(-50% + ${slot} * var(--step))) scale(${scaleFor(off)})`,
              opacity: shown ? opacityFor(off) : 0,
              zIndex: 20 - Math.abs(off),
              pointerEvents: shown ? "auto" : "none",
              transition: shown ? "transform 0.6s ease, opacity 0.6s ease" : "none",
            }}
          >
            <Link
              href={`/products/${it.handle}`}
              onClick={(e) => {
                // Side cards recentre instead of navigating; the centred one opens.
                if (!isCenter) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              className={`group block border p-3 transition-all duration-500 ease-out ${
                isCenter
                  ? "border-line bg-porcelain shadow-[0_26px_54px_-28px_rgba(28,27,25,0.5)]"
                  : "border-transparent"
              }`}
              tabIndex={isCenter ? 0 : -1}
              aria-hidden={!isCenter}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  sizes="(max-width: 640px) 62vw, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 min-h-[8rem] text-center">
                <h3 className="line-clamp-2 font-display text-xl text-ink">{it.title}</h3>
                <p className="mt-1 line-clamp-2 text-[11px] tracking-[0.14em] uppercase text-stone">
                  {it.metal}
                  {it.stone && it.stone !== "—" ? ` · ${it.stone}` : ""}
                </p>
                <p className="mt-2 font-display text-[15px] text-ink tabular-nums">
                  {it.oneOfAKind ? "Price on Request" : formatPrice(it.price, it.currency)}
                </p>
              </div>
            </Link>
          </div>
        );
      })}

      {n > 1 && (
        <>
          <CarouselArrow side="left" onClick={() => go(-1)} />
          <CarouselArrow side="right" onClick={() => go(1)} />
        </>
      )}

      {n > 1 && (
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.handle}
              type="button"
              aria-label={`Show ${it.title}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-gold" : "w-1.5 bg-line hover:bg-stone"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CarouselArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute top-[38%] z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/85 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white sm:flex ${
        side === "left" ? "left-2 lg:left-6" : "right-2 lg:right-6"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {side === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
