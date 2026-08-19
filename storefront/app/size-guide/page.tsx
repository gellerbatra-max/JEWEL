import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ring Size Guide",
  description:
    "Find your ring size — measure at home and convert between US, UK, Europe, Japan, and India sizes. Taygerian sizes in US (as Sri Lankan jewellers do); any size is made to order.",
};

// ISO 8653 conversions (US 4–10). India column is approximate (Indian sizing is
// numeric, based on inner circumference). Sri Lankan fine jewellers use US sizes
// + millimetre measurements, so US / mm is the reference here.
type Row = {
  us: string;
  dia: string;
  circ: string;
  uk: string;
  eu: string;
  jp: string;
  india: string;
  stocked?: boolean;
};

const ROWS: Row[] = [
  { us: "4", dia: "14.8", circ: "46.5", uk: "H", eu: "46", jp: "7", india: "7", stocked: true },
  { us: "4.5", dia: "15.2", circ: "47.8", uk: "I", eu: "48", jp: "8", india: "8", stocked: true },
  { us: "5", dia: "15.7", circ: "49.3", uk: "J", eu: "49", jp: "9", india: "9", stocked: true },
  { us: "5.5", dia: "16.0", circ: "50.3", uk: "K", eu: "50", jp: "10", india: "10", stocked: true },
  { us: "6", dia: "16.5", circ: "51.8", uk: "L", eu: "51", jp: "12", india: "12", stocked: true },
  { us: "6.5", dia: "16.9", circ: "53.1", uk: "M", eu: "52", jp: "13", india: "13", stocked: true },
  { us: "7", dia: "17.3", circ: "54.4", uk: "N", eu: "54", jp: "14", india: "14", stocked: true },
  { us: "7.5", dia: "17.7", circ: "55.7", uk: "O", eu: "55", jp: "15", india: "16", stocked: true },
  { us: "8", dia: "18.1", circ: "57.0", uk: "P", eu: "57", jp: "16", india: "18", stocked: true },
  { us: "8.5", dia: "18.5", circ: "58.3", uk: "Q", eu: "58", jp: "17", india: "19", stocked: true },
  { us: "9", dia: "19.0", circ: "59.5", uk: "R", eu: "59", jp: "19", india: "20", stocked: true },
  { us: "9.5", dia: "19.4", circ: "60.8", uk: "S", eu: "60", jp: "20", india: "21" },
  { us: "10", dia: "19.8", circ: "62.1", uk: "T", eu: "62", jp: "21", india: "22" },
];

const th = "px-3 py-3 text-[11px] font-normal tracking-[0.1em] uppercase text-stone whitespace-nowrap";
const td = "px-3 py-2.5 text-[14px] tabular-nums text-ink whitespace-nowrap";

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16">
      <PageIntro eyebrow="Rings" title="Ring Size Guide">
        We size our rings in <strong className="text-ink">US sizes</strong> — the standard used by
        Sri Lanka&apos;s fine jewellers — and the chart below converts to the UK, Europe, Japan, and
        India. Any size can be made to order.
      </PageIntro>

      {/* How to measure */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Method
          n="1"
          title="Measure a ring you own"
          steps={[
            "Take a ring that already fits the right finger.",
            "Measure the inside diameter across the middle, in millimetres.",
            "Find that number in the Diameter (mm) column below.",
          ]}
        />
        <Method
          n="2"
          title="Measure your finger"
          steps={[
            "Wrap a thin strip of paper or string around the base of the finger.",
            "Mark where it overlaps and measure the length in millimetres.",
            "Find that number in the Circumference (mm) column below.",
          ]}
        />
      </div>

      {/* Conversion table */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-2xl text-ink">International conversions</h2>
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left">
            <thead className="border-b border-line bg-cloud/50">
              <tr>
                <th className={th}>US / Canada</th>
                <th className={th}>Diameter (mm)</th>
                <th className={th}>Circumference (mm)</th>
                <th className={th}>UK / Aus</th>
                <th className={th}>Europe</th>
                <th className={th}>Japan</th>
                <th className={th}>India</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.us} className="border-b border-line-soft last:border-0 hover:bg-cloud/30">
                  <td className={`${td} font-semibold`}>
                    {r.us}
                    {r.stocked && (
                      <span className="ml-2 align-middle text-[9px] uppercase tracking-[0.1em] text-gold">
                        in stock
                      </span>
                    )}
                  </td>
                  <td className={td}>{r.dia}</td>
                  <td className={td}>{r.circ}</td>
                  <td className={td}>{r.uk}</td>
                  <td className={td}>{r.eu}</td>
                  <td className={td}>{r.jp}</td>
                  <td className={td}>{r.india}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-stone">
          Based on ISO 8653 standards. Europe/Japan values are rounded to the nearest standard size;
          India&apos;s numeric sizing is approximate (it tracks inner circumference). We stock US 4–9
          and craft any other size — including quarter sizes — to order.
        </p>
      </div>

      {/* Tips */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-2xl text-ink">Tips for an accurate fit</h2>
        <ul className="grid gap-2.5 text-[14.5px] leading-relaxed text-stone sm:grid-cols-2">
          {[
            "Measure at the end of the day, when fingers are at their largest.",
            "Warm hands measure larger than cold — avoid measuring when chilly.",
            "Wide or heavy bands fit more snugly; consider a quarter size up.",
            "The same finger differs on each hand — measure the exact one.",
            "If you're between sizes, size up rather than down.",
            "Knuckle larger than the base? Size to slide over the knuckle.",
          ].map((t) => (
            <li key={t} className="relative pl-5">
              <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-gold" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Sri Lanka + international note */}
      <div className="mt-12 border border-line bg-cloud/40 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink">Sri Lanka &amp; overseas orders</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-stone">
          In Sri Lanka, fine jewellers size in <strong className="text-ink">US sizes and
          millimetres</strong>, so those are your reference — the Indian column is included only for
          those who know their Indian size. For clients in Australia, Europe, the UK, or Japan, use
          the conversion for your region. Not sure? Send us your finger&apos;s diameter or
          circumference in millimetres and we&apos;ll do the rest.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={waLink("Hi Taygerian, I'd like help finding my ring size.")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          Get sizing help on WhatsApp
        </a>
        <Link
          href="/care"
          className="text-[13px] text-stone underline underline-offset-2 transition-colors hover:text-ink"
        >
          Resizing &amp; care services
        </Link>
      </div>
    </div>
  );
}

function Method({ n, title, steps }: { n: string; title: string; steps: string[] }) {
  return (
    <div className="border border-line bg-white/50 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold font-display text-gold">
          {n}
        </span>
        <h3 className="font-display text-lg text-ink">{title}</h3>
      </div>
      <ol className="mt-4 space-y-2 text-[14px] leading-relaxed text-stone">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="tabular-nums text-gold">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
