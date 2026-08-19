import { addReview, type ReviewInput } from "@/lib/review-store";

// Receives a review from the storefront. Stored unapproved; the owner approves
// it in the dashboard before it appears publicly.
export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const rating = Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return Response.json({ ok: false, error: "Please choose a rating." }, { status: 400 });
  }
  const body_ = String(body.body || "").trim();
  if (body_.length < 3) {
    return Response.json({ ok: false, error: "Please write a short review." }, { status: 400 });
  }

  const input: ReviewInput = {
    productHandle: body.product_handle == null ? "" : String(body.product_handle),
    productTitle: body.product_title == null ? "" : String(body.product_title),
    rating,
    name: body.name == null ? "" : String(body.name),
    title: body.title == null ? "" : String(body.title),
    body: body_,
  };

  try {
    await addReview(input);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Could not save your review" }, { status: 500 });
  }
}
