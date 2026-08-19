// Client-safe Journal types (no fs). The store lives in ./journal-store.ts.

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string; // plain text; blank lines separate paragraphs
  cover: string; // public image path ("" if none)
  date: string; // ISO date (YYYY-MM-DD)
  published: boolean;
};

// Split a post body into paragraphs for rendering.
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function formatPostDate(date: string): string {
  try {
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
