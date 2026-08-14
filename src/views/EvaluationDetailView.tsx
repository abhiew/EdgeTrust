import React, { useState } from 'react';
import { mockEvaluationRunComparison } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ArrowLeft, CheckCircle2, TrendingUp, History, ShieldCheck, Zap } from 'lucide-react';

interface EvaluationDetailViewProps {
  evaluationId: string;
  onNavigate: (route: string) => void;
}

export const EvaluationDetailView: React.FC<EvaluationDetailViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { v230, v241 } = mockEvaluationRunComparison;

  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [rollbackModalOpen, setRollbackModalOpen] = useState(false);

  const handleConfirmPromote = () => {
    showToast('Promoted to Production Staging', 'Collections Agent v2.4.1 promoted to staging environment.', 'success');
    setPromoteModalOpen(false);
  };

  const handleConfirmRollback = () => {
    showToast('Rollback Executed', 'Collections Agent rolled back to v2.3.0 release candidate.', 'warning');
    setRollbackModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <button
        onClick={() => onNavigate('/evaluations')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Evaluation Studio</span>
      </button>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-xs border border-blue-500/30">
              BENCHMARK COMPARISON
            </span>
            <h3 className="text-xl font-bold text-white">Collections Conversation Agent Version Evaluation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side performance comparison of Agent v2.3.0 vs Agent v2.4.1 across 100 benchmark scenarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRollbackModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Rollback to v2.3.0</span>
          </button>

          <button
            onClick={() => setPromoteModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Promote v2.4.1 to Staging</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Metrics Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <h4 className="text-sm font-semibold text-white">Evaluation Benchmark Metrics Breakdown</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">EVALUATION METRIC</th>
                <th className="py-3 px-4 bg-slate-950/40 text-slate-400 font-bold">PREVIOUS (AGENT v2.3.0)</th>
                <th className="py-3 px-4 bg-blue-950/40 text-blue-300 font-bold">RELEASE CANDIDATE (AGENT v2.4.1)</th>
                <th className="py-3 px-4 text-right">DELTA CHANGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Overall Pass Rate</td>
                <td className="py-3.5 px-4 text-slate-400">{v230.passRatePercent}%</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{v241.passRatePercent}%</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">+9.0%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Policy Compliance Score</td>
                <td className="py-3.5 px-4 text-slate-400">{v230.policyCompliancePercent}%</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{v241.policyCompliancePercent}%</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">+7.0%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Evidence Grounding Score</td>
                <td className="py-3.5 px-4 text-slate-400">{v230.evidenceGroundingPercent}%</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{v241.evidenceGroundingPercent}%</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">+8.0%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Correct Escalation Rate</td>
                <td className="py-3.5 px-4 text-slate-400">{v230.escalationAccuracyPercent}%</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{v241.escalationAccuracyPercent}%</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">+8.0%</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-sans font-semibold text-white">Cost per Case Execution</td>
                <td className="py-3.5 px-4 text-slate-400">₹{v230.costPerCaseInr.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-purple-300 font-bold">₹{v241.costPerCaseInr.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">-₹0.50 (-17.2%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        onConfirm={handleConfirmPromote}
        title="Promote Agent v2.4.1 to Staging?"
        description="This will deploy Agent v2.4.1 to the production staging workspace for live canary verification."
        confirmText="Promote Release"
        confirmVariant="primary"
        icon="check"
      />

      <ConfirmationModal
        isOpen={rollbackModalOpen}
        onClose={() => setRollbackModalOpen(false)}
        onConfirm={handleConfirmRollback}
        title="Rollback Agent to v2.3.0?"
        description="Are you sure you want to rollback the active release candidate?"
        confirmText="Confirm Rollback"
        confirmVariant="warning"
        icon="warning"
      />
    </div>
  );
};
