"use client";

// Catches unexpected render errors in any page so visitors get a branded
// fallback (and a retry) instead of a raw 500.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-[13px] tracking-[0.24em] uppercase text-gold">Taygerian</p>
      <h1 className="font-display text-3xl text-ink">Something went wrong</h1>
      <p className="mt-4 text-stone">A brief hiccup on our end. Please try again.</p>
      <button
        onClick={() => reset()}
        className="mt-8 bg-ink px-8 py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
      >
        Try again
      </button>
    </div>
  );
}
