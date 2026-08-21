"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Full-width craftsmanship video banner (sibling to the promo banner). Plays
// muted + looping; `startAt` seeks past any intro so playback begins at the
// desired frame and loops from there. Plays only while on screen.
export function CraftVideoBanner({
  src,
  startAt = 0,
  eyebrow = "The Atelier",
  heading = "Crafted by Hand",
  subtext = "Every Taygerian piece is set and finished by our own goldsmiths in Colombo — one stone at a time.",
  ctaLabel = "Design Yours",
  href = "/bespoke",
}: {
  src: string;
  startAt?: number;
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  ctaLabel?: string;
  href?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const seekStart = () => {
      try {
        if (startAt > 0 && v.currentTime < startAt) v.currentTime = startAt;
      } catch {}
    };
    // Loop back to the start offset instead of 0.
    const onEnded = () => {
      try {
        v.currentTime = startAt;
        v.play().catch(() => {});
      } catch {}
    };
    v.addEventListener("loadedmetadata", seekStart);
    v.addEventListener("ended", onEnded);

    // Play only while visible to save bandwidth.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);

    return () => {
      v.removeEventListener("loadedmetadata", seekStart);
      v.removeEventListener("ended", onEnded);
      io.disconnect();
    };
  }, [startAt, src]);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-8">
      <div className="relative flex min-h-[300px] items-center justify-start overflow-hidden rounded-xl sm:min-h-[400px] md:min-h-[440px]">
        <video
          ref={videoRef}
          src={startAt > 0 ? `${src}#t=${startAt}` : src}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />

        <div className="relative z-10 max-w-lg px-6 py-10 text-left text-porcelain sm:px-10 lg:px-14">
          {eyebrow && (
            <p className="mb-3 text-[12px] tracking-[0.24em] uppercase text-porcelain/85">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-4xl">
            {heading}
          </h2>
          {subtext && (
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-porcelain/90">
              {subtext}
            </p>
          )}
          {href && ctaLabel && (
            <div className="mt-6">
              <Link
                href={href}
                className="inline-block border border-porcelain px-7 py-3 text-[11px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                {ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
