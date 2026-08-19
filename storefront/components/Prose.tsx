import type { ReactNode } from "react";

// Long-form container for policy / info copy. Styling lives in the `.prose-lux`
// block in globals.css so pages can just drop in semantic <h2>/<p>/<ul> markup
// and stay visually consistent.
export function Prose({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`prose-lux mx-auto max-w-[720px] ${className}`}>{children}</div>;
}
