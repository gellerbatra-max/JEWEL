"use client";

import { useActionState, useEffect, useState } from "react";
import { subscribeAction, type PublicFormState } from "@/app/site-actions";
import { getAttribution, track } from "@/lib/analytics";

// Footer newsletter signup. Captures the email into the self-owned subscriber
// store, tagged with first-touch attribution (which channel referred them).
export function NewsletterForm() {
  const [state, action, pending] = useActionState<PublicFormState, FormData>(
    subscribeAction,
    {}
  );
  const [attr, setAttr] = useState({
    source: "",
    medium: "",
    campaign: "",
    referrer: "",
    landing: "",
  });

  useEffect(() => {
    const a = getAttribution();
    setAttr({
      source: a.source,
      medium: a.medium,
      campaign: a.campaign,
      referrer: a.referrer,
      landing: a.landingPath,
    });
  }, []);

  useEffect(() => {
    if (state.ok) track("newsletter_signup");
  }, [state.ok]);

  if (state.ok) {
    return (
      <p className="text-[13.5px] leading-relaxed text-stone">
        {state.already ? "You're already on the list — thank you." : "Thank you — you're on the list."}
      </p>
    );
  }

  return (
    <form action={action} noValidate>
      <div className="flex max-w-sm items-stretch border border-line bg-white/60 focus-within:border-gold">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          maxLength={120}
          placeholder="Your email"
          className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone/60"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 bg-ink px-5 text-[11px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold disabled:opacity-60"
        >
          {pending ? "…" : "Join"}
        </button>
      </div>
      <input type="hidden" name="attr_source" value={attr.source} />
      <input type="hidden" name="attr_medium" value={attr.medium} />
      <input type="hidden" name="attr_campaign" value={attr.campaign} />
      <input type="hidden" name="attr_referrer" value={attr.referrer} />
      <input type="hidden" name="attr_landing" value={attr.landing} />
      {state.error && <p className="mt-2 text-[12px] text-risk">{state.error}</p>}
    </form>
  );
}
