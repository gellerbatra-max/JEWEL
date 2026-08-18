import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SignatureCarousel, type CarouselItem } from "@/components/SignatureCarousel";
import { getSignaturePieces } from "@/lib/catalog-store";

// The home page body, rendered by the real route (app/page.tsx).
export async function HomeContent() {
  const signature = await getSignaturePieces(20);
  const signatureItems: CarouselItem[] = signature.map((p) => ({
    handle: p.handle,
    title: p.title,
    image: p.image,
    metal: p.metal,
    stone: p.stone,
    price: p.price,
    currency: p.currency,
    oneOfAKind: p.oneOfAKind,
  }));

  return (
    <div>
      {/* Full-bleed campaign hero — image with overlaid text (Swarovski-style) */}
      <section className="relative w-full min-h-[80vh] md:min-h-screen flex items-end justify-start overflow-hidden bg-porcelain pb-[16vh] md:pb-[20vh]">
        <div
          className="absolute inset-0 bg-no-repeat mix-blend-multiply"
          style={{
            backgroundImage: "url('/images/hero-ruby-ring-gold.webp')",
            backgroundSize: "auto 90%",
            backgroundPosition: "center calc(50% + 40px)",
          }}
        />
        <div className="relative text-left pl-6 pr-6 md:pl-16">
          <h1 className="font-sans text-lg leading-[1.08] md:whitespace-nowrap text-balance text-ink">
            Hand Crafted Fabulous Jewels
          </h1>
          <div className="mt-4">
            <Link
              href="/jewellery"
              className="inline-block border-2 border-ink text-ink px-6 py-2.5 text-[11px] tracking-[0.16em] uppercase hover:bg-gold hover:border-gold hover:text-porcelain transition-colors"
            >
              Explore the Jewellery
            </Link>
          </div>
        </div>
      </section>

      <SectionRule />

      {/* Signature Pieces — auto-rotating, centre-highlight carousel */}
      <Reveal className="py-20">
        <section>
          <div className="mx-auto max-w-[1600px] px-6 text-center mb-12">
            <p className="text-[13px] tracking-[0.2em] uppercase text-gold mb-3">The House</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">Signature Pieces</h2>
          </div>
          <SignatureCarousel items={signatureItems} />
          <div className="mx-auto max-w-[1600px] px-6 text-center mt-10">
            <Link
              href="/jewellery"
              className="text-[11px] tracking-[0.16em] uppercase text-ink border-b border-gold pb-1 hover:text-gold transition-colors"
            >
              Explore all jewellery
            </Link>
          </div>
        </section>
      </Reveal>

      <SectionRule />

      {/* Bespoke challenge */}
      <Reveal className="py-20">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 bg-porcelain px-6 md:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* The Seraphine ring, drawn from the collection */}
          <div className="flex items-center justify-center py-10 md:py-0">
            <Image
              src="/images/catalog/rings/rings-004-1.avif"
              alt="Seraphine Ring — star pavé in 18k gold"
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 70vw, 460px"
              className="w-full max-w-[560px] h-auto mix-blend-multiply"
            />
          </div>

          {/* The challenge */}
          <div className="flex items-center py-8 md:py-0">
            <div className="mx-auto max-w-md">
              <p className="mb-5 text-[13px] tracking-[0.24em] uppercase text-gold">Made to Order</p>
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-balance text-ink">
                Dare to Challenge Us?
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                Found a design you love — a piece you&apos;ve seen, a sketch, an heirloom to
                reimagine? Send us a photo or video, and our atelier will recreate it in gold,
                silver, or platinum, set with certified Ceylon stones. If you can picture it,
                we can make it.
              </p>
              <div className="mt-9">
                <a
                  href="https://wa.me/94000000000?text=Hi%20Taygerian%2C%20I%27d%20love%20you%20to%20make%20this%20design%20for%20me%20%E2%80%94%20here%27s%20a%20photo%2Fvideo%20of%20what%20I%20have%20in%20mind%3A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-ink px-8 py-3.5 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
                >
                  Send Your Design
                </a>
                <p className="mt-4 text-[11px] tracking-[0.12em] uppercase text-stone">
                  Photos · Videos · Sketches — anything goes
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <SectionRule />

      {/* Bridal — mirrored layout */}
      <Reveal className="py-20">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 bg-porcelain px-6 md:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* The promise */}
          <div className="order-2 flex items-center py-8 md:order-1 md:py-0">
            <div className="mx-auto max-w-md">
              <p className="mb-5 text-[13px] tracking-[0.24em] uppercase text-gold">Bridal</p>
              <h2 className="font-display text-4xl sm:text-5xl leading-[1.05] text-balance text-ink">
                The Only One in the Universe
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-stone">
                Designed to your dream theme and hand-made to your preference, each bridal piece
                is made only once — no duplicate, no second casting. What you wear on your day is
                truly one of a kind, yours alone: a keepsake to remember it by, forever.
              </p>
              <div className="mt-9">
                <a
                  href="https://wa.me/94000000000?text=Hi%20Taygerian%2C%20I%27d%20love%20to%20design%20a%20one-of-a-kind%20bridal%20piece%20for%20my%20day."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-ink px-8 py-3.5 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
                >
                  Begin Your Bridal Piece
                </a>
              </div>
            </div>
          </div>

          {/* The Isolde ring, drawn from the collection */}
          <div className="order-1 flex items-center justify-center py-10 md:order-2 md:py-0">
            <Image
              src="/images/catalog/rings/rings-007-1.avif"
              alt="Isolde Ring — cushion-cut white sapphire halo in 18k gold"
              width={1200}
              height={1200}
              sizes="(max-width: 768px) 70vw, 460px"
              className="w-full max-w-[560px] h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// A delicate full-width hairline that fades out at both ends — separates
// sections while keeping a single continuous background.
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
