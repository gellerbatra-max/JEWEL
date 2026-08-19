import type { ReactNode } from "react";

// Reassurance strip shown at the foot of every product page (below the
// accordion), as a 2x2 icon + label grid in the house style (hairline + gold).

const IconWarranty = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M12 3l7 3v5.5c0 4.3-3 7.4-7 8.8-4-1.4-7-4.5-7-8.8V6l7-3z" />
    <path d="M9 11.8l2 2 4-4" />
  </svg>
);
const IconExchange = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M16.5 3.5L20 7l-3.5 3.5" /><path d="M20 7H9a4.5 4.5 0 0 0-4.5 4.5" />
    <path d="M7.5 20.5L4 17l3.5-3.5" /><path d="M4 17h11a4.5 4.5 0 0 0 4.5-4.5" />
  </svg>
);
const IconGlobe = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18" />
    <path d="M12 3c2.6 2.7 3.9 5.8 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.8-3.9-9S9.4 5.7 12 3z" />
  </svg>
);
const IconParcel = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <rect x="3.5" y="6.5" width="17" height="12" rx="1" /><path d="M3.5 10.5h17" /><path d="M12 6.5v12" />
  </svg>
);

function Item({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <li className="flex flex-col items-center gap-2 px-2 text-center">
      <span className="text-gold" aria-hidden="true">{icon}</span>
      <span className="text-[9.5px] sm:text-[10px] tracking-[0.1em] uppercase text-ink leading-[1.5] max-w-[12ch]">
        {label}
      </span>
    </li>
  );
}

export function ProductAssurances() {
  return (
    <div className="mt-8 border-y border-line py-8">
      <ul className="grid grid-cols-4 divide-x divide-line">
        <Item icon={IconWarranty} label="Lifetime Warranty" />
        <Item icon={IconExchange} label="Lifetime Buy Back" />
        <Item icon={IconGlobe} label="Worldwide Delivery" />
        <Item icon={IconParcel} label="Discreetly Packaged" />
      </ul>
    </div>
  );
}
