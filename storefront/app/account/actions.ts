"use server";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import {
  createCustomer,
  authenticate,
  setVerificationCode,
  confirmVerification,
  getPublicCustomerById,
} from "@/lib/customer-store";
import {
  startCustomerSession,
  endCustomerSession,
  getCurrentCustomerId,
  isCustomerAuthConfigured,
} from "@/lib/customer-auth";
import { sendEmail, generateCode, emailConfigured } from "@/lib/email";
import {
  loginBlockedSeconds,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/login-rate-limit";

export type AccountFormState = { error?: string; ok?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const DEV_CODE_COOKIE = "tay_devcode";

async function clientKey(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `cust:${ip}`;
}

// Generate a verification code, store its hash, and email it. In a prototype with
// no email service connected (and not in production), stash the code in a
// short-lived cookie so the verify page can show it for testing.
async function issueCode(id: string, email: string): Promise<void> {
  const code = generateCode();
  await setVerificationCode(id, code);
  const { sent } = await sendEmail({
    to: email,
    subject: "Your Taygerian verification code",
    text: `Welcome to Taygerian.\n\nYour verification code is ${code}.\nIt expires in 30 minutes.\n\nIf you didn't create an account, you can ignore this email.`,
  });
  const store = await cookies();
  if (!sent && !emailConfigured() && process.env.NODE_ENV !== "production") {
    store.set(DEV_CODE_COOKIE, code, { httpOnly: true, path: "/account", maxAge: 1800 });
  } else {
    store.set(DEV_CODE_COOKIE, "", { httpOnly: true, path: "/account", maxAge: 0 });
  }
}

export async function registerAction(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  if (!isCustomerAuthConfigured()) {
    return { error: "Accounts aren't enabled yet — a session secret needs to be set." };
  }
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!name) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (password.length < MIN_PASSWORD)
    return { error: `Please choose a password of at least ${MIN_PASSWORD} characters.` };
  if (password !== confirm) return { error: "The passwords don't match." };

  const res = await createCustomer({ name, email, password });
  if (!res.ok || !res.customer) return { error: res.error || "Could not create your account." };

  await startCustomerSession(res.customer.id);
  await issueCode(res.customer.id, res.customer.email);
  redirect("/account/verify");
}

export async function loginAction(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const key = await clientKey();
  const blocked = loginBlockedSeconds(key);
  if (blocked > 0) {
    const mins = Math.ceil(blocked / 60);
    return { error: `Too many attempts. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const id = await authenticate(email, password);
  if (!id) {
    recordLoginFailure(key);
    return { error: "Incorrect email or password." };
  }
  recordLoginSuccess(key);
  await startCustomerSession(id);
  redirect("/account");
}

export async function verifyAction(
  _prev: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const id = await getCurrentCustomerId();
  if (!id) redirect("/account/login");
  const code = String(formData.get("code") || "").trim();
  if (!/^\d{4,8}$/.test(code)) return { error: "Please enter the code from your email." };

  const res = await confirmVerification(id, code);
  if (!res.ok) return { error: res.error || "That code isn't right." };

  const store = await cookies();
  store.set(DEV_CODE_COOKIE, "", { httpOnly: true, path: "/account", maxAge: 0 });
  redirect("/account");
}

export async function resendCodeAction(): Promise<void> {
  const id = await getCurrentCustomerId();
  if (!id) redirect("/account/login");
  const customer = await getPublicCustomerById(id);
  if (customer) await issueCode(id, customer.email);
  redirect("/account/verify");
}

export async function logoutAction(): Promise<void> {
  await endCustomerSession();
  redirect("/");
}
