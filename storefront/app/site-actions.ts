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
  // WhatsApp comes from the country-code PhoneField: dial code + number.
  const waNumber = String(formData.get("whatsapp") || "").trim();
  const waCode = String(formData.get("whatsapp_code") || "").trim();
  const waOk = waNumber.replace(/[^0-9]/g, "").length >= 6;
  const whatsapp = waOk ? `${waCode} ${waNumber}`.trim() : "";

  if (email && (!EMAIL_RE.test(email) || email.length > 120)) {
    return { error: "Please enter a valid email address." };
  }
  if (!email && !whatsapp) {
    return { error: "Please add your email or WhatsApp number." };
  }
  try {
    const res = await addSubscriber({
      email,
      whatsapp,
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
