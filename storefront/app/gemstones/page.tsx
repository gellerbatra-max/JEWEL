import type { Metadata } from "next";
import Image from "next/image";
import { FacetMark } from "@/components/FacetMark";
import { ConsultationCTA } from "@/components/ConsultationCTA";

export const metadata: Metadata = {
  title: "Ceylon Gemstones",
  description:
    "The Ceylon gemstones behind Taygerian — cornflower sapphire, padparadscha, yellow and white sapphire, star sapphire, and Ceylon ruby, mined in Ratnapura and cut in-house.",
};

const STONES = [
  {
    name: "Cornflower Blue Sapphire",
    from: "#2f4c82",
    to: "#4a6da8",
    note: "The most prized Ceylon hue — a vivid, velvety blue that commands a premium at auction when its origin is certified.",
  },
  {
    name: "Padparadscha Sapphire",
    from: "#e08a6b",
    to: "#f0b49a",
    note: "A rare pink-orange found almost only in Sri Lanka. Named for the lotus blossom; among the most collectible of all sapphires.",
  },
  {
    name: "Yellow Sapphire",
    from: "#c6a54d",
    to: "#e0c874",
    note: "Warm canary to golden tones, brilliant in daylight — a Ceylon speciality, worn for both beauty and tradition.",
  },
  {
    name: "White Sapphire",
    from: "#e7e3d8",
    to: "#f4f1ea",
    note: "Colourless and brilliant, cut in-house as a natural, untreated alternative to a diamond in bridal pieces.",
  },
  {
    name: "Star Sapphire",
    from: "#5b6b82",
    to: "#8290a6",
    note: "A six-rayed star of light glides across the dome — asterism formed by fine needle inclusions, a Ceylon signature.",
  },
  {
    name: "Ceylon Ruby",
    from: "#7a2230",
    to: "#a83a4a",
    note: "The red sister of the sapphire, from the same Ratnapura gravels — deep, warm, and increasingly scarce.",
  },
];

export default function GemstonesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[44vh] min-h-[300px]">
        <Image
          src="/images/hero-sapphire.jpg"
          alt="Ceylon sapphire"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <FacetMark size={30} className="text-rose mb-5" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-porcelain/90 mb-3">Serendib&rsquo;s Stones</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-balance text-porcelain">
            The Ceylon Gemstones
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <p className="text-lg text-stone leading-relaxed">
          For two thousand years the gravels of Ratnapura — the &ldquo;City of Gems&rdquo; — have
          yielded some of the finest coloured stones on earth. We source directly from those mines
          and cut every stone in our own atelier, so each Taygerian gem can be traced to the island
          it came from and certified by an independent laboratory.
        </p>
      </div>

      {/* Variety grid */}
      <section className="mx-auto max-w-[1600px] px-6 pt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {STONES.map((s) => (
            <div
              key={s.name}
              className="group text-center p-5 border border-transparent hover:border-line hover:bg-porcelain hover:shadow-[0_20px_46px_-28px_rgba(28,27,25,0.45)] hover:-translate-y-0.5 transition-all duration-300 ease-out"
            >
              <div
                className="aspect-square rounded-full mx-auto max-w-[200px] mb-5 shadow-[0_20px_40px_-20px_rgba(28,27,25,0.4)] transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ background: `radial-gradient(circle at 38% 32%, ${s.to}, ${s.from} 62%, ${s.from})` }}
              />
              <h2 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">{s.name}</h2>
              <p className="mt-2 text-[15px] text-stone leading-relaxed max-w-sm mx-auto">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Provenance + CTA */}
      <section className="mt-20 border-t border-line bg-cloud">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Verified Origin</p>
          <h2 className="font-display text-3xl text-ink text-balance">
            Every signature stone carries a laboratory origin report
          </h2>
          <p className="mt-5 text-lg text-stone leading-relaxed">
            Looking for a particular stone — a specific colour, cut, or carat weight? Our advisors
            source to order from the current parcels and guide you through certification.
          </p>
          <div className="mt-8 max-w-xs mx-auto">
            <ConsultationCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
