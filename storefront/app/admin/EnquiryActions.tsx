"use client";

import { useState, useTransition } from "react";
import { markEnquiryReadAction, deleteEnquiryAction } from "@/app/admin/actions";

export function EnquiryActions({ id, read }: { id: string; read: boolean }) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-4 text-[11px] tracking-[0.1em] uppercase">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => markEnquiryReadAction(id, !read))}
        className="text-stone transition-colors hover:text-ink disabled:opacity-50"
      >
        {read ? "Mark unread" : "Mark read"}
      </button>
      {confirming ? (
        <span className="flex items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => deleteEnquiryAction(id))}
            className="text-risk hover:underline disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-stone hover:text-ink"
          >
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
