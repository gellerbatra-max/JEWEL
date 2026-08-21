"use client";

import { useEffect, useRef, useState } from "react";

export const DIAL_CODES = [
  { f: "🇦🇺", n: "Australia", c: "+61" },
  { f: "🇧🇭", n: "Bahrain", c: "+973" },
  { f: "🇨🇦", n: "Canada", c: "+1" },
  { f: "🇨🇳", n: "China", c: "+86" },
  { f: "🇩🇰", n: "Denmark", c: "+45" },
  { f: "🇫🇷", n: "France", c: "+33" },
  { f: "🇩🇪", n: "Germany", c: "+49" },
  { f: "🇭🇰", n: "Hong Kong", c: "+852" },
  { f: "🇮🇳", n: "India", c: "+91" },
  { f: "🇮🇪", n: "Ireland", c: "+353" },
  { f: "🇮🇹", n: "Italy", c: "+39" },
  { f: "🇯🇵", n: "Japan", c: "+81" },
  { f: "🇰🇼", n: "Kuwait", c: "+965" },
  { f: "🇲🇾", n: "Malaysia", c: "+60" },
  { f: "🇲🇻", n: "Maldives", c: "+960" },
  { f: "🇳🇱", n: "Netherlands", c: "+31" },
  { f: "🇳🇿", n: "New Zealand", c: "+64" },
  { f: "🇳🇴", n: "Norway", c: "+47" },
  { f: "🇴🇲", n: "Oman", c: "+968" },
  { f: "🇶🇦", n: "Qatar", c: "+974" },
  { f: "🇸🇦", n: "Saudi Arabia", c: "+966" },
  { f: "🇸🇬", n: "Singapore", c: "+65" },
  { f: "🇪🇸", n: "Spain", c: "+34" },
  { f: "🇱🇰", n: "Sri Lanka", c: "+94" },
  { f: "🇸🇪", n: "Sweden", c: "+46" },
  { f: "🇨🇭", n: "Switzerland", c: "+41" },
  { f: "🇦🇪", n: "United Arab Emirates", c: "+971" },
  { f: "🇬🇧", n: "United Kingdom", c: "+44" },
  { f: "🇺🇸", n: "United States", c: "+1" },
];

const field =
  "w-full rounded-md border border-line bg-white/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-gold";
const smallLabel = "mb-1.5 block text-[11px] tracking-[0.12em] uppercase text-stone";

// Compact country-code picker (flag + code) + number input. The full country
// list only appears in the searchable dropdown. On submit the form reads the
// number under `numberName` and the dial code under `codeName`.
export function PhoneField({
  label = "Phone *",
  numberName = "phone",
  codeName = "code",
  placeholder = "Your phone",
  required = true,
  defaultDial = "+94",
}: {
  label?: string;
  numberName?: string;
  codeName?: string;
  placeholder?: string;
  required?: boolean;
  defaultDial?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(() => DIAL_CODES.find((d) => d.c === defaultDial) ?? DIAL_CODES[0]);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DIAL_CODES.filter(
    (d) => d.n.toLowerCase().includes(q.toLowerCase()) || d.c.includes(q)
  );

  return (
    <div>
      {label && <span className={smallLabel}>{label}</span>}
      <div className="flex gap-2">
        <div className="relative shrink-0" ref={ref}>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Country code" className={`${field} flex w-24 items-center justify-between gap-1`}>
            <span className="truncate">{sel.f} {sel.c}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-stone"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {open && (
            <div className="absolute left-0 z-30 mt-1 max-h-56 w-64 overflow-y-auto rounded-md border border-line bg-porcelain shadow-[0_20px_50px_-20px_rgba(28,27,25,0.5)]">
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} placeholder="Search country…" className="sticky top-0 w-full border-b border-line bg-porcelain px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60" />
              {filtered.map((d) => (
                <button type="button" key={d.n} onClick={() => { setSel(d); setOpen(false); setQ(""); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-cloud">
                  <span className="w-6 shrink-0">{d.f}</span>
                  <span className="flex-1 truncate">{d.n}</span>
                  <span className="text-stone">{d.c}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="px-3 py-3 text-sm text-stone">No match</p>}
            </div>
          )}
        </div>
        <input name={numberName} required={required} maxLength={20} inputMode="tel" className={`${field} flex-1`} placeholder={placeholder} />
        <input type="hidden" name={codeName} value={sel.c} />
      </div>
    </div>
  );
}
