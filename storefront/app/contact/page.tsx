import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact — Taygerian",
  description:
    "Speak with the Taygerian atelier — message on WhatsApp, email us, or book a private appointment.",
};

// NOTE: placeholder contact details — replace with the brand's real number,
// email, and address before launch.
const WA_NUMBER = "94712280818";
const wa = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const EMAIL = "hello@taygerian.com";

const IconChat = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l.9-4.5A8 8 0 1 1 21 12z" />
  </svg>
);
const IconMail = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);
const IconCalendar = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
    <path d="M3.5 9h17M8 3v4M16 3v4" />
  </svg>
);
const IconPin = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-4 text-[11px] tracking-[0.2em] uppercase text-gold">Get in Touch</p>
        <h1 className="mb-4 font-display text-4xl text-ink sm:text-5xl">Contact</h1>
        <p className="text-lg leading-relaxed text-stone">
          Every Taygerian piece begins with a conversation. Message us, write, or book a private
          appointment — our Colombo atelier will guide you from first idea to finished piece.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card
          icon={IconChat}
          title="WhatsApp"
          desc="The fastest way to reach us — send a photo, a sketch, or a question."
        >
          <CTA href={wa("Hi Taygerian, I'd like to enquire about a piece.")}>Message on WhatsApp</CTA>
        </Card>

        <Card icon={IconMail} title="Email" desc="For detailed enquiries and bespoke commissions.">
          <CTA href={`mailto:${EMAIL}`} outline>
            {EMAIL}
          </CTA>
        </Card>

        <Card
          icon={IconCalendar}
          title="Private Appointment"
          desc="View pieces and discuss a commission in person or over video."
        >
          <CTA href={wa("Hi Taygerian, I'd like to book an appointment.")} outline>
            Book an Appointment
          </CTA>
        </Card>

        <Card icon={IconPin} title="The Atelier" desc="By appointment.">
          <p className="text-[15px] leading-relaxed text-stone">
            Colombo, Sri Lanka
            <br />
            Mon–Sat · 10am – 6pm
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  desc,
  children,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col border border-line bg-white/50 p-8">
      <span className="text-gold" aria-hidden="true">
        {icon}
      </span>
      <h2 className="mt-4 font-display text-2xl text-ink">{title}</h2>
      <p className="mt-2 mb-6 text-[15px] leading-relaxed text-stone">{desc}</p>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

function CTA({
  href,
  outline,
  children,
}: {
  href: string;
  outline?: boolean;
  children: ReactNode;
}) {
  const target = href.startsWith("http") ? "_blank" : undefined;
  return (
    <a
      href={href}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      className={
        outline
          ? "inline-block border border-ink px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:border-gold hover:text-gold"
          : "inline-block bg-ink px-6 py-3 text-[12px] tracking-[0.14em] uppercase text-porcelain transition-colors hover:bg-gold"
      }
    >
      {children}
    </a>
  );
}
