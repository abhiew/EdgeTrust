import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logAuditEvent } from '../../services/auditLogger';

interface DataMaskProps {
  value: string;
  maskedValue: string;
  label?: string;
}

export const DataMask: React.FC<DataMaskProps> = ({ value, maskedValue, label }) => {
  const { user } = useAuth();
  const [revealed, setRevealed] = useState(false);

  const handleToggleReveal = () => {
    const nextRevealed = !revealed;
    setRevealed(nextRevealed);

    if (nextRevealed && user) {
      logAuditEvent({
        actorId: user.id,
        actorName: user.name,
        role: user.role,
        eventType: 'data_unmasked',
        resourceType: 'PII_Field',
        resourceId: label || 'Sensitive_Attribute',
        severity: 'Warning',
        outcome: 'Success',
        details: `Operator unmasked sensitive field "${label || 'PII'}" in Case Workbench.`,
      });
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
      {label && <span className="text-slate-400 font-sans font-medium mr-1">{label}:</span>}
      <span>{revealed ? value : maskedValue}</span>
      <button
        onClick={handleToggleReveal}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors ml-1"
        title={revealed ? 'Hide sensitive detail' : 'Temporarily unmask (Demo Audit Logged)'}
      >
        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
