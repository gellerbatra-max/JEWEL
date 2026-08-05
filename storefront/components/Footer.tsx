import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 text-[13px] text-ivory-dim flex flex-col gap-3 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Cassian. Working name — pending trademark clearance.</p>
        <div className="flex gap-6">
          <Link href="/our-story" className="hover:text-ivory transition-colors">Our Story</Link>
          <Link href="/cart" className="hover:text-ivory transition-colors">Bag</Link>
        </div>
      </div>
    </footer>
  );
}
