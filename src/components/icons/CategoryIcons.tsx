// Line-art icons, single 1.6px stroke, 64x64 viewBox — style referenced
// from a minimaliste space icon set (thin outline, rounded joins).
// Size is controlled entirely by the caller via `className` so these
// drop cleanly into an IconBadge or an inline sidebar row.

interface IconProps {
  className?: string;
}

const base = {
  viewBox: '0 0 64 64',
  fill: 'none' as const,
  xmlns: 'http://www.w3.org/2000/svg',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ---------- Marketplace category icons ---------- */

export const ElectronicsIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="20" y="14" width="24" height="36" rx="3" />
    <line x1="20" y1="42" x2="44" y2="42" />
    <circle cx="32" cy="46" r="1.6" fill="currentColor" stroke="none" />
    <line x1="27" y1="18" x2="37" y2="18" />
  </svg>
);

export const FurnitureIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M20 30v-6a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6" />
    <rect x="17" y="30" width="30" height="12" rx="2" />
    <line x1="20" y1="42" x2="20" y2="49" />
    <line x1="44" y1="42" x2="44" y2="49" />
    <line x1="17" y1="36" x2="47" y2="36" />
  </svg>
);

export const VehiclesIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M16 38v-5a3 3 0 0 1 2-2.8l3-1 3-6a3 3 0 0 1 2.7-1.7h10.6a3 3 0 0 1 2.7 1.7l3 6 3 1a3 3 0 0 1 2 2.8v5" />
    <path d="M16 38h32v3a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1H22v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3z" />
    <circle cx="23" cy="38" r="3.4" />
    <circle cx="41" cy="38" r="3.4" />
    <line x1="24" y1="28" x2="40" y2="28" />
  </svg>
);

export const ClothingIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M25 16c1.5 2 3.7 3 7 3s5.5-1 7-3l7 4-3.5 6-3.5-2v23a2 2 0 0 1-2 2H27a2 2 0 0 1-2-2V20l-3.5 2L18 16l7-4z" />
  </svg>
);

export const ServicesIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="16" y="24" width="32" height="20" rx="3" />
    <path d="M25 24v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" />
    <line x1="16" y1="33" x2="48" y2="33" />
    <line x1="30" y1="33" x2="30" y2="37" />
    <line x1="34" y1="33" x2="34" y2="37" />
  </svg>
);

export const AllCategoriesIcon = ({ className = 'w-7 h-7' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="16" y="16" width="12" height="12" rx="2" />
    <rect x="36" y="16" width="12" height="12" rx="2" />
    <rect x="16" y="36" width="12" height="12" rx="2" />
    <rect x="36" y="36" width="12" height="12" rx="2" />
  </svg>
);

/* ---------- Space-themed decorative icons ---------- */

export const AstronautIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="32" cy="23" r="9" />
    <path d="M25.5 20.5c1.5-1.4 3.9-2.2 6.5-2.2s5 .8 6.5 2.2" strokeWidth={1.2} opacity={0.5} />
    <path d="M23 33c-2.5.6-4.5 2.6-4.5 5.4V44a3 3 0 0 0 3 3h21a3 3 0 0 0 3-3v-5.6c0-2.8-2-4.8-4.5-5.4" />
    <path d="M23 33a9 9 0 0 0 18 0" />
    <line x1="18.5" y1="38" x2="11" y2="35" />
    <line x1="45.5" y1="38" x2="53" y2="35" />
    <path d="M27 47l-2 9M37 47l2 9" />
  </svg>
);

export const SpaceshipIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="26" y="20" width="12" height="18" rx="3" />
    <circle cx="32" cy="27" r="2.6" />
    <path d="M26 24h-8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8" />
    <path d="M38 24h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8" />
    <path d="M29 38l-2.5 7M35 38l2.5 7" />
  </svg>
);

export const TelescopeIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <line x1="22" y1="46" x2="44" y2="20" strokeWidth={2.8} />
    <circle cx="22" cy="46" r="3.2" />
    <circle cx="44" cy="20" r="5" />
    <line x1="27" y1="40" x2="17" y2="54" />
    <line x1="11" y1="54" x2="23" y2="54" />
  </svg>
);

export const RocketIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 9c5 4 7 11 7 20 0 6-1.5 10-2.5 12h-9C26.5 39 25 35 25 29c0-9 2-16 7-20z" />
    <circle cx="32" cy="24" r="3.4" />
    <path d="M25 33c-4 1-6 4-6 9l6-3z" />
    <path d="M39 33c4 1 6 4 6 9l-6-3z" />
    <path d="M28.5 41h7l-1.5 5a2 2 0 0 1-2 1.5h0a2 2 0 0 1-2-1.5z" />
    <path d="M29 48c-1 2-1 4 0 6M32 48v6M35 48c1 2 1 4 0 6" strokeWidth={1.3} opacity={0.7} />
  </svg>
);

export const UFOIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M20 34c0-7.7 5.4-14 12-14s12 6.3 12 14" />
    <ellipse cx="32" cy="36" rx="18" ry="5.5" />
    <ellipse cx="32" cy="36" rx="9" ry="2.4" opacity={0.5} />
    <circle cx="24" cy="30" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="32" cy="28" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="40" cy="30" r="1.3" fill="currentColor" stroke="none" />
    <path d="M26 41l-3 9M32 42v9M38 41l3 9" strokeWidth={1.3} opacity={0.7} />
  </svg>
);

export const PlanetIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="30" cy="30" r="11" />
    <circle cx="34" cy="25" r="1.3" fill="currentColor" stroke="none" />
    <ellipse cx="30" cy="30" rx="21" ry="6.5" transform="rotate(-22 30 30)" />
  </svg>
);

export const AlienIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 15c-6 0-10 5-10 11 0 4 2 7 4 9h12c2-2 4-5 4-9 0-6-4-11-10-11z" />
    <ellipse cx="27.5" cy="25" rx="2.6" ry="3.6" />
    <ellipse cx="36.5" cy="25" rx="2.6" ry="3.6" />
    <rect x="24" y="37" width="16" height="14" rx="3" />
    <line x1="20" y1="41" x2="13" y2="39" />
    <line x1="44" y1="41" x2="51" y2="39" />
    <path d="M28 51l-1 6M36 51l1 6" strokeWidth={1.3} />
  </svg>
);

export const SatelliteDishIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="22" cy="18" r="2.4" fill="currentColor" stroke="none" />
    <line x1="22" y1="21" x2="22" y2="44" />
    <line x1="15" y1="48" x2="29" y2="48" />
    <line x1="22" y1="44" x2="22" y2="48" />
    <path d="M28 22a11 11 0 0 1 0 14" strokeWidth={1.4} opacity={0.75} />
    <path d="M33 16a20 20 0 0 1 0 26" strokeWidth={1.2} opacity={0.4} />
  </svg>
);

export const RoverIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="18" y="30" width="28" height="12" rx="3" />
    <circle cx="23" cy="45" r="4" />
    <circle cx="32" cy="45" r="4" />
    <circle cx="41" cy="45" r="4" />
    <line x1="26" y1="30" x2="26" y2="24" />
    <line x1="38" y1="30" x2="38" y2="24" />
    <circle cx="26" cy="21" r="2.6" />
    <circle cx="38" cy="21" r="2.6" />
    <path d="M23 20a5 5 0 0 1 6-3M35 17a5 5 0 0 1 6 3" strokeWidth={1.2} opacity={0.6} />
  </svg>
);
