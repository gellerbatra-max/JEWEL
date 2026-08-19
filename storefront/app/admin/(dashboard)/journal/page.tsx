import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/journal-store";
import { formatPostDate } from "@/lib/journal";
import { JournalDeleteButton } from "@/app/admin/JournalDeleteButton";

export const dynamic = "force-dynamic";

export default async function JournalAdminPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">The Journal</h1>
          <p className="mt-1 text-sm text-stone">
            {posts.length} {posts.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="bg-ink px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
        >
          ＋ New entry
        </Link>
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        Journal entries help your <span className="text-ink">Google ranking</span> and give your
        newsletter and social posts something to link to. Write about a stone, a commission, or the
        craft.
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No entries yet.</p>
          <Link
            href="/admin/journal/new"
            className="mt-5 inline-block bg-ink px-5 py-2.5 text-[12px] tracking-[0.14em] uppercase text-porcelain hover:bg-gold"
          >
            ＋ Write your first entry
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {posts.map((p) => (
            <div
              key={p.slug}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-line bg-white px-4 py-3"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-cloud">
                {p.cover ? (
                  <Image src={p.cover} alt="" fill sizes="80px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-ink">{p.title}</p>
                <p className="text-[12px] text-stone">{formatPostDate(p.date)}</p>
              </div>
              <span
                className={`text-[10px] tracking-[0.12em] uppercase ${
                  p.published ? "text-gold" : "text-stone"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/journal/${p.slug}/edit`}
                  className="text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink"
                >
                  Edit
                </Link>
                <JournalDeleteButton slug={p.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
