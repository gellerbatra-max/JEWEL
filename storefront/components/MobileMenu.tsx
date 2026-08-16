"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex flex-col justify-center gap-[5px] w-6 h-6 text-ink"
      >
        <span className={`block h-px w-6 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
        <span className={`block h-px w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block h-px w-6 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full bg-porcelain border-b border-line shadow-sm">
          <nav className="flex flex-col px-6 py-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[12px] tracking-[0.12em] uppercase text-ink border-b border-line-soft last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
