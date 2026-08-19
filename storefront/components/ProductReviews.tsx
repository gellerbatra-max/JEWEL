import { getApprovedForProduct } from "@/lib/review-store";
import { averageRating, formatReviewDate } from "@/lib/review";
import { Stars } from "./Stars";
import { ReviewForm } from "./ReviewForm";

export async function ProductReviews({ handle, title }: { handle: string; title: string }) {
  const reviews = await getApprovedForProduct(handle);
  const { count, avg } = averageRating(reviews);

  return (
    <section className="mx-auto max-w-[820px] px-6 pb-24">
      <div className="border-t border-line pt-14">
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">Reviews</p>
          {count > 0 ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <Stars value={avg} size={20} />
              <span className="text-[15px] text-ink">
                {avg} · {count} {count === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-[15px] text-stone">Be the first to review this piece.</p>
          )}
        </div>

        {count > 0 && (
          <div className="mb-12 divide-y divide-line border-y border-line">
            {reviews.map((r) => (
              <div key={r.id} className="py-5">
                <div className="flex items-center justify-between gap-3">
                  <Stars value={r.rating} />
                  <span className="text-[12px] tabular-nums text-stone">
                    {formatReviewDate(r.createdAt)}
                  </span>
                </div>
                {r.title && <p className="mt-2 font-display text-lg text-ink">{r.title}</p>}
                <p className="mt-1.5 whitespace-pre-line text-[14.5px] leading-relaxed text-stone">
                  {r.body}
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-stone">— {r.name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto max-w-[560px]">
          <h3 className="mb-5 text-center font-display text-xl text-ink">Write a review</h3>
          <ReviewForm productHandle={handle} productTitle={title} />
        </div>
      </div>
    </section>
  );
}
