import { addEnquiry, type EnquiryInput } from "@/lib/enquiry-store";
import type { Enquiry, EnquiryType } from "@/lib/enquiry";

// Receives an enquiry from the storefront forms, saves it to the self-owned
// inbox (data/enquiries.json → visible in the dashboard), and — if you've set
// ENQUIRY_WEBHOOK_URL — fires an instant notification so a lead never waits.
//
// Optional env:
//   ENQUIRY_WEBHOOK_URL — any incoming webhook (Slack, Discord, Zapier, Make…)

const TYPES: EnquiryType[] = ["hint", "appointment", "customise", "general"];

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const s = (k: string) => (body[k] == null ? undefined : String(body[k]));
  const rawType = s("type") as EnquiryType | undefined;
  const type: EnquiryType = rawType && TYPES.includes(rawType) ? rawType : "general";

  const input: EnquiryInput = {
    type,
    productTitle: s("product_title"),
    productHandle: s("product_handle"),
    productSku: s("product_sku"),
    productUrl: s("product_url"),
    name: s("name"),
    contact: s("contact"),
    recipientName: s("recipient_name"),
    recipientEmail: s("recipient_email"),
    message: s("message"),
    source: s("attr_source"),
    medium: s("attr_medium"),
    campaign: s("attr_campaign"),
    referrer: s("attr_referrer"),
    landingPath: s("attr_landing"),
  };

  try {
    const saved = await addEnquiry(input);
    notify(saved); // fire-and-forget
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Could not save enquiry" }, { status: 500 });
  }
}

function notify(e: Enquiry): void {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return;
  const lines = [
    `New ${e.type} enquiry`,
    e.productTitle ? `Piece: ${e.productTitle}${e.productSku ? ` (${e.productSku})` : ""}` : "",
    e.name ? `From: ${e.name}` : "",
    e.contact ? `Contact: ${e.contact}` : "",
    e.recipientEmail ? `Recipient: ${e.recipientName} <${e.recipientEmail}>` : "",
    e.message ? `Message: ${e.message}` : "",
    `Source: ${e.source}${e.medium ? ` / ${e.medium}` : ""}`,
  ].filter(Boolean);
  const text = lines.join("\n");
  // Slack/Discord accept { text } / { content }; send both keys so either works.
  fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text, content: text }),
  }).catch(() => {});
}
