// Server-only store for The Journal (editorial posts). File-backed JSON, same
// self-owned pattern as the catalog store: cached in-memory, atomic writes, a
// small write lock. Seeded once from the posts below so the Journal isn't empty.
//
// NOTE: imports `fs` — never import from a client component. Client-safe types
// live in ./journal.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { JournalPost } from "./journal";

const DATA_FILE = path.join(process.cwd(), "data", "journal.json");

const seedPosts: JournalPost[] = [
  {
    slug: "the-colour-of-ceylon",
    title: "The Colour of Ceylon",
    excerpt:
      "Why a Ceylon sapphire reads differently in the light — and what centuries of Ratnapura mining taught the world about blue.",
    cover: "/images/editorial-provenance.jpg",
    date: "2026-06-12",
    published: true,
    body: `For two thousand years, the gravels of Sri Lanka have given up sapphires in a blue no other source quite repeats — a cornflower brightness that holds its colour by candlelight as well as by day.

Geology explains part of it. The island's stones form slowly, under conditions that lend them exceptional clarity and an even, luminous saturation. The rest is knowledge: generations of Ratnapura miners and cutters who learned to read a rough stone and coax the most life from it.

At Taygerian, every sapphire we set is chosen for that living colour first. A certificate confirms the origin; the eye confirms the rest.`,
  },
  {
    slug: "made-in-the-south-by-our-own-hands",
    title: "Made in the South, By Our Own Hands",
    excerpt:
      "Our stones are born in Ceylon's gem gravels; our pieces are made by our own goldsmiths in southern Sri Lanka — a family craft passed down for generations.",
    cover: "/images/story-asworn.jpg",
    date: "2026-05-03",
    published: true,
    body: `The stone comes from Ratnapura — "city of gems" — where some of the richest gem gravels on earth have been worked for centuries. But a sapphire leaves that ground rough and unremarkable. What it becomes is a matter of hands.

Those hands are ours. Taygerian pieces are made in our own workshop in the south of Sri Lanka, by goldsmiths from a family tradition that reaches back generations — cutting to release colour and fire, then setting each stone where the light should fall.

We don't outsource the making, and we don't keep it anonymous. The people who craft a Taygerian piece are the reason it looks the way it does.`,
  },
  {
    slug: "choosing-a-sapphire",
    title: "Choosing a Sapphire",
    excerpt:
      "Colour, cut, clarity, and the question of heat. A short guide to reading a stone before you fall for it.",
    cover: "/images/cornflower-solitaire-ring.jpg",
    date: "2026-04-18",
    published: true,
    body: `Colour comes first. With sapphire, the prize is an even, vivid blue that is neither too dark nor washed out — a colour that stays alive as the light changes.

Cut is what releases that colour. A well-cut stone returns light evenly across the whole face, with no dull windows. Clarity matters, but a few natural inclusions are the fingerprint of a genuine, untreated stone.

Then there is heat. Most sapphires on the market are gently heated to improve colour — a long-accepted practice. Unheated stones of fine colour are rarer, and priced accordingly. Whichever you choose, it should be stated plainly on the certificate. If you would like help reading one, we are always glad to talk it through.`,
  },
];

let seedPromise: Promise<void> | null = null;
function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await fs.access(DATA_FILE);
        return;
      } catch {
        // not created yet — seed
      }
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(seedPosts, null, 2), "utf8");
    })();
  }
  return seedPromise;
}

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: JournalPost[] | null = null;

async function read(): Promise<JournalPost[]> {
  if (cache) return cache;
  await ensureSeeded();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    // unreadable/corrupt — fall back to seed
  }
  cache = Array.isArray(parsed) ? (parsed as JournalPost[]) : [...seedPosts];
  return cache;
}

async function write(list: JournalPost[]): Promise<void> {
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

const byNewest = (a: JournalPost, b: JournalPost) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

export async function getAllPosts(): Promise<JournalPost[]> {
  return [...(await read())].sort(byNewest);
}

export async function getPublishedPosts(): Promise<JournalPost[]> {
  return (await read()).filter((p) => p.published).sort(byNewest);
}

export async function getPost(slug: string): Promise<JournalPost | undefined> {
  return (await read()).find((p) => p.slug === slug);
}

export type JournalInput = {
  originalSlug?: string; // present when editing (slug may change)
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  date: string;
  published: boolean;
};

export async function upsertPost(input: JournalInput): Promise<JournalPost> {
  return withWriteLock(async () => {
    const all = await read();
    const post: JournalPost = {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      cover: input.cover,
      date: input.date,
      published: input.published,
    };
    const key = input.originalSlug || input.slug;
    const idx = all.findIndex((p) => p.slug === key);
    const next = [...all];
    if (idx === -1) next.push(post);
    else next[idx] = post;
    await write(next);
    return post;
  });
}

export async function deletePost(slug: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((p) => p.slug !== slug));
  });
}
