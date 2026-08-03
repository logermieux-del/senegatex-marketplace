// Y mark: straight left arm, right arm with top hook, tapered drop stem.
const Y_ARMS = 'M60,40 L190,280 M360,40 Q375,20 355,70 L190,280';
const Y_STEM = 'M190,280 L178,400';

interface LogoProps {
  className?: string;
}

// Y mark alone — the app icon, used everywhere: mobile header, favicon,
// app icon, avatars, loading spinner.
export function LogoIcon({ className = 'h-9 w-auto' }: LogoProps) {
  return (
    <svg viewBox="0 0 380 420" className={className} aria-label="Yembal">
      <g stroke="#0F8B6D" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={Y_ARMS} />
        <path d={Y_STEM} />
      </g>
    </svg>
  );
}

// Full "Yembal" wordmark — Y mark + real Plus Jakarta Sans type (see brand identity).
export function Logo({ className = 'h-9 w-auto' }: LogoProps) {
  return (
    <span className={className}>
      <span className="inline-flex items-center h-full">
        <svg viewBox="0 0 380 420" className="h-full w-auto flex-shrink-0" aria-hidden="true">
          <g stroke="#0F8B6D" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={Y_ARMS} />
            <path d={Y_STEM} />
          </g>
        </svg>
        <span className="font-display font-extrabold text-neutral-900 tracking-tight leading-none -ml-0.5 text-3xl">
          embal
        </span>
      </span>
    </span>
  );
}
