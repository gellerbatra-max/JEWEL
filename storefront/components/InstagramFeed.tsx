import Image from "next/image";
import { SOCIAL } from "@/lib/site";

const IconFacebook = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
  </svg>
);
const IconTikTok = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.4c-1.2.1-2.4-.2-3.5-.8v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.5a3.1 3.1 0 1 0 2.2 3V3h2.5z" />
  </svg>
);
const IconInstagram = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// Home-page "Follow Us" social module. In Sri Lanka Facebook & TikTok lead, so
// they come first, with Instagram alongside. The photo grid uses owner-picked
// images (the home page passes a fallback so it always looks intentional).
export function InstagramFeed({ images, handle = "taygerian" }: { images: string[]; handle?: string }) {
  if (!images || images.length === 0) return null;

  const btn =
    "inline-flex items-center gap-2 border border-ink px-6 py-3 text-[11px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:bg-gold hover:text-porcelain";

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 text-center">
      <p className="mb-3 text-[13px] tracking-[0.2em] uppercase text-gold">Follow Us</p>
      <p className="font-display text-3xl text-ink sm:text-4xl">@{handle}</p>

      <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {images.map((src, i) => (
          <a
            key={`${src}-${i}`}
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`@${handle} on Instagram`}
            className="group relative aspect-square overflow-hidden bg-cloud"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </a>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className={btn}>
          {IconFacebook} Facebook
        </a>
        <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className={btn}>
          {IconTikTok} TikTok
        </a>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={btn}>
          {IconInstagram} Instagram
        </a>
      </div>
    </section>
  );
}
