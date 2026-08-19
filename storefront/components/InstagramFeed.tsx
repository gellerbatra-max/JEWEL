import Image from "next/image";
import { SOCIAL } from "@/lib/site";

// Home-page "Follow us on Instagram" grid. Uses owner-picked photos (managed in
// the dashboard); the home page passes a fallback set so it always looks
// intentional. Each tile links to the Instagram profile.
export function InstagramFeed({ images, handle = "taygerian" }: { images: string[]; handle?: string }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 text-center">
      <p className="mb-3 text-[13px] tracking-[0.2em] uppercase text-gold">Follow Us</p>
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-3xl text-ink transition-colors hover:text-gold sm:text-4xl"
      >
        @{handle} on Instagram
      </a>

      <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {images.map((src, i) => (
          <a
            key={`${src}-${i}`}
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View @${handle} on Instagram`}
            className="group relative aspect-square overflow-hidden bg-cloud"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-porcelain opacity-0 transition-all duration-300 group-hover:bg-ink/30 group-hover:opacity-100">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
          </a>
        ))}
      </div>

      <div className="mt-8">
        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-ink px-7 py-3 text-[11px] tracking-[0.16em] uppercase text-ink transition-colors hover:border-gold hover:bg-gold hover:text-porcelain"
        >
          Follow @{handle}
        </a>
      </div>
    </section>
  );
}
