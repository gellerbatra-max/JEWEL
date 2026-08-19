import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Order",
  description:
    "How buying a Taygerian piece works — enquire, consult, receive a written quote, pay securely by bank transfer, and receive your insured, certified piece.",
};

const STEPS = [
  {
    t: "Enquire",
    d: "Found a piece you love, or have one in mind? Send an enquiry from any product page — Drop a Hint, Book an Appointment, or Customise Me — or message us on WhatsApp. Tell us the piece, your size, and any changes you'd like.",
  },
  {
    t: "Consultation",
    d: "We reply personally, usually within a day. We'll confirm the stone, metal, and sizing, answer any questions on certification or origin, and — for a commission — share sketches or options.",
  },
  {
    t: "Written quote",
    d: "You receive a clear, itemised quote: the piece, the certified stone, any customisation, and worldwide insured shipping. No obligation, nothing hidden.",
  },
  {
    t: "Secure payment",
    d: "Approve the quote and we send secure payment instructions (bank transfer). For made-to-order and bespoke pieces we may take a deposit to begin, with the balance before dispatch. A card gateway is coming soon.",
  },
  {
    t: "Crafted for you",
    d: "In-stock pieces are prepared and inspected right away. Made-to-order and bespoke pieces are crafted in our atelier — typically two to six weeks — and we keep you updated as they progress.",
  },
  {
    t: "Insured delivery",
    d: "Your piece ships fully insured and tracked, in its Taygerian box with its gem certificate. We'll share the tracking the moment it leaves us.",
  },
];

export default function HowToOrderPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Ordering" title="How to Order">
        Taygerian is, for now, an enquiry-and-commission house rather than an instant checkout. It
        means every piece begins with a conversation — and that you're guided personally from first
        message to finished piece.
      </PageIntro>

      <ol className="mt-6 space-y-px">
        {STEPS.map((s, i) => (
          <li
            key={s.t}
            className="flex gap-6 border-t border-line py-7 last:border-b sm:gap-9"
          >
            <span className="shrink-0 font-display text-2xl tabular-nums text-gold sm:text-3xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">{s.t}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-stone">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 border border-line bg-cloud/50 p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl text-ink">Ready to begin?</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-stone">
          Tell us what you're looking for. There's no obligation — just a conversation with the
          people who will make your piece.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={waLink("Hi Taygerian, I'd like to start an enquiry.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
          >
            Message on WhatsApp
          </a>
          <Link
            href="/jewellery"
            className="border border-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
          >
            Browse the collection
          </Link>
        </div>
      </div>
    </div>
  );
}
