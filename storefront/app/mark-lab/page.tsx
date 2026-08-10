// TEMPORARY mark studio — alternatives for the little brand glyph (currently the
// nested-octagon "FacetMark"). Visit http://localhost:3000/mark-lab. Tell me
// which you like and I'll wire it in everywhere the FacetMark is used, then delete this.
import { Cinzel } from "next/font/google";
import type { ReactNode } from "react";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"] });

function Svg({ children, size = 96 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const MARKS: { id: string; name: string; note: string; el: ReactNode }[] = [
  {
    id: "1",
    name: "Octagon · current",
    note: "Today's mark — two nested octagons. An emerald-cut stone seen flat.",
    el: (
      <>
        <polygon points="60,20 140,20 180,60 180,140 140,180 60,180 20,140 20,60" strokeWidth={8} />
        <polygon points="70,40 130,40 160,70 160,130 130,160 70,160 40,130 40,70" strokeWidth={5} opacity={0.75} />
      </>
    ),
  },
  {
    id: "2",
    name: "Octagon · crown facets",
    note: "The same stone, but with its crown facets drawn in — more clearly a cut gem.",
    el: (
      <>
        <polygon points="55,18 145,18 182,55 182,145 145,182 55,182 18,145 18,55" strokeWidth={7} />
        <polygon points="82,58 118,58 142,82 142,118 118,142 82,142 58,118 58,82" strokeWidth={4} opacity={0.7} />
        <g strokeWidth={3} opacity={0.55}>
          <line x1="55" y1="18" x2="82" y2="58" /><line x1="145" y1="18" x2="118" y2="58" />
          <line x1="182" y1="55" x2="142" y2="82" /><line x1="182" y1="145" x2="142" y2="118" />
          <line x1="145" y1="182" x2="118" y2="142" /><line x1="55" y1="182" x2="82" y2="142" />
          <line x1="18" y1="145" x2="58" y2="118" /><line x1="18" y1="55" x2="58" y2="82" />
        </g>
      </>
    ),
  },
  {
    id: "3",
    name: "Emerald step cut",
    note: "Concentric steps — the calm, architectural look of an emerald-cut stone.",
    el: (
      <>
        <polygon points="52,30 148,30 170,52 170,148 148,170 52,170 30,148 30,52" strokeWidth={7} />
        <polygon points="66,48 134,48 152,66 152,134 134,152 66,152 48,134 48,66" strokeWidth={3.5} opacity={0.65} />
        <polygon points="80,66 120,66 134,80 134,120 120,134 80,134 66,120 66,80" strokeWidth={3.5} opacity={0.5} />
      </>
    ),
  },
  {
    id: "4",
    name: "Round brilliant",
    note: "A brilliant from above — soft, feminine, reads instantly as 'diamond'.",
    el: (
      <>
        <circle cx="100" cy="100" r="82" strokeWidth={7} />
        <polygon points="72,45 128,45 155,72 155,128 128,155 72,155 45,128 45,72" strokeWidth={3.5} opacity={0.7} />
        <polygon points="86,86 114,86 114,114 86,114" strokeWidth={3.5} opacity={0.6} />
        <g strokeWidth={2.6} opacity={0.5}>
          <line x1="100" y1="18" x2="100" y2="45" /><line x1="182" y1="100" x2="155" y2="100" />
          <line x1="100" y1="182" x2="100" y2="155" /><line x1="18" y1="100" x2="45" y2="100" />
        </g>
      </>
    ),
  },
  {
    id: "5",
    name: "Marquise",
    note: "A pointed navette — the most distinctive silhouette, elegant and a touch regal.",
    el: (
      <>
        <path d="M100,26 C140,60 160,100 100,174 C40,100 60,60 100,26 Z" strokeWidth={7} />
        <line x1="62" y1="100" x2="138" y2="100" strokeWidth={3.5} opacity={0.6} />
        <line x1="100" y1="40" x2="100" y2="160" strokeWidth={3.5} opacity={0.5} />
      </>
    ),
  },
  {
    id: "6",
    name: "Kite diamond",
    note: "A classic diamond lozenge with table + pavilion lines. Heraldic and gem at once.",
    el: (
      <>
        <polygon points="100,22 176,100 100,178 24,100" strokeWidth={7} />
        <polygon points="100,54 146,100 100,146 54,100" strokeWidth={3.6} opacity={0.65} />
        <g strokeWidth={2.6} opacity={0.5}>
          <line x1="100" y1="22" x2="100" y2="54" /><line x1="176" y1="100" x2="146" y2="100" />
          <line x1="100" y1="178" x2="100" y2="146" /><line x1="24" y1="100" x2="54" y2="100" />
        </g>
      </>
    ),
  },
  {
    id: "7",
    name: "Monogram T",
    note: "The house initial inside the octagon — turns the mark into a proper monogram.",
    el: (
      <>
        <polygon points="60,22 140,22 178,60 178,140 140,178 60,178 22,140 22,60" strokeWidth={4} opacity={0.45} />
        <line x1="66" y1="74" x2="134" y2="74" strokeWidth={9} />
        <line x1="100" y1="74" x2="100" y2="140" strokeWidth={9} />
        <g strokeWidth={4}>
          <line x1="66" y1="68" x2="66" y2="80" /><line x1="134" y1="68" x2="134" y2="80" />
          <line x1="90" y1="140" x2="110" y2="140" />
        </g>
      </>
    ),
  },
  {
    id: "8",
    name: "Winged gem crest",
    note: "The gem carried on dragon wings — the 'old house with dragons' idea as an icon.",
    el: (
      <>
        <polygon points="100,30 116,44 116,66 100,80 84,66 84,44" strokeWidth={6} />
        <g strokeWidth={5}>
          <path d="M112,52 C140,44 162,50 192,34 C180,58 160,74 132,78 C120,80 108,74 112,64" />
          <path d="M88,52 C60,44 38,50 8,34 C20,58 40,74 68,78 C80,80 92,74 88,64" />
        </g>
        <path d="M84,92 C92,100 108,100 116,92" strokeWidth={4} />
      </>
    ),
  },
  {
    id: "9",
    name: "Faceted star",
    note: "A four-point sparkle — the 'brilliance' of a stone abstracted into a star.",
    el: (
      <>
        <polygon points="100,20 118,82 180,100 118,118 100,180 82,118 20,100 82,82" strokeWidth={6} />
        <polygon points="100,60 110,90 140,100 110,110 100,140 90,110 60,100 90,90" strokeWidth={3.5} opacity={0.6} />
      </>
    ),
  },
];

export default function MarkLab() {
  return (
    <div className="bg-porcelain pb-24">
      <header className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold">Mark Studio</p>
        <h1 className={`${cinzel.className} mt-3 text-3xl tracking-[0.1em] text-ink`}>
          The House Emblem
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone">
          Alternatives to the little gem glyph that sits with the wordmark. Each is shown large,
          then locked up small beside TAYGERIAN the way it appears in the header.
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-8 gap-y-14 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {MARKS.map((m) => (
          <div key={m.id} className="flex flex-col items-center text-center">
            <div className="flex h-28 items-center justify-center text-gold">
              <Svg size={104}>{m.el}</Svg>
            </div>
            <p className="mt-5 text-[11px] tracking-[0.18em] uppercase text-gold">
              <span className="text-stone/50">{m.id}</span> · {m.name}
            </p>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-stone">{m.note}</p>
            <div className="mt-5 flex items-center gap-2.5 text-ink">
              <span className="text-gold">
                <Svg size={22}>{m.el}</Svg>
              </span>
              <span className={`${cinzel.className} text-lg tracking-[0.22em]`}>TAYGERIAN</span>
            </div>
          </div>
        ))}
      </div>

      {/* On dark, for versatility */}
      <div className="mt-16 bg-ink py-14">
        <p className="mb-10 text-center text-[11px] tracking-[0.2em] uppercase text-gold">
          The set, in gold on ink
        </p>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-8 px-6 text-gold">
          {MARKS.map((m) => (
            <Svg key={m.id} size={52}>
              {m.el}
            </Svg>
          ))}
        </div>
      </div>
    </div>
  );
}
