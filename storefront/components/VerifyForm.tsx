"use client";

import { useActionState } from "react";
import { verifyAction, resendCodeAction, type AccountFormState } from "@/app/account/actions";

export function VerifyForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(verifyAction, {});

  return (
    <div className="mx-auto max-w-sm">
      <p className="text-center text-[14.5px] leading-relaxed text-stone">
        We&apos;ve sent a verification code to <span className="text-ink">{email}</span>. Enter it
        below to confirm your account.
      </p>

      <form action={action} className="mt-6 space-y-4">
        <input
          name="code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          required
          placeholder="6-digit code"
          className="w-full border border-line bg-white px-4 py-3 text-center text-lg tracking-[0.4em] text-ink outline-none transition-colors focus:border-gold"
        />
        {state.error && <p className="text-center text-[13px] text-risk">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-ink py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <form action={resendCodeAction} className="mt-4 text-center">
        <button
          type="submit"
          className="text-[12px] tracking-[0.1em] uppercase text-stone transition-colors hover:text-ink"
        >
          Resend code
        </button>
      </form>
    </div>
  );
}
