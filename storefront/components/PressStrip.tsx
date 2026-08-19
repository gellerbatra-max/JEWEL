// "As featured in" trust strip. Renders nothing unless the owner has added
// real press names in the dashboard — so there's never any fabricated press.
export function PressStrip({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="border-y border-line-soft bg-cloud/40 py-9">
      <div className="mx-auto max-w-[1400px] px-6 text-center">
        <p className="mb-5 text-[11px] tracking-[0.24em] uppercase text-stone">As featured in</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((name) => (
            <span
              key={name}
              className="font-display text-lg tracking-[0.08em] text-ink/70 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
