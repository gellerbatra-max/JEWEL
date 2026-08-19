// Admin session auth for the /admin Manage area.
//
// Single-owner model: no user accounts or database. Access is gated by one
// password (ADMIN_PASSWORD) set in the environment. On successful login we set a
// signed, HTTP-only session cookie (HMAC-SHA256 over an expiry, keyed by
// ADMIN_SESSION_SECRET) so the password is never stored in the cookie and the
// cookie can't be forged or tampered with.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE = "tay_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

// Minimum session-secret length. A short/empty secret makes the HMAC key
// guessable, which would let anyone forge a session cookie — so we treat it as
// "not configured" everywhere.
const MIN_SECRET_LEN = 16;

function secretOk(): boolean {
  return (process.env.ADMIN_SESSION_SECRET || "").length >= MIN_SECRET_LEN;
}

function sign(data: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

// True only when the password AND a sufficiently long session secret are set.
// Used to show a helpful "not set up yet" message instead of a forgeable login.
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && secretOk();
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  // Length check first — timingSafeEqual throws on length mismatch.
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function makeToken(): string {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

function tokenValid(token: string | undefined): boolean {
  // No usable secret → no session can be trusted (blocks empty-key forgery).
  if (!secretOk()) return false;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return tokenValid(store.get(COOKIE)?.value);
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

// For use at the top of a protected Server Component / layout.
export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
