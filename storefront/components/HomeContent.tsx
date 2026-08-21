import { preload } from "react-dom";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SignatureCarousel, type CarouselItem } from "@/components/SignatureCarousel";
import { RotatingImage } from "@/components/RotatingImage";
import { PressStrip } from "@/components/PressStrip";
import { InstagramFeed } from "@/components/InstagramFeed";
import { LovedByInfluencers } from "@/components/LovedByInfluencers";
import { CustomerReviews, type ReviewCard } from "@/components/CustomerReviews";
import { PromoBanners } from "@/components/PromoBanners";
import { CraftVideoBanner } from "@/components/CraftVideoBanner";
import { getSignaturePieces, getAllProducts } from "@/lib/catalog-store";
import { getUgcPosts } from "@/lib/ugc-store";
import { getPromoBanners } from "@/lib/promo-store";
import type { UgcCard } from "@/lib/ugc";
import { getApprovedAll } from "@/lib/review-store";
import { SAMPLE_REVIEWS } from "@/lib/sample-reviews";
import {
  getBespokeImages,
  getInstagramImages,
  getPressItems,
} from "@/lib/site-config-store";

// The home page body, rendered by the real route (app/page.tsx).
export async function HomeContent() {
  // The hero is a CSS background image (discovered late by the preload scanner);
  // hint it early so it starts downloading immediately — improves LCP.
  preload("/images/hero-ruby-ring-gold.webp", { as: "image", fetchPriority: "high" });

  // One batched pass over the stores instead of sequential awaits.
  const [
    signature,
    allProducts,
    bespokeSaved,
    instaSaved,
    pressItems,
    ugcPosts,
    approvedReviews,
    promos,
  ] = await Promise.all([
    getSignaturePieces(12),
    getAllProducts(),
    getBespokeImages(),
    getInstagramImages(),
    getPressItems(),
    getUgcPosts(),
    getApprovedAll(),
    getPromoBanners(),
  ]);

  // Resolve each influencer post to its linked piece (drop any whose piece was removed).
  const productByHandle = new Map(allProducts.map((p) => [p.handle, p]));
  const snapshot = (p: (typeof allProducts)[number]) => ({
    handle: p.handle,
    title: p.title,
    image: p.image,
    price: p.price,
    currency: p.currency,
    oneOfAKind: p.oneOfAKind,
  });
  const ownerCards: UgcCard[] = ugcPosts.flatMap((post) => {
    const p = productByHandle.get(post.productHandle);
    return p ? [{ id: post.id, media: post.media, name: post.name, product: snapshot(p) }] : [];
  });
  // Preview fallback so the section is visible before the owner adds real
  // influencer clips — uses pieces not already in the Signature carousel above.
  const sigHandles = new Set(signature.map((p) => p.handle));
  const previewPool = allProducts.filter((p) => p.image && !sigHandles.has(p.handle));
  const previewProducts = (
    previewPool.length >= 4 ? previewPool : allProducts.filter((p) => p.image)
  ).slice(0, 8);
  const ugcCards: UgcCard[] = ownerCards.length
    ? ownerCards
    : previewProducts.map((p) => ({ id: p.handle, media: p.image, name: "", product: snapshot(p) }));
  // Instagram grid: owner's picks, or fall back to signature pieces so the
  // "Follow us" module always looks intentional.
  const instaImages = (
    instaSaved.length ? instaSaved : signature.slice(0, 6).map((p) => p.image)
  ).filter(Boolean);
  const bespokeImages = bespokeSaved.length
    ? bespokeSaved
    : ["/images/catalog/rings/rings-004-1.avif"];
  // Customer reviews carousel: approved reviews if any, else sample reviews as a preview.
  const reviewCards: ReviewCard[] = approvedReviews.length
    ? approvedReviews.map((r) => ({
        id: r.id,
        name: r.name,
        rating: r.rating,
        title: r.title || undefined,
        body: r.body,
        productTitle: r.productHandle ? productByHandle.get(r.productHandle)?.title : undefined,
      }))
    : SAMPLE_REVIEWS;
  const reviewCount = reviewCards.length;
  const reviewAvg = reviewCount ? reviewCards.reduce((a, r) => a + r.rating, 0) / reviewCount : 0;
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
          className="absolute inset-0 bg-no-repeat mix-blend-multiply [background-position:center_36%] [background-size:auto_55%] sm:[background-position:center_68%] sm:[background-size:auto_74%] md:[background-position:center_76%] md:[background-size:auto_90%]"
          style={{ backgroundImage: "url('/images/hero-ruby-ring-gold.webp')" }}
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

      {/* "As featured in" — shows only when the owner has added press names */}
      <PressStrip items={pressItems} />

      {/* Craftsmanship video banner — starts at the stone-setting frame */}
      <CraftVideoBanner src="/videos/craftsmanship-setting.mp4" startAt={4.5} eyebrow="" />

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

      {/* Loved by Influencers — shoppable video carousel (hidden until posts exist) */}
      {ugcCards.length > 0 && (
        <>
          <Reveal>
            <LovedByInfluencers cards={ugcCards} />
          </Reveal>
          <SectionRule />
        </>
      )}

      {/* Bespoke challenge */}
      <Reveal className="py-20">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 bg-porcelain px-6 md:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* The Seraphine ring, drawn from the collection */}
          <div className="flex items-center justify-center py-10 md:py-0">
            <RotatingImage
              images={bespokeImages}
              alt="Made to order — bespoke Ceylon jewellery"
              className="aspect-square w-full max-w-[560px]"
              sizes="(max-width: 768px) 70vw, 460px"
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

      {/* Craftsmanship — full-width video banner */}
      <CraftVideoBanner
        src="/videos/craftsmanship.mp4"
        startAt={0}
        eyebrow="Craftsmanship"
        heading="The Only One in the Universe"
        subtext="Every Taygerian piece is shaped by hand in our Colombo atelier — Ceylon stones cut and matched, settings raised, and each facet finished by master craftsmen. No moulds, no shortcuts: only patient, generational skill, so the piece you wear carries the mark of the hand that made it."
        ctaLabel="Commission a Piece"
        href="/bespoke"
      />

      <SectionRule />

      {/* Loved By Our Customers — reviews carousel */}
      <Reveal>
        <CustomerReviews reviews={reviewCards} avg={reviewAvg} count={reviewCount} />
      </Reveal>

      <SectionRule />

      {/* Follow us on Instagram */}
      <Reveal>
        <InstagramFeed images={instaImages} />
      </Reveal>

      <SectionRule />

      {/* Promotional banners — owner-managed, at the end of the page */}
      <PromoBanners banners={promos} />
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
