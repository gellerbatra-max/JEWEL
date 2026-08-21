"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { PhoneField } from "./PhoneField";

const field =
  "w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold";

// Leave-a-review form. Works for a specific piece (productHandle set) or the
// service as a whole (both empty). Guest-friendly; reviews are held for the
// owner's approval before appearing.
export function ReviewForm({
  productHandle = "",
  productTitle = "",
}: {
  productHandle?: string;
  productTitle?: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => String(fd.get(k) || "").trim();
    if (!g("name")) {
      setError("Please add your name.");
      return;
    }
    if (g("whatsapp").length < 6) {
      setError("Please add your WhatsApp number.");
      return;
    }
    if (g("body").length < 3) {
      setError("Please write a few words.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          rating,
          product_handle: productHandle,
          product_title: productTitle,
          name: g("name"),
          title: g("title"),
          body: g("body"),
          whatsapp: `${g("whatsapp_code")} ${g("whatsapp")}`.trim(),
          bill_number: g("bill_number"),
          email: g("email"),
        }),
      });
      if (res.ok) {
        setSent(true);
        track("review_submitted", { piece: productTitle || "service" });
      } else {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setError(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="border border-line bg-cloud/50 p-6 text-center">
        <p className="font-display text-lg text-ink">Thank you</p>
        <p className="mt-1 text-[14px] text-stone">
          Your review has been received and will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-[11px] tracking-[0.12em] uppercase text-stone">Your rating</span>
        <span className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              aria-label={`${i} star${i === 1 ? "" : "s"}`}
              className="p-0.5 text-gold"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={i <= (hover || rating) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.7l5.9-.9z" />
              </svg>
            </button>
          ))}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" maxLength={80} placeholder="Your name" className={field} />
        <input name="email" type="email" maxLength={120} placeholder="Email (optional)" className={field} />
      </div>
      <PhoneField
        label="WhatsApp number *"
        numberName="whatsapp"
        codeName="whatsapp_code"
        placeholder="Your WhatsApp number"
      />
      <input name="bill_number" maxLength={60} placeholder="Bill / invoice number (optional)" className={field} />
      <input name="title" maxLength={120} placeholder="Headline (optional)" className={field} />
      <textarea
        name="body"
        rows={4}
        maxLength={2000}
        required
        placeholder={
          productTitle
            ? `What did you think of the ${productTitle}?`
            : "Tell us about your experience with Taygerian…"
        }
        className={`${field} resize-none`}
      />
      <p className="text-[12px] leading-relaxed text-stone">
        Your WhatsApp number, invoice number and email stay private — we use them only to verify
        your purchase. Only your name and review appear publicly.
      </p>
      {error && <p className="text-[13px] text-risk">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-7 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
