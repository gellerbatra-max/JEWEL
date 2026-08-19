"use server";

// Server Actions for the Manage dashboard. Every mutating action re-checks the
// session here — Server Actions are reachable via direct POST, not only through
// our UI — then writes through the catalog store and revalidates the live site.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAuthed, verifyPassword, startSession, endSession } from "@/lib/admin-auth";
import {
  loginBlockedSeconds,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/login-rate-limit";
import {
  upsertProduct,
  deleteProduct,
  setShowOnHome,
  saveUploadedImage,
  type ProductInput,
} from "@/lib/catalog-store";
import {
  setCategoryCover,
  setBespokeImages,
  setBridalImages,
  setInstagramImages,
  setPressItems,
  pruneCategoryCoverForProduct,
  pruneSectionImages,
  MAX_SECTION_IMAGES,
  MAX_PRESS_ITEMS,
} from "@/lib/site-config-store";
import { setEnquiryRead, deleteEnquiry } from "@/lib/enquiry-store";
import { removeSubscriber } from "@/lib/newsletter-store";
import { upsertPost, deletePost } from "@/lib/journal-store";
import { deleteCustomer } from "@/lib/customer-store";
import { setReviewApproved, deleteReview } from "@/lib/review-store";
import type { CollectionHandle, Certification } from "@/lib/products";
import { SECTION_DEFS, type ProductSections } from "@/lib/product-sections";

export type FormState = { error?: string; images?: string[]; saved?: boolean };

const COLLECTIONS: CollectionHandle[] = [
  "rings", "necklaces", "pendants", "earrings", "bracelets", "bangles",
];
const LABS = ["GIA", "GRS", "AGL"] as const;
const CURRENCIES = ["USD", "LKR", "EUR", "GBP", "AUD"];

async function assertAuthed(): Promise<void> {
  // Redirect (not throw) so an unauthenticated direct POST lands on the login
  // page instead of surfacing a raw 500.
  if (!(await isAuthed())) redirect("/admin/login");
}

// --- Auth ------------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";

  const blockedFor = loginBlockedSeconds(ip);
  if (blockedFor > 0) {
    const mins = Math.ceil(blockedFor / 60);
    return { error: `Too many attempts. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    recordLoginFailure(ip);
    return { error: "Incorrect password. Please try again." };
  }
  recordLoginSuccess(ip);
  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// --- Products --------------------------------------------------------------

export async function saveProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();

  const id = String(formData.get("id") || "").trim() || undefined;
  const title = String(formData.get("title") || "").trim();
  const collectionHandle = String(formData.get("collectionHandle") || "") as CollectionHandle;
  const metal = String(formData.get("metal") || "").trim();
  const stone = String(formData.get("stone") || "").trim();
  const colour = String(formData.get("colour") || "").trim();
  const currencyRaw = (String(formData.get("currency") || "USD").trim() || "USD").toUpperCase();
  // Allow-list: an invalid code would crash Intl.NumberFormat on every page that
  // renders this product's price, so fall back to USD.
  const currency = CURRENCIES.includes(currencyRaw) ? currencyRaw : "USD";
  const description = String(formData.get("description") || "").trim();
  const oneOfAKind = formData.get("oneOfAKind") === "on";
  const showOnHome = formData.get("showOnHome") === "on";

  if (!title) return { error: "Please enter a name for the piece." };
  if (!COLLECTIONS.includes(collectionHandle)) return { error: "Please choose a category." };

  const price = Number(String(formData.get("price") || "").replace(/[^0-9.]/g, ""));
  if (!oneOfAKind && (!Number.isFinite(price) || price <= 0)) {
    return {
      error:
        "Please enter a price — or tick “one-of-a-kind (price on request)” if it has no fixed price.",
    };
  }

  // Images: keep the existing ones (in order) and append any newly uploaded files.
  const existing = formData.getAll("existingImages").map(String).filter(Boolean);
  const files = formData
    .getAll("newImages")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  try {
    for (const f of files) uploaded.push(await saveUploadedImage(f));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "A photo couldn't be uploaded." };
  }
  const images = [...existing, ...uploaded];
  if (images.length === 0) return { error: "Please add at least one photo of the piece." };

  // Optional lab certification.
  const certLab = String(formData.get("certLab") || "").trim().toUpperCase();
  const certReport = String(formData.get("certReport") || "").trim();
  const certOrigin = String(formData.get("certOrigin") || "").trim();
  let certification: Certification | null = null;
  if ((LABS as readonly string[]).includes(certLab) && certReport) {
    certification = {
      lab: certLab as Certification["lab"],
      reportNumber: certReport,
      origin: certOrigin || "Ceylon (Sri Lanka)",
    };
  }

  // Product-page section overrides. Each textarea is pre-filled with the shared
  // house default; we only store a value when the owner has actually changed it,
  // so untouched sections stay linked to the shared template.
  const sections: ProductSections = {};
  for (const def of SECTION_DEFS) {
    // Normalise CRLF (browsers submit textarea newlines as \r\n) so unchanged
    // multi-line sections match the \n defaults and aren't stored as overrides.
    const raw = String(formData.get(`section_${def.key}`) || "").replace(/\r\n/g, "\n").trim();
    if (!raw) continue;
    const isDefault =
      raw === def.defaultText({ oneOfAKind: false }).trim() ||
      raw === def.defaultText({ oneOfAKind: true }).trim();
    if (!isDefault) sections[def.key] = raw;
  }

  const input: ProductInput = {
    id,
    title,
    collectionHandle,
    metal: metal || "—",
    stone: stone || "—",
    colour: colour || undefined,
    price: Number.isFinite(price) ? price : 0,
    currency,
    oneOfAKind,
    description,
    images,
    showOnHome,
    certification,
    sections: Object.keys(sections).length > 0 ? sections : undefined,
  };

  await upsertProduct(input);
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteProductAction(id: string): Promise<void> {
  await assertAuthed();
  if (id) {
    // Delete the piece, then clean up anything that referenced it: its uploaded
    // photos (removed from disk by deleteProduct), any category cover pointing at
    // it, and any home-section rotating photos that used those now-gone files.
    const removedUploads = await deleteProduct(id);
    await pruneCategoryCoverForProduct(id);
    await pruneSectionImages(removedUploads);
    revalidatePath("/", "layout");
  }
  redirect("/admin");
}

export async function toggleHomeAction(
  id: string,
  show: boolean
): Promise<{ ok: boolean; atLimit?: boolean }> {
  await assertAuthed();
  if (!id) return { ok: false };
  const res = await setShowOnHome(id, show);
  if (res.ok) revalidatePath("/", "layout");
  return res;
}

// --- Category cover images -------------------------------------------------

export async function setCategoryCoverAction(handle: string, productId: string): Promise<void> {
  await assertAuthed();
  if (!COLLECTIONS.includes(handle as CollectionHandle)) return;
  await setCategoryCover(handle as CollectionHandle, productId);
  revalidatePath("/", "layout");
}

// --- Home section rotating photos ------------------------------------------

// Shared parsing for a section image manager (existing paths + new uploads).
async function collectSectionImages(formData: FormData): Promise<string[]> {
  const existing = formData.getAll("existingImages").map(String).filter(Boolean);
  const files = formData
    .getAll("newImages")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: string[] = [];
  for (const f of files) uploaded.push(await saveUploadedImage(f));
  return [...existing, ...uploaded].slice(0, MAX_SECTION_IMAGES);
}

export async function saveBespokeImagesAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();
  let images: string[];
  try {
    images = await collectSectionImages(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "A photo couldn't be uploaded." };
  }
  await setBespokeImages(images);
  revalidatePath("/", "layout");
  return { images };
}

export async function saveBridalImagesAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();
  let images: string[];
  try {
    images = await collectSectionImages(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "A photo couldn't be uploaded." };
  }
  await setBridalImages(images);
  revalidatePath("/", "layout");
  return { images };
}

export async function saveInstagramImagesAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();
  let images: string[];
  try {
    images = await collectSectionImages(formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "A photo couldn't be uploaded." };
  }
  await setInstagramImages(images);
  revalidatePath("/", "layout");
  return { images };
}

// --- Press ("As featured in") ----------------------------------------------

export async function savePressAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();
  const items = String(formData.get("press") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_PRESS_ITEMS);
  await setPressItems(items);
  revalidatePath("/", "layout");
  return { saved: true };
}

// --- Enquiries inbox -------------------------------------------------------

export async function markEnquiryReadAction(id: string, read: boolean): Promise<void> {
  await assertAuthed();
  if (!id) return;
  await setEnquiryRead(id, read);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(id: string): Promise<void> {
  await assertAuthed();
  if (!id) return;
  await deleteEnquiry(id);
  revalidatePath("/admin/enquiries");
}

// --- Newsletter subscribers ------------------------------------------------

export async function removeSubscriberAction(email: string): Promise<void> {
  await assertAuthed();
  if (!email) return;
  await removeSubscriber(email);
  revalidatePath("/admin/newsletter");
}

// --- Customers -------------------------------------------------------------

export async function deleteCustomerAction(id: string): Promise<void> {
  await assertAuthed();
  if (!id) return;
  await deleteCustomer(id);
  revalidatePath("/admin/customers");
}

// --- Reviews ---------------------------------------------------------------

export async function approveReviewAction(id: string, approved: boolean): Promise<void> {
  await assertAuthed();
  if (!id) return;
  await setReviewApproved(id, approved);
  // Product pages are static; refresh so the review appears/disappears publicly.
  revalidatePath("/", "layout");
}

export async function deleteReviewAction(id: string): Promise<void> {
  await assertAuthed();
  if (!id) return;
  await deleteReview(id);
  revalidatePath("/", "layout");
}

// --- Journal ---------------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveJournalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAuthed();

  const originalSlug = String(formData.get("originalSlug") || "").trim() || undefined;
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Please enter a title." };

  const slug = slugify(String(formData.get("slug") || "").trim() || title);
  if (!slug) return { error: "Please enter a valid title or web address." };

  const excerpt = String(formData.get("excerpt") || "").replace(/\r\n/g, "\n").trim();
  const body = String(formData.get("body") || "").replace(/\r\n/g, "\n").trim();
  if (!body) return { error: "Please write the story." };

  const dateRaw = String(formData.get("date") || "").trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
    ? dateRaw
    : new Date().toISOString().slice(0, 10);
  const published = formData.get("published") === "on";

  // Cover: keep the existing one, or replace with a newly uploaded file.
  let cover = String(formData.get("existingCover") || "").trim();
  const file = formData
    .getAll("cover")
    .find((f): f is File => f instanceof File && f.size > 0);
  if (file) {
    try {
      cover = await saveUploadedImage(file);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "The cover photo couldn't be uploaded." };
    }
  }

  await upsertPost({ originalSlug, slug, title, excerpt, body, cover, date, published });
  revalidatePath("/", "layout");
  redirect("/admin/journal");
}

export async function deleteJournalAction(slug: string): Promise<void> {
  await assertAuthed();
  if (slug) {
    await deletePost(slug);
    revalidatePath("/", "layout");
  }
  redirect("/admin/journal");
}
