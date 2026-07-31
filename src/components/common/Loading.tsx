import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeStyles = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function Loading({ message, size = 'md', fullScreen = false }: LoadingProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizeStyles[size]}
          border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin
        `}
      />
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">{spinner}</div>
      </div>
    );
  }

  return spinner;
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = 'h-4 w-full', count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`bg-gray-200 rounded animate-pulse ${className}`} />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <Skeleton className="h-40 w-full rounded" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-8 flex-1 rounded" />
            <Skeleton className="h-8 flex-1 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
