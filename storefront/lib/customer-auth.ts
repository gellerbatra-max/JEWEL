// Customer session auth. A signed, HTTP-only cookie (HMAC-SHA256 over the
// customer id + expiry) — the same tamper-proof pattern as the admin session,
// but a separate cookie and (optionally) a separate secret. No password or
// personal data is stored in the cookie.

import { cookies } from "next/headers";
import crypto from "node:crypto";
import { getPublicCustomerById } from "./customer-store";
import type { PublicCustomer } from "./customer";

const COOKIE = "tay_customer";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MIN_SECRET_LEN = 16;

function secret(): string {
  return process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "";
}
function secretOk(): boolean {
  return secret().length >= MIN_SECRET_LEN;
}
function sign(data: string): string {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

function makeToken(id: string): string {
  const payload = `${id}.${Date.now() + MAX_AGE * 1000}`;
  return `${payload}.${sign(payload)}`;
}

function customerIdFromToken(token: string | undefined): string | null {
  if (!secretOk() || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  const payload = `${id}.${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const expNum = Number(exp);
  if (!Number.isFinite(expNum) || expNum <= Date.now()) return null;
  return id || null;
}

export function isCustomerAuthConfigured(): boolean {
  return secretOk();
}

export async function startCustomerSession(id: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, makeToken(id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export async function endCustomerSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getCurrentCustomerId(): Promise<string | null> {
  const store = await cookies();
  return customerIdFromToken(store.get(COOKIE)?.value);
}

export async function getCurrentCustomer(): Promise<PublicCustomer | null> {
  const id = await getCurrentCustomerId();
  if (!id) return null;
  return getPublicCustomerById(id);
}
