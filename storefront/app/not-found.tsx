import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-[13px] tracking-[0.24em] uppercase text-gold">404</p>
      <h1 className="font-display text-3xl text-ink">Page not found</h1>
      <p className="mt-4 text-stone">
        The piece or page you&rsquo;re looking for isn&rsquo;t here.
      </p>
      <Link
        href="/"
        className="mt-8 bg-ink px-8 py-3 text-[12px] tracking-[0.16em] uppercase text-porcelain transition-colors hover:bg-gold"
      >
        Return home
      </Link>
    </div>
  );
}
