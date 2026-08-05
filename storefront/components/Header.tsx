import Link from "next/link";
import { FacetMark } from "./FacetMark";
import { CartLink } from "./CartLink";

const NAV = [
  { href: "/collections/ceylon-signature", label: "Ceylon Signature" },
  { href: "/collections/fine-jewellery", label: "Fine Jewellery" },
  { href: "/collections/bridal", label: "Bridal" },
  { href: "/our-story", label: "Our Story" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-panel-2/60 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-[0.12em] uppercase">
          <FacetMark size={22} className="text-gold" />
          Cassian
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[11.5px] tracking-[0.05em] uppercase text-ivory-dim">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ivory transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <CartLink />
      </div>
    </header>
  );
}
