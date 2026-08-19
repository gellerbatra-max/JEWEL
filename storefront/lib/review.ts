// Client-safe review types (no fs). Store lives in ./review-store.ts.

export type Review = {
  id: string;
  productHandle: string; // "" = a review of the service / house (not a specific piece)
  productTitle: string; // snapshot for display in admin / listings
  rating: number; // 1–5
  name: string;
  title: string;
  body: string;
  createdAt: string;
  approved: boolean;
};

export function averageRating(reviews: Review[]): { count: number; avg: number } {
  if (reviews.length === 0) return { count: 0, avg: 0 };
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return { count: reviews.length, avg: Math.round((sum / reviews.length) * 10) / 10 };
}

export function formatReviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}
