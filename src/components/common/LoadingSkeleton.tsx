import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
}) => {
  return (
    <div
      style={{ width, height }}
      className={`bg-slate-800/60 rounded animate-pulse ${className}`}
    />
  );
};

export const SkeletonCard: React.FC<{ rows?: number; className?: string }> = ({
  rows = 3,
  className = '',
}) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
};

export const SkeletonMetric: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

export const SkeletonRow: React.FC<{ cols?: number; className?: string }> = ({
  cols = 5,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-slate-800/80 gap-4 ${className}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
  );
};
