"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveJournalAction, type FormState } from "@/app/admin/actions";
import type { JournalPost } from "@/lib/journal";

const field =
  "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold";
const label = "mb-1.5 block text-[11px] tracking-[0.12em] uppercase text-stone";

export function JournalForm({ post }: { post?: JournalPost }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveJournalAction, {});
  const [cover, setCover] = useState(post?.cover || "");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-6">
      {post && <input type="hidden" name="originalSlug" value={post.slug} />}
      <input type="hidden" name="existingCover" value={cover} />

      <div>
        <label className={label} htmlFor="j-title">
          Title *
        </label>
        <input
          id="j-title"
          name="title"
          defaultValue={post?.title}
          required
          maxLength={120}
          className={`${field} font-display text-lg`}
          placeholder="The Colour of Ceylon"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="j-slug">
            Web address (optional)
          </label>
          <input
            id="j-slug"
            name="slug"
            defaultValue={post?.slug}
            maxLength={120}
            className={field}
            placeholder="the-colour-of-ceylon"
          />
          <p className="mt-1 text-[11px] text-stone">Leave blank to build it from the title.</p>
        </div>
        <div>
          <label className={label} htmlFor="j-date">
            Date
          </label>
          <input
            id="j-date"
            name="date"
            type="date"
            defaultValue={post?.date || today}
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="j-excerpt">
          Short summary
        </label>
        <textarea
          id="j-excerpt"
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={2}
          maxLength={300}
          className={`${field} resize-none`}
          placeholder="One or two lines shown on the Journal list."
        />
      </div>

      <div>
        <label className={label} htmlFor="j-body">
          Story *
        </label>
        <textarea
          id="j-body"
          name="body"
          defaultValue={post?.body}
          rows={12}
          required
          className={`${field} leading-relaxed`}
          placeholder={"Write your story here.\n\nLeave a blank line between paragraphs."}
        />
        <p className="mt-1 text-[11px] text-stone">Leave a blank line between paragraphs.</p>
      </div>

      <div>
        <label className={label}>Cover photo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-line bg-cloud">
            {cover ? (
              <Image src={cover} alt="" fill sizes="112px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-[11px] text-stone">
                None
              </span>
            )}
          </div>
          <div className="text-sm">
            <input
              type="file"
              name="cover"
              accept="image/*"
              className="block text-[13px] text-stone file:mr-3 file:border file:border-line file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:uppercase file:tracking-[0.1em] file:text-ink hover:file:border-ink"
            />
            {cover && (
              <button
                type="button"
                onClick={() => setCover("")}
                className="mt-2 text-[11px] tracking-[0.1em] uppercase text-stone hover:text-risk"
              >
                Remove cover
              </button>
            )}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post ? post.published : true}
          className="h-4 w-4 accent-gold"
        />
        Published (visible on the site)
      </label>

      {state.error && <p className="text-sm text-risk">{state.error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink px-6 py-2.5 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "Saving…" : post ? "Save changes" : "Publish entry"}
        </button>
        <Link
          href="/admin/journal"
          className="text-[12px] tracking-[0.1em] uppercase text-stone hover:text-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
