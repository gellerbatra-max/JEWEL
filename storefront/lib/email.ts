// Minimal, dependency-free email sender. Uses Resend's HTTP API when configured
// (free tier available); otherwise reports "not sent" so callers can fall back.
//
// Env to enable real delivery:
//   RESEND_API_KEY — your Resend API key
//   EMAIL_FROM     — a verified from-address, e.g. "Taygerian <hello@taygerian.com>"

export function emailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function generateCode(): string {
  // 6-digit numeric code.
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { sent: false };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}
