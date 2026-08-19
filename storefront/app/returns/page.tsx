import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Taygerian's returns and exchanges policy for in-stock, made-to-order, and bespoke fine jewellery — clear terms, handled personally.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Service · Policy" title="Returns & Exchanges">
        We want you to love your piece. If something isn&apos;t right, here&apos;s exactly how we put
        it right — and the terms that apply.
      </PageIntro>

      <Prose>
        <p className="lead">
          Because much of what we make is created to order by our own goldsmiths, our policy
          distinguishes between ready pieces and pieces made for you.
        </p>

        <h2>In-stock pieces</h2>
        <p>
          A ready-to-ship piece may be returned for a refund or exchange within{" "}
          <strong>14 days</strong> of delivery, provided it is unworn, undamaged, and returned in its
          original box with its certificate and any documentation. Once we receive and inspect it,
          we process your refund to the original payment method.
        </p>

        <h2>Made-to-order &amp; bespoke pieces</h2>
        <p>
          Pieces crafted or customised to your specification — your metal, your stone, your size,
          your engraving — are made uniquely for you and so cannot be returned simply for a change of
          mind. This is standard for fine bespoke jewellery. We reduce that risk by confirming every
          detail with you, in writing, before we begin.
        </p>

        <h2>If a piece arrives faulty</h2>
        <p>
          Every piece is inspected before it leaves us, but if yours arrives with a genuine fault or
          not as described, contact us within <strong>7 days</strong> of delivery with photographs.
          We will repair, replace, or refund it at our cost. This does not affect any statutory
          rights you have.
        </p>

        <h2>How to start a return</h2>
        <ul>
          <li>
            <Link href="/contact">Message the atelier</Link> with your order details and reason.
          </li>
          <li>We&apos;ll confirm the return and share secure, insured return instructions.</li>
          <li>
            Return shipping for change-of-mind returns is arranged by you and fully insured; we cover
            it for faulty pieces.
          </li>
        </ul>

        <h2>Resizing &amp; alterations</h2>
        <p>
          Sometimes a piece simply needs adjusting rather than returning. We offer resizing and
          alterations — see <Link href="/care">Jewellery Care &amp; Servicing</Link>.
        </p>

        <p className="muted">
          This page also serves as our returns policy for the purposes of our{" "}
          <Link href="/terms">Terms of Sale</Link>. Timeframes are indicative for this prototype and
          should be confirmed before launch.
        </p>
      </Prose>
    </div>
  );
}
