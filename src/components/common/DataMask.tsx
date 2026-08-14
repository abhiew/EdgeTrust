import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface DataMaskProps {
  value: string;
  maskedValue: string;
  label?: string;
}

export const DataMask: React.FC<DataMaskProps> = ({ value, maskedValue, label }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">
      {label && <span className="text-slate-400 font-sans font-medium mr-1">{label}:</span>}
      <span>{revealed ? value : maskedValue}</span>
      <button
        onClick={() => setRevealed(!revealed)}
        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors ml-1"
        title={revealed ? 'Hide sensitive detail' : 'Temporarily unmask (Demo Audit Logged)'}
      >
        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
