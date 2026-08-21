"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartLink } from "./CartLink";
import { HeaderSearch } from "./HeaderSearch";
import { WishlistLink } from "./WishlistLink";
import { AccountLink } from "./AccountLink";
import { MobileMenu } from "./MobileMenu";

const NAV = [
  { href: "/jewellery", label: "Jewellery" },
  { href: "/gemstones", label: "Gemstones" },
  { href: "/bespoke", label: "Design Yours" },
  { href: "/journal", label: "Journal" },
  { href: "/dynasty", label: "Dynasty" },
  { href: "/contact", label: "Contact" },
];

// True once the page is scrolled past `threshold` px. Mirrors the pattern
// luxury houses use for a condensing masthead (Monaco Chain, Cartier, Tiffany).
// Passive listener + a synchronous first read so a reload mid-page starts
// in the correct state.
function useScrolled(threshold = 28) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY ?? 0) > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function Header() {
  const scrolled = useScrolled(28);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // On the home page the header floats transparently over the hero image
  // (Swarovski-style) until you scroll, then condenses into a solid bar.
  const overlay = isHome && !scrolled;
  // Compensate the trailing letter-space so the letter-spaced nav centres visually.
  const navTrail = overlay ? "mr-[-0.26em]" : scrolled ? "mr-[-0.16em]" : "mr-[-0.2em]";

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
        overlay
          ? "bg-white/45 backdrop-blur-md shadow-[0_14px_34px_-16px_rgba(28,27,25,0.45)]"
          : scrolled
            ? "bg-white/65 backdrop-blur-md shadow-[0_16px_34px_-18px_rgba(28,27,25,0.5)]"
            : "bg-white/60 backdrop-blur-md shadow-[0_14px_32px_-16px_rgba(28,27,25,0.45)]"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Masthead row: hamburger (mobile) · centered wordmark · bag */}
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ${
            scrolled ? "py-3.5" : "pt-6 pb-3"
          }`}
        >
          <div className="flex items-center justify-self-start">
            <MobileMenu items={NAV} />
          </div>

          <Link
            href="/"
            aria-label="Taygerian — home"
            className="group flex flex-col items-center justify-self-center"
          >
            {/* Wordmark — Philosopher (humanist serif), plain ink text.
                Condenses/animates across the overlay / scrolled / plain states. */}
            <span
              style={{ fontFamily: "var(--font-philosopher), Georgia, serif" }}
              className={`uppercase leading-none whitespace-nowrap text-[#46443f] transition-all duration-500 ${
                overlay
                  ? "text-4xl tracking-[0.22em] sm:text-6xl sm:tracking-[0.3em] mr-[-0.22em] sm:mr-[-0.3em]"
                  : scrolled
                    ? "text-base tracking-[0.22em] sm:text-lg sm:tracking-[0.26em] mr-[-0.22em] sm:mr-[-0.26em]"
                    : "text-xl tracking-[0.28em] sm:text-3xl sm:tracking-[0.36em] mr-[-0.28em] sm:mr-[-0.36em]"
              }`}
            >
              Taygerian
            </span>
          </Link>

          <div className="flex items-center gap-3.5 justify-self-end sm:gap-4">
            <span className="hidden sm:block">
              <HeaderSearch light={overlay} />
            </span>
            <WishlistLink light={overlay} />
            <AccountLink light={overlay} />
            <Link
              href="/contact"
              aria-label="Find us"
              className={`hidden transition-colors sm:block ${
                overlay ? "text-ink/75 hover:text-ink" : "text-stone hover:text-ink"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 10c0 4.8-8 11-8 11s-8-6.2-8-11a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="2.75" />
              </svg>
            </Link>
            <CartLink light={overlay} />
          </div>
        </div>

        {/* Nav-tab row — centered beneath the wordmark; condenses on scroll */}
        <nav
          className={`hidden items-center justify-center uppercase transition-all duration-500 md:flex ${
            "text-stone"
          } ${
            overlay
              ? "gap-14 pb-6 text-[17px] tracking-[0.26em]"
              : scrolled
                ? "gap-8 pb-3 text-[12px] tracking-[0.16em]"
                : "gap-10 pb-5 text-[13.5px] tracking-[0.2em]"
          }`}
        >
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative py-1 transition-colors ${
                i === NAV.length - 1 ? navTrail : ""
              } hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
