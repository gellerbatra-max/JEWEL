import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bespoke & Commissions",
  description:
    "Commission a one-of-a-kind piece with Taygerian — designed with you and handmade by our own goldsmiths in southern Sri Lanka, set with a certified Ceylon gemstone.",
};

const STEPS = [
  {
    t: "Conversation",
    d: "It starts with an idea — a stone you love, an occasion, a piece to reimagine, or a blank page. We listen, and talk you through what's possible.",
  },
  {
    t: "The stone",
    d: "We help you choose the heart of the piece: a certified Ceylon sapphire or coloured gemstone selected for colour, cut, and character, with its origin documented.",
  },
  {
    t: "Design",
    d: "We share sketches or references and refine the design with you — metal, setting, proportion — until it's exactly right. Nothing is made until you're sure.",
  },
  {
    t: "The making",
    d: "Your piece is crafted by our own goldsmiths in our southern Sri Lanka workshop, in a tradition handed down through generations. We keep you updated as it takes shape.",
  },
  {
    t: "Yours",
    d: "The finished piece arrives with its gem certificate, in its Taygerian box, delivered insured to your door — a piece that exists nowhere else.",
  },
];

export default function BespokePage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16">
      <PageIntro eyebrow="Bespoke" title="Commission a Piece">
        The rarest thing we make is the one designed for a single person. A Taygerian commission is a
        collaboration — your idea, our stones, and hands that have shaped fine jewellery for
        generations.
      </PageIntro>

      <div className="grid gap-px sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <div key={s.t} className="border border-line bg-white/50 p-7">
            <span className="font-display text-2xl tabular-nums text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-3 font-display text-xl text-ink">{s.t}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-stone">{s.d}</p>
          </div>
        ))}
        <div className="flex flex-col justify-center border border-line bg-cloud/50 p-7">
          <h2 className="font-display text-xl text-ink">Begin your commission</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-stone">
            Share your idea — there&apos;s no obligation, and no idea is too early to talk through.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <a
              href={waLink("Hi Taygerian, I'd like to discuss a bespoke commission.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink px-6 py-3 text-center text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
            >
              Start on WhatsApp
            </a>
            <Link
              href="/contact"
              className="border border-ink px-6 py-3 text-center text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
            >
              Contact the atelier
            </Link>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[720px] text-center text-[14px] leading-relaxed text-stone">
        Every existing design can also be tailored — a different stone, metal, or size. Look for{" "}
        <span className="text-ink">Customise Me</span> on any product page.
      </p>
    </div>
  );
}
