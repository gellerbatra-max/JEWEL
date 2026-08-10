export function ConsultationCTA({ productTitle }: { productTitle?: string }) {
  const message = productTitle
    ? `Hello, I'd like to book a consultation about the ${productTitle}.`
    : "Hello, I'd like to book a jewellery consultation.";

  return (
    <a
      href={`https://wa.me/94712280818?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center border border-ink/25 text-ink py-3.5 font-sans text-[12px] tracking-[0.16em] uppercase hover:border-gold hover:text-gold transition-colors"
    >
      Book a Video Consultation
    </a>
  );
}
