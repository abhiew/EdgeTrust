import React from 'react';
import { getPolicies } from '../services/api';
import { ArrowLeft, ShieldCheck, History, AlertTriangle } from 'lucide-react';

interface PolicyDetailViewProps {
  policyId: string;
  onNavigate: (route: string) => void;
}

export const PolicyDetailView: React.FC<PolicyDetailViewProps> = ({ policyId, onNavigate }) => {
  const policies = getPolicies();
  const policy = policies.find((p) => p.id === policyId) || policies[0];

  return (
    <div className="space-y-6 animate-slide-up">
      <button
        onClick={() => onNavigate('/policies')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Policy Engine</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-400">{policy.id}</span>
              <h3 className="text-xl font-bold text-white">{policy.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ● {policy.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">{policy.description}</p>
          </div>

          <span className="px-3 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
            {policy.severity} Severity
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Rule DSL Condition & Execution Target
          </h4>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <p className="text-slate-400">Condition:</p>
            <code className="text-blue-300 font-mono text-xs block">{policy.condition}</code>
            <p className="text-slate-400 pt-2">Enforcement Action:</p>
            <code className="text-emerald-400 font-mono text-xs block">{policy.action}</code>
          </div>
        </div>

        {policy.history && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Version Audit History
            </h4>
            <div className="space-y-2 text-xs">
              {policy.history.map((h) => (
                <div key={h.version} className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between">
                  <div>
                    <p className="font-bold text-white">{h.version} — {h.changeNote}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Updated by {h.updatedBy}</p>
                  </div>
                  <span className="font-mono text-slate-400">{h.updatedAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
