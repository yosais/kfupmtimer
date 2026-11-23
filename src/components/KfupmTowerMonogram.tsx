interface KfupmTowerMonogramProps {
  className?: string;
}

/**
 * Minimalist architectural linework faithfully modeled on the genuine
 * faceted concrete KFUPM Clock/Water Tower in Dhahran.
 */
export function KfupmTowerMonogram({ className = 'w-10 h-10' }: KfupmTowerMonogramProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* True KFUPM Tower faceted silhouette: wider top crown tapering gracefully to shaft */}
      <path
        d="M19 10L24 7H40L45 10L43 22L40 31V57H24V31L21 22L19 10Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {/* Faceted vertical corner ridges */}
      <path
        d="M25 8L26.5 22L27.5 31V57"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      <path
        d="M39 8L37.5 22L36.5 31V57"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.45"
      />
      {/* Horizontal structural seam lines */}
      <line x1="21.2" y1="21.5" x2="42.8" y2="21.5" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
      <line x1="24" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="1.1" opacity="0.4" />
      {/* Signature clock face on the upper facet */}
      <circle cx="32" cy="26.5" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M32 24.8V26.5L33.4 27.3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ground line */}
      <line x1="16" y1="57" x2="48" y2="57" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}
