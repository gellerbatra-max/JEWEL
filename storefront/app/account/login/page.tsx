import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageIntro } from "@/components/PageIntro";
import { AccountAuth } from "@/components/AccountAuth";
import { getCurrentCustomerId } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

export default async function AccountLoginPage() {
  if (await getCurrentCustomerId()) redirect("/account");

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Account" title="Sign in or Register">
        Your Taygerian account keeps your saved pieces and enquiries together.
      </PageIntro>
      <AccountAuth />
    </div>
  );
}
