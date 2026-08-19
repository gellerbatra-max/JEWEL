"use server";

// Public (non-admin) server actions: newsletter signup and enquiry capture.
// Both write to self-owned file stores so you keep the data.

import { addSubscriber } from "@/lib/newsletter-store";
import { addEnquiry, type EnquiryInput } from "@/lib/enquiry-store";

export type PublicFormState = { ok?: boolean; error?: string; already?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(
  _prev: PublicFormState,
  formData: FormData
): Promise<PublicFormState> {
  const email = String(formData.get("email") || "").trim();
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return { error: "Please enter a valid email address." };
  }
  try {
    const res = await addSubscriber({
      email,
      source: str(formData, "attr_source"),
      medium: str(formData, "attr_medium"),
      campaign: str(formData, "attr_campaign"),
      referrer: str(formData, "attr_referrer"),
      landingPath: str(formData, "attr_landing"),
    });
    return res.already ? { ok: true, already: true } : { ok: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

// Capture an enquiry (Drop a Hint / Appointment / Customise / general) into the
// self-owned inbox. Called from the client via a fetch to /api/enquiries, which
// delegates here — kept as an action too so forms could post directly.
export async function submitEnquiry(input: EnquiryInput): Promise<{ ok: boolean }> {
  try {
    await addEnquiry(input);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || "").slice(0, 400);
}
