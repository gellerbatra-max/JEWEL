import Link from "next/link";
import { getEnquiries } from "@/lib/enquiry-store";
import { getSubscribers } from "@/lib/newsletter-store";
import { getAllProducts } from "@/lib/catalog-store";
import { ENQUIRY_LABEL, type EnquiryType } from "@/lib/enquiry";

export const dynamic = "force-dynamic";

const GA_ON = !!process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_ON = !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

function countBy<T>(items: T[], key: (t: T) => string): { label: string; n: number }[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it) || "—";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
}

function daysAgo(iso: string, now: number): number {
  return (now - new Date(iso).getTime()) / 86_400_000;
}

export default async function InsightsPage() {
  const [enquiries, subscribers, products] = await Promise.all([
    getEnquiries(),
    getSubscribers(),
    getAllProducts(),
  ]);
  const now = Date.now();

  const unread = enquiries.filter((e) => !e.read).length;
  const last30 = enquiries.filter((e) => daysAgo(e.createdAt, now) <= 30).length;
  const onHome = products.filter((p) => p.showOnHome).length;

  const bySource = countBy(enquiries, (e) => e.source);
  const byType = countBy(enquiries, (e) => ENQUIRY_LABEL[e.type as EnquiryType] ?? e.type);
  const subsBySource = countBy(subscribers, (s) => s.source);
  const recent = enquiries.slice(0, 5);
  const maxSource = Math.max(1, ...bySource.map((s) => s.n));

  const cards = [
    { label: "Enquiries", value: enquiries.length, sub: `${last30} in last 30 days`, href: "/admin/enquiries" },
    { label: "Unread", value: unread, sub: unread ? "needs a reply" : "all caught up", href: "/admin/enquiries" },
    { label: "Subscribers", value: subscribers.length, sub: "on your list", href: "/admin/newsletter" },
    { label: "Pieces", value: products.length, sub: `${onHome} on home page`, href: "/admin" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Insights</h1>
        <p className="mt-1 text-sm text-stone">
          Your customers and leads at a glance — and which channels bring them.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-line bg-white p-5 transition-colors hover:border-ink"
          >
            <p className="text-[11px] tracking-[0.12em] uppercase text-stone">{c.label}</p>
            <p className="mt-2 font-display text-4xl tabular-nums text-ink">{c.value}</p>
            <p className="mt-1 text-[12px] text-stone">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Leads by source */}
        <section className="border border-line bg-white p-6">
          <h2 className="font-display text-xl text-ink">Where your leads come from</h2>
          <p className="mt-1 text-[13px] text-stone">
            The channel that first brought each enquiring visitor.
          </p>
          <div className="mt-5 space-y-3">
            {bySource.length === 0 && <p className="text-sm text-stone">No enquiries yet.</p>}
            {bySource.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="capitalize text-ink">{s.label}</span>
                  <span className="tabular-nums text-stone">{s.n}</span>
                </div>
                <div className="h-2 w-full bg-cloud">
                  <div
                    className="h-2 bg-gold"
                    style={{ width: `${Math.round((s.n / maxSource) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enquiries by type + subscribers by source */}
        <section className="space-y-6">
          <div className="border border-line bg-white p-6">
            <h2 className="font-display text-xl text-ink">Enquiries by type</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {byType.length === 0 && <p className="text-sm text-stone">No enquiries yet.</p>}
              {byType.map((t) => (
                <span
                  key={t.label}
                  className="border border-line px-3 py-1.5 text-[13px] text-ink"
                >
                  {t.label} <span className="ml-1 tabular-nums text-gold">{t.n}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="border border-line bg-white p-6">
            <h2 className="font-display text-xl text-ink">Subscribers by source</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {subsBySource.length === 0 && <p className="text-sm text-stone">No subscribers yet.</p>}
              {subsBySource.map((t) => (
                <span
                  key={t.label}
                  className="border border-line px-3 py-1.5 text-[13px] capitalize text-ink"
                >
                  {t.label} <span className="ml-1 tabular-nums text-gold">{t.n}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Recent enquiries */}
      <section className="mt-6 border border-line bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="text-[12px] tracking-[0.1em] uppercase text-stone hover:text-ink">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-stone">Nothing yet.</p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {recent.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[13.5px]">
                {!e.read && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                <span className="text-[10px] uppercase tracking-[0.1em] text-sapphire">
                  {ENQUIRY_LABEL[e.type as EnquiryType] ?? e.type}
                </span>
                <span className="text-ink">{e.name || "—"}</span>
                {e.productTitle && <span className="text-stone">· {e.productTitle}</span>}
                <span className="ml-auto capitalize text-stone">{e.source}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Traffic analytics pointer */}
      <section className="mt-6 border border-line bg-cloud/50 p-6">
        <h2 className="font-display text-xl text-ink">Website traffic</h2>
        {GA_ON || PLAUSIBLE_ON ? (
          <p className="mt-2 text-[14px] leading-relaxed text-stone">
            Full visitor &amp; traffic analytics are being collected
            {GA_ON ? " in Google Analytics" : ""}
            {GA_ON && PLAUSIBLE_ON ? " and" : ""}
            {PLAUSIBLE_ON ? " in Plausible" : ""}. Open that dashboard to see page views, visitors,
            and the pages and channels driving traffic. The numbers above (your actual leads and
            subscribers) live here, on your own site.
          </p>
        ) : (
          <p className="mt-2 text-[14px] leading-relaxed text-stone">
            Detailed page-view and visitor traffic isn&apos;t connected yet. When you&apos;re ready,
            add a Google Analytics or Plausible ID and full traffic reporting switches on
            automatically — the lead and subscriber data above is always kept here regardless.
          </p>
        )}
      </section>
    </div>
  );
}
