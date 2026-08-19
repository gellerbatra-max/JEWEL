"use client";

import { useActionState } from "react";
import { savePressAction, type FormState } from "./actions";

// Owner-managed "As featured in" list — one publication per line. The strip on
// the home page only appears when this has entries, so there's never any fake
// press showing.
export function PressManager({ initial }: { initial: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePressAction, {});

  return (
    <form action={action} className="max-w-lg space-y-3">
      <textarea
        name="press"
        rows={5}
        defaultValue={initial.join("\n")}
        placeholder={"One publication per line, e.g.\nVogue\nHarper's Bazaar\nHi! Magazine"}
        className="w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold"
      />
      <p className="text-[13px] text-stone">
        One name per line. The &ldquo;As featured in&rdquo; strip shows on the home page only when
        this has entries — leave it empty to hide it.
      </p>
      {state.saved && <p className="text-sm text-gold">Saved.</p>}
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-6 py-2.5 text-[12px] uppercase tracking-[0.14em] text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save press"}
      </button>
    </form>
  );
}
