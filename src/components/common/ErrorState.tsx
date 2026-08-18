import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  onBack,
  backLabel = 'Go Back',
  className = '',
}) => {
  return (
    <div
      className={`bg-slate-900 border border-red-500/30 rounded-xl p-8 max-w-lg mx-auto text-center space-y-4 shadow-xl ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        {onBack && (
          <Button variant="secondary" size="sm" onClick={onBack} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            {backLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
