import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

function CardRoot({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-accent-200 p-6
        transition-all duration-200
        ${hoverable ? 'hover:shadow-lg hover:border-primary-200 cursor-pointer' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`text-accent-700 ${className}`}>{children}</div>;
}

function CardFooter({ children, align = 'right' }: CardFooterProps) {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <div className={`flex ${alignClass} gap-3 mt-6 pt-6 border-t border-accent-200`}>
      {children}
    </div>
  );
}

// Compose as static properties
CardRoot.Header = CardHeader;
CardRoot.Body = CardBody;
CardRoot.Footer = CardFooter;

export const Card = CardRoot;
export { CardHeader, CardBody, CardFooter };
