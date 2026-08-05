# Roadmap

Sequenced so each phase is justified by evidence from a prior phase, not built speculatively. Timelines assume a small dedicated team (1 brand/creative lead, 2–3 engineers, 1 photographer/content, external legal/accounting for the entity setup) — adjust to actual team size.

## Phase 0 — Foundation (Weeks 1–4)

- Lock brand name, motif, and visual identity (see [Brand Strategy](01-brand-strategy.md)); run trademark + domain availability checks before design starts.
- Legal/financial setup: incorporate the foreign holding entity needed for global Stripe access (see [Technical Architecture](03-technical-architecture.md)); open the local PayHere/WebXPay merchant account in parallel.
- Photography direction locked: macro product standard, lifestyle style guide, archival-style mine/atelier imagery brief.
- Information architecture and content plan for story pages (*Ceylon Provenance*, *The Maison*, *Bridal*, *High Jewellery*).

## Phase 1 — MVP Launch (Months 2–4)

- Medusa.js (self-hosted) storefront live with core collections (bridal, fine jewellery, signature Ceylon sapphire line) — see [Technical Architecture](03-technical-architecture.md) for why this replaced the original Shopify Plus recommendation (client doesn't want recurring platform fees).
- Product pages with 360° viewer, macro zoom, and on-page GIA/GRS certification display.
- Guest checkout; Stripe (global) + PayHere/WebXPay (local LKR) both live; itemized international duty/tax shown at checkout.
- WhatsApp/video "Book a Consultation" channel live on all high-value PDPs — this is the single highest-leverage conversion mechanic found in research (see [UX patterns](02-ux-design-patterns.md)) and should not be deferred to a later phase.
- Certificate/stock tracking (Postgres or Medusa metadata) for one-of-a-kind vs. made-to-order vs. configurable status — no platform variant-cap workaround needed with Medusa.
- Hosting/ops plan settled: who owns uptime, backups, and patching for the self-hosted stack (a managed PaaS or a part-time devops arrangement) before this goes live with real payments.
- Core SEO/content: Ceylon Provenance story, The Maison/founder story, care & warranty pages.

## Phase 2 — Growth (Months 4–8)

- AR try-on for rings and earrings; metal/stone/size build-your-own configurator (reference: James Allen Ring Studio, Blue Nile Creative Studio) — plus a mailed/printable ring-sizer kit as the fallback, since even category leaders haven't solved camera-based finger sizing.
- Clienteling CRM: advisor-customer relationship continuity, private-sale early access, invitation-only previews — access and recognition, not discounts (see [UX patterns](02-ux-design-patterns.md) on why loyalty discounts erode luxury positioning).
- Lifecycle email/SMS (Klaviyo or similar): 48-hour post-purchase care sequence, 2–3 year appraisal/cleaning reminders, anniversary/birthday reminders timed ~30 days ahead.
- Financing at checkout: Affirm and/or Klarna.
- Multi-currency pricing (USD/EUR/GBP/AED, market-based pricing) — modeled natively in Medusa's multi-region support.
- Fraud layer upgrade: Signifyd or Riskified once order volume justifies the fee.

## Phase 3 — Scale (Months 8–14)

- Provenance layer: NFC tag + serial lookup page linking to lab certificate and care record for signature pieces (stop short of bespoke blockchain — see [Technical Architecture](03-technical-architecture.md) verdict on Tracr vs. building your own).
- Evaluate commercetools/Saleor migration only if genuinely outgrowing Medusa — unlikely before real scale given Medusa has no variant-count ceiling to force the issue.
- Personalization/recommendation engine driven by CRM purchase history.
- Gulf market expansion: Tabby/Tamara financing, Arabic localization if warranted by traffic.
- Physical boutique POS integration if a flagship retail location is part of the plan.

## Phase 4 — Global Prestige (Year 2+)

- High Jewellery private-sale tier: one-of-a-kind pieces, POR pricing, by-appointment only — matching how Graff/Bulgari/Cartier gate their top tier.
- PR/press strategy and selective placement (red-carpet/editorial seeding), built on the founder/provenance story rather than manufactured celebrity association.
- Pursue Responsible Jewellery Council (RJC) certification if the ethical-sourcing narrative is to be formalized alongside the geographic-provenance story.
- Evaluate flagship boutique and/or integration into an industry provenance network (e.g., a GIA/Tracr-adjacent platform) once brand prestige justifies the investment.

## What NOT to build first

- No bespoke blockchain/provenance ledger before Phase 3 — the trust value is achievable with NFC + a certificate lookup page at a fraction of the cost.
- No AR/configurator before MVP traction is proven — strong static + 360° photography carries Phase 1.
- No loyalty-points/discount program at any phase — the research is consistent that this undercuts luxury positioning; use access/recognition mechanics instead.
- No forced account creation at checkout, at any phase — guest checkout stays available even after CRM/clienteling matures.
