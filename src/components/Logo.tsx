import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
  className = '',
  variant = 'full',
  size = 'md'
}: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon/Logo */}
      {(variant === 'full' || variant === 'icon') && (
        <div className={`${sizes[size]} relative flex-shrink-0`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Define gradients */}
            <defs>
              <linearGradient id="baobabGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Baobab roots - abstract and elegant */}
            <g>
              {/* Left root */}
              <path
                d="M 30 60 Q 15 75 10 90"
                stroke="url(#baobabGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Center root */}
              <path
                d="M 50 65 L 50 92"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Right root */}
              <path
                d="M 70 60 Q 85 75 90 90"
                stroke="url(#baobabGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Baobab trunk - stylized and modern */}
            <ellipse
              cx="50"
              cy="45"
              rx="10"
              ry="16"
              fill="url(#baobabGradient)"
              opacity="0.9"
            />

            {/* Baobab canopy - abstract leaves forming a crown */}
            <g>
              {/* Top circle */}
              <circle
                cx="50"
                cy="18"
                r="14"
                fill="#2563eb"
                opacity="0.85"
              />

              {/* Left leaf cluster */}
              <ellipse
                cx="25"
                cy="30"
                rx="10"
                ry="12"
                fill="#ea580c"
                opacity="0.8"
                transform="rotate(-25 25 30)"
              />

              {/* Right leaf cluster */}
              <ellipse
                cx="75"
                cy="30"
                rx="10"
                ry="12"
                fill="#ea580c"
                opacity="0.8"
                transform="rotate(25 75 30)"
              />

              {/* Accent highlights - delivery/movement concept */}
              <circle cx="50" cy="15" r="3" fill="#ffffff" opacity="0.9" />
              <circle cx="35" cy="28" r="2.5" fill="#ffffff" opacity="0.8" />
              <circle cx="65" cy="28" r="2.5" fill="#ffffff" opacity="0.8" />
            </g>

            {/* Subtle delivery element - pin at bottom */}
            <path
              d="M 50 95 L 48 88 Q 50 86 52 88 L 50 95"
              fill="#ea580c"
              opacity="0.7"
            />
          </svg>
        </div>
      )}

      {/* Text */}
      {(variant === 'full' || variant === 'text') && (
        <div className="flex flex-col leading-none">
          <div className={`font-display font-bold ${textSizes[size]} text-black`}>
            Afro <span className="text-primary-600">Sport</span>
          </div>
          {size !== 'sm' && (
            <div className="text-xs text-secondary-600 font-medium">
              Livraison Premium
            </div>
          )}
        </div>
      )}
    </div>
  );
}
