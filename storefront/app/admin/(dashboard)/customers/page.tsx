import { getAllCustomers } from "@/lib/customer-store";
import { CustomerRemove } from "@/app/admin/CustomerRemove";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function CustomersPage() {
  const customers = await getAllCustomers();
  const verified = customers.filter((c) => c.emailVerified).length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Customers</h1>
          <p className="mt-1 text-sm text-stone">
            {customers.length} registered · {verified} verified
          </p>
        </div>
        {customers.length > 0 && (
          <a
            href="/api/admin/customers"
            className="border border-line px-4 py-2 text-[12px] tracking-[0.12em] uppercase text-ink transition-colors hover:border-ink"
          >
            ↓ Export CSV
          </a>
        )}
      </div>

      <div className="mb-6 border border-line bg-white/60 px-4 py-3 text-sm text-stone">
        People who created an account. Their saved pieces and enquiries appear in their own account
        page. You own this list — export it any time.
      </div>

      {customers.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="text-ink">No customers yet.</p>
          <p className="mt-1 text-sm text-stone">
            Accounts created from the storefront will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-line bg-white text-[11px] tracking-[0.1em] uppercase text-stone">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Saved</th>
                <th className="px-4 py-3 font-normal">Joined</th>
                <th className="px-4 py-3 font-normal text-right">—</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-line-soft bg-white last:border-0">
                  <td className="px-4 py-3 text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-stone">
                    {c.email || (c.phone ? `WhatsApp · +${c.phone}` : "—")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] uppercase tracking-[0.1em] ${
                        c.via === "whatsapp" ? "text-sapphire" : c.emailVerified ? "text-gold" : "text-stone"
                      }`}
                    >
                      {c.via === "whatsapp" ? "WhatsApp" : c.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-stone">{c.savedCount}</td>
                  <td className="px-4 py-3 tabular-nums text-stone">{when(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <CustomerRemove id={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
