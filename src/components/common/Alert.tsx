import React from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
}

const typeStyles: Record<AlertType, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ️',
  },
};

export function Alert({
  type,
  title,
  message,
  children,
  onClose,
  dismissible = true,
}: AlertProps) {
  const styles = typeStyles[type];

  return (
    <div className={`${styles.bg} border ${styles.border} ${styles.text} px-4 py-4 rounded-lg flex gap-3`}>
      <span className="text-lg flex-shrink-0">{styles.icon}</span>

      <div className="flex-1">
        {title && <p className="font-bold mb-1">{title}</p>}
        {message && <p>{message}</p>}
        {children && <div>{children}</div>}
      </div>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 font-bold hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}
