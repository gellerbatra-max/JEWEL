export function FacetMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="60,20 140,20 180,60 180,140 140,180 60,180 20,140 20,60"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      />
      <polygon
        points="70,40 130,40 160,70 160,130 130,160 70,160 40,130 40,70"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        opacity="0.75"
      />
    </svg>
  );
}
