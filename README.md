# JEWEL — Sri Lankan Ceylon Gem & Jewellery House

A brand + e-commerce platform plan for a traditional Sri Lankan jeweller (gold, silver, platinum, house-cut Ceylon gemstones) going global — positioned to compete with Graff, Bulgari, Cartier, and Monaco Chain.

This repo holds the brand strategy, UX research, technical architecture, and phased roadmap produced for this project. Nothing here is final — it's the working plan to align on before design and build begin.

## Contents

- [docs/01-brand-strategy.md](docs/01-brand-strategy.md) — positioning, name candidates, visual identity, the "Ceylon Provenance" differentiator
- [docs/02-ux-design-patterns.md](docs/02-ux-design-patterns.md) — research-backed UX/conversion patterns from luxury e-commerce
- [docs/03-technical-architecture.md](docs/03-technical-architecture.md) — platform, frontend, payments, security, PIM/inventory architecture
- [docs/04-roadmap.md](docs/04-roadmap.md) — phased build plan, Phase 0 → Year 2+
- [docs/brand-roadmap.html](docs/brand-roadmap.html) — single-page visual summary of the above (open in a browser)
- [docs/brand-identity.html](docs/brand-identity.html) — wordmark, mark, color and type system (open in a browser)

## TL;DR

**The brand asset competitors can't copy:** direct control of Ceylon sapphire sourcing + lab-verified origin certification. Graff controls diamond mine-to-market; Chopard owns the ethical-sourcing story; Monaco Chain substitutes transparency for heritage. This business can combine vertical control *and* genuine geographic provenance — something none of the reference brands can claim for colored stones.

**The stack:** Shopify Plus + Hydrogen (Next.js) storefront now, with a jewellery-specific PIM layer to work around Shopify's variant limits; Stripe via a foreign holding entity for global cards (Sri Lanka isn't directly supported) + PayHere/WebXPay for local LKR traffic; AR try-on and a metal/stone/size configurator once MVP traction is proven; migrate to composable commerce (commercetools) only if/when scale demands it.

**Sequencing:** brand lock → MVP storefront with guest checkout + certification display + WhatsApp/consultation booking → AR + configurator + clienteling CRM + financing → provenance tech (NFC/digital passport) + Gulf market expansion → High Jewellery private-sale tier.

See [docs/04-roadmap.md](docs/04-roadmap.md) for the full phase-by-phase plan.
