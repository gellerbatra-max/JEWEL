import Link from "next/link";
import { JournalForm } from "@/app/admin/JournalForm";

export default function NewJournalPage() {
  return (
    <div className="mx-auto max-w-[760px]">
      <Link
        href="/admin/journal"
        className="text-[11px] tracking-[0.1em] uppercase text-stone hover:text-ink"
      >
        ← The Journal
      </Link>
      <h1 className="mb-8 mt-3 font-display text-3xl text-ink">New journal entry</h1>
      <JournalForm />
    </div>
  );
}
