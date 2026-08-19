import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Responsible Sourcing",
  description:
    "Where Taygerian's gemstones and gold come from, and how we work — Ceylon gem gravels, our own workshop in southern Sri Lanka, and a commitment to responsible, traceable practice.",
};

export default function SourcingPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Trust" title="Responsible Sourcing">
        For a Ceylon house, provenance isn&apos;t marketing — it&apos;s the whole story. Where a
        stone comes from, and the hands that shape it, are the reason it&apos;s worth what it is.
      </PageIntro>

      <Prose>
        <h2>Ceylon gemstones</h2>
        <p>
          Our stones come from the gem gravels of Sri Lanka — chiefly the fabled fields around
          Ratnapura, the &ldquo;city of gems.&rdquo; Ceylon has given the world its finest sapphires
          for two thousand years, and that heritage is the foundation of everything we make.
        </p>

        <h2>Our own hands, in the south</h2>
        <p>
          We are not a reseller. Taygerian pieces are made in our own workshop in southern Sri Lanka,
          by goldsmiths from a family tradition passed down through generations. Keeping the making
          in-house means we know exactly who worked on your piece, and under what conditions.
        </p>

        <h2>How we work</h2>
        <ul>
          <li>
            We buy stones through trusted, established relationships within Sri Lanka&apos;s
            long-regulated gem trade.
          </li>
          <li>
            We favour stones whose origin and any treatment can be independently documented — see{" "}
            <Link href="/certification">Certification &amp; Authenticity</Link>.
          </li>
          <li>
            Our craft is our own, fairly employed, rather than outsourced to anonymous hands.
          </li>
          <li>
            We use recycled and responsibly obtained precious metals wherever practical.
          </li>
        </ul>

        <h2>An honest note</h2>
        <p>
          Responsible sourcing is a commitment we take seriously and keep improving — not a badge we
          claim to have perfected. If you would like to know more about a specific stone&apos;s
          journey, ask us; we&apos;d rather tell you plainly than promise vaguely.
        </p>

        <p className="muted">
          Related: <Link href="/dynasty">Our story</Link> ·{" "}
          <Link href="/certification">Certification &amp; Authenticity</Link>
        </p>
      </Prose>
    </div>
  );
}
