import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Stars } from "@/components/Stars";
import { ReviewForm } from "@/components/ReviewForm";
import { getApprovedService, getApprovedAll } from "@/lib/review-store";
import { averageRating, formatReviewDate } from "@/lib/review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What Taygerian clients say — reviews of our Ceylon fine jewellery and the service behind every commission.",
};

export default async function ReviewsPage() {
  const [service, all] = await Promise.all([getApprovedService(), getApprovedAll()]);
  const overall = averageRating(all);

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Client Words" title="Reviews">
        The measure of a house is what its clients say when the piece is in their hands.
      </PageIntro>

      {overall.count > 0 && (
        <div className="mb-14 flex flex-col items-center gap-2">
          <Stars value={overall.avg} size={24} />
          <p className="text-[15px] text-ink">
            {overall.avg} out of 5 · {overall.count} {overall.count === 1 ? "review" : "reviews"}
          </p>
        </div>
      )}

      {service.length > 0 && (
        <div className="mb-16 space-y-8">
          {service.map((r) => (
            <figure key={r.id} className="border-l-2 border-gold pl-6">
              <Stars value={r.rating} />
              {r.title && <p className="mt-2 font-display text-xl text-ink">{r.title}</p>}
              <blockquote className="mt-2 whitespace-pre-line text-[16px] leading-relaxed text-stone">
                {r.body}
              </blockquote>
              <figcaption className="mt-3 text-[12px] uppercase tracking-[0.1em] text-stone">
                — {r.name} · {formatReviewDate(r.createdAt)}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {service.length === 0 && overall.count === 0 && (
        <p className="mb-14 text-center text-[15px] text-stone">
          No reviews published yet — yours could be the first.
        </p>
      )}

      <div className="mx-auto max-w-[560px] border-t border-line pt-12">
        <h2 className="mb-2 text-center font-display text-2xl text-ink">Share your experience</h2>
        <p className="mb-6 text-center text-[14px] text-stone">
          Tell us about your piece and the service behind it. Every review is read before it&apos;s
          published.
        </p>
        <ReviewForm />
      </div>

      <p className="mt-10 text-center text-[14px] text-stone">
        <Link href="/jewellery" className="text-gold underline underline-offset-2">
          Browse the collection
        </Link>
      </p>
    </div>
  );
}
