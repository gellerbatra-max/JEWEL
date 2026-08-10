// TEMPORARY wordmark studio — options for the TAYGERIAN brand text.
// Visit http://localhost:3000/wordmark-lab. Tell me which direction(s) you like
// and I'll refine the winner and wire it into the site, then delete this page.
import {
  Cinzel,
  Cinzel_Decorative,
  Cormorant_SC,
  Playfair_Display,
  Marcellus,
  EB_Garamond,
  Cardo,
} from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"] });
const cinzelDec = Cinzel_Decorative({ subsets: ["latin"], weight: ["400", "700"] });
const cormorantSC = Cormorant_SC({ subsets: ["latin"], weight: ["400", "500", "600"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });
const marcellus = Marcellus({ subsets: ["latin"], weight: ["400"] });
const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "500"] });
const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"] });

// Heraldic winged crest — the house gem carried on a pair of dragon wings.
function WingedCrest({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 118"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="130,10 143,19 148,35 130,50 112,35 117,19" strokeWidth="3" />
      <polygon points="130,20 137,26 139,35 130,43 121,35 123,26" strokeWidth="1.5" opacity="0.7" />
      <g strokeWidth="2.6">
        <path d="M140,34 C172,26 198,32 240,14 C228,38 208,56 178,60 C162,62 148,56 140,47" />
        <path d="M120,34 C88,26 62,32 20,14 C32,38 52,56 82,60 C98,62 112,56 120,47" />
      </g>
      <g strokeWidth="1.4" opacity="0.6">
        <path d="M150,38 C172,34 192,36 222,24" />
        <path d="M150,46 C170,46 188,50 210,44" />
        <path d="M110,38 C88,34 68,36 38,24" />
        <path d="M110,46 C90,46 72,50 50,44" />
      </g>
      <path d="M112,64 C120,72 140,72 148,64" strokeWidth="2" />
    </svg>
  );
}

function Option({
  n,
  name,
  note,
  children,
}: {
  n: string;
  name: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-16 first:border-t-0">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] uppercase text-gold">
          <span className="text-stone/60">{n}</span>
          <span>{name}</span>
        </div>
        <div className="flex min-h-[120px] w-full items-center justify-center text-ink">
          {children}
        </div>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-stone">{note}</p>
      </div>
    </section>
  );
}

export default function WordmarkLab() {
  return (
    <div className="bg-porcelain pb-24">
      <header className="mx-auto max-w-4xl px-6 pt-16 pb-4 text-center">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold">Wordmark Studio</p>
        <h1 className={`${cinzel.className} mt-3 text-3xl tracking-[0.1em] text-ink`}>
          TAYGERIAN
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone">
          Directions for the brand text — an old house of high caliber, with dragons in its
          blood. Each is a distinct treatment, not just a font. Tell me which way to take it.
        </p>
      </header>

      {/* Flipped final-N experiment on the current Cinzel wordmark */}
      <Option n="N1" name="Final N · Upside down (180°)" note="The last N rotated a full 180°. A capital N is nearly point-symmetric, so this reads almost the same as normal — the twist is very subtle (only the serifs shift).">
        <span className={`${cinzel.className} text-5xl tracking-[0.3em] sm:text-6xl`}>
          TAYGERIA
          <span className="inline-block rotate-180 align-baseline">N</span>
        </span>
      </Option>

      <Option n="N2" name="Final N · Mirrored (the signature)" note="The last N flipped left-to-right — a genuine 'reversed N' mark. This is the distinctive one, like a maker's monogram quirk.">
        <span className={`${cinzel.className} text-5xl tracking-[0.3em] sm:text-6xl`}>
          TAYGERIA
          <span className="inline-block align-baseline" style={{ transform: "scaleX(-1)" }}>N</span>
        </span>
      </Option>

      <Option n="N3" name="Final N · Flipped vertical" note="The last N mirrored top-to-bottom — reverses the diagonal for a subtler quirk than the horizontal mirror.">
        <span className={`${cinzel.className} text-5xl tracking-[0.3em] sm:text-6xl`}>
          TAYGERIA
          <span className="inline-block align-baseline" style={{ transform: "scaleY(-1)" }}>N</span>
        </span>
      </Option>

      {/* Kavalri-match: Kavalri's logo is a refined Roman-capitals serif image
          (fine serifs, sharp 'A' apex, wide spacing) — NOT Manrope. Closest free matches: */}
      <Option n="A" name="Marcellus · Closest to Kavalri" note="Kavalri's logo is a refined Roman-capitals serif — fine serifs, sharp 'A' apex, wide spacing. Marcellus is the nearest free match: light, elegant, highly legible.">
        <span className={`${marcellus.className} text-5xl tracking-[0.3em] sm:text-6xl`}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="B" name="Cinzel · Light & Wide" note="The family the site already uses, at Regular weight and opened right up — the same classical caps as Kavalri, a touch more chiselled.">
        <span className={`${cinzel.className} text-5xl tracking-[0.34em] sm:text-6xl`} style={{ fontWeight: 400 }}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="C" name="Cormorant · Finer, Higher-contrast" note="A more delicate, higher-contrast take — thinner hairlines than Kavalri, dressier. Good if you want it more couture.">
        <span className={`${cormorantSC.className} text-6xl tracking-[0.2em] sm:text-7xl`} style={{ fontWeight: 500 }}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="D" name="EB Garamond · Old-World" note="A warm old-style serif in caps — softer serifs than Kavalri, more literary. Reads as heritage and history.">
        <span className={`${ebGaramond.className} text-5xl tracking-[0.28em] sm:text-6xl`} style={{ fontWeight: 500 }}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="E" name="Cardo · Scholar" note="A humanist book serif (after Bembo) — calm and classical, sitting between Kavalri and a Garamond.">
        <span className={`${cardo.className} text-5xl tracking-[0.26em] sm:text-6xl`}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="F" name="Marcellus · Compact" note="The Kavalri-nearest face again, but with tighter spacing — closer to a fixed logo lockup than an airy line.">
        <span className={`${marcellus.className} text-5xl tracking-[0.14em] sm:text-6xl`}>
          TAYGERIAN
        </span>
      </Option>

      <Option n="G" name="Cinzel · Weighted" note="Cinzel at Semibold for more ink on the page — the most engraved / monumental of the set.">
        <span className={`${cinzel.className} text-5xl tracking-[0.26em] sm:text-6xl`} style={{ fontWeight: 600 }}>
          TAYGERIAN
        </span>
      </Option>

      {/* 1 — current baseline */}
      <Option n="01" name="Cinzel · The House Standard" note="What the site uses today: chiseled Roman capitals, widely tracked. Architectural and safe — the reference point.">
        <span className={`${cinzel.className} text-5xl tracking-[0.42em] sm:text-6xl`}>
          TAYGERIAN
        </span>
      </Option>

      {/* 2 — ornate regal */}
      <Option n="02" name="Cinzel Decorative · Regalia" note="Flourished, ceremonial capitals — reads like a coat of arms or an old seal. The most overtly 'ancient noble house'.">
        <span className={`${cinzelDec.className} text-4xl tracking-[0.18em] sm:text-5xl`} style={{ fontWeight: 700 }}>
          TAYGERIAN
        </span>
      </Option>

      {/* 3 — high-contrast small caps */}
      <Option n="03" name="Cormorant · Aristocrat" note="Delicate high-contrast serif in small caps — aristocratic and quiet, closer to Cartier / Boucheron than to a film title.">
        <span className={`${cormorantSC.className} text-6xl tracking-[0.26em] sm:text-7xl`} style={{ fontWeight: 500 }}>
          Taygerian
        </span>
      </Option>

      {/* 4 — fashion couture */}
      <Option n="04" name="Playfair · Couture" note="High-contrast display serif with mixed case — a fashion-maison feel. Elegant, a touch editorial.">
        <span className={`${playfair.className} text-5xl tracking-[0.05em] sm:text-6xl`} style={{ fontWeight: 500 }}>
          Taygerian
        </span>
      </Option>

      {/* 5 — monument */}
      <Option n="05" name="Marcellus · Monument" note="Understated classical capitals with calm authority — restrained, timeless, never shouts.">
        <span className={`${marcellus.className} text-5xl tracking-[0.3em] sm:text-6xl`}>
          TAYGERIAN
        </span>
      </Option>

      {/* 6 — dragon crest lockup */}
      <Option n="06" name="The Dragon Crest" note="The house emblem — a faceted Ceylon gem borne on dragon wings — set above the wordmark. This is the 'old family with dragons' direction as a full crest.">
        <div className="flex flex-col items-center">
          <WingedCrest className="mb-4 h-16 w-auto text-gold" />
          <span className={`${cinzel.className} text-4xl tracking-[0.4em] sm:text-5xl`}>
            TAYGERIAN
          </span>
        </div>
      </Option>

      {/* 7 — illuminated initial */}
      <Option n="07" name="Illuminated Initial" note="An oversized ornate 'T' leads the name, like an illuminated manuscript capital — heritage and craft in one gesture.">
        <div className="flex items-baseline">
          <span className={`${cinzelDec.className} text-7xl leading-none text-gold sm:text-8xl`} style={{ fontWeight: 700 }}>
            T
          </span>
          <span className={`${cinzel.className} text-4xl tracking-[0.34em] sm:text-5xl`}>
            AYGERIAN
          </span>
        </div>
      </Option>

      {/* 8 — full crest lockup with tagline */}
      <Option n="08" name="Crest Lockup · Maison" note="A complete lockup: crest, wordmark, and a provenance line framed by hairlines — the version that would go on packaging, a seal, or a certificate.">
        <div className="flex flex-col items-center">
          <WingedCrest className="mb-5 h-12 w-auto text-gold" />
          <span className={`${marcellus.className} text-4xl tracking-[0.4em] sm:text-5xl`}>
            TAYGERIAN
          </span>
          <span className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.34em] uppercase text-stone">
            <span className="h-px w-8 bg-line" />
            Ceylon · Est. MMXXVI
            <span className="h-px w-8 bg-line" />
          </span>
        </div>
      </Option>

      {/* 9 — wide-tracked minimal */}
      <Option n="09" name="Modern Heir" note="Maximum air between the letters — the piece almost becomes a texture. Cool, modern, and very high-end when set in ink.">
        <span className={`${ebGaramond.className} text-3xl tracking-[0.62em] uppercase sm:text-4xl`} style={{ fontWeight: 500 }}>
          Taygerian
        </span>
      </Option>

      {/* 10 — dark version of the crest, to show versatility */}
      <section className="mt-8 bg-ink py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <div className="mb-8 text-[11px] tracking-[0.2em] uppercase text-gold">
            10 · The Crest, in Ink
          </div>
          <div className="flex flex-col items-center text-porcelain">
            <WingedCrest className="mb-4 h-14 w-auto text-gold" />
            <span className={`${cinzel.className} text-4xl tracking-[0.4em] sm:text-5xl`}>
              TAYGERIAN
            </span>
          </div>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-porcelain/60">
            Every mark should also live on a dark ground — this is how the crest reads on ink or
            in gold foil. A true one-of-a-kind dragon crest can be commissioned/drawn to replace
            the winged gem if you like this direction.
          </p>
        </div>
      </section>
    </div>
  );
}
