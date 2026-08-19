// Simple in-memory login rate limiter, keyed by client IP. Blocks brute-forcing
// the single admin password. Single-process (fine for a single-instance deploy);
// a multi-instance deploy would want a shared store (Redis, etc.).

const MAX_ATTEMPTS = 5; // failures allowed within the window before lockout
const WINDOW_MS = 15 * 60 * 1000; // failures are counted within this rolling window
const LOCK_MS = 15 * 60 * 1000; // lockout duration once the limit is hit

type Attempt = { count: number; first: number; lockedUntil: number };
const attempts = new Map<string, Attempt>();

// Keep the map from growing unbounded under a distributed attack.
function prune(now: number): void {
  if (attempts.size < 500) return;
  for (const [ip, a] of attempts) {
    if (a.lockedUntil < now && now - a.first > WINDOW_MS) attempts.delete(ip);
  }
}

// Seconds remaining on a lockout for this IP, or 0 if not blocked.
export function loginBlockedSeconds(ip: string): number {
  const a = attempts.get(ip);
  if (!a) return 0;
  const now = Date.now();
  return a.lockedUntil > now ? Math.ceil((a.lockedUntil - now) / 1000) : 0;
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  prune(now);
  const a = attempts.get(ip);
  if (!a || now - a.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now, lockedUntil: 0 });
    return;
  }
  a.count += 1;
  if (a.count >= MAX_ATTEMPTS) a.lockedUntil = now + LOCK_MS;
}

export function recordLoginSuccess(ip: string): void {
  attempts.delete(ip);
}
