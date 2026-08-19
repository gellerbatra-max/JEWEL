// Server-only store for customer accounts. File-backed JSON (data/customers.json),
// self-owned. Passwords are never stored in plain text — each is hashed with
// scrypt and a per-user random salt (Node's crypto, no external dependency).
//
// NOTE: imports `fs` + `crypto` — never import from a client component. Client-
// safe types live in ./customer.ts.

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { WishItem } from "./wishlist";
import type { PublicCustomer } from "./customer";

const DATA_FILE = path.join(process.cwd(), "data", "customers.json");

type Customer = {
  id: string;
  name: string;
  email: string; // lowercased, unique (email accounts); "" for WhatsApp accounts
  phone?: string; // digits only (WhatsApp accounts)
  via?: "email" | "whatsapp";
  passwordHash: string; // "salt:hashHex"; "" for WhatsApp accounts
  saved: WishItem[];
  createdAt: string;
  emailVerified?: boolean;
  verifyHash?: string; // sha256 of the current verification code
  verifyExpires?: number; // epoch ms
  verifyAttempts?: number;
};

function sha256(s: string): string {
  return crypto.createHash("sha256").update(s).digest("hex");
}

// --- password hashing (scrypt) ---------------------------------------------

function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function passwordMatches(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(pw, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

// --- file access ------------------------------------------------------------

let writeChain: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn);
  writeChain = next.catch(() => {});
  return next as Promise<T>;
}

let cache: Customer[] | null = null;

async function read(): Promise<Customer[]> {
  if (cache) return cache;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  } catch {
    parsed = null;
  }
  cache = Array.isArray(parsed) ? (parsed as Customer[]) : [];
  return cache;
}

async function write(list: Customer[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(list, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
  cache = list;
}

// --- public API -------------------------------------------------------------

const publicView = (c: Customer): PublicCustomer => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone ?? "",
  via: c.via ?? "email",
  createdAt: c.createdAt,
  savedCount: c.saved?.length ?? 0,
  emailVerified: !!c.emailVerified,
});

export async function createCustomer(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; customer?: PublicCustomer }> {
  const email = input.email.trim().toLowerCase();
  return withWriteLock(async () => {
    const all = await read();
    if (all.some((c) => c.email === email)) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const customer: Customer = {
      id: `c_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      name: input.name.trim().slice(0, 120),
      email,
      passwordHash: hashPassword(input.password),
      saved: [],
      createdAt: new Date().toISOString(),
    };
    await write([...all, customer]);
    return { ok: true, customer: publicView(customer) };
  });
}

// Low-friction WhatsApp signup: identified by phone number, no password. If an
// account already exists for that number we return it (so returning visitors
// don't create duplicates). NOTE: without an OTP this trusts the entered number,
// which is a deliberate low-friction trade-off — add WhatsApp/SMS OTP for
// stronger identity when a verification provider is connected.
export async function createOrGetWhatsappCustomer(input: {
  name: string;
  phone: string;
}): Promise<{ id: string; created: boolean }> {
  const phone = input.phone.replace(/[^\d]/g, "");
  return withWriteLock(async () => {
    const all = await read();
    const existing = all.find((c) => c.via === "whatsapp" && (c.phone ?? "") === phone);
    if (existing) return { id: existing.id, created: false };
    const customer: Customer = {
      id: `c_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      name: input.name.trim().slice(0, 120),
      email: "",
      phone,
      via: "whatsapp",
      passwordHash: "",
      saved: [],
      createdAt: new Date().toISOString(),
      emailVerified: false,
    };
    await write([...all, customer]);
    return { id: customer.id, created: true };
  });
}

// Returns the customer id on success, or null.
export async function authenticate(email: string, password: string): Promise<string | null> {
  const all = await read();
  const c = all.find((x) => x.email === email.trim().toLowerCase());
  if (!c) return null;
  return passwordMatches(password, c.passwordHash) ? c.id : null;
}

export async function getPublicCustomerById(id: string): Promise<PublicCustomer | null> {
  const c = (await read()).find((x) => x.id === id);
  return c ? publicView(c) : null;
}

export async function getSaved(id: string): Promise<WishItem[]> {
  const c = (await read()).find((x) => x.id === id);
  return c?.saved ?? [];
}

export async function setSaved(id: string, items: WishItem[]): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    const idx = all.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const next = [...all];
    next[idx] = { ...all[idx], saved: items.slice(0, 200) };
    await write(next);
  });
}

// --- email verification -----------------------------------------------------

const CODE_TTL = 30 * 60 * 1000; // 30 minutes

export async function setVerificationCode(id: string, code: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    const idx = all.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const next = [...all];
    next[idx] = {
      ...all[idx],
      emailVerified: false,
      verifyHash: sha256(code),
      verifyExpires: Date.now() + CODE_TTL,
      verifyAttempts: 0,
    };
    await write(next);
  });
}

export async function confirmVerification(
  id: string,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  return withWriteLock(async () => {
    const all = await read();
    const idx = all.findIndex((x) => x.id === id);
    if (idx === -1) return { ok: false, error: "Account not found." };
    const c = all[idx];
    if (c.emailVerified) return { ok: true };
    if (!c.verifyHash || !c.verifyExpires)
      return { ok: false, error: "No code on file — please request a new one." };
    if (Date.now() > c.verifyExpires)
      return { ok: false, error: "That code has expired — please request a new one." };
    if ((c.verifyAttempts ?? 0) >= 6)
      return { ok: false, error: "Too many attempts — please request a new code." };
    if (sha256(code.trim()) !== c.verifyHash) {
      const next = [...all];
      next[idx] = { ...c, verifyAttempts: (c.verifyAttempts ?? 0) + 1 };
      await write(next);
      return { ok: false, error: "That code isn't right — please try again." };
    }
    const next = [...all];
    next[idx] = {
      ...c,
      emailVerified: true,
      verifyHash: undefined,
      verifyExpires: undefined,
      verifyAttempts: 0,
    };
    await write(next);
    return { ok: true };
  });
}

export async function isEmailVerified(id: string): Promise<boolean> {
  const c = (await read()).find((x) => x.id === id);
  return !!c?.emailVerified;
}

export async function getAllCustomers(): Promise<PublicCustomer[]> {
  return (await read())
    .map(publicView)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function deleteCustomer(id: string): Promise<void> {
  return withWriteLock(async () => {
    const all = await read();
    await write(all.filter((c) => c.id !== id));
  });
}
