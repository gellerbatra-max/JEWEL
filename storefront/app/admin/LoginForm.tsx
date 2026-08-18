"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="password" className="block text-[12px] tracking-[0.14em] uppercase text-stone mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="w-full border border-line bg-white px-4 py-3 text-ink outline-none focus:border-gold"
          placeholder="Enter your Manage password"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-6 py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
