import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Prose } from "@/components/Prose";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Taygerian collects, uses, and protects your personal data — enquiries, newsletter, and analytics — and the rights you have over it.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[860px] px-6 py-16">
      <PageIntro eyebrow="Legal" title="Privacy Policy">
        Your trust matters as much as your data. This explains what we collect, why, and the control
        you keep over it.
      </PageIntro>

      <Prose>
        <p className="muted">Last updated: August 2026</p>

        <h2>Who we are</h2>
        <p>
          Taygerian (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a fine-jewellery house based in Sri
          Lanka, selling to clients in Sri Lanka and internationally. We are the &ldquo;data
          controller&rdquo; of the personal data described here. We handle your data in accordance
          with Sri Lanka&apos;s <strong>Personal Data Protection Act, No. 9 of 2022 (PDPA)</strong> —
          overseen by the Data Protection Authority of Sri Lanka — and, for clients abroad, with the
          data-protection laws that apply to them. Contact us any time at{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Enquiry details</strong> — when you send an enquiry, book an appointment, drop a
            hint, or request a commission: your name, contact details, and your message.
          </li>
          <li>
            <strong>Newsletter</strong> — the email address you give us to join our list.
          </li>
          <li>
            <strong>Usage &amp; traffic data</strong> — with your consent, analytics about how the
            site is used (pages viewed, approximate location, device, and the source that referred
            you, such as a social platform or search engine).
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To respond to your enquiry and arrange your piece, delivery, and after-care.</li>
          <li>To send you our newsletter, where you&apos;ve asked us to (you can unsubscribe any time).</li>
          <li>To understand which content and channels bring visitors, so we can improve the site.</li>
          <li>To meet legal, accounting, and security obligations.</li>
        </ul>

        <h2>Our lawful basis</h2>
        <p>
          As required by the PDPA, we process personal data only where we have a lawful basis: your{" "}
          <strong>consent</strong> (newsletter and analytics cookies), the{" "}
          <strong>performance of a contract or steps you request</strong> (handling your enquiry and
          order), compliance with a <strong>legal obligation</strong> (tax and accounting records),
          and our <strong>legitimate interests</strong> in running and securing our business. We keep
          data accurate and up to date, and process it transparently.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell your data. We share it only with service providers who help us operate — for
          example a shipping courier, a payment provider, or an email/analytics tool — and only as
          needed. Where we use analytics (such as Google Analytics or a privacy-friendly
          alternative), it runs only after you accept analytics cookies.
        </p>

        <h2>International transfers</h2>
        <p>
          We serve clients in Sri Lanka, Australia, Europe, the UK, and Japan, so your data may be
          processed in, or transferred between, these regions. We take reasonable steps to ensure it
          is protected wherever it is handled.
        </p>

        <h2>Retention</h2>
        <p>
          We keep enquiry and order records for as long as needed to serve you and to meet legal and
          accounting requirements, then delete or anonymise them. Newsletter data is kept until you
          unsubscribe.
        </p>

        <h2>Your rights</h2>
        <p>
          Under Sri Lanka&apos;s PDPA you have the right to <strong>access</strong> the data we hold
          about you, to have it <strong>corrected or completed</strong>, to request its{" "}
          <strong>erasure</strong>, to <strong>withdraw consent</strong> at any time, and to{" "}
          <strong>object to</strong> automated decision-making that significantly affects you. To
          exercise any of these, email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. If
          you are not satisfied with our response, you may complain to the{" "}
          <strong>Data Protection Authority of Sri Lanka</strong>.
        </p>
        <p>
          Clients outside Sri Lanka may have additional or equivalent rights under their own laws —
          including the EU/UK GDPR, Australia&apos;s Privacy Act, and Japan&apos;s APPI — and we will
          honour those. You can withdraw cookie consent at any time; see our{" "}
          <Link href="/cookie-policy">Cookie Policy</Link>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about your privacy? Write to <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{" "}
          or reach us through our <Link href="/contact">contact page</Link>.
        </p>

        <hr />
        <p className="muted">
          This policy is a working template written to reflect Sri Lanka&apos;s Personal Data
          Protection Act, No. 9 of 2022. It should still be reviewed and finalised with a qualified
          Sri Lankan legal adviser — including whether your business must register with the Data
          Protection Authority or appoint a Data Protection Officer, and reflecting your registered
          entity, real service providers, and the jurisdictions you sell into — before the store goes
          live.
        </p>
      </Prose>
    </div>
  );
}
