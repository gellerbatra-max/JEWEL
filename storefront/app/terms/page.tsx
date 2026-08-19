import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description:
    "The terms on which Taygerian offers and sells its fine jewellery — enquiries, quotes, pricing, payment, delivery, and returns.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-16">
      <PageIntro eyebrow="Legal" title="Terms of Sale">
        The plain terms on which we offer, make, and deliver our pieces. We&apos;ve kept them as
        clear as we can.
      </PageIntro>

      <Prose>
        <p className="muted">Last updated: August 2026</p>

        <h2>1. About these terms</h2>
        <p>
          These terms apply to enquiries and purchases made through this website with Taygerian. By
          placing an enquiry or order, you accept them. They sit alongside our{" "}
          <Link href="/privacy">Privacy Policy</Link> and <Link href="/returns">Returns &amp;
          Exchanges</Link> policy.
        </p>

        <h2>2. How a sale is made</h2>
        <p>
          Prices shown are an invitation to enquire, not a completed sale. A binding order forms when
          we issue you a written quote for a specific piece and you accept it and pay as instructed.
          We may decline or cancel an order — for example if a one-of-a-kind piece has already sold,
          or a stone is no longer available — and will refund any payment taken.
        </p>

        <h2>3. Pricing</h2>
        <ul>
          <li>Prices are in the currency shown and may change until an order is confirmed.</li>
          <li>
            &ldquo;Price on request&rdquo; / one-of-a-kind pieces are quoted individually.
          </li>
          <li>
            Quotes include the certified stone and insured shipping; import duties and taxes in your
            country are separate — see <Link href="/shipping">Shipping &amp; Delivery</Link>.
          </li>
        </ul>

        <h2>4. Payment</h2>
        <p>
          Payment is currently by secure bank transfer per the instructions on your quote (a card
          gateway is coming). Made-to-order and bespoke pieces may require a deposit to begin, with
          the balance due before dispatch. We begin crafting a made-to-order piece once the agreed
          payment is received.
        </p>

        <h2>5. Made-to-order &amp; bespoke</h2>
        <p>
          Pieces made or customised to your specification are created uniquely for you. We confirm
          every detail with you in writing before making begins; once confirmed, changes may not be
          possible and such pieces are not returnable for change of mind. See{" "}
          <Link href="/returns">Returns &amp; Exchanges</Link>.
        </p>

        <h2>6. Delivery</h2>
        <p>
          We deliver insured and tracked worldwide. Timeframes are estimates; risk passes to you on
          delivery. You are responsible for providing an accurate address and for any local duties or
          taxes.
        </p>

        <h2>7. Authenticity &amp; warranty</h2>
        <p>
          We warrant that each piece is as described, and that certified stones are accompanied by
          their laboratory report — see <Link href="/certification">Certification &amp;
          Authenticity</Link>. Natural gemstones vary; small natural inclusions and variations are
          inherent, not defects. This warranty does not cover ordinary wear, accidental damage, or
          unauthorised alteration.
        </p>

        <h2>8. Our content</h2>
        <p>
          All imagery, designs, and text on this site are the property of Taygerian or used with
          permission and may not be reproduced without our consent.
        </p>

        <h2>9. Liability</h2>
        <p>
          Nothing in these terms limits liability that cannot lawfully be limited (including for
          fraud, or death or personal injury caused by negligence). Otherwise, our liability in
          connection with an order is limited to the price paid for the piece. Nothing here affects
          your non-excludable statutory consumer rights in your country.
        </p>

        <h2>10. Governing law</h2>
        <p>
          These terms are governed by the laws of Sri Lanka, without affecting any mandatory consumer
          protections available to you where you live.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or use our{" "}
          <Link href="/contact">contact page</Link>.
        </p>

        <hr />
        <p className="muted">
          These terms are a working template for the prototype and must be reviewed and finalised
          with a qualified legal adviser — reflecting your registered entity, payment terms, and the
          jurisdictions you sell into — before the store goes live.
        </p>
      </Prose>
    </div>
  );
}
