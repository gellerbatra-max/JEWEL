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
};

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

async function read(): Promise<SiteConfig> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as SiteConfig;
  } catch {
    return {};
  }
}

async function write(cfg: SiteConfig): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(cfg, null, 2), "utf8");
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
    cfg.categoryCovers = covers;
    await write(cfg);
  });
}
