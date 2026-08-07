"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

function Chevron({ dir }: { dir: "up" | "down" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {dir === "up" ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const list = images.length ? images : ["/images/hero-sapphire.jpg"];

  const next = useCallback(() => setActive((i) => (i + 1) % list.length), [list.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + list.length) % list.length), [list.length]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed, next, prev]);

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-4">
        {list.length > 1 && (
          <div className="flex sm:flex-col items-center gap-2 sm:w-[76px] shrink-0">
            <button
              onClick={prev}
              aria-label="Previous image"
              className="hidden sm:flex items-center justify-center w-6 h-6 text-stone hover:text-ink transition-colors"
            >
              <Chevron dir="up" />
            </button>
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {list.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === active}
                  className={`relative aspect-square w-16 sm:w-full shrink-0 overflow-hidden bg-porcelain border transition-colors ${
                    i === active ? "border-gold" : "border-line-soft hover:border-stone"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="76px" className="object-contain" />
                </button>
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next image"
              className="hidden sm:flex items-center justify-center w-6 h-6 text-stone hover:text-ink transition-colors"
            >
              <Chevron dir="down" />
            </button>
          </div>
        )}

        <button
          onClick={() => setZoomed(true)}
          aria-label="Enlarge image"
          className="relative aspect-[4/5] flex-1 overflow-hidden bg-porcelain cursor-zoom-in group"
        >
          <Image
            src={list[active]}
            alt={alt}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 45vw"
            className="object-contain"
          />
          <span className="absolute bottom-3 right-3 bg-porcelain/85 text-ink text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to enlarge
          </span>
        </button>
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — enlarged view`}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close"
            className="absolute top-5 right-5 text-porcelain/80 hover:text-porcelain text-3xl leading-none"
          >
            &times;
          </button>

          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-porcelain/70 text-[11px] tracking-[0.16em] uppercase tabular-nums">
            {active + 1} / {list.length}
          </span>

          {list.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 text-porcelain/70 hover:text-porcelain text-4xl leading-none px-2"
              >
                &#8249;
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 text-porcelain/70 hover:text-porcelain text-4xl leading-none px-2"
              >
                &#8250;
              </button>
            </>
          )}

          <div className="relative w-[92vw] h-[86vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={list[active]} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
