import { getAllReviews } from "@/lib/review-store";
import { formatReviewDate } from "@/lib/review";
import { Stars } from "@/components/Stars";
import { ReviewModerate } from "@/app/admin/ReviewModerate";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const reviews = await getAllReviews();
  const pending = reviews.filter((r) => !r.approved);
  // Pending first, then the rest (already newest-sorted within each).
  const ordered = [...pending, ...reviews.filter((r) => r.approved)];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Reviews</h1>
        <p className="mt-1 text-sm text-stone">
          {reviews.length} total · {pending.length} awaiting approval
        </p>
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        Reviews stay hidden until you <span className="text-gold">approve</span> them. Approved
        reviews show on the Reviews page and in the home-page reviews section. The WhatsApp number,
        invoice number and email are <span className="text-gold">private</span> — use them to verify
        the purchase before approving.
      </div>

      {reviews.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No reviews yet.</p>
          <p className="mt-1 text-sm text-stone">
            Reviews left on the site will appear here for approval.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ordered.map((r) => (
            <div
              key={r.id}
              className={`border px-4 py-4 ${
                r.approved ? "border-line bg-white" : "border-gold/40 bg-gold/[0.04]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <Stars value={r.rating} />
                <span className="text-[13px] text-ink">
                  {r.productTitle || "Service / house review"}
                </span>
                {!r.approved && (
                  <span className="text-[10px] tracking-[0.12em] uppercase text-gold">Pending</span>
                )}
                <span className="ml-auto text-[12px] tabular-nums text-stone">
                  {formatReviewDate(r.createdAt)}
                </span>
              </div>
              {r.title && <p className="mt-2 font-display text-lg text-ink">{r.title}</p>}
              <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-stone">
                {r.body}
              </p>

              {/* Private verification details (never shown publicly) */}
              {(r.whatsapp || r.billNumber || r.email) && (
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-line-soft pt-3 text-[12px] text-stone">
                  {r.whatsapp && (
                    <span>
                      <span className="uppercase tracking-[0.1em] text-stone/70">WhatsApp </span>
                      <a
                        href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink underline underline-offset-2 hover:text-gold"
                      >
                        {r.whatsapp}
                      </a>
                    </span>
                  )}
                  {r.billNumber && (
                    <span>
                      <span className="uppercase tracking-[0.1em] text-stone/70">Bill </span>
                      <span className="text-ink">{r.billNumber}</span>
                    </span>
                  )}
                  {r.email && (
                    <span>
                      <span className="uppercase tracking-[0.1em] text-stone/70">Email </span>
                      <a href={`mailto:${r.email}`} className="text-ink underline underline-offset-2 hover:text-gold">
                        {r.email}
                      </a>
                    </span>
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.1em] text-stone">— {r.name}</span>
                <ReviewModerate id={r.id} approved={r.approved} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
