"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { saveProductAction, type FormState } from "./actions";
import { collections, type Product } from "@/lib/products";
import { SECTION_DEFS, sectionText, type SectionKey } from "@/lib/product-sections";

const CURRENCIES = ["USD", "LKR", "EUR", "GBP", "AUD"];

// Add / edit form for a jewellery piece. Used for both "new" (no product) and
// "edit" (product provided). Photos already on the piece can be reordered or
// removed; new photos are uploaded on save.
export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProductAction, {});
  const [existing, setExisting] = useState<string[]>(product?.images ?? []);
  const [newNames, setNewNames] = useState<string[]>([]);
  const [coll, setColl] = useState<string>(product?.collectionHandle ?? "");

  const sectionValue = (key: SectionKey) =>
    product
      ? sectionText(product, key)
      : SECTION_DEFS.find((s) => s.key === key)!.defaultText({ oneOfAKind: false });

  const makeMain = (path: string) =>
    setExisting((imgs) => [path, ...imgs.filter((p) => p !== path)]);
  const removeImg = (path: string) => setExisting((imgs) => imgs.filter((p) => p !== path));

  return (
    <form action={action} className="space-y-8">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Name + category */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name of the piece" required>
          <input
            name="title"
            required
            defaultValue={product?.title ?? ""}
            placeholder="e.g. Aurelia Ring"
            className={inputCls}
          />
        </Field>
        <Field label="Category" required>
          <select
            name="collectionHandle"
            value={coll}
            onChange={(e) => setColl(e.target.value)}
            className={inputCls}
          >
            <option value="" disabled>
              Choose a category…
            </option>
            {collections.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Metal + stone */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Metal" hint="e.g. 18k Gold, Platinum, White Gold">
          <input name="metal" defaultValue={product?.metal ?? ""} placeholder="18k Gold" className={inputCls} />
        </Field>
        <Field label="Stone" hint="e.g. Ceylon Blue Sapphire, oval cut">
          <input name="stone" defaultValue={product?.stone ?? ""} placeholder="Ceylon Blue Sapphire" className={inputCls} />
        </Field>
      </div>

      {/* Price + currency */}
      <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
        <Field label="Price" hint="Numbers only. Leave blank if price is on request.">
          <input
            name="price"
            inputMode="decimal"
            defaultValue={product && !product.oneOfAKind ? String(product.price) : ""}
            placeholder="3450"
            className={inputCls}
          />
        </Field>
        <Field label="Currency">
          <select name="currency" defaultValue={product?.currency ?? "USD"} className={inputCls}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Description */}
      <Field label="Description" hint="A sentence or two shown on the product page.">
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          placeholder="A round white sapphire set in 18k gold, hand-finished in our Colombo atelier."
          className={inputCls}
        />
      </Field>

      {/* Photos */}
      <div>
        <p className="text-[12px] tracking-[0.14em] uppercase text-stone mb-2">Photos</p>
        <p className="text-sm text-stone mb-4">
          The <strong>first photo is the main image</strong> shown in listings. Add several to build the
          gallery on the product page.
        </p>

        {existing.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 mb-4">
            {existing.map((path, i) => (
              <div key={path} className="group relative aspect-square border border-line bg-white overflow-hidden">
                <Image src={path} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 bg-ink/85 text-porcelain text-[9px] tracking-[0.1em] uppercase px-1.5 py-0.5">
                    Main
                  </span>
                )}
                {/* Submitted so the server keeps this image, in this order. */}
                <input type="hidden" name="existingImages" value={path} />
                <div className="absolute inset-x-0 bottom-0 flex divide-x divide-white/30 bg-ink/70 opacity-0 transition-opacity group-hover:opacity-100">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(path)}
                      className="flex-1 py-1 text-[10px] uppercase tracking-[0.08em] text-porcelain hover:bg-gold"
                    >
                      Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImg(path)}
                    className="flex-1 py-1 text-[10px] uppercase tracking-[0.08em] text-porcelain hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="inline-flex cursor-pointer items-center gap-3 border border-dashed border-line bg-white px-4 py-3 text-sm text-stone hover:border-gold">
          <span className="text-[12px] tracking-[0.12em] uppercase">＋ Add photos</span>
          <input
            type="file"
            name="newImages"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setNewNames(Array.from(e.target.files ?? []).map((f) => f.name))
            }
          />
        </label>
        {newNames.length > 0 && (
          <p className="mt-2 text-sm text-stone">
            {newNames.length} new photo{newNames.length === 1 ? "" : "s"} ready to upload: {newNames.join(", ")}
          </p>
        )}
      </div>

      {/* Toggles */}
      <div className="space-y-3 border-y border-line py-6">
        <Toggle
          name="showOnHome"
          defaultChecked={product?.showOnHome ?? false}
          title="Show on home page"
          desc="Feature this piece in the “Signature Pieces” section of the home page."
        />
        <Toggle
          name="oneOfAKind"
          defaultChecked={product?.oneOfAKind ?? false}
          title="One-of-a-kind (price on request)"
          desc="Marks the piece as unique and shows “Price on Request” instead of a price."
        />
      </div>

      {/* Product-page sections (optional per-item overrides) */}
      <details className="border border-line bg-white/60 px-5 py-4">
        <summary className="cursor-pointer text-[12px] tracking-[0.12em] uppercase text-stone">
          Product-page sections
        </summary>
        <p className="mt-3 text-sm text-stone">
          These appear as expandable sections on the piece’s page. Each is pre-filled with the
          standard house wording — edit any to customise it for this piece, or leave it as-is to keep
          the standard text.
        </p>
        <div className="mt-4 space-y-5">
          {SECTION_DEFS.filter((s) => !s.onlyRings || coll === "rings").map((s) => (
            <Field key={s.key} label={s.title}>
              <textarea
                name={`section_${s.key}`}
                rows={s.key === "care" ? 7 : 3}
                defaultValue={sectionValue(s.key)}
                className={inputCls}
              />
            </Field>
          ))}
        </div>
      </details>

      {/* Certification (optional) */}
      <details className="border border-line bg-white/60 px-5 py-4">
        <summary className="cursor-pointer text-[12px] tracking-[0.12em] uppercase text-stone">
          Lab certification (optional)
        </summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Lab">
            <select name="certLab" defaultValue={product?.certification?.lab ?? ""} className={inputCls}>
              <option value="">None</option>
              <option value="GIA">GIA</option>
              <option value="GRS">GRS</option>
              <option value="AGL">AGL</option>
            </select>
          </Field>
          <Field label="Report number">
            <input name="certReport" defaultValue={product?.certification?.reportNumber ?? ""} className={inputCls} />
          </Field>
          <Field label="Verified origin">
            <input
              name="certOrigin"
              defaultValue={product?.certification?.origin ?? ""}
              placeholder="Ceylon (Sri Lanka)"
              className={inputCls}
            />
          </Field>
        </div>
      </details>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{state.error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-8 py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "Saving…" : product ? "Save changes" : "Add piece"}
        </button>
        <a href="/admin" className="text-[12px] tracking-[0.12em] uppercase text-stone hover:text-ink">
          Cancel
        </a>
      </div>
    </form>
  );
}

const inputCls =
  "w-full border border-line bg-white px-3.5 py-2.5 text-ink outline-none focus:border-gold";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] tracking-[0.14em] uppercase text-stone mb-2">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[13px] text-stone/80">{hint}</span>}
    </label>
  );
}

function Toggle({
  name,
  title,
  desc,
  defaultChecked,
}: {
  name: string;
  title: string;
  desc: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-[var(--gold)]" />
      <span>
        <span className="block text-ink">{title}</span>
        <span className="block text-sm text-stone">{desc}</span>
      </span>
    </label>
  );
}
