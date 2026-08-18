import React from 'react';
import { Inbox, FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 ${className}`}
    >
      <div className="p-3.5 bg-slate-800/80 rounded-2xl text-slate-400 border border-slate-700/60">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
