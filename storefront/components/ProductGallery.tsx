"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const isVideo = (s: string) => /\.(mp4|webm|mov|m4v)$/i.test(s);

function PlayBadge({ size = 26 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-ink/55 text-porcelain"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : ["/images/hero-sapphire.jpg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = list[active];

  const next = useCallback(() => setActive((i) => (i + 1) % list.length), [list.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + list.length) % list.length), [list.length]);

  // Auto-start the video when it becomes the active media. Try with sound
  // first (the selection was a user gesture); fall back to muted if the
  // browser blocks unmuted autoplay.
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!isVideo(current)) return;
    const v = mainVideoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [current]);

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

  const arrowBtn =
    "absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-porcelain/80 hover:bg-porcelain text-ink text-2xl leading-none shadow-[0_2px_10px_rgba(28,27,25,0.12)] transition-colors";

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main viewer */}
        <div className="relative">
          <div className="relative aspect-square bg-porcelain overflow-hidden">
            {isVideo(current) ? (
              <video
                key={current}
                ref={mainVideoRef}
                src={current}
                controls
                autoPlay
                playsInline
                controlsList="nodownload"
                disablePictureInPicture
                className="absolute inset-0 w-full h-full object-contain bg-porcelain"
              />
            ) : (
              <button
                onClick={() => setZoomed(true)}
                aria-label="Enlarge image"
                className="absolute inset-0 cursor-zoom-in group"
              >
                <Image
                  src={current}
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
            )}
          </div>

          {list.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous" className={`${arrowBtn} left-2`}>
                &#8249;
              </button>
              <button onClick={next} aria-label="Next" className={`${arrowBtn} right-2`}>
                &#8250;
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {list.length > 1 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to media ${i + 1}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-gold" : "w-1.5 bg-line"}`}
              />
            ))}
          </div>
        )}

        {/* Horizontal thumbnail strip */}
        {list.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {list.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`View media ${i + 1}`}
                aria-current={i === active}
                className={`relative w-16 h-16 sm:w-[74px] sm:h-[74px] shrink-0 overflow-hidden bg-porcelain border transition-colors ${
                  i === active ? "border-gold" : "border-line-soft hover:border-stone"
                }`}
              >
                {isVideo(src) ? (
                  <>
                    <video
                      src={`${src}#t=0.1`}
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => { try { e.currentTarget.currentTime = 0.1; } catch {} }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <PlayBadge size={24} />
                    </span>
                  </>
                ) : (
                  <Image src={src} alt="" fill sizes="74px" className="object-contain" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox (images only) */}
      {zoomed && !isVideo(current) && (
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
            <Image src={current} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
