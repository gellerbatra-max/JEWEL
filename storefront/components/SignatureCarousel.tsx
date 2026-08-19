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

const ANGLE = 20; // deg of Y-tilt per step from centre
const BASE_SPEED = 0.006; // index-units advanced per frame (~one piece / 2.8s)

// Smooth size ramp by distance from centre: 0→1, 1→0.8, 2→0.6.
function scaleFor(o: number) {
  const a = Math.abs(o);
  if (a >= 2) return 0.6;
  if (a >= 1) return 0.8 - (a - 1) * 0.2;
  return 1 - a * 0.2;
}

// Faux-3D coverflow for the home "Signature Pieces" row.
//
// Keeps the same spaced object-cover tiles as before, but adds depth: a shared
// perspective + per-card Y-tilt (centre faces forward, previews fan back) and a
// continuous glide driven by one requestAnimationFrame loop writing transforms
// imperatively — so it flows seamlessly rather than stepping. Performance
// safeguards: the loop runs ONLY while the row is on-screen, restyles just the
// few visible cards each frame, uses no blend modes, and halts on hover / for
// reduced motion. A closed ring; scrolling adds momentum; a quick intro spin.
export function SignatureCarousel({ items }: { items: CarouselItem[] }) {
  const n = items.length;
  const side = Math.max(0, Math.min(2, Math.floor((n - 1) / 2)));

  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const posRef = useRef(0); // fractional centre index
  const burstRef = useRef(0); // extra velocity (intro spin + scroll), decays
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const hoverRef = useRef(false);
  const reducedRef = useRef(false);
  const snapRef = useRef<number | null>(null); // target index to glide to on click
  const dwellRef = useRef(0); // hold-centred-until timestamp after a click
  const [center, setCenter] = useState(0);

  useEffect(() => {
    reducedRef.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const layout = (): number => {
      const pos = posRef.current;
      let nearest = 0;
      let nd = Infinity;
      for (let i = 0; i < n; i++) {
        const el = cardsRef.current[i];
        if (!el) continue;
        let off = (((i - pos) % n) + n) % n;
        if (off > n / 2) off -= n;
        const a = Math.abs(off);
        if (a < nd) {
          nd = a;
          nearest = i;
        }
        if (a > side + 1.02) {
          if (el.style.opacity !== "0") {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
          continue;
        }
        const clamped = Math.max(-2, Math.min(2, off));
        const op = a <= side ? 1 : Math.max(0, 1 - (a - side));
        el.style.transform = `translateX(calc(-50% + ${off.toFixed(3)} * var(--step))) scale(${scaleFor(
          off
        ).toFixed(3)}) rotateY(${(-clamped * ANGLE).toFixed(2)}deg)`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.style.pointerEvents = "auto";
      }
      return nearest;
    };

    const tick = (t: number) => {
      const snap = snapRef.current;
      if (snap !== null) {
        // Glide toward a clicked side piece (shortest way round the ring).
        let d = (((snap - posRef.current) % n) + n) % n;
        if (d > n / 2) d -= n;
        if (Math.abs(d) < 0.008) {
          posRef.current = snap;
          snapRef.current = null;
          dwellRef.current = t + 2200; // hold it centred briefly before resuming
        } else {
          posRef.current += d * 0.14;
        }
      } else if (!hoverRef.current && !reducedRef.current && t >= dwellRef.current) {
        posRef.current += BASE_SPEED + burstRef.current;
      }
      burstRef.current *= 0.94;
      posRef.current = ((posRef.current % n) + n) % n;
      const nearest = layout();
      setCenter((c) => (c === nearest ? c : nearest));
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };

    layout(); // static coverflow before it animates

    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          burstRef.current = 0.05; // speedy intro spin whenever it enters view
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [n, side]);

  // Scrolling through the section adds a little momentum to the glide.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (!runningRef.current || reducedRef.current) return;
      burstRef.current += dy * 0.0009;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (n === 0) return null;

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-[1600px] overflow-hidden"
      style={
        {
          "--cardw": "min(62vw, 280px)",
          "--step": "calc(var(--cardw) * 1.06)",
          perspective: "1600px",
          perspectiveOrigin: "center 46%",
        } as React.CSSProperties
      }
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      {/* Invisible sizer establishes the row height for the absolute cards. */}
      <div className="mx-auto invisible p-3" style={{ width: "var(--cardw)" }} aria-hidden>
        <div className="aspect-[4/5]" />
        <div className="mt-4 min-h-[8rem]" />
      </div>

      {items.map((it, i) => (
        <div
          key={it.handle}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
          className="absolute left-1/2 top-0"
          style={{ width: "var(--cardw)", transformStyle: "preserve-3d", opacity: 0 }}
        >
          <Link
            href={`/products/${it.handle}`}
            onClick={(e) => {
              // Centre piece opens; a side piece glides to the centre instead.
              let off = (((i - posRef.current) % n) + n) % n;
              if (off > n / 2) off -= n;
              if (Math.abs(off) < 0.5) return;
              e.preventDefault();
              snapRef.current = i;
              burstRef.current = 0;
            }}
            className="group block p-3"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-cloud shadow-[0_18px_44px_-30px_rgba(28,27,25,0.45)]">
              <Image
                src={it.image}
                alt={it.title}
                fill
                sizes="(max-width: 640px) 62vw, 280px"
                className="object-cover"
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
      ))}

      {n > 1 && (
        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.handle}
              type="button"
              aria-label={`Show ${it.title}`}
              onClick={() => {
                posRef.current = i;
                burstRef.current = 0;
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === center ? "w-5 bg-gold" : "w-1.5 bg-line hover:bg-stone"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
