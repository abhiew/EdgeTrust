import React, { useState } from 'react';
import { getAgents, pauseAgent, resumeAgent } from '../services/api';
import { Agent } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Bot, Shield, Play, Pause, ArrowRight, Activity, Clock, DollarSign, Layers } from 'lucide-react';

interface AgentsViewProps {
  onNavigate: (route: string) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [agents, setAgents] = useState<Agent[]>(getAgents());
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredAgents = agents.filter((a) => {
    if (filterRisk !== 'All' && a.riskTier !== filterRisk) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    return true;
  });

  const handlePauseResumeToggle = (agent: Agent) => {
    if (agent.status === 'Healthy' || agent.status === 'Degraded') {
      setSelectedAgentId(agent.id);
      setModalOpen(true);
    } else {
      if (!user) return;
      resumeAgent(agent.id, user);
      setAgents(getAgents());
      showToast('Agent Resumed', `Agent ${agent.name} is now active.`, 'info');
    }
  };

  const confirmPause = () => {
    if (!selectedAgentId || !user) return;
    pauseAgent(selectedAgentId, user);
    setAgents(getAgents());
    showToast('Agent Paused', 'Automated recommendation execution suspended.', 'warning');
    setModalOpen(false);
    setSelectedAgentId(null);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Registered AI Agents ({filteredAgents.length})</h3>
            <p className="text-xs text-slate-400">Monitor health, trust scores, version deployments, and permission scopes.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Degraded">Degraded</option>
            <option value="Paused">Paused</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Risk Tiers</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Agents Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 space-y-5 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                      agent.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : agent.status === 'Degraded'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    ● {agent.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {agent.currentVersion}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    agent.riskTier === 'High'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                      : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {agent.riskTier} Risk Tier
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  onClick={() => onNavigate(`/agents/${agent.id}`)}
                  className="text-base font-bold text-white hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {agent.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{agent.description}</p>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono">TRUST SCORE</p>
                  <p className="text-sm font-bold font-mono text-blue-400">{agent.trustScore}/100</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono">ACCURACY</p>
                  <p className="text-sm font-bold font-mono text-emerald-400">{agent.accuracy}%</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono">LATENCY</p>
                  <p className="text-sm font-bold font-mono text-slate-200">{agent.latencyMs}ms</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono">COST/RUN</p>
                  <p className="text-sm font-bold font-mono text-purple-300">₹{agent.costPerRunInr.toFixed(2)}</p>
                </div>
              </div>

              {/* Connected Tools & Data Sources */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Model Provider:</span>
                  <span className="text-slate-200 font-mono text-[11px]">{agent.modelProvider}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-medium">Connected Tools:</span>
                  {agent.tools.map((tool) => (
                    <span key={tool} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => handlePauseResumeToggle(agent)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  agent.status === 'Paused'
                    ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30'
                    : 'bg-red-950/40 hover:bg-red-900/40 text-red-300 border-red-500/30'
                }`}
              >
                {agent.status === 'Paused' ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Agent</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Agent</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate(`/agents/${agent.id}`)}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Manage & Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmPause}
        title="Pause Agent Operations?"
        description="Suspending this agent will halt all autonomous recommendation generation and force all related customer workflows into manual review."
        confirmText="Pause Agent"
        confirmVariant="danger"
        icon="shield"
      />
    </div>
  );
};
