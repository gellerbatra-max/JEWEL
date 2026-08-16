# Cassian — Storefront Prototype

A working front-end prototype of the storefront described in [../docs/03-technical-architecture.md](../docs/03-technical-architecture.md), built with Next.js (App Router) + Tailwind CSS v4.

**This is a prototype, not a live store.** Product data in `lib/products.ts` is mocked, shaped to mirror what a Shopify Storefront API response looks like so it can be swapped for real data with minimal rework once a Shopify Plus account exists (see the platform decision in the architecture doc). Checkout is intentionally a disabled stub — there is no payment backend wired up yet.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here

- `/` — home, hero + Ceylon Signature teaser + differentiator callout
- `/collections/[handle]` — collection grid (`ceylon-signature`, `fine-jewellery`, `bridal`)
- `/products/[handle]` — product detail: certification display, catalog price vs. "Price on Request" for one-of-a-kind pieces, "Book a Video Consultation" CTA (per [../docs/02-ux-design-patterns.md](../docs/02-ux-design-patterns.md))
- `/dynasty` — Ceylon provenance narrative (the house story)
- `/cart` — client-side bag (persisted to `localStorage`), checkout disabled pending a real commerce backend

## Identity system

Colors, type, and the facet mark come from [../docs/brand-identity.html](../docs/brand-identity.html) — see `app/globals.css` for the token definitions. The working name "Cassian" is used throughout; the alternate placeholder "Taigerian" is *not* wired in here since it's flagged high legal risk (see [../docs/01-brand-strategy.md](../docs/01-brand-strategy.md)).

## Not yet implemented

Per the phased [roadmap](../docs/04-roadmap.md): AR try-on, the metal/stone/size configurator, real checkout/payments, clienteling CRM, and financing are all Phase 2+ and intentionally not in this prototype.
