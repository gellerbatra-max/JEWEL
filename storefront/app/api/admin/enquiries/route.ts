import { isAuthed } from "@/lib/admin-auth";
import { getEnquiries } from "@/lib/enquiry-store";

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(): Promise<Response> {
  if (!(await isAuthed())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const list = await getEnquiries();
  const header = [
    "createdAt",
    "type",
    "productTitle",
    "productSku",
    "name",
    "contact",
    "recipientName",
    "recipientEmail",
    "message",
    "source",
    "medium",
    "campaign",
    "referrer",
    "landingPath",
    "read",
  ];
  const rows = list.map((e) =>
    [
      e.createdAt,
      e.type,
      e.productTitle,
      e.productSku,
      e.name,
      e.contact,
      e.recipientName,
      e.recipientEmail,
      e.message,
      e.source,
      e.medium,
      e.campaign,
      e.referrer,
      e.landingPath,
      e.read ? "read" : "unread",
    ]
      .map(cell)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="taygerian-enquiries.csv"`,
      "cache-control": "no-store",
    },
  });
}
