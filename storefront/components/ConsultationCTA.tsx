export function ConsultationCTA({ productTitle }: { productTitle?: string }) {
  const message = productTitle
    ? `Hello, I'd like to book a consultation about the ${productTitle}.`
    : "Hello, I'd like to book a jewellery consultation.";

  return (
    <a
      href={`https://wa.me/94000000000?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center rounded-sm border border-gold/60 text-gold py-3 text-[13px] tracking-[0.08em] uppercase hover:bg-gold hover:text-ink transition-colors"
    >
      Book a Video Consultation
    </a>
  );
}
