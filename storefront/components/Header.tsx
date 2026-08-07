import Link from "next/link";
import { FacetMark } from "./FacetMark";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";

const NAV = [
  { href: "/jewellery", label: "Jewellery" },
  { href: "/gemstones", label: "Gemstones" },
  { href: "/our-story", label: "Our Story" },
];

export function Header() {
  return (
    <header className="relative border-b border-line bg-porcelain/85 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <div className="flex items-center gap-4">
          <MobileMenu items={NAV} />
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl tracking-[0.22em] uppercase text-ink"
          >
            <FacetMark size={20} className="text-gold" />
            Taygerian
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-stone">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <CartLink />
      </div>
    </header>
  );
}
