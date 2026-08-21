// Server-only store for customer reviews (of pieces and of the service). Reviews
// are held unapproved until the owner approves them in the dashboard, so the
// public site is never exposed to spam. File-backed, self-owned.
//
// NOTE: imports `fs` — never import from a client component. Client-safe types
// live in ./review.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Review } from "./review";

const DATA_FILE = path.join(process.cwd(), "data", "reviews.json");
const MAX_STORED = 5000;

export type ReviewInput = {
  productHandle?: string;
  productTitle?: string;
  rating: number;
  name?: string;
  title?: string;
  body?: string;
  whatsapp?: string;
  billNumber?: string;
  email?: string;
};

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: Review[] | null = null;

async function read(): Promise<Review[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as Review[]) : [];
  return cache;
}

async function write(list: Review[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

const clip = (v: unknown, n: number) => (v == null ? "" : String(v).slice(0, n));

export async function addReview(input: ReviewInput): Promise<Review> {
  const rating = Math.max(1, Math.min(5, Math.round(Number(input.rating) || 0)));
  return withWriteLock(async () => {
    const all = await read();
    const review: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productHandle: clip(input.productHandle, 200),
      productTitle: clip(input.productTitle, 200),
      rating,
      name: clip(input.name, 80) || "Anonymous",
      title: clip(input.title, 120),
      body: clip(input.body, 2000),
      whatsapp: clip(input.whatsapp, 40),
      billNumber: clip(input.billNumber, 60),
      email: clip(input.email, 120),
      createdAt: new Date().toISOString(),
      approved: false,
    };
    await write([review, ...all].slice(0, MAX_STORED));
    return review;
  });
}

const byNewest = (a: Review, b: Review) => (a.createdAt < b.createdAt ? 1 : -1);

export async function getApprovedForProduct(handle: string): Promise<Review[]> {
  return (await read()).filter((r) => r.approved && r.productHandle === handle).sort(byNewest);
}

export async function getApprovedService(): Promise<Review[]> {
  return (await read()).filter((r) => r.approved && r.productHandle === "").sort(byNewest);
}

export async function getApprovedAll(): Promise<Review[]> {
  return (await read()).filter((r) => r.approved).sort(byNewest);
}

export async function getAllReviews(): Promise<Review[]> {
  return [...(await read())].sort(byNewest);
}

export async function getPendingCount(): Promise<number> {
  return (await read()).filter((r) => !r.approved).length;
}

export async function setReviewApproved(id: string, approved: boolean): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return;
    const next = [...all];
    next[idx] = { ...all[idx], approved };
    await write(next);
  });
}

export async function deleteReview(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((r) => r.id !== id));
  });
}
