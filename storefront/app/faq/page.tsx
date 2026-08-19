import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers on ordering, payment, sizing, certification, shipping, customs, returns and care for Taygerian fine jewellery.",
};

type QA = { q: string; a: string };
type Group = { heading: string; items: QA[] };

const GROUPS: Group[] = [
  {
    heading: "Ordering & payment",
    items: [
      {
        q: "How do I buy a piece?",
        a: "Every piece begins with an enquiry. You'll receive a written quote, then pay securely by bank transfer. See How to Order for the full journey. A card payment gateway is coming soon.",
      },
      {
        q: "Do the prices include everything?",
        a: "Your quote is itemised and includes the certified stone and worldwide insured shipping. Import duties or taxes in your country, where they apply, are separate — we'll flag them where we can.",
      },
      {
        q: "Can I reserve a piece while I decide?",
        a: "Yes. Tell us and we'll hold a piece for a short period. One-of-a-kind pieces are offered first-come, so a reservation is the surest way to secure one.",
      },
    ],
  },
  {
    heading: "Stones & certification",
    items: [
      {
        q: "Are your gemstones certified?",
        a: "Our principal stones are independently certified by leading laboratories (GIA, GRS, AGL). The report number and verified origin are shown on the piece and travel with it. See Certification & Authenticity.",
      },
      {
        q: "Are the sapphires heated?",
        a: "Most sapphires are gently heated — a long-accepted practice that stabilises colour. Where a stone is unheated, we say so, and the certificate confirms it.",
      },
      {
        q: "Where do the stones come from?",
        a: "Predominantly Ceylon (Sri Lanka), from the gem gravels around Ratnapura. Responsible sourcing matters to us — see Responsible Sourcing.",
      },
    ],
  },
  {
    heading: "Sizing & customisation",
    items: [
      {
        q: "How do I find my ring size?",
        a: "Use our ring size guide, linked on every ring page. If you're between sizes or unsure, message us — most designs can be made to your exact size.",
      },
      {
        q: "Can a piece be customised?",
        a: "Almost always — metal, stone, size, and engraving. Use Customise Me on any product page, or ask about a fully bespoke commission.",
      },
    ],
  },
  {
    heading: "Delivery, returns & care",
    items: [
      {
        q: "How is my piece shipped?",
        a: "Fully insured and tracked, worldwide, in its Taygerian box with the gem certificate. See Shipping & Delivery.",
      },
      {
        q: "What is your returns policy?",
        a: "In-stock pieces may be returned within the window set out in Returns & Exchanges. Bespoke and made-to-order pieces, being made for you, are handled case by case.",
      },
      {
        q: "Do you offer repairs and servicing?",
        a: "Yes — cleaning, resizing, restringing, and valuation for insurance. See Jewellery Care & Servicing.",
      },
    ],
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((qa) => ({
        "@type": "Question",
        name: qa.q,
        acceptedAnswer: { "@type": "Answer", text: qa.a },
      }))
    ),
  };

  return (
    <div className="mx-auto max-w-[820px] px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageIntro eyebrow="Help" title="Frequently Asked Questions">
        The essentials, in short. If your question isn&apos;t here, we&apos;re a message away.
      </PageIntro>

      <div className="space-y-12">
        {GROUPS.map((g) => (
          <section key={g.heading}>
            <h2 className="mb-3 text-[12px] tracking-[0.16em] uppercase text-gold">{g.heading}</h2>
            <div className="divide-y divide-line border-y border-line">
              {g.items.map((qa) => (
                <details key={qa.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    <span>{qa.q}</span>
                    <span className="shrink-0 text-gold transition-transform duration-200 group-open:rotate-45">
                      ＋
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[14.5px] leading-relaxed text-stone">{qa.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-14 text-center text-[15px] text-stone">
        Still have a question?{" "}
        <Link href="/contact" className="text-gold underline underline-offset-2 hover:text-ink">
          Contact the atelier
        </Link>
        .
      </p>
    </div>
  );
}
