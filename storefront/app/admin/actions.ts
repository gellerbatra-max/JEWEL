"use server";

// Server Actions for the Manage dashboard. Every mutating action re-checks the
// session here — Server Actions are reachable via direct POST, not only through
// our UI — then writes through the catalog store and revalidates the live site.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthed, verifyPassword, startSession, endSession } from "@/lib/admin-auth";
import {
  upsertProduct,
  deleteProduct,
  setShowOnHome,
  saveUploadedImage,
  type ProductInput,
} from "@/lib/catalog-store";
import { setCategoryCover } from "@/lib/site-config-store";
import type { CollectionHandle, Certification } from "@/lib/products";
import { SECTION_DEFS, type ProductSections } from "@/lib/product-sections";

export type FormState = { error?: string };

const COLLECTIONS: CollectionHandle[] = [
  "rings", "necklaces", "pendants", "earrings", "bracelets", "bangles",
];
const LABS = ["GIA", "GRS", "AGL"] as const;

async function assertAuthed(): Promise<void> {
  if (!(await isAuthed())) throw new Error("Not authorised");
}

// --- Auth ------------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    return { error: "Incorrect password. Please try again." };
  }
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
  const currency = (String(formData.get("currency") || "USD").trim() || "USD").toUpperCase();
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
  for (const f of files) uploaded.push(await saveUploadedImage(f));
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
    await deleteProduct(id);
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
