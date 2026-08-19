// Server-only store for small, owner-controlled site settings that aren't tied
// to a single product — currently the cover image shown for each category on the
// Jewellery page. Kept in data/site-config.json (self-owned, no external service).
//
// NOTE: imports `fs` — never import from a client component.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { CollectionHandle } from "./products";

const FILE = path.join(process.cwd(), "data", "site-config.json");

type SiteConfig = {
  // category handle -> the product id whose photo represents that category
  categoryCovers?: Partial<Record<CollectionHandle, string>>;
  // up to 5 photos that auto-rotate in each home section
  bespokeImages?: string[]; // "Made to Order"
  bridalImages?: string[]; // "Bridal"
};

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

// Cached for this process; invalidated on write.
let cache: SiteConfig | null = null;

async function read(): Promise<SiteConfig> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    parsed = null; // missing or corrupt — fall back to empty config
  }
  cache = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as SiteConfig) : {};
  return cache;
}

async function write(cfg: SiteConfig): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(cfg, null, 2), "utf8");
  await fs.rename(tmp, FILE);
  cache = cfg;
}

export async function getCategoryCovers(): Promise<Partial<Record<CollectionHandle, string>>> {
  return (await read()).categoryCovers ?? {};
}

// Set (or clear, when productId is empty) which piece's photo represents a category.
export async function setCategoryCover(handle: CollectionHandle, productId: string): Promise<void> {
  return withWriteLock(async () => {
    const cfg = await read();
    const covers = { ...(cfg.categoryCovers ?? {}) };
    if (productId) covers[handle] = productId;
    else delete covers[handle];
    await write({ ...cfg, categoryCovers: covers });
  });
}

export const MAX_SECTION_IMAGES = 5;

export async function getBespokeImages(): Promise<string[]> {
  return (await read()).bespokeImages ?? [];
}

export async function setBespokeImages(paths: string[]): Promise<void> {
  return withWriteLock(async () => {
    const cfg = await read();
    await write({ ...cfg, bespokeImages: paths.slice(0, MAX_SECTION_IMAGES) });
  });
}

export async function getBridalImages(): Promise<string[]> {
  return (await read()).bridalImages ?? [];
}

export async function setBridalImages(paths: string[]): Promise<void> {
  return withWriteLock(async () => {
    const cfg = await read();
    await write({ ...cfg, bridalImages: paths.slice(0, MAX_SECTION_IMAGES) });
  });
}
