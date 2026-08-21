"use client";

import { useRef } from "react";
import Link from "next/link";
import { Stars } from "./Stars";

export type ReviewCard = {
  id: string;
  name: string;
  rating: number;
  title?: string;
  body: string;
  productTitle?: string;
};

// "Loved By Our Customers" — a horizontal carousel of approved reviews with an
// aggregate rating badge, in the style of the reference site.
export function CustomerReviews({
  reviews,
  avg,
  count,
  title = "Loved By Our Customers",
}: {
  reviews: ReviewCard[];
  avg: number;
  count: number;
  title?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  if (!reviews.length) return null;

  const scroll = (dir: number) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
        <div className="mt-3 flex items-center justify-center gap-2 text-[15px] text-ink">
          <Stars value={avg} size={18} />
          <span className="tabular-nums">
            {avg.toFixed(2)} · {count} {count === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white md:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-white md:flex"
        >
          ›
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="flex w-[260px] shrink-0 snap-start flex-col rounded-xl border border-line bg-white p-6 sm:w-[300px]"
            >
              {r.title && <p className="mb-1.5 font-display text-lg text-ink">{r.title}</p>}
              <blockquote className="line-clamp-5 text-[14.5px] leading-relaxed text-stone">
                {r.body}
              </blockquote>
              <div className="mt-4">
                <Stars value={r.rating} />
              </div>
              <figcaption className="mt-3">
                <p className="text-[14px] font-semibold text-ink">{r.name}</p>
                {r.productTitle && (
                  <p className="mt-0.5 text-[12px] text-stone">{r.productTitle}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-9 text-center">
        <Link
          href="/reviews"
          className="border-b border-gold pb-1 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold"
        >
          Read all &amp; write a review
        </Link>
      </div>
    </section>
  );
}
