"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import type { FormState } from "./actions";

const MAX = 5;

type CatalogItem = { title: string; image: string };
type SaveAction = (prev: FormState, formData: FormData) => Promise<FormState>;

// Manage the up-to-5 photos that auto-rotate in a home section (Made to Order,
// Bridal, ...). Photos can be chosen from the existing catalogue or uploaded.
// The section-specific save server action is passed in as a prop.
export function SectionImagesManager({
  initial,
  catalog,
  action: saveAction,
}: {
  initial: string[];
  catalog: CatalogItem[];
  action: SaveAction;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAction, {});
  const [selected, setSelected] = useState<string[]>(initial);
  const [newNames, setNewNames] = useState<string[]>([]);
  const total = selected.length + newNames.length;
  const full = total >= MAX;

  // After a save, reflect the stored set (incl. new uploads) without a reload.
  useEffect(() => {
    if (state.images) {
      setSelected(state.images);
      setNewNames([]);
    }
  }, [state]);

  const remove = (p: string) => setSelected((x) => x.filter((q) => q !== p));
  const toggleCatalog = (path: string) =>
    setSelected((cur) => {
      if (cur.includes(path)) return cur.filter((p) => p !== path);
      if (cur.length + newNames.length >= MAX) return cur;
      return [...cur, path];
    });

  return (
    <form action={action} className="space-y-5">
      {/* Selected photos */}
      <div>
        <p className="mb-2 text-[12px] uppercase tracking-[0.12em] text-stone">
          Selected ({total}/{MAX})
        </p>
        {selected.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {selected.map((p, i) => (
              <div key={p} className="group relative aspect-square border border-line bg-porcelain">
                <Image src={p} alt="" fill sizes="120px" className="object-contain mix-blend-multiply" />
                <input type="hidden" name="existingImages" value={p} />
                <span className="absolute left-1 top-1 bg-ink/80 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.1em] text-porcelain">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label="Remove photo"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone">
            None yet — choose from your catalogue below, or upload your own. The default image shows
            until you add some.
          </p>
        )}
      </div>

      {/* Choose from catalogue */}
      <details className="border border-line bg-white/60 px-4 py-3">
        <summary className="cursor-pointer text-[12px] uppercase tracking-[0.12em] text-stone">
          Choose from your catalogue ({catalog.length})
        </summary>
        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
          {catalog.map((it) => {
            const on = selected.includes(it.image);
            const disabled = !on && full;
            return (
              <button
                key={it.image}
                type="button"
                onClick={() => toggleCatalog(it.image)}
                disabled={disabled}
                title={it.title}
                className={`relative aspect-square overflow-hidden border bg-porcelain transition ${
                  on ? "border-gold ring-1 ring-gold" : "border-line hover:border-stone"
                } ${disabled ? "opacity-40" : ""}`}
              >
                <Image src={it.image} alt={it.title} fill sizes="120px" className="object-contain mix-blend-multiply" />
                {on && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] text-porcelain">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </details>

      {/* Upload your own — always available (the cap is enforced on save) */}
      <div>
        <label className="inline-flex cursor-pointer items-center gap-3 border border-dashed border-line bg-white px-4 py-3 text-sm text-stone hover:border-gold">
          <span className="text-[12px] uppercase tracking-[0.12em]">＋ Upload your own</span>
          <input
            type="file"
            name="newImages"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => setNewNames(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
        </label>
        {newNames.length > 0 && (
          <p className="mt-2 text-sm text-stone">
            {newNames.length} new photo{newNames.length === 1 ? "" : "s"} ready to upload:{" "}
            {newNames.join(", ")}
          </p>
        )}
        {full && newNames.length > 0 && (
          <p className="mt-1 text-sm text-red-700">
            You&apos;re at the {MAX}-photo limit — remove a selected photo above to include your upload.
          </p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.14em] text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save photos"}
      </button>
    </form>
  );
}
