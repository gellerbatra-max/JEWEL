// Server-only catalog store.
//
// The single source of truth for live product data. Reads and the owner's edits
// (from the /admin Manage dashboard) go through here. Data is kept in a plain
// JSON file on disk (data/catalog.json) — fully self-owned, no external service,
// no monthly fee. On first run the file is seeded from the committed prototype
// catalog (catalog-data.ts) so the store opens with all existing pieces.
//
// NOTE: imports `fs` — never import this from a client component. Client-safe
// types/constants/helpers live in ./products.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import { products as seedProducts } from "./catalog-data";
import {
  collections,
  MAX_SIGNATURE,
  type CollectionHandle,
  type Certification,
  type Product,
} from "./products";
import type { ProductSections } from "./product-sections";

const DATA_FILE = path.join(process.cwd(), "data", "catalog.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "uploads");
const UPLOAD_PUBLIC = "/images/uploads";

// Only real image types may be written into the public uploads folder (Next
// serves them same-origin, so an .svg/.html would be a stored-XSS vector).
const ALLOWED_IMAGE_EXT = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12 MB per photo

const ID_PREFIX: Record<CollectionHandle, string> = {
  rings: "RNG",
  necklaces: "NCK",
  pendants: "PND",
  earrings: "EAR",
  bracelets: "BRC",
  bangles: "BNG",
};

// ---------------------------------------------------------------------------
// File access (seed-once + a small write lock so rapid edits can't interleave)
// ---------------------------------------------------------------------------

let seedPromise: Promise<void> | null = null;
function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        await fs.access(DATA_FILE);
        return; // already exists — leave the owner's live data untouched
      } catch {
        // not created yet — seed from the committed prototype catalog
      }
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf8");
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

// In-memory cache of the parsed catalog for this process. Invalidated on every
// write, so reads don't re-read + re-parse the file (and O(n) scan) on every
// call — a single render often reads several times.
let cache: Product[] | null = null;

async function readCatalog(): Promise<Product[]> {
  if (cache) return cache;
  await ensureSeeded();
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    // Unreadable or corrupt/truncated JSON — fall through to the seed fallback
    // below rather than throwing (an unguarded throw would 500 the whole site).
  }
  // Guard against a corrupt or hand-edited non-array file: fall back to the
  // committed seed instead of crashing every page that reads the catalog.
  cache = Array.isArray(parsed) ? (parsed as Product[]) : [...seedProducts];
  return cache;
}

// Atomic write: write a temp file, then rename over the target, so a crash or
// full disk mid-write can't leave a truncated catalog.json. Refreshes the cache
// only after the rename succeeds, keeping cache and disk consistent.
async function writeCatalog(list: Product[]): Promise<void> {
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

// ---------------------------------------------------------------------------
// Reads (used by the public site)
// ---------------------------------------------------------------------------

export async function getAllProducts(): Promise<Product[]> {
  return readCatalog();
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const all = await readCatalog();
  return all.find((p) => p.handle === handle);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await readCatalog();
  return all.find((p) => p.id === id);
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  const all = await readCatalog();
  return all.filter((p) => p.collectionHandle === handle);
}

// Signature Pieces on the home page. Owner-picked items (showOnHome) win, sorted
// by homeOrder. If the owner hasn't picked any yet, fall back to a curated spread
// across categories so the home page is never empty.
export async function getSignaturePieces(count = 4): Promise<Product[]> {
  const all = await readCatalog();
  const picked = all
    .filter((p) => p.showOnHome)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0));
  if (picked.length > 0) return picked.slice(0, count);
  return autoSpread(all, count);
}

function autoSpread(all: Product[], count: number): Product[] {
  const out: Product[] = [];
  const byCat = collections.map((c) => all.filter((p) => p.collectionHandle === c.handle));
  let round = 0;
  while (out.length < count && round < 12) {
    for (const list of byCat) {
      if (list[round]) out.push(list[round]);
      if (out.length >= count) break;
    }
    round++;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Writes (used by the Manage dashboard via server actions)
// ---------------------------------------------------------------------------

export type ProductInput = {
  id?: string; // present when editing an existing piece
  title: string;
  collectionHandle: CollectionHandle;
  metal: string;
  stone: string;
  price: number;
  currency: string;
  oneOfAKind: boolean;
  description: string;
  images: string[]; // public paths, first one is the primary image
  showOnHome: boolean;
  certification?: Certification | null;
  sections?: ProductSections; // per-item product-page section overrides
};

export async function upsertProduct(input: ProductInput): Promise<Product> {
  return withWriteLock(async () => {
    const all = await readCatalog();

    if (input.id) {
      const idx = all.findIndex((p) => p.id === input.id);
      if (idx === -1) throw new Error(`Product not found: ${input.id}`);
      const existing = all[idx];
      const images = input.images.length ? input.images : existing.images;
      const updated: Product = {
        ...existing,
        title: input.title,
        collectionHandle: input.collectionHandle,
        metal: input.metal,
        stone: input.stone,
        price: input.price,
        currency: input.currency,
        oneOfAKind: input.oneOfAKind,
        description: input.description,
        certification: input.certification ?? null,
        images,
        image: images[0] ?? existing.image,
        isRing: input.collectionHandle === "rings",
        showOnHome: input.showOnHome,
        homeOrder: input.showOnHome
          ? existing.homeOrder ?? nextHomeOrder(all)
          : existing.homeOrder,
        sections: input.sections,
      };
      const next = [...all];
      next[idx] = updated;
      await writeCatalog(next);
      return updated;
    }

    const id = nextId(all, input.collectionHandle);
    const created: Product = {
      id,
      handle: uniqueHandle(all, slugify(input.title) || input.collectionHandle),
      title: input.title,
      sku: id,
      collectionHandle: input.collectionHandle,
      metal: input.metal,
      stone: input.stone,
      price: input.price,
      currency: input.currency,
      oneOfAKind: input.oneOfAKind,
      certification: input.certification ?? null,
      description: input.description,
      swatch: "#d8d3c8",
      image: input.images[0] ?? "",
      images: input.images,
      isRing: input.collectionHandle === "rings",
      showOnHome: input.showOnHome,
      homeOrder: input.showOnHome ? nextHomeOrder(all) : undefined,
      sections: input.sections,
    };
    await writeCatalog([...all, created]);
    return created;
  });
}

export async function deleteProduct(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await readCatalog();
    await writeCatalog(all.filter((p) => p.id !== id));
  });
}

export async function setShowOnHome(
  id: string,
  show: boolean
): Promise<{ ok: boolean; atLimit?: boolean }> {
  return withWriteLock(async () => {
    const all = await readCatalog();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return { ok: false };
    // Cap the number of home-page pieces at MAX_SIGNATURE.
    if (show && !all[idx].showOnHome) {
      const count = all.filter((p) => p.showOnHome).length;
      if (count >= MAX_SIGNATURE) return { ok: false, atLimit: true };
    }
    const next = [...all];
    next[idx] = {
      ...all[idx],
      showOnHome: show,
      homeOrder: show ? all[idx].homeOrder ?? nextHomeOrder(all) : all[idx].homeOrder,
    };
    await writeCatalog(next);
    return { ok: true };
  });
}

// Save an uploaded photo to public/images/uploads and return its public path.
// Rejects non-image types and oversized files.
export async function saveUploadedImage(file: File): Promise<string> {
  const ext = (extFromName(file.name) || extFromType(file.type) || "").toLowerCase();
  if (!ALLOWED_IMAGE_EXT.has(ext)) {
    throw new Error(`Unsupported image type: ${file.name || file.type || "unknown"}`);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Photo too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB)`);
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "photo";
  const name = `${base}-${Date.now()}-${Math.floor(Math.random() * 1e6)}.${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);
  return `${UPLOAD_PUBLIC}/${name}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueHandle(all: Product[], base: string): string {
  let handle = base;
  let n = 2;
  const taken = new Set(all.map((p) => p.handle));
  while (taken.has(handle)) handle = `${base}-${n++}`;
  return handle;
}

function nextId(all: Product[], coll: CollectionHandle): string {
  const pfx = ID_PREFIX[coll];
  const nums = all
    .filter((p) => p.id.startsWith(`TAY-${pfx}-`))
    .map((p) => parseInt(p.id.split("-").pop() ?? "", 10) || 0);
  const n = (nums.length ? Math.max(...nums) : 0) + 1;
  return `TAY-${pfx}-${String(n).padStart(3, "0")}`;
}

function nextHomeOrder(all: Product[]): number {
  const orders = all.map((p) => p.homeOrder ?? 0);
  return (orders.length ? Math.max(...orders) : 0) + 1;
}

function extFromName(name: string): string | null {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : null;
}

function extFromType(type: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return map[type] ?? null;
}
