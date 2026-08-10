// TEMPORARY emblem-colour lab. Visit http://localhost:3000/emblem-color — the
// house emblem (current octagon) shown in metals and jewel tones, on light and
// on ink. Tell me which colour and I'll apply it, then delete this page.
import { FacetMark } from "@/components/FacetMark";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500"] });

const COLORS: { name: string; hex: string }[] = [
  { name: "Gold (current)", hex: "#9a7b3f" },
  { name: "Deep Antique Gold", hex: "#7d5f2c" },
  { name: "Champagne Gold", hex: "#c2a45c" },
  { name: "Rose Gold", hex: "#bd8368" },
  { name: "Copper", hex: "#a86238" },
  { name: "Platinum", hex: "#9aa0a8" },
  { name: "Pewter / Steel", hex: "#6f7680" },
  { name: "Sapphire", hex: "#2f4c82" },
  { name: "Emerald", hex: "#2f6b4c" },
  { name: "Ruby", hex: "#97303c" },
  { name: "Onyx (ink)", hex: "#1c1b19" },
];

export default function EmblemColorLab() {
  return (
    <div className="bg-porcelain pb-24">
      <header className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold">Emblem Colour</p>
        <h1 className={`${cinzel.className} mt-3 text-3xl tracking-[0.1em] text-ink`}>
          The House Emblem, in Colour
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone">
          The current gem glyph in metals and jewel tones — each shown large, then locked up beside
          the wordmark the way it appears in the header.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 px-6 sm:grid-cols-3 lg:grid-cols-4">
        {COLORS.map((c) => (
          <div key={c.hex} className="flex flex-col items-center text-center">
            <div className="flex h-24 items-center justify-center" style={{ color: c.hex }}>
              <FacetMark size={92} />
            </div>
            <p className="mt-4 text-[11px] tracking-[0.14em] uppercase text-ink">{c.name}</p>
            <p className="mt-1 text-[11px] tabular-nums text-stone/70">{c.hex}</p>
            <div className="mt-4 flex items-center gap-2 text-ink">
              <span style={{ color: c.hex }}>
                <FacetMark size={18} />
              </span>
              <span className={`${cinzel.className} text-base tracking-[0.2em]`}>TAYGERIAN</span>
            </div>
          </div>
        ))}
      </div>

      {/* On ink — metals and jewel tones read very differently on a dark ground */}
      <div className="mt-16 bg-ink py-14">
        <p className="mb-10 text-center text-[11px] tracking-[0.2em] uppercase text-gold">
          The same, on ink
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-10 px-6 sm:grid-cols-3 lg:grid-cols-4">
          {COLORS.map((c) => (
            <div key={c.hex} className="flex flex-col items-center text-center">
              <div className="flex h-20 items-center justify-center" style={{ color: c.hex }}>
                <FacetMark size={76} />
              </div>
              <p className="mt-3 text-[11px] tracking-[0.14em] uppercase text-porcelain/80">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
