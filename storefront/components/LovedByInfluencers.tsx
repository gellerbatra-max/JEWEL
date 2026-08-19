"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/products";
import { isVideoMedia, type UgcCard } from "@/lib/ugc";

// Shoppable "Loved by Influencers" carousel — a horizontal row of tall video/
// photo cards, each linked to the piece it features. Videos play only while on
// screen (IntersectionObserver) to keep it light.
export function LovedByInfluencers({
  cards,
  title = "Loved by Influencers",
}: {
  cards: UgcCard[];
  title?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.4 }
    );
    vids.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, [cards.length]);

  if (!cards.length) return null;

  const scroll = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[13px] tracking-[0.2em] uppercase text-gold">Seen &amp; Worn</p>
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-3 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white md:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute -right-3 top-[38%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white md:flex"
        >
          ›
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {cards.map((c, i) => (
            <Link
              key={c.id}
              href={`/products/${c.product.handle}`}
              className="group w-[220px] shrink-0 snap-start sm:w-[248px]"
            >
              <div className="relative aspect-[3/5] overflow-hidden rounded-xl bg-cloud">
                {isVideoMedia(c.media) ? (
                  <video
                    ref={(el) => {
                      vids.current[i] = el;
                    }}
                    src={c.media}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={c.media}
                    alt=""
                    fill
                    sizes="248px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
                {c.name && (
                  <span className="absolute left-2 top-2 rounded bg-ink/45 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
                    {c.name}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-cloud">
                  {c.product.image ? (
                    <Image src={c.product.image} alt="" fill sizes="44px" className="object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] text-ink transition-colors group-hover:text-gold">
                    {c.product.title}
                  </p>
                  <p className="text-[13px] tabular-nums text-stone">
                    {c.product.oneOfAKind
                      ? "Price on request"
                      : formatPrice(c.product.price, c.product.currency)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
