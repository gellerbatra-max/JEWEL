import { isAuthed } from "@/lib/admin-auth";
import { getSubscribers } from "@/lib/newsletter-store";

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(): Promise<Response> {
  if (!(await isAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const subs = await getSubscribers();
  const header = ["email", "source", "medium", "campaign", "referrer", "landingPath", "createdAt"];
  const rows = subs.map((s) =>
    [s.email, s.source, s.medium, s.campaign, s.referrer, s.landingPath, s.createdAt].map(cell).join(",")
  );
  const csv = [header.join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="taygerian-subscribers.csv"`,
      "cache-control": "no-store",
    },
  });
}
