import { getEnquiries } from "@/lib/enquiry-store";
import { ENQUIRY_LABEL } from "@/lib/enquiry";
import { EnquiryActions } from "@/app/admin/EnquiryActions";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();
  const unread = enquiries.filter((e) => !e.read).length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Enquiries</h1>
          <p className="mt-1 text-sm text-stone">
            {enquiries.length} total · {unread} unread
          </p>
        </div>
        {enquiries.length > 0 && (
          <a
            href="/api/admin/enquiries"
            className="border border-line px-4 py-2 text-[12px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
          >
            ↓ Export CSV
          </a>
        )}
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        Every enquiry from the site lands here — and each records the{" "}
        <span className="text-ink">source</span> that brought the visitor (e.g. Instagram, Google),
        so you can see which channels drive real leads.
      </div>

      {enquiries.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No enquiries yet.</p>
          <p className="mt-1 text-sm text-stone">
            Drop-a-Hint, appointment, and customise requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className={`border px-4 py-4 ${
                e.read ? "border-line bg-white" : "border-gold/40 bg-gold/[0.04]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {!e.read && <span className="h-2 w-2 rounded-full bg-gold" aria-label="unread" />}
                <span className="text-[10px] tracking-[0.14em] uppercase text-sapphire">
                  {ENQUIRY_LABEL[e.type]}
                </span>
                {e.productTitle && (
                  <span className="text-[13px] text-ink">· {e.productTitle}</span>
                )}
                <span className="ml-auto text-[12px] tabular-nums text-stone">{when(e.createdAt)}</span>
              </div>

              <div className="mt-2 grid gap-x-6 gap-y-1 text-[14px] sm:grid-cols-2">
                <p className="text-ink">
                  <span className="text-stone">From: </span>
                  {e.name || "—"}
                </p>
                <p className="text-ink">
                  <span className="text-stone">Contact: </span>
                  {e.contact || "—"}
                </p>
                {e.recipientEmail && (
                  <p className="text-ink">
                    <span className="text-stone">Recipient: </span>
                    {e.recipientName} &lt;{e.recipientEmail}&gt;
                  </p>
                )}
                <p className="text-ink">
                  <span className="text-stone">Source: </span>
                  {e.source}
                  {e.medium ? ` / ${e.medium}` : ""}
                  {e.campaign ? ` · ${e.campaign}` : ""}
                </p>
              </div>

              {e.message && (
                <p className="mt-2 whitespace-pre-line border-l-2 border-line pl-3 text-[14px] leading-relaxed text-stone">
                  {e.message}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                {e.productUrl ? (
                  <a
                    href={e.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink"
                  >
                    View piece ↗
                  </a>
                ) : (
                  <span />
                )}
                <EnquiryActions id={e.id} read={e.read} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
