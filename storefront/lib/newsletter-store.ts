// Server-only store for newsletter subscribers. File-backed JSON, fully
// self-owned — you keep your list, exportable to CSV from the dashboard, never
// locked inside a third-party tool. Same atomic-write + cache pattern as the
// catalog store.
//
// NOTE: imports `fs` — never import from a client component.

import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

export type Subscriber = {
  email: string;
  // where this signup came from (first-touch attribution, best-effort)
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
  landingPath: string;
  createdAt: string; // ISO
};

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: Subscriber[] | null = null;

async function read(): Promise<Subscriber[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as Subscriber[]) : [];
  return cache;
}

async function write(list: Subscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

export type SubscriberInput = {
  email: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  landingPath?: string;
};

export async function addSubscriber(
  input: SubscriberInput
): Promise<{ ok: boolean; already?: boolean }> {
  const email = input.email.trim().toLowerCase();
  return withWriteLock(async () => {
    const all = await read();
    if (all.some((s) => s.email === email)) return { ok: true, already: true };
    const sub: Subscriber = {
      email,
      source: input.source || "direct",
      medium: input.medium || "direct",
      campaign: input.campaign || "",
      referrer: input.referrer || "",
      landingPath: input.landingPath || "",
      createdAt: new Date().toISOString(),
    };
    await write([...all, sub]);
    return { ok: true };
  });
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return [...(await read())].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function removeSubscriber(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((s) => s.email !== e));
  });
}
