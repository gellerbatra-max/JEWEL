import { getSubscribers } from "@/lib/newsletter-store";
import { SubscriberRemove } from "@/app/admin/SubscriberRemove";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Newsletter</h1>
          <p className="mt-1 text-sm text-stone">
            {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}
          </p>
        </div>
        {subscribers.length > 0 && (
          <a
            href="/api/admin/subscribers"
            className="border border-line px-4 py-2 text-[12px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
          >
            ↓ Export CSV
          </a>
        )}
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        Your list is stored here, on your own site — export it any time to Mailchimp, a spreadsheet,
        or wherever you send campaigns. Each signup records the channel it came from.
      </div>

      {subscribers.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No subscribers yet.</p>
          <p className="mt-1 text-sm text-stone">
            The footer signup form adds people here as they join.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-line bg-white text-[11px] tracking-[0.1em] uppercase text-stone">
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">WhatsApp</th>
                <th className="px-4 py-3 font-normal">Source</th>
                <th className="px-4 py-3 font-normal">Joined</th>
                <th className="px-4 py-3 font-normal text-right">—</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email || s.whatsapp} className="border-b border-line-soft bg-white last:border-0">
                  <td className="px-4 py-3 text-ink">{s.email || "—"}</td>
                  <td className="px-4 py-3 tabular-nums text-ink">{s.whatsapp || "—"}</td>
                  <td className="px-4 py-3 text-stone">
                    {s.source}
                    {s.medium && s.medium !== "direct" ? ` / ${s.medium}` : ""}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stone">{when(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <SubscriberRemove id={s.email || s.whatsapp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
