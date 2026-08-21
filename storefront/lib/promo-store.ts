// Server-only store for promotional banners. File-backed, self-owned. Nothing is
// seeded — the home section stays hidden until the owner adds a banner.
//
// NOTE: imports `fs` — never import from a client component. Client-safe types
// live in ./promo.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { PromoBanner } from "./promo";

const DATA_FILE = path.join(process.cwd(), "data", "promos.json");
const MAX_BANNERS = 12;

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: PromoBanner[] | null = null;

async function read(): Promise<PromoBanner[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as PromoBanner[]) : [];
  return cache;
}

async function write(list: PromoBanner[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

export async function getPromoBanners(): Promise<PromoBanner[]> {
  return read();
}

export async function addPromoBanner(input: {
  heading: string;
  subtext?: string;
  ctaLabel?: string;
  href?: string;
  image?: string;
}): Promise<PromoBanner> {
  return withWriteLock(async () => {
    const all = await read();
    const banner: PromoBanner = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      heading: (input.heading || "").slice(0, 120),
      subtext: (input.subtext || "").slice(0, 240),
      ctaLabel: (input.ctaLabel || "").slice(0, 40),
      href: (input.href || "").slice(0, 400),
      image: input.image || "",
      createdAt: new Date().toISOString(),
    };
    await write([...all, banner].slice(0, MAX_BANNERS));
    return banner;
  });
}

export async function deletePromoBanner(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((b) => b.id !== id));
  });
}
