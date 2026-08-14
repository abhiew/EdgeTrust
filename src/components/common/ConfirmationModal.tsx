import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-slide-up">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
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
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-0.5">Audit Governance Note:</p>
          Executing this sensitive operational action will record your user identity, timestamp, and correlation ID in the append-only audit trail.
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-lg flex items-center gap-2 transition-colors ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                : confirmVariant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
