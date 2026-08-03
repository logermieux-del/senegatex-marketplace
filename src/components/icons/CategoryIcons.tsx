// Line-art icons, single 1.6px stroke, 64x64 viewBox — thin outline,
// rounded joins, one visual family for both category and feature icons.
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

/* ---------- Marketplace trust & service icons ---------- */

export const ShieldCheckIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 11l15 5.5v12c0 12-8 19.5-15 24.5-7-5-15-12.5-15-24.5v-12z" />
    <path d="M24 31l6 6 11-12" />
  </svg>
);

export const DeliveryBoxIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="20" y="25" width="26" height="21" rx="2" />
    <path d="M20 25l4-9h18l4 9" />
    <line x1="33" y1="25" x2="33" y2="46" />
    <line x1="6" y1="27" x2="16" y2="27" />
    <line x1="4" y1="33" x2="16" y2="33" />
    <line x1="7" y1="39" x2="16" y2="39" />
  </svg>
);

export const QualityCheckIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="27" cy="27" r="13" />
    <path d="M21 27.5l4.2 4.5L34 22" />
    <line x1="36.2" y1="36.2" x2="47" y2="47" strokeWidth={2.4} />
  </svg>
);

export const LiveBellIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 14c-5.5 0-9 4-9 9v7l-4 6h26l-4-6v-7c0-5-3.5-9-9-9z" />
    <path d="M28 40a4 4 0 0 0 8 0" />
    <path d="M42 21a12 12 0 0 1 0 12" strokeWidth={1.3} opacity={0.7} />
    <path d="M47 17a19 19 0 0 1 0 20" strokeWidth={1.1} opacity={0.4} />
  </svg>
);

export const LightningIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="32" cy="32" r="20" />
    <path d="M34 20l-11 15h8l-3 11 12-16h-8z" strokeLinejoin="round" />
  </svg>
);

export const SmartphoneAppIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="21" y="10" width="22" height="36" rx="3" />
    <line x1="21" y1="38" x2="43" y2="38" />
    <rect x="25" y="15" width="6" height="6" rx="1.3" />
    <rect x="33" y="15" width="6" height="6" rx="1.3" />
    <rect x="25" y="23" width="6" height="6" rx="1.3" />
    <rect x="33" y="23" width="6" height="6" rx="1.3" />
  </svg>
);

export const MapPinIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 12c-8 0-14 6.3-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.7-6-14-14-14z" />
    <circle cx="32" cy="26" r="5.5" />
  </svg>
);

export const HeadsetIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M17 33v-3a15 15 0 0 1 30 0v3" />
    <rect x="13" y="31" width="8" height="15" rx="3" />
    <rect x="43" y="31" width="8" height="15" rx="3" />
    <path d="M51 46v2a6 6 0 0 1-6 6h-5" />
  </svg>
);

/* ---------- Small inline icons ---------- */

export const PinIcon = ({ className = 'w-4 h-4' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M32 8c-9 0-16 7-16 16 0 12 16 32 16 32s16-20 16-32c0-9-7-16-16-16z" />
    <circle cx="32" cy="24" r="6" />
  </svg>
);

export const PhotoIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="10" y="14" width="44" height="36" rx="3" />
    <circle cx="23" cy="26" r="4.5" />
    <path d="M10 42l13-13 10 10 8-8 13 13" />
  </svg>
);

export const EmptyBoxIcon = ({ className = 'w-9 h-9' }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M10 24l22-10 22 10-22 10z" />
    <path d="M10 24v18l22 10 22-10V24" />
    <path d="M32 34v18" />
  </svg>
);
