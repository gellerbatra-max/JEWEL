// Client-safe analytics + attribution helpers.
//
// Two jobs:
//  1. track()  — fire a conversion event into GA4 and/or Plausible if loaded.
//  2. attribution — record where a visitor first came from (referrer + UTM /
//     ad-click tags), first-touch, so a lead that arrives from Instagram and
//     enquires days later still carries "instagram" as its source. This is
//     first-party data tied to a voluntary action (an enquiry / signup), stored
//     on your own server — not third-party tracking.

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
};

export type Attribution = {
  source: string; // utm_source, or derived from referrer ("instagram", "google", "direct")
  medium: string; // utm_medium ("social", "cpc", "organic", "referral", "direct")
  campaign: string;
  term: string;
  content: string;
  referrer: string;
  landingPath: string;
  firstSeen: string; // ISO
};

const ATTR_KEY = "tay_attr_v1";

// Fire a named conversion event to whichever analytics tools are loaded.
export function track(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  try {
    if (typeof w.gtag === "function") w.gtag("event", name, params ?? {});
    if (typeof w.plausible === "function") w.plausible(name, { props: params });
  } catch {
    /* never let analytics break the page */
  }
}

function deriveFromReferrer(ref: string): { source: string; medium: string } {
  if (!ref) return { source: "direct", medium: "direct" };
  let host = "";
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return { source: "referral", medium: "referral" };
  }
  if (typeof window !== "undefined" && host === window.location.hostname)
    return { source: "direct", medium: "direct" };
  const social = /(instagram|facebook|fb|t\.co|twitter|x\.com|tiktok|youtube|pinterest|linkedin)/i;
  const search = /(google|bing|yahoo|duckduckgo|ecosia)/i;
  if (social.test(host)) return { source: host.split(".")[0], medium: "social" };
  if (search.test(host)) return { source: host.split(".")[0], medium: "organic" };
  return { source: host, medium: "referral" };
}

// Read first-touch attribution (persisted), capturing it on first visit.
export function getAttribution(): Attribution {
  const empty: Attribution = {
    source: "direct",
    medium: "direct",
    campaign: "",
    term: "",
    content: "",
    referrer: "",
    landingPath: "",
    firstSeen: "",
  };
  if (typeof window === "undefined") return empty;

  try {
    const stored = window.localStorage.getItem(ATTR_KEY);
    if (stored) return { ...empty, ...(JSON.parse(stored) as Partial<Attribution>) };
  } catch {
    /* ignore */
  }

  const q = new URLSearchParams(window.location.search);
  const ref = document.referrer || "";
  const derived = deriveFromReferrer(ref);
  const clickId = q.get("gclid") || q.get("fbclid") || "";
  const attr: Attribution = {
    source: q.get("utm_source") || derived.source,
    medium: q.get("utm_medium") || (clickId ? "cpc" : derived.medium),
    campaign: q.get("utm_campaign") || "",
    term: q.get("utm_term") || "",
    content: q.get("utm_content") || "",
    referrer: ref,
    landingPath: window.location.pathname + window.location.search,
    firstSeen: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    /* ignore */
  }
  return attr;
}
