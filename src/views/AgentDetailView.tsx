import React, { useState } from 'react';
import { getAgentById, pauseAgent, resumeAgent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Bot, Shield, Play, Pause, History, ArrowLeft, CheckCircle2, AlertTriangle, Layers, Key } from 'lucide-react';

interface AgentDetailViewProps {
  agentId: string;
  onNavigate: (route: string) => void;
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({ agentId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const agent = getAgentById(agentId);
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Runs' | 'Evaluations' | 'Policies' | 'Versions' | 'Access' | 'Incidents'
  >('Overview');

  const [rollbackModalOpen, setRollbackModalOpen] = useState(false);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);

  if (!agent) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-slate-400">Agent not found.</p>
        <button
          onClick={() => onNavigate('/agents')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg"
        >
          Back to Agent Registry
        </button>
      </div>
    );
  }

  const handleConfirmRollback = () => {
    showToast('Version Rollback Simulated', `Agent ${agent.name} rolled back to previous stable release. Audit event logged.`, 'warning');
    setRollbackModalOpen(false);
  };

  const handleConfirmPause = () => {
    if (!user) return;
    pauseAgent(agent.id, user);
    showToast('Agent Paused', `Agent ${agent.name} status updated to Paused.`, 'warning');
    setPauseModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/agents')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Agent Registry</span>
      </button>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-white">{agent.name}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ● {agent.status}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Current: {agent.currentVersion}
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {agent.riskTier} Risk Tier
            </span>
          </div>
          <p className="text-xs text-slate-400">{agent.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setRollbackModalOpen(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Rollback Version</span>
          </button>

          <button
            onClick={() => setPauseModalOpen(true)}
            className="px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause Agent</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        {(['Overview', 'Runs', 'Evaluations', 'Policies', 'Versions', 'Access', 'Incidents'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h4 className="text-sm font-semibold text-white">Agent Specification & Architecture</h4>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Owner:</span>
                <p className="font-semibold text-white mt-0.5">{agent.ownerName}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Business Function:</span>
                <p className="font-semibold text-white mt-0.5">{agent.businessFunction}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Foundation Model:</span>
                <p className="font-mono text-blue-300 mt-0.5">{agent.modelProvider}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Data Sensitivity Level:</span>
                <p className="font-semibold text-amber-300 mt-0.5">{agent.dataSensitivity}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-300">Connected Tools & Capabilities:</h5>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((t) => (
                  <span key={t} className="bg-blue-950/40 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-300">Data Sources & RAG Knowledge Base:</h5>
              <div className="flex flex-wrap gap-2">
                {agent.dataSources.map((ds) => (
                  <span key={ds} className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg text-xs">
                    {ds}
                  </span>
                ))}
              </div>
            </div>

            {agent.knownLimitations && (
              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-lg space-y-2">
                <h5 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Known Operational Boundaries & Limitations:</span>
                </h5>
                <ul className="list-disc list-inside text-xs text-amber-200/90 space-y-1">
                  {agent.knownLimitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h4 className="text-sm font-semibold text-white">Trust & Quality Performance</h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Trust Score</span>
                  <span className="font-mono text-blue-400 font-bold">{agent.trustScore}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${agent.trustScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Accuracy Benchmark</span>
                  <span className="font-mono text-emerald-400 font-bold">{agent.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${agent.accuracy}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Automation Rate</span>
                  <span className="font-mono text-purple-400 font-bold">{agent.automationRatePercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${agent.automationRatePercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Average Latency:</span>
                <span className="font-mono text-white">{agent.latencyMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Cost / Execution Run:</span>
                <span className="font-mono text-white">₹{agent.costPerRunInr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Evaluated:</span>
                <span className="font-mono text-slate-300">{new Date(agent.lastEvaluatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Versions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h4 className="text-sm font-semibold text-white">Release Version History</h4>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-blue-400 font-bold">{agent.currentVersion} (Active Production)</span>
              <span className="text-xs text-slate-400">Released: Aug 12, 2026</span>
            </div>
            <p className="text-xs text-slate-300">{agent.changelog || 'Standard governance update.'}</p>
          </div>
        </div>
      )}

      {activeTab !== 'Overview' && activeTab !== 'Versions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
          Showing synthetic demonstration data for tab: <strong className="text-white">{activeTab}</strong>. All related events are synced with central audit logs.
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={rollbackModalOpen}
        onClose={() => setRollbackModalOpen(false)}
        onConfirm={handleConfirmRollback}
        title="Roll Back Agent Version?"
        description={`Are you sure you want to rollback ${agent.name} to the previous stable release?`}
        confirmText="Rollback to Previous Release"
        confirmVariant="warning"
        icon="warning"
      />

      <ConfirmationModal
        isOpen={pauseModalOpen}
        onClose={() => setPauseModalOpen(false)}
        onConfirm={handleConfirmPause}
        title="Pause Agent Execution?"
        description={`This will halt all automated recommendations generated by ${agent.name}.`}
        confirmText="Pause Agent"
        confirmVariant="danger"
        icon="shield"
      />
    </div>
  );
};
