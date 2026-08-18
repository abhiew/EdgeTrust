import React, { useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  icon?: 'warning' | 'shield' | 'check';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm Action',
  confirmVariant = 'danger',
  icon = 'warning',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-slide-up"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              confirmVariant === 'danger'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : confirmVariant === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}
          >
            {icon === 'warning' && <AlertTriangle className="w-6 h-6" />}
            {icon === 'shield' && <ShieldAlert className="w-6 h-6" />}
            {icon === 'check' && <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div className="space-y-1 pr-6">
            <h3 id="confirmation-modal-title" className="text-base font-semibold text-white">
              {title}
            </h3>
            <p id="confirmation-modal-description" className="text-xs text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-0.5">Audit Governance Note:</p>
          Executing this sensitive operational action will record your user identity, timestamp, and correlation ID in the append-only audit trail.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
