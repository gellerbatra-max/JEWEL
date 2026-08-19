"use client";

// The three product-page enquiry modals (Drop a Hint / Book an Appointment /
// Customise Me) plus their shared form helpers and the long country/dial-code
// lists. Split out of ProductActions so this heavier chunk is only fetched the
// first time a shopper actually opens one of the modals (via next/dynamic).

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getAttribution, track } from "@/lib/analytics";

export type Action = "hint" | "appointment" | "customise";

const STORE = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9h16M4 9l1.2-4h13.6L20 9M4 9v10h16V9M9.5 19v-5h5v5" /></svg>
);
const VIDEO = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2" /><circle cx="12" cy="17.5" r="0.7" fill="currentColor" /></svg>
);

// Send an enquiry to our own inbox (/api/enquiries), tagged with first-touch
// attribution so each lead records the channel that produced it, and record a
// conversion event for analytics.
function post(payload: Record<string, unknown>) {
  const a = getAttribution();
  fetch("/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...payload,
      attr_source: a.source,
      attr_medium: a.medium,
      attr_campaign: a.campaign,
      attr_referrer: a.referrer,
      attr_landing: a.landingPath,
    }),
  }).catch(() => {});
  track("enquiry_submitted", { type: payload.type, piece: payload.product_title });
}

function Overlay({ onClose, children, size = "sm" }: { onClose: () => void; children: ReactNode; size?: "sm" | "lg" | "xl" }) {
  const w = size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-md";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative max-h-[94vh] w-full overflow-y-auto border border-line bg-porcelain shadow-[0_40px_90px_-45px_rgba(28,27,25,0.55)] ${w}`}>
        {children}
      </div>
    </div>
  );
}

function CloseX({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 text-lg leading-none text-stone transition-colors hover:text-ink">✕</button>
  );
}

function ThankYou({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4.5 4.5L19 7" /></svg>
      </div>
      <p className="font-display text-2xl text-ink">Thank you</p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone">
        We&apos;ve received your enquiry and will be in touch shortly.
      </p>
      <button type="button" onClick={onClose} className="mt-7 bg-ink px-10 py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold">
        Done
      </button>
    </div>
  );
}

const field = "w-full rounded-md border border-line bg-white/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-stone/60 focus:border-gold";
const smallLabel = "mb-1.5 block text-[11px] tracking-[0.12em] uppercase text-stone";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo",
  "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const DIAL_CODES = [
  { f: "🇦🇺", n: "Australia", c: "+61" },
  { f: "🇧🇭", n: "Bahrain", c: "+973" },
  { f: "🇨🇦", n: "Canada", c: "+1" },
  { f: "🇨🇳", n: "China", c: "+86" },
  { f: "🇩🇰", n: "Denmark", c: "+45" },
  { f: "🇫🇷", n: "France", c: "+33" },
  { f: "🇩🇪", n: "Germany", c: "+49" },
  { f: "🇭🇰", n: "Hong Kong", c: "+852" },
  { f: "🇮🇳", n: "India", c: "+91" },
  { f: "🇮🇪", n: "Ireland", c: "+353" },
  { f: "🇮🇹", n: "Italy", c: "+39" },
  { f: "🇯🇵", n: "Japan", c: "+81" },
  { f: "🇰🇼", n: "Kuwait", c: "+965" },
  { f: "🇲🇾", n: "Malaysia", c: "+60" },
  { f: "🇲🇻", n: "Maldives", c: "+960" },
  { f: "🇳🇱", n: "Netherlands", c: "+31" },
  { f: "🇳🇿", n: "New Zealand", c: "+64" },
  { f: "🇳🇴", n: "Norway", c: "+47" },
  { f: "🇴🇲", n: "Oman", c: "+968" },
  { f: "🇶🇦", n: "Qatar", c: "+974" },
  { f: "🇸🇦", n: "Saudi Arabia", c: "+966" },
  { f: "🇸🇬", n: "Singapore", c: "+65" },
  { f: "🇪🇸", n: "Spain", c: "+34" },
  { f: "🇱🇰", n: "Sri Lanka", c: "+94" },
  { f: "🇸🇪", n: "Sweden", c: "+46" },
  { f: "🇨🇭", n: "Switzerland", c: "+41" },
  { f: "🇦🇪", n: "United Arab Emirates", c: "+971" },
  { f: "🇬🇧", n: "United Kingdom", c: "+44" },
  { f: "🇺🇸", n: "United States", c: "+1" },
];

// Compact country-code picker (flag + code) + number input. The full country
// list only appears in the dropdown. Reads `code` + `phone` on submit.
function PhoneField() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(() => DIAL_CODES.find((d) => d.c === "+94") ?? DIAL_CODES[0]);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = DIAL_CODES.filter((d) => d.n.toLowerCase().includes(q.toLowerCase()) || d.c.includes(q));

  return (
    <div>
      <span className={smallLabel}>Phone *</span>
      <div className="flex gap-2">
        <div className="relative shrink-0" ref={ref}>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Country code" className={`${field} flex w-24 items-center justify-between gap-1`}>
            <span className="truncate">{sel.f} {sel.c}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-stone"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {open && (
            <div className="absolute left-0 z-30 mt-1 max-h-56 w-64 overflow-y-auto rounded-md border border-line bg-porcelain shadow-[0_20px_50px_-20px_rgba(28,27,25,0.5)]">
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} placeholder="Search country…" className="sticky top-0 w-full border-b border-line bg-porcelain px-3 py-2 text-sm text-ink outline-none placeholder:text-stone/60" />
              {filtered.map((d) => (
                <button type="button" key={d.n} onClick={() => { setSel(d); setOpen(false); setQ(""); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-cloud">
                  <span className="w-6 shrink-0">{d.f}</span>
                  <span className="flex-1 truncate">{d.n}</span>
                  <span className="text-stone">{d.c}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="px-3 py-3 text-sm text-stone">No match</p>}
            </div>
          )}
        </div>
        <input name="phone" required maxLength={20} className={`${field} flex-1`} placeholder="Your phone" />
        <input type="hidden" name="code" value={sel.c} />
      </div>
    </div>
  );
}

// ---- Drop a Hint --------------------------------------------------------------
function HintModal({ productTitle, productSku, productImage, productHandle, onClose }: { productTitle: string; productSku?: string; productImage?: string; productHandle?: string; onClose: () => void }) {
  const [f, setF] = useState({ yourName: "", yourEmail: "", recipientName: "", recipientEmail: "", message: "" });
  const [sent, setSent] = useState(false);
  const on = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post({
      type: "hint", product_title: productTitle, product_handle: productHandle ?? null,
      product_url: typeof window !== "undefined" ? window.location.href : "",
      product_sku: productSku,
      product_image_url: productImage ? (typeof window !== "undefined" ? window.location.origin + productImage : productImage) : undefined,
      name: f.yourName, contact: f.yourEmail, recipient_email: f.recipientEmail, recipient_name: f.recipientName, message: f.message,
    });
    setSent(true);
  }

  const line = "w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-gold";

  return (
    <Overlay onClose={onClose} size="xl">
      <div className="grid sm:grid-cols-2">
        <div className="hidden flex-col items-center justify-center bg-white px-8 py-10 text-center sm:flex">
          <p className="font-display text-xl tracking-[0.34em] text-ink">TAYGERIAN</p>
          <div className="mt-7 w-full break-words text-sm leading-relaxed text-ink">
            <p>Dear {f.recipientName || "…"},</p>
            <p>Apparently {f.yourName || "someone"}</p>
            <p>has been dreaming about this creation</p>
          </div>
          {productImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={productImage} alt="" className="my-6 h-40 w-40 object-contain" />
          )}
          <p className="font-display text-base text-ink">{productTitle}</p>
          {productSku && <p className="mt-1 text-[11px] tracking-[0.12em] text-stone">Piece {productSku}</p>}
          <p className="mt-5 text-sm italic text-stone">Hint hint…</p>
          {f.message && <p className="mt-1 w-full break-words text-sm italic text-stone">{f.message}</p>}
        </div>
        <div className="relative bg-cloud/50 px-7 py-8 sm:px-8">
          <CloseX onClose={onClose} />
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold text-gold"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4.5 4.5L19 7" /></svg></div>
              <p className="font-display text-xl text-ink">Your hint is on its way</p>
              <p className="mt-2 text-sm leading-relaxed text-stone">We&apos;ll send {f.recipientName || "them"} a note about the {productTitle}, on your behalf.</p>
              <button type="button" onClick={onClose} className="mt-6 w-full bg-ink py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold">Done</button>
            </div>
          ) : (
            <>
              <p className="font-display text-2xl text-ink">Drop a Hint</p>
              <form onSubmit={submit} className="mt-6">
                <div className="space-y-4">
                  <input className={line} placeholder="Your name*" required maxLength={20} value={f.yourName} onChange={on("yourName")} />
                  <input className={line} type="email" placeholder="Your email*" required maxLength={64} value={f.yourEmail} onChange={on("yourEmail")} />
                </div>
                <div className="my-6 border-t border-ink/60" />
                <div className="space-y-4">
                  <input className={line} placeholder="Recipient name*" required maxLength={20} value={f.recipientName} onChange={on("recipientName")} />
                  <input className={line} type="email" placeholder="Recipient email*" required maxLength={64} value={f.recipientEmail} onChange={on("recipientEmail")} />
                  <textarea className="w-full resize-none border border-line bg-white/50 px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-gold" rows={3} maxLength={100} placeholder="Type your hint message here…" value={f.message} onChange={on("message")} />
                </div>
                <button type="submit" className="mt-6 w-full break-words bg-ink py-3.5 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold">
                  Send Hint{f.recipientName ? ` to ${f.recipientName}` : ""}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Overlay>
  );
}

// ---- Book an Appointment ------------------------------------------------------
function AppointmentModal({ productTitle, productSku, productHandle, onClose }: { productTitle: string; productSku?: string; productHandle?: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k)?.toString() ?? "").trim();
    const details = [
      `Appointment: ${g("appt_type") || "—"}`,
      g("city") ? `City/Country: ${g("city")}` : "",
      g("store") ? `Location: ${g("store")}` : "",
      `Preferred contact: ${g("method") || "—"}`,
      g("requests") ? `Requests: ${g("requests")}` : "",
    ].filter(Boolean).join("\n");
    post({
      type: "appointment", product_title: productTitle, product_handle: productHandle ?? null,
      product_sku: productSku, product_url: typeof window !== "undefined" ? window.location.href : "",
      name: `${g("first")} ${g("last")}`.trim(),
      contact: [g("email"), g("phone") ? `${g("code") || "+94"} ${g("phone")}` : ""].filter(Boolean).join(" / "),
      message: details,
    });
    setSent(true);
  }

  const typeCard = "flex cursor-pointer items-center gap-3 rounded-md border border-line bg-white/50 px-4 py-3.5 text-sm text-ink transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10";

  return (
    <Overlay onClose={onClose} size="xl">
      <div className="relative p-8 sm:p-10">
        <CloseX onClose={onClose} />
        {sent ? <ThankYou onClose={onClose} /> : (<>
        <h3 className="font-display text-2xl leading-tight text-ink sm:text-3xl">Book an Appointment</h3>
        <p className="mt-2 text-[15px] text-stone">Please fill out your details below to secure your appointment.</p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <label className={typeCard}>
              <input type="radio" name="appt_type" value="In-store" defaultChecked required className="accent-gold" />
              <span className="text-gold">{STORE}</span> In-store appointment
            </label>
            <label className={typeCard}>
              <input type="radio" name="appt_type" value="Virtual" className="accent-gold" />
              <span className="text-gold">{VIDEO}</span> Virtual appointment
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><span className={smallLabel}>First name *</span><input name="first" required maxLength={40} className={field} placeholder="First name" /></div>
            <div><span className={smallLabel}>Last name *</span><input name="last" required maxLength={40} className={field} placeholder="Last name" /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><span className={smallLabel}>Email *</span><input name="email" type="email" required maxLength={64} className={field} placeholder="you@email.com" /></div>
            <div><span className={smallLabel}>Which city / country?</span><input name="city" maxLength={60} className={field} placeholder="City / country" /></div>
          </div>

          <PhoneField />

          <div><span className={smallLabel}>Any special requests *</span><textarea name="requests" required maxLength={300} rows={2} className={`${field} resize-none`} placeholder="A particular piece or collection you'd like to view…" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={smallLabel}>Select a location</span>
              <select name="store" className={field} defaultValue="">
                <option value="" disabled>Please select</option>
                <option>Private viewing (by appointment)</option>
                <option>Online / Virtual</option>
              </select>
            </div>
            <div>
              <span className={smallLabel}>Preferred contact *</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-sm text-ink">
                {["Email", "Phone", "WhatsApp"].map((m) => (
                  <label key={m} className="flex items-center gap-1.5">
                    <input type="radio" name="method" value={m} required className="accent-gold" /> {m}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-ink py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold">
            Request Appointment
          </button>
        </form>
        </>)}
      </div>
    </Overlay>
  );
}

// ---- Customise Me: two-panel (product left, bespoke enquiry form right) --------
function CustomiseModal({ productTitle, productSku, productImage, productHandle, onClose }: { productTitle: string; productSku?: string; productImage?: string; productHandle?: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k)?.toString() ?? "").trim();
    post({
      type: "customise", product_title: productTitle, product_handle: productHandle ?? null,
      product_sku: productSku, product_url: typeof window !== "undefined" ? window.location.href : "",
      name: `${g("first")} ${g("last")}`.trim(),
      contact: [g("email"), g("phone") ? `${g("code") || "+94"} ${g("phone")}` : ""].filter(Boolean).join(" / "),
      message: [g("country") ? `Country: ${g("country")}` : "", g("message")].filter(Boolean).join("\n"),
    });
    setSent(true);
  }

  return (
    <Overlay onClose={onClose} size="xl">
      <div className="grid sm:grid-cols-2">
        {/* Left — the piece, no message */}
        <div className="hidden flex-col items-center justify-center bg-white px-8 py-10 text-center sm:flex">
          <p className="font-display text-xl tracking-[0.34em] text-ink">TAYGERIAN</p>
          {productImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={productImage} alt="" className="my-8 h-48 w-48 object-contain" />
          )}
          <p className="font-display text-lg text-ink">{productTitle}</p>
          {productSku && <p className="mt-1 text-[11px] tracking-[0.12em] text-stone">Piece {productSku}</p>}
        </div>

        {/* Right — bespoke enquiry form */}
        <div className="relative bg-cloud/50 px-7 py-8 sm:px-8">
          <CloseX onClose={onClose} />
          {sent ? <ThankYou onClose={onClose} /> : (<>
          <h3 className="font-display text-2xl leading-tight text-ink">Customize this Item</h3>
          <p className="mt-1.5 text-sm text-stone">Tell us how you&apos;d like this piece made your own.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><span className={smallLabel}>First name *</span><input name="first" required maxLength={40} className={field} placeholder="First name" /></div>
              <div><span className={smallLabel}>Last name *</span><input name="last" required maxLength={40} className={field} placeholder="Last name" /></div>
            </div>
            <div><span className={smallLabel}>Email *</span><input name="email" type="email" required maxLength={64} className={field} placeholder="you@email.com" /></div>
            <PhoneField />
            <div>
              <span className={smallLabel}>Country</span>
              <select name="country" className={field} defaultValue="">
                <option value="" disabled>Please select</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><span className={smallLabel}>Message *</span><textarea name="message" required maxLength={400} rows={3} className={`${field} resize-none`} placeholder="Metal, stone, size, engraving, or any request…" /></div>
            <button type="submit" className="w-full bg-ink py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold">Send</button>
          </form>
          </>)}
        </div>
      </div>
    </Overlay>
  );
}

// Dispatcher: renders whichever modal is active. This is the default export that
// ProductActions lazy-loads via next/dynamic.
export default function ProductActionModals({
  action,
  productTitle,
  productHandle,
  productImage,
  productSku,
  onClose,
}: {
  action: Action;
  productTitle: string;
  productHandle?: string;
  productImage?: string;
  productSku?: string;
  onClose: () => void;
}) {
  if (action === "hint")
    return <HintModal productTitle={productTitle} productSku={productSku} productImage={productImage} productHandle={productHandle} onClose={onClose} />;
  if (action === "appointment")
    return <AppointmentModal productTitle={productTitle} productSku={productSku} productHandle={productHandle} onClose={onClose} />;
  return <CustomiseModal productTitle={productTitle} productSku={productSku} productImage={productImage} productHandle={productHandle} onClose={onClose} />;
}
