import { isAuthed } from "@/lib/admin-auth";
import { getAllCustomers } from "@/lib/customer-store";

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(): Promise<Response> {
  if (!(await isAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const customers = await getAllCustomers();
  const header = ["name", "email", "phone", "via", "emailVerified", "savedCount", "createdAt"];
  const rows = customers.map((c) =>
    [c.name, c.email, c.phone, c.via, c.emailVerified ? "yes" : "no", c.savedCount, c.createdAt]
      .map(cell)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="taygerian-customers.csv"`,
      "cache-control": "no-store",
    },
  });
}
