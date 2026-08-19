import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { getPublishedPosts } from "@/lib/journal-store";
import { formatPostDate } from "@/lib/journal";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Stories from the Taygerian atelier — Ceylon sapphires, the craft of our southern Sri Lanka workshop, and guidance for choosing a stone.",
};

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <PageIntro eyebrow="The Journal" title="Notes from the Atelier">
        On Ceylon stones, the craft behind each piece, and how to choose jewellery that lasts
        generations.
      </PageIntro>

      {posts.length === 0 ? (
        <p className="text-center text-stone">Stories are on their way.</p>
      ) : (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
                {post.cover ? (
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center font-display text-2xl text-stone/40">
                    Taygerian
                  </span>
                )}
              </div>
              <p className="mt-4 text-[11px] tracking-[0.14em] uppercase text-gold">
                {formatPostDate(post.date)}
              </p>
              <h2 className="mt-1.5 font-display text-xl text-ink transition-colors group-hover:text-gold">
                {post.title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-stone">{post.excerpt}</p>
              <span className="mt-3 inline-block text-[11px] tracking-[0.14em] uppercase text-stone group-hover:text-ink">
                Read →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
