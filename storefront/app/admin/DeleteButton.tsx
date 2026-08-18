"use client";

import { useTransition } from "react";
import { deleteProductAction } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete “${title}”? This can't be undone.`)) {
          start(() => deleteProductAction(id));
        }
      }}
      className="text-[11px] tracking-[0.1em] uppercase text-stone transition-colors hover:text-red-600 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
