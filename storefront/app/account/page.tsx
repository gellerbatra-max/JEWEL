import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { getSaved } from "@/lib/customer-store";
import { getEnquiries } from "@/lib/enquiry-store";
import { ENQUIRY_LABEL } from "@/lib/enquiry";
import { formatPrice } from "@/lib/products";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");

  const [saved, allEnquiries] = await Promise.all([getSaved(customer.id), getEnquiries()]);
  const email = customer.email.toLowerCase();
  const phone = (customer.phone || "").replace(/[^\d]/g, "");
  const mine = allEnquiries.filter((e) => {
    const byEmail =
      !!email && (e.contact.toLowerCase().includes(email) || e.recipientEmail.toLowerCase() === email);
    const byPhone = !!phone && e.contact.replace(/[^\d]/g, "").includes(phone);
    return byEmail || byPhone;
  });
  const contactLine = customer.email || (customer.phone ? `WhatsApp · +${customer.phone}` : "");

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold">Your account</p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Welcome, {customer.name.split(" ")[0] || "there"}
          </h1>
          <p className="mt-2 text-[14px] text-stone">{contactLine}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="border border-line px-5 py-2.5 text-[11px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
          >
            Log out
          </button>
        </form>
      </div>

      {/* Verify banner — only for email accounts */}
      {!!customer.email && !customer.emailVerified && (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border border-gold/40 bg-gold/[0.06] px-5 py-4">
          <p className="text-[14px] text-ink">Please verify your email to secure your account.</p>
          <Link
            href="/account/verify"
            className="bg-ink px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-porcelain transition-colors hover:bg-gold"
          >
            Verify now
          </Link>
        </div>
      )}

      {/* Favourites */}
      <section className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">Your favourites</h2>
          <Link href="/wishlist" className="text-[11px] tracking-[0.12em] uppercase text-stone hover:text-ink">
            View all →
          </Link>
        </div>
        {saved.length === 0 ? (
          <p className="text-[15px] text-stone">
            Nothing saved yet. Tap the heart on any piece to keep it here.{" "}
            <Link href="/jewellery" className="text-gold underline underline-offset-2">
              Browse the collection
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {saved.map((item) => (
              <Link key={item.handle} href={`/products/${item.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-cloud">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <p className="mt-2 text-center font-display text-[15px] text-ink group-hover:text-gold">
                  {item.title}
                </p>
                <p className="text-center text-[12px] tabular-nums text-stone">
                  {item.oneOfAKind ? "On request" : formatPrice(item.price, item.currency)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Requests / interaction history */}
      <section className="mb-14">
        <h2 className="mb-6 font-display text-2xl text-ink">Your requests</h2>
        {mine.length === 0 ? (
          <p className="text-[15px] text-stone">
            Your enquiries, appointments, and commission requests will appear here.
          </p>
        ) : (
          <div className="divide-y divide-line border-y border-line">
            {mine.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3.5 text-[14px]">
                <span className="text-[10px] tracking-[0.12em] uppercase text-sapphire">
                  {ENQUIRY_LABEL[e.type]}
                </span>
                {e.productTitle && <span className="text-ink">{e.productTitle}</span>}
                <span className="ml-auto tabular-nums text-stone">{when(e.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders (future) */}
      <section>
        <h2 className="mb-6 font-display text-2xl text-ink">Your orders</h2>
        <p className="text-[15px] text-stone">
          Once secure online payment is available, your purchases and their status will appear here.
          For now, every piece is arranged personally —{" "}
          <Link href="/how-to-order" className="text-gold underline underline-offset-2">
            see how ordering works
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
