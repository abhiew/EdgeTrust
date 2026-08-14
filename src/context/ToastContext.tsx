import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-xl border flex items-start justify-between gap-3 text-sm transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-slate-900 border-red-500/40 text-red-300'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/40 text-amber-300'
                : toast.type === 'ai'
                ? 'bg-slate-900 border-purple-500/40 text-purple-300'
                : 'bg-slate-900 border-blue-500/40 text-blue-300'
            }`}
          >
            <div>
              <p className="font-semibold">{toast.title}</p>
              {toast.message && <p className="text-xs mt-1 text-slate-300">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white font-mono text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
