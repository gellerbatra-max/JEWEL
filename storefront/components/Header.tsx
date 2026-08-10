"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";

const NAV = [
  { href: "/jewellery", label: "Jewellery" },
  { href: "/gemstones", label: "Gemstones" },
  { href: "/our-story", label: "Our Story" },
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

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line transition-[background-color,box-shadow] duration-500 ${
        scrolled
          ? "bg-porcelain/90 backdrop-blur shadow-[0_12px_30px_-20px_rgba(28,27,25,0.45)]"
          : "bg-porcelain shadow-[0_8px_24px_-18px_rgba(28,27,25,0.28)]"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
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
            <span
              className={`font-display uppercase leading-none text-ink whitespace-nowrap transition-all duration-500 ${
                scrolled
                  ? "text-base tracking-[0.28em] sm:text-lg sm:tracking-[0.32em]"
                  : "text-xl tracking-[0.34em] sm:text-3xl sm:tracking-[0.44em]"
              }`}
            >
              Taygerian
            </span>
          </Link>

          <div className="flex items-center justify-self-end">
            <CartLink />
          </div>
        </div>

        {/* Nav-tab row — centered beneath the wordmark; condenses on scroll */}
        <nav
          className={`hidden items-center justify-center text-stone uppercase transition-all duration-500 md:flex ${
            scrolled
              ? "gap-8 pb-3 text-[11px] tracking-[0.16em]"
              : "gap-10 pb-5 text-[12px] tracking-[0.2em]"
          }`}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-1 transition-colors hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
