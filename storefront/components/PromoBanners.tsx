"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PromoBanner } from "@/lib/promo";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

function Cta({ href, label, className }: { href: string; label: string; className: string }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

// Owner-managed promotional banners (e.g. "Follow us & win a gift voucher").
// Auto-rotates when there is more than one; hidden when there are none.
export function PromoBanners({ banners }: { banners: PromoBanner[] }) {
  const [i, setI] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => {
      if (!paused.current) setI((x) => (x + 1) % banners.length);
    }, 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;
  const b = banners[i % banners.length];
  const hasImage = Boolean(b.image);
  const textOnImage = hasImage;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-8">
      <div
        className="relative flex min-h-[190px] items-center justify-center overflow-hidden rounded-xl sm:min-h-[230px]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {/* Background */}
        {hasImage ? (
          <>
            <Image src={b.image} alt="" fill sizes="(max-width: 1600px) 100vw, 1600px" className="object-cover" priority={false} />
            <div className="absolute inset-0 bg-ink/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-cloud via-porcelain to-cloud" />
        )}

        {/* Content */}
        <div className={`relative z-10 max-w-2xl px-6 py-10 text-center ${textOnImage ? "text-porcelain" : "text-ink"}`}>
          {b.heading && (
            <h2 className={`font-display text-2xl leading-tight sm:text-3xl ${textOnImage ? "drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" : ""}`}>
              {b.heading}
            </h2>
          )}
          {b.subtext && (
            <p className={`mx-auto mt-3 max-w-xl text-[15px] leading-relaxed ${textOnImage ? "text-porcelain/90" : "text-stone"}`}>
              {b.subtext}
            </p>
          )}
          {b.href && b.ctaLabel && (
            <div className="mt-6">
              <Cta
                href={b.href}
                label={b.ctaLabel}
                className={
                  textOnImage
                    ? "inline-block border border-porcelain px-7 py-3 text-[11px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                    : "inline-block bg-ink px-7 py-3 text-[11px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
                }
              />
            </div>
          )}
        </div>

        {/* Whole-banner link when there's a destination but no explicit button */}
        {b.href && !b.ctaLabel &&
          (isExternal(b.href) ? (
            <a href={b.href} target="_blank" rel="noopener noreferrer" aria-label={b.heading} className="absolute inset-0 z-20" />
          ) : (
            <Link href={b.href} aria-label={b.heading} className="absolute inset-0 z-20" />
          ))}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {banners.map((bn, idx) => (
            <button
              key={bn.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show banner ${idx + 1}`}
              aria-current={idx === i}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-gold" : "w-1.5 bg-stone/40"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
