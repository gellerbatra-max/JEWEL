// Server-only store for customer enquiries (Drop a Hint / Book an Appointment /
// Customise / general). Every enquiry lands here in a self-owned JSON file and
// shows in the dashboard inbox, so a lead can never be silently lost even if an
// external email service is down. Same atomic-write + cache pattern as elsewhere.
//
// NOTE: imports `fs` — never import from a client component. Client-safe types
// live in ./enquiry.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Enquiry, EnquiryType } from "./enquiry";

const DATA_FILE = path.join(process.cwd(), "data", "enquiries.json");
const MAX_STORED = 2000; // keep the newest N; a safety cap, not a normal limit

export type EnquiryInput = {
  type: EnquiryType;
  productTitle?: string;
  productHandle?: string;
  productSku?: string;
  productUrl?: string;
  name?: string;
  contact?: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  landingPath?: string;
};

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: Enquiry[] | null = null;

async function read(): Promise<Enquiry[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as Enquiry[]) : [];
  return cache;
}

async function write(list: Enquiry[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

const clip = (v: unknown, n = 600) => (v == null ? "" : String(v).slice(0, n));

export async function addEnquiry(input: EnquiryInput): Promise<Enquiry> {
  return withWriteLock(async () => {
    const all = await read();
    const enquiry: Enquiry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: input.type,
      productTitle: clip(input.productTitle, 200),
      productHandle: clip(input.productHandle, 200),
      productSku: clip(input.productSku, 80),
      productUrl: clip(input.productUrl, 400),
      name: clip(input.name, 160),
      contact: clip(input.contact, 200),
      recipientName: clip(input.recipientName, 160),
      recipientEmail: clip(input.recipientEmail, 200),
      message: clip(input.message, 2000),
      source: clip(input.source, 120) || "direct",
      medium: clip(input.medium, 120) || "direct",
      campaign: clip(input.campaign, 200),
      referrer: clip(input.referrer, 400),
      landingPath: clip(input.landingPath, 400),
      createdAt: new Date().toISOString(),
      read: false,
    };
    const next = [enquiry, ...all].slice(0, MAX_STORED);
    await write(next);
    return enquiry;
  });
}

export async function getEnquiries(): Promise<Enquiry[]> {
  return [...(await read())].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getUnreadCount(): Promise<number> {
  return (await read()).filter((e) => !e.read).length;
}

export async function setEnquiryRead(id: string, isRead: boolean): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    const idx = all.findIndex((e) => e.id === id);
    if (idx === -1) return;
    const next = [...all];
    next[idx] = { ...all[idx], read: isRead };
    await write(next);
  });
}

export async function deleteEnquiry(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((e) => e.id !== id));
  });
}
