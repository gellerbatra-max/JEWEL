import Link from "next/link";
import { requireAuth } from "@/lib/admin-auth";
import { logoutAction } from "@/app/admin/actions";

// Guards every route in the (dashboard) group: unauthenticated visitors are
// redirected to /admin/login before any content renders.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-porcelain">
      <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-7">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="font-display text-lg tracking-[0.14em] uppercase text-ink">Taygerian</span>
              <span className="text-[11px] tracking-[0.16em] uppercase text-gold">Manage</span>
            </Link>
            <nav className="hidden items-center gap-5 text-[12px] tracking-[0.1em] uppercase text-stone sm:flex">
              <Link href="/admin" className="hover:text-ink">
                Pieces
              </Link>
              <Link href="/admin/home" className="hover:text-ink">
                Home page
              </Link>
              <Link href="/admin/categories" className="hover:text-ink">
                Category images
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5 text-[12px] tracking-[0.12em] uppercase text-stone">
            <a href="/" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
              View site ↗
            </a>
            <form action={logoutAction}>
              <button type="submit" className="hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
