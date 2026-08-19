import { getCurrentCustomerId } from "@/lib/customer-auth";
import { getSaved, setSaved } from "@/lib/customer-store";
import type { WishItem } from "@/lib/wishlist";

// GET  -> { authed, items }: the signed-in customer's saved pieces (empty if not
//         signed in). POST -> replaces the saved list when signed in; no-op
//         otherwise. The browser wishlist calls this to sync with the profile.

export async function GET(): Promise<Response> {
  const id = await getCurrentCustomerId();
  if (!id) return Response.json({ authed: false, items: [] });
  return Response.json({ authed: true, items: await getSaved(id) });
}

export async function POST(request: Request): Promise<Response> {
  const id = await getCurrentCustomerId();
  if (!id) return Response.json({ authed: false, ok: false });
  let items: WishItem[] = [];
  try {
    const body = (await request.json()) as { items?: WishItem[] };
    if (Array.isArray(body.items)) items = body.items;
  } catch {
    return Response.json({ authed: true, ok: false }, { status: 400 });
  }
  await setSaved(id, items);
  return Response.json({ authed: true, ok: true });
}
