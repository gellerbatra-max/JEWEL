import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed, isAdminConfigured } from "@/lib/admin-auth";
import { LoginForm } from "@/app/admin/LoginForm";

export const metadata: Metadata = { title: { absolute: "Manage · Taygerian" } };

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-porcelain px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[13px] tracking-[0.28em] uppercase text-gold">Taygerian</p>
          <h1 className="mt-1 font-display text-2xl text-ink">Manage</h1>
          <p className="mt-2 text-sm text-stone">Private area — for the shop owner.</p>
        </div>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="border border-line bg-white px-5 py-4 text-sm text-stone">
            <p className="mb-2 font-medium text-ink">Not set up yet</p>
            <p>
              Add <code className="text-ink">ADMIN_PASSWORD</code> and{" "}
              <code className="text-ink">ADMIN_SESSION_SECRET</code> to{" "}
              <code className="text-ink">.env.local</code>, then restart the site. See the setup guide
              (<code className="text-ink">MANAGE-GUIDE.md</code>).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
