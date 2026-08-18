"use client";

import { usePathname } from "next/navigation";

// Renders the storefront chrome (Header / Footer) everywhere except the /admin
// Manage area, which supplies its own top bar and layout.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
