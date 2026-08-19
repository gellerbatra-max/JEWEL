import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Fully insured, tracked worldwide delivery for every Taygerian piece, in its box with its gem certificate. Timelines, duties, and how it works.",
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Service" title="Shipping & Delivery">
        Every piece travels the way it deserves to — fully insured, discreetly packaged, and
        tracked to your door, anywhere in the world.
      </PageIntro>

      <Prose>
        <p className="lead">
          When a piece leaves our atelier it carries real value, so we treat delivery as part of the
          craft rather than an afterthought.
        </p>

        <h2>Insured &amp; tracked, worldwide</h2>
        <p>
          All orders ship fully insured and tracked via a trusted secure courier. Your piece is sent
          in its Taygerian box, accompanied by its gem certificate where one applies. A signature is
          required on delivery. We share tracking the moment your piece is dispatched.
        </p>
        <p>
          We ship within Sri Lanka and to collectors abroad — with particular experience delivering
          to <strong>Australia, Europe, the United Kingdom, and Japan</strong>, alongside the rest of
          the world.
        </p>

        <h2>Timelines</h2>
        <ul>
          <li>
            <strong>In-stock pieces</strong> are inspected, packed, and dispatched within a few
            business days.
          </li>
          <li>
            <strong>Made-to-order &amp; bespoke pieces</strong> are crafted first — typically two to
            six weeks depending on the design — then dispatched. We keep you updated throughout.
          </li>
          <li>
            International transit times vary by destination; your courier tracking will give a firm
            estimate.
          </li>
        </ul>

        <h2>Duties &amp; taxes</h2>
        <p>
          Prices are quoted exclusive of any import duties or taxes that your country may levy on
          arrival. These are set by your local customs authority and are the recipient&apos;s
          responsibility. Where we can estimate them in advance, we&apos;ll tell you before you pay —
          there should be no surprises.
        </p>

        <h2>Packaging &amp; discretion</h2>
        <p>
          Shipments are packaged securely and discreetly, with no external branding that indicates
          the contents. If a piece is a gift, tell us — we&apos;re glad to help it arrive the right
          way.
        </p>

        <h2>A question about your delivery?</h2>
        <p>
          We&apos;re happy to arrange a specific delivery date, hold a piece, or answer anything at
          all. <Link href="/contact">Contact the atelier</Link> and we&apos;ll take care of it.
        </p>
        <p className="muted">
          Related: <Link href="/returns">Returns &amp; Exchanges</Link> ·{" "}
          <Link href="/care">Jewellery Care</Link>
        </p>
      </Prose>
    </div>
  );
}
