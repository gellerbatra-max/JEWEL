import type { ReactNode } from "react";

// Shared page header used across the content/info pages (How to Order, FAQ,
// legal, service, guide…). Matches the eyebrow + display-serif title + stone
// lede pattern used on Contact and the collection pages.
export function PageIntro({
  eyebrow,
  title,
  children,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  const wrap = align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl";
  return (
    <div className={`mb-12 ${wrap}`}>
      {eyebrow && (
        <p className="mb-4 text-[11px] tracking-[0.2em] uppercase text-gold">{eyebrow}</p>
      )}
      <h1 className="text-balance font-display text-4xl text-ink sm:text-5xl">{title}</h1>
      {children && <div className="mt-5 text-lg leading-relaxed text-stone">{children}</div>}
    </div>
  );
}
