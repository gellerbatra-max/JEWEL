"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, type AccountFormState } from "@/app/account/actions";

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

      <p className="mt-6 text-center text-[13px] leading-relaxed text-stone">
        Creating an account lets you keep your favourites and see your enquiries in one place. We
        never share your details.
      </p>
    </div>
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
