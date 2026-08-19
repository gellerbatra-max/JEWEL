// Server-only store for "Loved by Influencers" posts. File-backed, self-owned.
// Each post is an owner-uploaded video/photo linked to a product. Nothing is
// seeded — the home section stays hidden until the owner adds real content.
//
// NOTE: imports `fs` — never import from a client component. Client-safe types
// live in ./ugc.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { UgcPost } from "./ugc";

const DATA_FILE = path.join(process.cwd(), "data", "ugc.json");
const MAX_POSTS = 40;

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: UgcPost[] | null = null;

async function read(): Promise<UgcPost[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as UgcPost[]) : [];
  return cache;
}

async function write(list: UgcPost[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

export async function getUgcPosts(): Promise<UgcPost[]> {
  return read();
}

export async function addUgcPost(input: {
  media: string;
  productHandle: string;
  name?: string;
}): Promise<UgcPost> {
  return withWriteLock(async () => {
    const all = await read();
    const post: UgcPost = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      media: input.media,
      productHandle: input.productHandle,
      name: (input.name || "").slice(0, 80),
      createdAt: new Date().toISOString(),
    };
    await write([...all, post].slice(0, MAX_POSTS));
    return post;
  });
}

export async function deleteUgcPost(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((p) => p.id !== id));
  });
}
