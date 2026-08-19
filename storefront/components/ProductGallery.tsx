"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const isVideo = (s: string) => /\.(mp4|webm|mov|m4v)$/i.test(s);

// The gallery is kept within the viewport height (responsive) so the full image
// shows without scrolling; the thumbnail rail matches that height. Shorter on
// phones so the main image isn't a thin, tall sliver.

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

function Chevron({ dir }: { dir: "up" | "down" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      {dir === "up" ? <path d="M6 15l6-6 6 6" /> : <path d="M6 9l6 6 6-6" />}
    </svg>
  );
}

// Bulgari-style gallery: a vertical thumbnail rail on the left (3 visible, scrolls
// up/down for more), a large main image on the right over soft studio-grey. The
// whole gallery fits the viewport height. Images enlarge in a lightbox; videos
// play inline.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : ["/images/hero-sapphire.jpg"];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = list[active];
  const railRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setActive((i) => (i + 1) % list.length), [list.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + list.length) % list.length), [list.length]);

  const scrollRail = (dir: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ top: dir * (el.clientHeight / 3 + 12), behavior: "smooth" });
  };

  // Auto-start the video when it becomes the active media. Try with sound first
  // (the selection was a user gesture); fall back to muted if the browser blocks
  // unmuted autoplay.
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

  const scrollable = list.length > 3;

  return (
    <>
      <div className="flex h-[min(60vh,520px)] gap-2.5 sm:h-[min(74vh,660px)] sm:gap-4">
        {/* Vertical thumbnail rail (left) — 3 visible, scrolls for more */}
        {list.length > 1 && (
          <div className="relative h-full w-[76px] shrink-0 sm:w-[150px] lg:w-[186px]">
            <div
              ref={railRef}
              className="no-scrollbar flex h-full flex-col gap-3 overflow-y-auto scroll-smooth"
            >
              {list.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`View media ${i + 1}`}
                  aria-current={i === active}
                  className="group block shrink-0"
                  style={{ height: "calc((100% - 1.5rem) / 3)" }}
                >
                  <div className="relative h-full w-full overflow-hidden bg-porcelain">
                    {isVideo(src) ? (
                      <>
                        <video
                          src={`${src}#t=0.1`}
                          muted
                          playsInline
                          preload="metadata"
                          onLoadedMetadata={(e) => {
                            try {
                              e.currentTarget.currentTime = 0.1;
                            } catch {}
                          }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <PlayBadge size={30} />
                        </span>
                      </>
                    ) : (
                      <Image src={src} alt="" fill sizes="186px" className="object-contain mix-blend-multiply" />
                    )}
                    {/* Active underline, Bulgari-style (overlaid so it doesn't shrink the image) */}
                    {i === active && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ink" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Up / down scroll controls */}
            {scrollable && (
              <>
                <button
                  type="button"
                  onClick={() => scrollRail(-1)}
                  aria-label="Scroll thumbnails up"
                  className="absolute left-1/2 top-1 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-porcelain/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-porcelain"
                >
                  <Chevron dir="up" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(1)}
                  aria-label="Scroll thumbnails down"
                  className="absolute bottom-1 left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-porcelain/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-porcelain"
                >
                  <Chevron dir="down" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Main viewer (right) */}
        <div className="relative min-w-0 flex-1">
          <div className="relative h-full overflow-hidden bg-porcelain">
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
                className="absolute inset-0 h-full w-full bg-porcelain object-contain"
              />
            ) : (
              <button
                onClick={() => setZoomed(true)}
                aria-label="Enlarge image"
                className="group absolute inset-0 cursor-zoom-in"
              >
                <Image
                  src={current}
                  alt={alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 80vw, 45vw"
                  className="object-contain mix-blend-multiply"
                />
                <span className="absolute bottom-3 right-3 bg-porcelain/85 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  Click to enlarge
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox (images only) */}
      {zoomed && !isVideo(current) && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — enlarged view`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95"
          onClick={() => setZoomed(false)}
        >
          <button
            onClick={() => setZoomed(false)}
            aria-label="Close"
            className="absolute right-5 top-5 text-3xl leading-none text-porcelain/80 hover:text-porcelain"
          >
            &times;
          </button>
          <span className="absolute left-1/2 top-6 -translate-x-1/2 text-[11px] uppercase tracking-[0.16em] tabular-nums text-porcelain/70">
            {active + 1} / {list.length}
          </span>
          {list.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-4 px-2 text-4xl leading-none text-porcelain/70 hover:text-porcelain sm:left-8"
              >
                &#8249;
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-4 px-2 text-4xl leading-none text-porcelain/70 hover:text-porcelain sm:right-8"
              >
                &#8250;
              </button>
            </>
          )}
          <div className="relative h-[86vh] w-[92vw] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current} alt={alt} fill sizes="92vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
