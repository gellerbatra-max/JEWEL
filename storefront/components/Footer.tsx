import Link from "next/link";
import { FacetMark } from "./FacetMark";
import { SocialLinks } from "./SocialLinks";
import { NewsletterForm } from "./NewsletterForm";
import { CONTACT } from "@/lib/site";

type Col = { title: string; links: { href: string; label: string }[] };

const COLUMNS: Col[] = [
  {
    title: "Explore",
    links: [
      { href: "/jewellery", label: "Jewellery" },
      { href: "/gemstones", label: "Gemstones" },
      { href: "/dynasty", label: "Our Story" },
      { href: "/journal", label: "The Journal" },
      { href: "/guide/sapphires", label: "Sapphire Guide" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { href: "/how-to-order", label: "How to Order" },
      { href: "/shipping", label: "Shipping & Delivery" },
      { href: "/returns", label: "Returns & Exchanges" },
      { href: "/care", label: "Jewellery Care" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "The House",
    links: [
      { href: "/bespoke", label: "Bespoke & Commissions" },
      { href: "/certification", label: "Certification" },
      { href: "/sourcing", label: "Responsible Sourcing" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-28 border-t border-line bg-porcelain">
      <div className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1.85fr]">
          {/* Brand + newsletter */}
          <div>
            <div className="flex items-center gap-2.5">
              <FacetMark size={20} className="text-rose" />
              <span className="font-display text-lg tracking-[0.22em] uppercase text-ink">
                Taygerian
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-stone">
              Ceylon-provenance fine jewellery — set with certified sapphires and handmade by our own
              goldsmiths in southern Sri Lanka, in a family tradition spanning generations.
            </p>

            <p className="mt-8 mb-3 text-[11px] tracking-[0.2em] uppercase text-gold">
              Join our world
            </p>
            <p className="mb-3 max-w-sm text-[13px] leading-relaxed text-stone">
              New pieces, quietly. First look at one-of-a-kind stones and commissions.
            </p>
            <NewsletterForm />

            <SocialLinks light={false} className="mt-7 flex gap-4" />
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[11px] tracking-[0.18em] uppercase text-ink">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13.5px] text-stone transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Atelier line */}
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-line-soft pt-6 text-[12px] text-stone">
          <span>{CONTACT.city} · by appointment</span>
          <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-ink">
            {CONTACT.email}
          </a>
          <span>{CONTACT.hours}</span>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 text-[12px] text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Taygerian. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-stone/70">
          Working prototype — imagery and some details are placeholders pending brand-owned media.
        </p>
      </div>
    </footer>
  );
}
