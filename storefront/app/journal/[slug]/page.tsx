import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPost, getPublishedPosts } from "@/lib/journal-store";
import { paragraphs, formatPostDate } from "@/lib/journal";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journal/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post || !post.published) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: `${post.title} — Taygerian`,
      description: post.excerpt,
      type: "article",
      url: `/journal/${post.slug}`,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default async function JournalPostPage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    author: { "@type": "Organization", name: "Taygerian" },
    publisher: { "@type": "Organization", name: "Taygerian" },
    mainEntityOfPage: `${SITE_URL}/journal/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-[760px] px-6 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <div className="text-center">
        <p className="text-[11px] tracking-[0.16em] uppercase text-gold">
          {formatPostDate(post.date)}
        </p>
        <h1 className="mx-auto mt-3 max-w-[16ch] text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
      </div>

      {post.cover && (
        <div className="relative mt-10 aspect-[16/10] overflow-hidden bg-cloud">
          <Image src={post.cover} alt={post.title} fill sizes="760px" className="object-cover" priority />
        </div>
      )}

      <div className="prose-lux mx-auto mt-10">
        {paragraphs(post.body).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-8 text-center">
        <Link
          href="/journal"
          className="text-[11px] tracking-[0.14em] uppercase text-stone transition-colors hover:text-ink"
        >
          ← All journal entries
        </Link>
      </div>
    </article>
  );
}
