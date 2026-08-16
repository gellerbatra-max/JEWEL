import Link from "next/link";
import { FacetMark } from "./FacetMark";

export function Footer() {
  return (
    <footer className="border-t border-line mt-28">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <FacetMark size={22} className="text-rose" />
          <p className="font-display text-lg tracking-[0.22em] uppercase text-ink">Taygerian</p>
          <p className="text-[12px] tracking-[0.04em] text-stone max-w-md">
            Ceylon-provenance fine jewellery. Sourced, cut, and set in Sri Lanka.
          </p>
        </div>
        <div className="mt-10 pt-6 border-t border-line-soft flex flex-col gap-3 text-[12px] text-stone sm:flex-row sm:justify-between sm:items-center">
          <p>© {new Date().getFullYear()} Taygerian. Prototype — not a live store.</p>
          <div className="flex gap-6">
            <Link href="/jewellery" className="hover:text-ink transition-colors">Jewellery</Link>
            <Link href="/dynasty" className="hover:text-ink transition-colors">Dynasty</Link>
            <Link href="/cart" className="hover:text-ink transition-colors">Bag</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
