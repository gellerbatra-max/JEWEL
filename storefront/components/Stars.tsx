// Static star rating display (server-safe). `value` may be fractional.
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5 align-middle" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= full ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.3"
          className="text-gold"
          aria-hidden="true"
        >
          <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.9L12 17l-5.3 2.8 1-5.9L3.5 9.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  );
}
