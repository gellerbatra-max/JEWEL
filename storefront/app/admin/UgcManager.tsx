"use client";

import { useActionState, useState, useTransition } from "react";
import { saveUgcAction, deleteUgcAction, type FormState } from "./actions";
import { isVideoMedia } from "@/lib/ugc";

type PostRow = { id: string; media: string; name: string; productTitle: string };
type Prod = { handle: string; title: string };

const field =
  "w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold";

// Manage the "Loved by Influencers" carousel: upload a short video or photo and
// link it to a piece. Owner content only — the home section stays hidden until
// there's at least one post.
export function UgcManager({ posts, products }: { posts: PostRow[]; products: Prod[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveUgcAction, {});
  const [delPending, startDel] = useTransition();
  const [fileName, setFileName] = useState("");

  return (
    <div className="space-y-6">
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {posts.map((p) => (
            <div key={p.id} className="group relative">
              <div className="relative aspect-[3/5] overflow-hidden rounded border border-line bg-cloud">
                {isVideoMedia(p.media) ? (
                  <video src={p.media} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.media} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  disabled={delPending}
                  onClick={() => startDel(() => deleteUgcAction(p.id))}
                  aria-label="Remove post"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
              <p className="mt-1 truncate text-[11px] text-stone">{p.productTitle}</p>
            </div>
          ))}
        </div>
      )}

      <form action={action} className="space-y-3 border border-line bg-white/60 p-4">
        <p className="text-[12px] uppercase tracking-[0.12em] text-stone">Add a post</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <select name="productHandle" defaultValue="" required className={field}>
            <option value="" disabled>
              Which piece does it feature?
            </option>
            {products.map((p) => (
              <option key={p.handle} value={p.handle}>
                {p.title}
              </option>
            ))}
          </select>
          <input name="name" maxLength={80} placeholder="@handle or name (optional)" className={field} />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 border border-dashed border-line bg-white px-4 py-3 text-sm text-stone hover:border-gold">
          <span className="text-[12px] uppercase tracking-[0.12em]">＋ Video or photo</span>
          <input
            type="file"
            name="media"
            accept="video/*,image/*"
            required
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        {fileName && <p className="text-sm text-stone">Ready: {fileName}</p>}
        <p className="text-[12px] text-stone">
          Short vertical clips work best (up to 60MB). Use your real influencer or client content.
        </p>
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state.saved && <p className="text-sm text-gold">Added.</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.14em] text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Add post"}
        </button>
      </form>
    </div>
  );
}
