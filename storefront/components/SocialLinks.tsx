// Social icon links for the masthead. Replace the placeholder hrefs with the
// brand's real profile URLs.
const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3-.04-1.3-.13-2.46-.13-2.44 0-4.11 1.49-4.11 4.22V9.9H7.7V13h2.73v8h3.07z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.3 3h3.3l-7.2 8.24L21.9 21h-6.6l-4.7-6.14L5.2 21H1.9l7.7-8.8L2.3 3h6.77l4.25 5.62L17.3 3zm-1.16 16h1.83L7.94 4.9H5.98l10.16 14.1z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-2.9v11.4a2.34 2.34 0 1 1-2.34-2.34c.16 0 .32.02.48.05v-2.95a5.34 5.34 0 0 0-.48-.02 5.28 5.28 0 1 0 5.28 5.28V8.9a7.13 7.13 0 0 0 4.16 1.33V7.28a4.28 4.28 0 0 1-3.15-1.46z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M21.6 7.2c-.23-.86-.9-1.53-1.76-1.76C18.25 5 12 5 12 5s-6.25 0-7.84.44c-.86.23-1.53.9-1.76 1.76C2 8.79 2 12 2 12s0 3.21.4 4.8c.23.86.9 1.53 1.76 1.76C5.75 19 12 19 12 19s6.25 0 7.84-.44a2.5 2.5 0 0 0 1.76-1.76C22 15.21 22 12 22 12s0-3.21-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z"
        />
      </svg>
    ),
  },
];

export function SocialLinks({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <div className={`items-center gap-3.5 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`transition-colors ${light ? "text-ink/70 hover:text-ink" : "text-stone hover:text-ink"}`}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}
