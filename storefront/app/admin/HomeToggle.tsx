"use client";

import { useState, useTransition } from "react";
import { MAX_SIGNATURE } from "@/lib/products";
import { toggleHomeAction } from "./actions";

// A checkbox that flips a piece's "Show on home page" state. Enforces the
// MAX_SIGNATURE cap: when the home page is already full, turning more on is
// blocked (and the server re-checks too).
export function HomeToggle({
  id,
  initial,
  atLimit,
}: {
  id: string;
  initial: boolean;
  atLimit: boolean;
}) {
  const [on, setOn] = useState(initial);
  const [pending, start] = useTransition();

  const locked = !on && atLimit; // full and this one is off → can't add more

  return (
    <label
      className={`inline-flex items-center gap-2 ${locked ? "cursor-not-allowed" : "cursor-pointer"}`}
      title={
        locked
          ? `Home page is full (${MAX_SIGNATURE} max). Untick one first.`
          : "Feature in Signature Pieces on the home page"
      }
    >
      <input
        type="checkbox"
        checked={on}
        disabled={pending || locked}
        onChange={(e) => {
          const next = e.target.checked;
          setOn(next);
          start(async () => {
            const res = await toggleHomeAction(id, next);
            if (next && res?.atLimit) {
              setOn(false);
              alert(`You can feature up to ${MAX_SIGNATURE} pieces on the home page. Untick one first.`);
            }
          });
        }}
        className="h-4 w-4 accent-[var(--gold)]"
      />
      <span className={`text-[11px] tracking-[0.1em] uppercase ${on ? "text-gold" : "text-stone"}`}>
        {on ? "On home" : "Show on home"}
      </span>
    </label>
  );
}
