# UX & Conversion Design Patterns (research-backed)

Luxury jewellery converts far below general e-commerce (roughly 0.9–1.2% vs multi-percent norms) because customers research across 3–5 visits before buying a high-ticket item. The design goal is not "reduce clicks to purchase" — it's **build enough trust and confidence across repeat visits that the customer completes on whichever device/channel they're ready on.**

## Product discovery & product pages

- Multi-format product media as standard, not an upsell: white-background hero shot, an interactive (drag, not autoplay) 360° spin, macro/detail zoom on prongs/hallmarks/pavé, and lifestyle "as-worn" shots for scale.
- Scale rotation-frame density to piece complexity — a plain band doesn't need the same frame count as a diamond solitaire; heavier files slow mobile load, which is one of the highest-impact conversion levers in the underlying research.
- Certification (GIA/GRS/AGL) displayed **directly on the product page**, not linked off-site — trust evidence needs to sit where the anxiety is, i.e., right beside the price.

## Trust & conversion mechanics

- Repeat the same trust cues at two moments: on the PDP beside the price, and again at checkout beside the pay button. Security/authenticity cues placed near the commitment point measurably lift conversion, especially for a brand still building recognition.
- **Price transparency, applied selectively**: catalog pricing on bridal/fine-jewellery lines, "Price on Request" reserved for one-of-a-kind High Jewellery pieces gated behind an advisor — matching how Cartier/Bulgari/Graff themselves segment pricing. Full opacity reads as "hiding something" to a new/unfamiliar brand and depresses conversion.
- **Live/video consultation is the single highest-leverage mechanic found in the research** — reported lifts include a 21x conversion increase after adding virtual shopping (Credo), ~35% AOV lift from video consultations, and 3x AOV / 1.5x purchase frequency for customers who book an appointment vs. those who don't. A persistent "Book a Video Consultation" / "Speak to a Jewellery Advisor" CTA on high-value PDPs should be treated as core infrastructure, not a nice-to-have — and for the Sri Lankan/South Asian and diaspora customer base specifically, a WhatsApp-based advisor channel is likely to outperform generic web chat.

## AR / 3D visualization

- Products with AR see dramatically higher conversion (figures across sources range 15–94%), 25–40% fewer returns (especially rings), and customers spend ~4.5x longer engaging with AR-enabled product pages.
- Reference implementations: **James Allen's Ring Studio** and **Blue Nile's Creative Studio** — a step-by-step build-your-own-ring configurator (metal → setting → stone, live 360° preview at each step). Notably, even these category leaders still rely on mailed/printable ring sizers rather than true camera-based finger sizing — camera-based AR sizing is still immature industry-wide, which is a real opportunity to differentiate rather than a gap to apologize for.
- Sequencing note: this is a Phase 2 investment (see [roadmap](04-roadmap.md)), not MVP — ship strong static/360° photography first, add AR once the catalog and traffic justify the build cost.

## Retention & clienteling

- Luxury loyalty research is unanimous on one point: **discounts erode positioning at this tier.** The currency is access and recognition — private-sale early access, reserved advisor appointments, invitation-only previews — not points or percentage-off codes. Chanel's discreet, non-tiered relationship model is the benchmark to study, not a points-based program.
- Lifecycle email/SMS sequencing that matters specifically for jewellery: a care/maintenance message within 48 hours of purchase (highest open rate in the lifecycle), appraisal/cleaning/prong-inspection reminders every 2–3 years (protects the customer's investment and re-engages them), and anniversary/birthday reminders sent ~30 days ahead — the highest-converting trigger in the category because the gifting occasion already exists independent of any marketing.

## Mobile behavior

- Traffic skews heavily mobile (roughly 3:1 mobile:desktop), but desktop out-converts mobile in every study found, and luxury customers research across multiple sessions before buying.
- Design implication: **mobile-first discovery, desktop- or advisor-assisted completion.** Wishlist/save-for-later and cart state must persist across devices; consultation booking must work flawlessly on mobile since that's where most first contact happens.

## Checkout

- **Guest checkout must be available** — forcing account creation loses global buyers outright at this price point. Layer lightweight fraud checks (email/address matching, BIN/AVS) invisibly instead.
- International orders need **upfront, itemized duty/tax at checkout** (the Zonos/Easyship pattern) — surprise customs fees on a $5,000+ purchase are a guaranteed complaint and chargeback risk.
- Financing (Affirm/Klarna, and Tabby/Tamara for Gulf expansion) is now an expected checkout option at this price point, not a differentiator — treat as table stakes once international volume justifies the integration.
- Reserve visible step-up verification (ID check, callback confirmation) only for outlier high-value orders — most fraud prevention should be invisible to the legitimate customer.
