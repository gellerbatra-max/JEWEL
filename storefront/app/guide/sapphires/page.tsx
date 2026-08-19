import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "The Ceylon Sapphire Guide",
  description:
    "A short, honest guide to choosing a Ceylon sapphire — colour, cut, clarity, the question of heat, and why origin matters. From the Taygerian atelier.",
};

const FACTORS = [
  {
    k: "Colour",
    t: "The first thing, and the last",
    d: "Colour is where most of a sapphire's value and beauty live. The prize is a vivid, even blue — neither so dark it goes inky, nor so pale it washes out. Ceylon is famous for a bright cornflower blue that stays alive as the light changes, from daylight to candlelight.",
  },
  {
    k: "Cut",
    t: "What releases the colour",
    d: "A well-cut stone returns light evenly across its whole face, with no dull 'windows'. Cut is judged by how the stone comes alive, not by a fixed grade — a slightly deeper stone that glows can outshine a shallow one that's technically larger.",
  },
  {
    k: "Clarity",
    t: "The fingerprint of a natural stone",
    d: "Most fine sapphires hold a few tiny natural inclusions — the fingerprint of a genuine, earth-formed gem. What matters is whether they affect the stone's brilliance to the eye. Flawless-looking sapphires are rare, and worth questioning.",
  },
  {
    k: "Carat",
    t: "Size, in proportion",
    d: "Carat is weight, not just width. Because fine colour is rarer in larger stones, value rises steeply with size once colour and clarity are strong. The right size is the one that suits the piece and the hand it's made for.",
  },
];

export default function SapphireGuidePage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-16">
      <PageIntro eyebrow="Gem Guide" title="The Ceylon Sapphire Guide">
        Before you fall for a stone, it helps to know how to read one. Here&apos;s what we look for
        when we choose sapphires — explained plainly, the way we&apos;d tell a friend.
      </PageIntro>

      <div className="grid gap-px sm:grid-cols-2">
        {FACTORS.map((f) => (
          <div key={f.k} className="border border-line bg-white/50 p-8">
            <p className="text-[11px] tracking-[0.18em] uppercase text-gold">{f.k}</p>
            <h2 className="mt-2 font-display text-xl text-ink">{f.t}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-stone">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-[720px] space-y-10">
        <section>
          <h2 className="font-display text-2xl text-ink">The question of heat</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">
            Most sapphires on the market — including very fine ones — are gently heated, a
            long-accepted practice that stabilises and improves colour. Unheated stones of fine
            colour are rarer, and priced accordingly. Neither is &ldquo;better&rdquo; in the
            abstract; what matters is that the treatment is disclosed. On a Taygerian piece, it always
            is — stated on the piece and confirmed by its certificate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">Why origin matters</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">
            &ldquo;Ceylon&rdquo; on a report is more than geography. Sri Lanka&apos;s stones are
            prized for a particular clarity and luminous, even colour, formed over millions of years
            in the island&apos;s gem gravels. Origin is documented on the certificate — and it&apos;s
            a large part of why a Ceylon sapphire holds its value and its story.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">Beyond blue</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">
            Sapphire isn&apos;t only blue. Ceylon yields pinks, yellows, and the rare, coveted
            padparadscha — a sunset blend of pink and orange. The same eye for colour applies across
            all of them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink">Our promise</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-stone">
            We choose every stone by eye for living colour first, then confirm it with an independent
            certificate — and set it by hand in our own southern-Sri-Lanka workshop, in a craft
            handed down through generations. If you&apos;d like help choosing, we&apos;re always glad
            to talk a stone through with you.
          </p>
        </section>
      </div>

      <div className="mt-14 flex flex-wrap justify-center gap-3">
        <Link
          href="/gemstones"
          className="bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          Explore our gemstones
        </Link>
        <Link
          href="/contact"
          className="border border-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
        >
          Ask about a stone
        </Link>
      </div>
    </div>
  );
}
