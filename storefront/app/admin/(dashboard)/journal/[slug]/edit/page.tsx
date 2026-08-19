import Link from "next/link";
import { notFound } from "next/navigation";
import { JournalForm } from "@/app/admin/JournalForm";
import { getPost } from "@/lib/journal-store";

export default async function EditJournalPage(
  props: PageProps<"/admin/journal/[slug]/edit">
) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-[760px]">
      <Link
        href="/admin/journal"
        className="text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink"
      >
        ← The Journal
      </Link>
      <h1 className="mb-8 mt-3 font-display text-3xl text-ink">Edit entry</h1>
      <JournalForm post={post} />
    </div>
  );
}
