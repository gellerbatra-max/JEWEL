import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PageIntro } from "@/components/PageIntro";
import { VerifyForm } from "@/components/VerifyForm";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { emailConfigured } from "@/lib/email";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: true },
};

export default async function VerifyPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");
  if (customer.emailVerified) redirect("/account");

  const configured = emailConfigured();
  const devCode = configured ? undefined : (await cookies()).get("tay_devcode")?.value;

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Account" title="Verify your email" />
      <VerifyForm email={customer.email} />

      {!configured && (
        <div className="mx-auto mt-8 max-w-sm border border-line bg-cloud/50 p-4 text-center text-[12.5px] leading-relaxed text-stone">
          <p>
            <strong className="text-ink">Prototype note:</strong> email delivery isn&apos;t connected
            yet, so no message was sent. Connect an email service (e.g. Resend) to send real codes.
          </p>
          {devCode && (
            <p className="mt-2">
              For testing, your code is{" "}
              <span className="font-display text-base tracking-[0.2em] text-ink">{devCode}</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
