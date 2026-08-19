import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Certification & Authenticity",
  description:
    "Every principal Taygerian stone is independently certified by a leading gemmological laboratory — GIA, GRS, or AGL — with its origin documented and travelling with the piece.",
};

export default function CertificationPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-16">
      <PageIntro eyebrow="Trust" title="Certification & Authenticity">
        At this level, trust cannot be asked for — it has to be documented. So every principal stone
        we sell is independently certified, and that proof travels with your piece.
      </PageIntro>

      <Prose>
        <h2>Independent laboratory certification</h2>
        <p>
          Our principal gemstones are certified by internationally recognised gemmological
          laboratories — the <strong>GIA</strong> (Gemological Institute of America),{" "}
          <strong>GRS</strong> (GemResearch Swisslab), and <strong>AGL</strong> (American
          Gemological Laboratories). These are among the most respected authorities in the world,
          and they are independent of us.
        </p>

        <h2>What a certificate confirms</h2>
        <ul>
          <li>The stone&apos;s identity — that a sapphire is a sapphire.</li>
          <li>
            Its <strong>origin</strong> — for us, most often Ceylon (Sri Lanka).
          </li>
          <li>
            Whether it has been <strong>treated</strong>, and how — for example, whether a sapphire
            is heated or unheated.
          </li>
          <li>Its measurements, weight, and characteristics.</li>
        </ul>

        <h2>It travels with your piece</h2>
        <p>
          On every certified piece, the report number and verified origin are shown on the product
          page and again with the piece itself. When your piece is delivered, its certificate comes
          in the box — proof you can hold, insure, and pass on.
        </p>

        <h2>Made by us, so vouched for by us</h2>
        <p>
          Beyond the paperwork: our pieces are made by our own goldsmiths in southern Sri Lanka, in a
          family tradition spanning generations. We know each stone and each setting personally,
          because we set them. Authenticity isn&apos;t a claim we outsource.
        </p>

        <h2>Verifying independently</h2>
        <p>
          Laboratory reports can be verified directly with the issuing laboratory using the report
          number — and we&apos;re glad to walk you through it. If you&apos;d like to confirm a stone
          before you commit, just <Link href="/contact">ask us</Link>.
        </p>
      </Prose>
    </div>
  );
}
