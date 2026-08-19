"use client";

import { useActionState, useState } from "react";
import {
  loginAction,
  registerAction,
  whatsappSignupAction,
  type AccountFormState,
} from "@/app/account/actions";

const field =
  "w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold";
const label = "mb-1.5 block text-[11px] tracking-[0.12em] uppercase text-stone";

export function AccountAuth() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 flex border border-line">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 py-3 text-[11px] tracking-[0.14em] uppercase transition-colors ${
            mode === "login" ? "bg-ink text-porcelain" : "text-stone hover:text-ink"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 py-3 text-[11px] tracking-[0.14em] uppercase transition-colors ${
            mode === "register" ? "bg-ink text-porcelain" : "text-stone hover:text-ink"
          }`}
        >
          Create account
        </button>
      </div>

      {mode === "login" ? <LoginForm /> : <RegisterForm />}

      {/* Quick, one-step WhatsApp signup */}
      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] tracking-[0.14em] uppercase text-stone">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <WhatsappSignup />

      <p className="mt-6 text-center text-[13px] leading-relaxed text-stone">
        An account lets you keep your favourites and see your enquiries in one place. We never share
        your details.
      </p>
    </div>
  );
}

function WhatsappSignup() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(
    whatsappSignupAction,
    {}
  );
  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className={field} />
        <input
          name="phone"
          required
          inputMode="tel"
          placeholder="WhatsApp no. (+94…)"
          className={field}
        />
      </div>
      {state.error && <p className="text-[13px] text-risk">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 border border-ink py-3 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.2.2-.4.4-.2.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.3.1.7-.1 1.3z" />
        </svg>
        {pending ? "Continuing…" : "Continue with WhatsApp"}
      </button>
      <p className="text-center text-[11px] text-stone">One step — no password needed.</p>
    </form>
  );
}

function LoginForm() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={label} htmlFor="li-email">
          Email
        </label>
        <input id="li-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="li-pw">
          Password
        </label>
        <input
          id="li-pw"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </div>
      {state.error && <p className="text-[13px] text-risk">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const [state, action, pending] = useActionState<AccountFormState, FormData>(registerAction, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className={label} htmlFor="re-name">
          Name
        </label>
        <input id="re-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="re-email">
          Email
        </label>
        <input id="re-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label className={label} htmlFor="re-pw">
          Password
        </label>
        <input
          id="re-pw"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={field}
        />
        <p className="mt-1 text-[11px] text-stone">At least 8 characters.</p>
      </div>
      <div>
        <label className={label} htmlFor="re-confirm">
          Confirm password
        </label>
        <input
          id="re-confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className={field}
        />
      </div>
      {state.error && <p className="text-[13px] text-risk">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
