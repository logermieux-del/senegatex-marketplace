const Y_PATH = 'M60,40 L190,300 M320,40 L190,300 M190,300 C184,345 214,362 196,408';
const WORD_PATH =
  'M710,210 L710,480 M800,480 L800,220 Q865,130 930,220 L930,480 M930,220 Q995,130 1060,220 L1060,480 M1060,220 L1060,40 M1710,210 L1710,480 M1800,40 L1800,480';

interface LogoProps {
  className?: string;
}

// Full "Yombal" wordmark — custom vector lettering (see brand identity).
export function Logo({ className = 'h-9 w-auto' }: LogoProps) {
  return (
    <svg viewBox="0 0 1880 600" className={className} aria-label="Yombal">
      <g stroke="#0F8B6D" strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={Y_PATH} />
        <circle cx={194} cy={460} r={62} fill="#0F8B6D" stroke="none" />
      </g>
      <g stroke="#1F2937" strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={WORD_PATH} />
        <circle cx={570} cy={350} r={140} />
        <circle cx={1200} cy={350} r={140} />
        <circle cx={1570} cy={350} r={140} />
      </g>
    </svg>
  );
}

// Y mark alone — for compact contexts (mobile header, favicon, app icon).
export function LogoIcon({ className = 'h-9 w-auto' }: LogoProps) {
  return (
    <svg viewBox="0 0 380 600" className={className} aria-label="Yombal">
      <g stroke="#0F8B6D" strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={Y_PATH} />
        <circle cx={194} cy={460} r={64} fill="#0F8B6D" stroke="none" />
      </g>
    </svg>
  );
}
