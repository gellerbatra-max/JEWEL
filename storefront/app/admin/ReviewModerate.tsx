"use client";

import { useState, useTransition } from "react";
import { approveReviewAction, deleteReviewAction } from "@/app/admin/actions";

export function ReviewModerate({ id, approved }: { id: string; approved: boolean }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-4 text-[11px] tracking-[0.1em] uppercase">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => approveReviewAction(id, !approved))}
        className={`transition-colors disabled:opacity-50 ${
          approved ? "text-stone hover:text-ink" : "text-gold hover:underline"
        }`}
      >
        {approved ? "Hide" : "Approve"}
      </button>
      {confirming ? (
        <span className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => deleteReviewAction(id))}
            className="text-risk hover:underline disabled:opacity-50"
          >
            Confirm
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="text-stone hover:text-ink">
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-stone transition-colors hover:text-risk"
        >
          Delete
        </button>
      )}
    </div>
  );
}
