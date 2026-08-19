import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Taygerian uses cookies — essential cookies to run the site, and optional analytics cookies you control — and how to change your choice.",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-16">
      <PageIntro eyebrow="Legal" title="Cookie Policy">
        We keep cookies to a minimum, and nothing beyond the essentials loads without your say-so.
      </PageIntro>

      <Prose>
        <p className="muted">Last updated: August 2026</p>

        <h2>What cookies are</h2>
        <p>
          Cookies are small files stored on your device that help a website work and remember your
          preferences. Some are essential; others are optional and only used with your consent.
        </p>

        <h2>How we use them</h2>
        <ul>
          <li>
            <strong>Essential</strong> — needed for the site to function: remembering your cookie
            choice, your bag, and keeping the site secure. These are always on.
          </li>
          <li>
            <strong>Analytics (optional)</strong> — help us understand which pages and channels bring
            visitors, so we can improve. These load only if you choose &ldquo;Accept all.&rdquo; We
            may use Google Analytics and/or a privacy-friendly analytics tool.
          </li>
        </ul>

        <h2>Your choice</h2>
        <p>
          When you first visit, we ask whether to enable analytics. You can pick{" "}
          <strong>Essential only</strong> or <strong>Accept all</strong>. Nothing optional runs until
          you accept it. Optional cookies load only on your <strong>consent</strong>, in line with
          Sri Lanka&apos;s Personal Data Protection Act, No. 9 of 2022 — and you can withdraw that
          consent at any time.
        </p>

        <h2>Changing your mind</h2>
        <p>
          To change your choice, clear this site&apos;s data in your browser settings and the cookie
          banner will appear again on your next visit. You can also block or delete cookies through
          your browser at any time; essential features may be affected.
        </p>

        <h2>More on your data</h2>
        <p>
          For how we handle personal data more broadly, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <hr />
        <p className="muted">
          This policy is a working template aligned with Sri Lanka&apos;s Personal Data Protection
          Act, No. 9 of 2022, and should be reviewed with a qualified Sri Lankan legal adviser —
          listing the exact cookies your live tools set — before the store goes live.
        </p>
      </Prose>
    </div>
  );
}
