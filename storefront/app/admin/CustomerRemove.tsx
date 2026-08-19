"use client";

import { useState, useTransition } from "react";
import { deleteCustomerAction } from "@/app/admin/actions";

export function CustomerRemove({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => deleteCustomerAction(id))}
          className="text-risk hover:underline disabled:opacity-50"
        >
          Confirm
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-stone hover:text-ink">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-[11px] tracking-[0.1em] uppercase text-stone transition-colors hover:text-risk"
    >
      Remove
    </button>
  );
}
