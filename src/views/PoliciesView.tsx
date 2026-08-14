import React, { useState } from 'react';
import { getPolicies, createPolicy, disablePolicy } from '../services/api';
import { Policy, PolicySeverity, PolicyCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ShieldCheck, Plus, AlertTriangle, CheckCircle2, History, X } from 'lucide-react';

interface PoliciesViewProps {
  onNavigate: (route: string) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>(getPolicies());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // New Policy Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PolicyCategory>('Human Approval');
  const [severity, setSeverity] = useState<PolicySeverity>('Critical');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('REQUIRE_HUMAN_REVIEW');

  const handleCreatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    try {
      const created = createPolicy(
        {
          name,
          category,
          severity,
          description,
          condition: condition || 'true',
          action,
        },
        user
      );

      setPolicies(getPolicies());
      setCreateModalOpen(false);
      showToast('Policy Created', `Policy ${created.id} "${created.name}" is now active.`, 'success');

      // Reset
      setName('');
      setDescription('');
      setCondition('');
    } catch (e) {
      showToast('Error', 'Could not create policy.', 'error');
    }
  };

  const handleConfirmDisable = () => {
    if (!selectedPolicyId || !user) return;
    try {
      disablePolicy(selectedPolicyId, user);
      setPolicies(getPolicies());
      showToast('Policy Disabled', `Policy ${selectedPolicyId} status set to Inactive.`, 'warning');
    } catch (e) {
      showToast('Error', 'Could not disable policy.', 'error');
    } finally {
      setDisableModalOpen(false);
      setSelectedPolicyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Compliance Policy Engine ({policies.length})</h3>
            <p className="text-xs text-slate-400">Configure guardrail policies, human approval conditions, and safety constraints.</p>
          </div>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Policy</span>
        </button>
      </div>

      {/* Regulatory Advice Disclaimer */}
      <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-200 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Disclaimer:</strong> Policy Engine rules are part of an independent product demonstration and do not constitute legal or financial regulatory advice.
        </span>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 space-y-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400">{policy.id}</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {policy.version}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      policy.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    ● {policy.status}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    policy.severity === 'Critical'
                      ? 'bg-red-950/60 text-red-300 border-red-500/40'
                      : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {policy.severity}
                </span>
              </div>

              <div>
                <h4
                  onClick={() => onNavigate(`/policies/${policy.id}`)}
                  className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {policy.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{policy.description}</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Rule Condition:</p>
                <code className="text-blue-300 font-mono text-[11px] block overflow-x-auto">{policy.condition}</code>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-500">
                Owner: {policy.ownerName}
              </span>

              <div className="flex items-center gap-2">
                {policy.status === 'Active' && (
                  <button
                    onClick={() => {
                      setSelectedPolicyId(policy.id);
                      setDisableModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 text-[11px] rounded transition-colors"
                  >
                    Disable
                  </button>
                )}
                <button
                  onClick={() => onNavigate(`/policies/${policy.id}`)}
                  className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-medium rounded transition-colors"
                >
                  Edit Rule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Policy Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-slide-up">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Compliance Policy</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePolicySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Policy Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High-value transaction verification"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Human Approval">Human Approval</option>
                    <option value="Communication Safety">Communication Safety</option>
                    <option value="Consent & Contact Preferences">Consent & Contact Preferences</option>
                    <option value="Data Access">Data Access</option>
                    <option value="Sensitive Attributes">Sensitive Attributes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as PolicySeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Describe what this policy enforces..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Rule Condition (DSL Expression)</label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. case.outstandingAmount > 50000"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 font-mono text-blue-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded shadow-lg shadow-blue-600/20"
                >
                  Create & Activate Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={disableModalOpen}
        onClose={() => setDisableModalOpen(false)}
        onConfirm={handleConfirmDisable}
        title="Disable Compliance Policy?"
        description="Disabling this policy will deactivate its safety check across all active agent runs."
        confirmText="Disable Policy"
        confirmVariant="danger"
        icon="warning"
      />
    </div>
  );
};
