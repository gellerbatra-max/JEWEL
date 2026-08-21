"use client";

import { useActionState, useState, useTransition } from "react";
import { savePromoAction, deletePromoAction, type FormState } from "./actions";

type Row = {
  id: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  href: string;
  image: string;
};

const field =
  "w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold";

// Manage promotional banners shown before Signature Pieces on the home page.
// Text-only banners work (heading + subtext + button); a background image is
// optional. The section is hidden on the home page until there's a banner.
export function PromoManager({ banners }: { banners: Row[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePromoAction, {});
  const [delPending, startDel] = useTransition();
  const [fileName, setFileName] = useState("");

  return (
    <div className="space-y-6">
      {banners.length > 0 && (
        <div className="space-y-2">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-3 border border-line bg-white px-3 py-2">
              {b.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.image} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />
              ) : (
                <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-cloud text-[10px] uppercase tracking-[0.1em] text-stone">
                  Text
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] text-ink">{b.heading}</p>
                {b.href && (
                  <p className="truncate text-[12px] text-stone">
                    {b.ctaLabel ? `${b.ctaLabel} → ` : ""}
                    {b.href}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={delPending}
                onClick={() => startDel(() => deletePromoAction(b.id))}
                className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-stone transition-colors hover:text-risk"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form action={action} className="space-y-3 border border-line bg-white/60 p-4">
        <p className="text-[12px] uppercase tracking-[0.12em] text-stone">Add a banner</p>
        <input
          name="heading"
          required
          maxLength={120}
          placeholder="Heading (e.g. Follow us & win a gift voucher)"
          className={field}
        />
        <textarea
          name="subtext"
          rows={2}
          maxLength={240}
          placeholder="Subtext (optional)"
          className={`${field} resize-none`}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="ctaLabel" maxLength={40} placeholder="Button label (optional)" className={field} />
          <input
            name="href"
            maxLength={400}
            placeholder="Link — e.g. https://instagram.com/… or /contact"
            className={field}
          />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 border border-dashed border-line bg-white px-4 py-3 text-sm text-stone hover:border-gold">
          <span className="text-[12px] uppercase tracking-[0.12em]">＋ Background image (optional)</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        {fileName && <p className="text-sm text-stone">Ready: {fileName}</p>}
        <p className="text-[12px] text-stone">
          Wide artwork works best (roughly 1600×400). Text sits centred over the image.
        </p>
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state.saved && <p className="text-sm text-gold">Added.</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.14em] text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add banner"}
        </button>
      </form>
    </div>
  );
}
