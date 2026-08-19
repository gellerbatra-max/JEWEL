import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Jewellery Care & Servicing",
  description:
    "How to care for your Taygerian piece, and the services we offer — cleaning, resizing, restringing, repairs, and valuation for insurance.",
};

export default function CarePage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Service" title="Jewellery Care & Servicing">
        A fine piece is made to last generations. A little care keeps it as luminous as the day it
        left our workshop — and we&apos;re here to help for its whole life.
      </PageIntro>

      <Prose>
        <h2>Everyday care</h2>
        <ul>
          <li>
            Put jewellery on last — after perfume, lotion, and hairspray — and take it off first.
          </li>
          <li>
            Remove pieces for swimming, cleaning, gardening, and the gym; chlorine and knocks are the
            usual culprits.
          </li>
          <li>
            Store pieces separately in a soft pouch or a lined box so stones and metal don&apos;t
            scratch one another.
          </li>
        </ul>

        <h2>Gentle cleaning at home</h2>
        <p>
          For most gold and sapphire pieces, a soak in warm water with a drop of mild dish soap, a
          soft brush around the setting, then a pat dry with a lint-free cloth restores the sparkle.
          Avoid harsh chemicals and ultrasonic cleaners unless we&apos;ve told you a piece is
          suitable — some stones and treatments prefer to be left alone.
        </p>

        <h2>Services we offer</h2>
        <p>
          Because we make our pieces ourselves, we can also look after them. Our workshop in southern
          Sri Lanka offers:
        </p>
        <ul>
          <li>
            <strong>Professional cleaning &amp; polishing</strong> — a refresh that removes everyday
            wear.
          </li>
          <li>
            <strong>Resizing</strong> — most rings can be sized up or down.
          </li>
          <li>
            <strong>Restringing &amp; clasp repair</strong> — for necklaces and bracelets.
          </li>
          <li>
            <strong>Stone tightening &amp; repairs</strong> — settings checked and secured.
          </li>
          <li>
            <strong>Valuation for insurance</strong> — documentation for your insurer, on request.
          </li>
        </ul>

        <h2>Arranging a service</h2>
        <p>
          Tell us what your piece needs and we&apos;ll advise, quote where relevant, and arrange
          secure, insured shipping both ways.
        </p>
      </Prose>

      <div className="mx-auto mt-12 max-w-[720px]">
        <a
          href={waLink("Hi Taygerian, I'd like to arrange servicing for a piece.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          Arrange a service
        </a>
        <span className="ml-4 text-[14px] text-stone">
          or <Link href="/contact" className="text-gold underline underline-offset-2">contact the atelier</Link>
        </span>
      </div>
    </div>
  );
}
