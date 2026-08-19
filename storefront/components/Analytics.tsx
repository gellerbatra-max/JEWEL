"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsent } from "./CookieConsent";

// Analytics loader. Nothing loads until the visitor accepts "all" cookies, and
// nothing at all runs unless you've set an ID in the environment:
//   NEXT_PUBLIC_GA_ID           — Google Analytics 4 (e.g. G-XXXXXXX)
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN — Plausible (privacy-friendly), your domain
// Both can run together. Custom conversion events are sent via lib/analytics.ts.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function Analytics() {
  const [allowed, setAllowed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setAllowed(getConsent() === "all");
    check();
    window.addEventListener("tay:consent", check);
    return () => window.removeEventListener("tay:consent", check);
  }, []);

  // GA4 counts a client-side route change as a new page view.
  useEffect(() => {
    if (!allowed || !GA_ID) return;
    const w = window as GtagWindow;
    if (typeof w.gtag === "function") w.gtag("event", "page_view", { page_path: pathname });
  }, [allowed, pathname]);

  if (!allowed) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.tagged-events.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
