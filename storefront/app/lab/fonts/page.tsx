import localFont from "next/font/local";

// TEMP lab — the TAYGERIAN wordmark in every font from the client's Font
// folder, at logo scale in the current dark-ash colour. Not linked from the
// site. Delete once a font is chosen.

const arefRuqaa = localFont({ src: "../../fonts/ArefRuqaa-Regular.ttf" });
const inknut = localFont({ src: "../../fonts/InknutAntiqua-Regular.ttf" });
const junge = localFont({ src: "../../fonts/Junge-Regular.ttf" });
const marcellus = localFont({ src: "../../fonts/Marcellus-Regular.ttf" });
const metamorphous = localFont({ src: "../../fonts/Metamorphous-Regular.ttf" });
const philosopher = localFont({ src: "../../fonts/Philosopher-Regular.ttf" });
const platypi = localFont({ src: "../../fonts/Platypi-Regular.ttf" });
const tenorSans = localFont({ src: "../../fonts/TenorSans-Regular.ttf" });
const zenAntique = localFont({ src: "../../fonts/ZenAntique-Regular.ttf" });

type Row = { name: string; note: string; className: string; current?: boolean };

const ROWS: Row[] = [
  { name: "Marcellus", note: "Refined Roman capitals — classic, luxury-house feel.", className: marcellus.className },
  { name: "Tenor Sans", note: "Light, airy near-sans serif — quiet and modern.", className: tenorSans.className },
  { name: "Junge", note: "Delicate old-style serif, fine strokes.", className: junge.className },
  { name: "Philosopher", note: "Humanist serif with a subtle art-nouveau character.", className: philosopher.className },
  { name: "Inknut Antiqua", note: "Heavy literary old-style serif — bookish, grounded.", className: inknut.className },
  { name: "Platypi", note: "Contemporary serif, even and legible.", className: platypi.className },
  { name: "Zen Antique", note: "Antique Mincho-rooted serif — understated, characterful.", className: zenAntique.className },
  { name: "Metamorphous", note: "Decorative medieval serif.", className: metamorphous.className, current: true },
  { name: "Aref Ruqaa", note: "Ornate calligraphic (Arabic-rooted) — very decorative in Latin.", className: arefRuqaa.className },
];

export default function FontLab() {
  return (
    <div className="min-h-screen bg-porcelain px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-[13px] tracking-[0.24em] uppercase text-gold mb-3">Lab</p>
        <h1 className="font-display text-3xl text-ink mb-2">Logo font — your Font folder</h1>
        <p className="text-stone mb-12 max-w-xl">
          The wordmark in every font from your folder, shown in caps at logo scale in the
          current dark-ash colour. The one marked <em>current</em> is what&apos;s live now.
        </p>

        <div className="space-y-4">
          {ROWS.map((r) => (
            <div
              key={r.name}
              className={`rounded-lg border bg-white/40 px-8 py-10 ${
                r.current ? "border-gold" : "border-line"
              }`}
            >
              <div
                className={`uppercase leading-none ${r.className}`}
                style={{ color: "#46443f", fontSize: "clamp(2rem, 7.5vw, 4.6rem)", letterSpacing: "0.1em" }}
              >
                <span className="mr-[-0.1em]">Taygerian</span>
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-ink text-sm font-medium">{r.name}</span>
                {r.current && (
                  <span className="text-[10px] tracking-[0.16em] uppercase text-gold">current</span>
                )}
              </div>
              <p className="mt-1 text-stone text-sm max-w-lg">{r.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
