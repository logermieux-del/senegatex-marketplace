'use client';

interface IconBadgeProps {
  children: React.ReactNode;
  size?: number;
  variant?: 'default' | 'accent';
  className?: string;
}

// Puffy circular badge: soft light gradient + drop shadow, matching
// the reference icon-set look (white-to-grey sphere behind a line icon).
export function IconBadge({ children, size = 72, variant = 'default', className = '' }: IconBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 icon-badge ${
        variant === 'accent' ? 'icon-badge-accent' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
