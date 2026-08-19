import Link from "next/link";
import { requireAuth } from "@/lib/admin-auth";
import { logoutAction } from "@/app/admin/actions";
import { getUnreadCount } from "@/lib/enquiry-store";

// Guards every route in the (dashboard) group: unauthenticated visitors are
// redirected to /admin/login before any content renders.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  const unread = await getUnreadCount();

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
              <Link href="/admin/insights" className="hover:text-ink">
                Insights
              </Link>
              <Link href="/admin" className="hover:text-ink">
                Pieces
              </Link>
              <Link href="/admin/enquiries" className="flex items-center gap-1.5 hover:text-ink">
                Enquiries
                {unread > 0 && (
                  <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-gold px-1.5 py-0.5 text-[10px] leading-none text-porcelain">
                    {unread}
                  </span>
                )}
              </Link>
              <Link href="/admin/newsletter" className="hover:text-ink">
                Newsletter
              </Link>
              <Link href="/admin/journal" className="hover:text-ink">
                Journal
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
