import Image from "next/image";
import Link from "next/link";
import { FacetMark } from "@/components/FacetMark";
import { Reveal } from "@/components/Reveal";

// Story sections, alternating image side. Images are catalog pieces used as
// placeholders for now.
const SECTIONS = [
  {
    eyebrow: "Ceylon",
    title: "Born of Ratnapura",
    body: "Ceylon — Sri Lanka — has yielded the world's finest sapphires for two thousand years, most drawn from the gem gravels around Ratnapura, the City of Gems. We hold the relationship with the miners and our in-house cutters, so a stone's journey is ours from gravel to setting — a geographic-origin claim no open-market house can match.",
    image: "/images/catalog/rings/rings-002-1.avif",
    alt: "Emerald-set ring in 18k gold",
  },
  {
    eyebrow: "Provenance",
    title: "Origin, Owned",
    body: "A Ceylon-origin sapphire carries a real premium when backed by a lab origin report — a premium dealers and auction houses usually capture. We capture it directly, and build the whole identity around it: every signature piece leaves with a lab origin report and a house-issued provenance mark.",
    image: "/images/catalog/necklaces/necklaces-007-1.avif",
    alt: "Ceylon gemstone necklace",
  },
  {
    eyebrow: "The Atelier",
    title: "The Named Hand",
    body: "The cutter and the setter are credited — by name or atelier — where open-market stones arrive anonymous. The hand that shaped your piece is part of its record, not an afterthought.",
    image: "/images/catalog/earrings/earrings-003-1.avif",
    alt: "Hand-finished drop earrings",
  },
  {
    eyebrow: "Design",
    title: "Old Material, Modern Craft",
    body: "Two-thousand-year-old material, set by a contemporary hand. Modern design in gold, silver, and platinum — never costume-heritage pastiche. The result feels of today and lasts like an heirloom.",
    image: "/images/catalog/rings/rings-004-1.avif",
    alt: "Star pavé ring in 18k gold",
  },
];

export default function DynastyPage() {
  return (
    <div>
      {/* Hero — text only on the white ground (lifestyle photo removed) */}
      <section className="px-6 pt-20 pb-2 text-center sm:pt-28">
        <div className="mb-6 flex justify-center">
          <FacetMark size={32} className="text-gold" />
        </div>
        <p className="mb-4 text-[12px] tracking-[0.24em] uppercase text-gold">Dynasty</p>
        <h1 className="text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
          An Island, Not a Footnote
        </h1>
      </section>

      {/* Lead */}
      <Reveal className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-balance text-xl leading-relaxed text-stone">
            Every heritage house sells lineage and a signature motif. Ours begins with the ground
            itself — the gem gravels of Ceylon — and the people who mine, cut, and set what comes
            from it.
          </p>
        </div>
      </Reveal>

      {SECTIONS.map((s, i) => (
        <div key={s.title}>
          <SectionRule />
          <Reveal className="py-16 sm:py-20">
            <StorySection {...s} flip={i % 2 === 1} />
          </Reveal>
        </div>
      ))}

      <SectionRule />

      {/* Closing */}
      <Reveal className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="mb-5 text-[13px] tracking-[0.24em] uppercase text-gold">The House</p>
          <h2 className="text-balance font-display text-3xl text-ink sm:text-4xl">
            A Signature You Can Trace
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">
            Every signature piece ships with a lab origin report and a house-issued provenance mark —
            origin you can hold, not just claim.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/jewellery"
              className="inline-block bg-ink px-8 py-3.5 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
            >
              Explore the Collections
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-ink px-8 py-3.5 text-[12px] tracking-[0.16em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
            >
              Commission a Piece
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function StorySection({
  eyebrow,
  title,
  body,
  image,
  alt,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  flip?: boolean;
}) {
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 md:grid-cols-2 lg:gap-14">
      <div
        className={`flex items-center justify-center py-6 md:py-0 ${flip ? "md:order-2" : ""}`}
      >
        <Image
          src={image}
          alt={alt}
          width={1200}
          height={1200}
          sizes="(max-width: 768px) 70vw, 460px"
          className="h-auto w-full max-w-[500px] mix-blend-multiply"
        />
      </div>
      <div className={`flex items-center py-4 md:py-0 ${flip ? "md:order-1" : ""}`}>
        <div className="mx-auto max-w-md">
          <p className="mb-5 text-[13px] tracking-[0.24em] uppercase text-gold">{eyebrow}</p>
          <h2 className="text-balance font-display text-3xl leading-[1.1] text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone">{body}</p>
        </div>
      </div>
    </div>
  );
}

function SectionRule() {
  return (
    <div
      aria-hidden
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(to right, transparent, var(--line) 12%, var(--line) 88%, transparent)",
      }}
    />
  );
}
