import React, { useState } from 'react';
import { getDashboardSummary, getDashboardTrends, getAgents, pauseAgent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  UserCheck,
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  Sparkles,
  Layers,
  Bot
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [summary, setSummary] = useState(getDashboardSummary());
  const trends = getDashboardTrends();
  const [agents, setAgents] = useState(getAgents());
  const [selectedAgentToPause, setSelectedAgentToPause] = useState<string | null>(null);
  const [pauseModalOpen, setPauseModalOpen] = useState(false);

  const handleConfirmPause = () => {
    if (!selectedAgentToPause || !user) return;
    try {
      pauseAgent(selectedAgentToPause, user);
      setAgents(getAgents());
      setSummary(getDashboardSummary());
      showToast('Agent Paused Successfully', 'Audit log updated and automated execution suspended.', 'warning');
    } catch (e) {
      showToast('Action Failed', 'Could not pause agent.', 'error');
    } finally {
      setPauseModalOpen(false);
      setSelectedAgentToPause(null);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Executive Control Tower View</h3>
            <p className="text-xs text-slate-400">Showing metrics for past 30 days • Mode: {user?.role}</p>
          </div>
        </div>

        {/* Dashboard Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('/approvals')}
            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Review Approvals ({summary.counts.pendingApprovalsCount})</span>
          </button>

          <button
            onClick={() => onNavigate('/evaluations')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Evaluation</span>
          </button>

          <button
            onClick={() => onNavigate('/audit')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cases Processed</span>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded">Demo Data</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{summary.kpis.casesProcessed.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.kpis.casesProcessed.change}</span>
            <span className="text-[11px] text-slate-500 font-sans ml-1">vs prev 30d</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Automation Rate</span>
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 tracking-tight">{summary.kpis.automationRate.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.kpis.automationRate.change}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Human Review Rate</span>
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 tracking-tight">{summary.kpis.humanReviewRate.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{summary.kpis.humanReviewRate.change}</span>
            <span className="text-[10px] text-slate-500">workload</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Policy Compliance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight">{summary.kpis.policyCompliance.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.kpis.policyCompliance.change}</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Cost / Case</span>
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{summary.kpis.avgCostPerCase.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{summary.kpis.avgCostPerCase.change}</span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Est. Operational Savings</span>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded">Simulated</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 tracking-tight">{summary.kpis.operationalSavings.value}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.0% payback</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Business Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: Volume & Outcome Trend (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">Daily Case Processing & Outcome Trend</h4>
              <p className="text-xs text-slate-400">Volume breakdown across processed, resolved, escalated, and pending cases.</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">Daily Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.volumeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="Processed" stroke="#3B82F6" fillOpacity={1} fill="url(#colorProcessed)" />
                <Area type="monotone" dataKey="Resolved" stroke="#10B981" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Risk Distribution (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Risk Tier Distribution</h4>
            <p className="text-xs text-slate-400">Operational risk classification of current accounts.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trends.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trends.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
            {trends.riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                <span className="text-slate-300">{r.name}:</span>
                <span className="font-mono text-slate-100 font-semibold">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Automation Funnel & Business Impact ROI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Funnel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Automation & Approval Funnel
              </h4>
              <p className="text-xs text-slate-400">Stage-by-stage progression from raw case intake to human approval.</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
              72.4% Auto-executed
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={trends.automationFunnel} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis type="category" dataKey="step" stroke="#94A3B8" fontSize={11} width={110} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {trends.automationFunnel.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Impact ROI Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Business Value & ROI Impact
              </h4>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Simulated Business Metrics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Efficiency gains achieved via human-in-the-loop AI assistance.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
              <p className="text-xs text-slate-400">Handling Time Reduction</p>
              <p className="text-xl font-bold text-emerald-400">-{trends.businessImpact.handlingTimeReductionPercent}%</p>
              <p className="text-[10px] text-slate-400">12 min → 4 min per case</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
              <p className="text-xs text-slate-400">Review Workload Reduction</p>
              <p className="text-xl font-bold text-blue-400">-{trends.businessImpact.reviewWorkloadReductionPercent}%</p>
              <p className="text-[10px] text-slate-400">Low-risk auto-approved</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
              <p className="text-xs text-slate-400">Contact Success Rate</p>
              <p className="text-xl font-bold text-white">{trends.businessImpact.contactSuccessRatePercent}%</p>
              <p className="text-[10px] text-slate-400">+14% vs traditional SMS</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-lg space-y-1">
              <p className="text-xs text-slate-400">Promise-to-Pay Rate</p>
              <p className="text-xl font-bold text-amber-300">{trends.businessImpact.promiseToPayRatePercent}%</p>
              <p className="text-[10px] text-slate-400">Empathetic reminders</p>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between text-xs">
            <span className="text-emerald-300 font-medium">Monthly Cost Savings Calculated:</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">{trends.businessImpact.costSavedInr}</span>
          </div>
        </div>
      </div>

      {/* Third Row: Agent Health Matrix & Active System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Health Matrix Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                Active Agent Health Matrix
              </h4>
              <p className="text-xs text-slate-400">Real-time status, trust score, latency, and operational cost.</p>
            </div>
            <button
              onClick={() => onNavigate('/agents')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Registry</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">AGENT NAME</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">TRUST SCORE</th>
                  <th className="py-2.5 px-3">ACCURACY</th>
                  <th className="py-2.5 px-3">LATENCY</th>
                  <th className="py-2.5 px-3">COST/RUN</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{agent.currentVersion} • {agent.riskTier} Risk</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          agent.status === 'Healthy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : agent.status === 'Degraded'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        ● {agent.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-blue-400">{agent.trustScore}/100</td>
                    <td className="py-3 px-3 font-mono text-slate-200">{agent.accuracy}%</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{agent.latencyMs}ms</td>
                    <td className="py-3 px-3 font-mono text-slate-300">₹{agent.costPerRunInr.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      {agent.status === 'Healthy' ? (
                        <button
                          onClick={() => {
                            setSelectedAgentToPause(agent.id);
                            setPauseModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 text-[11px] font-medium transition-colors"
                        >
                          Pause
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Paused</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active System Alerts Panel (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Active System & Governance Alerts
            </h4>
            <p className="text-xs text-slate-400">Notifications requiring operational attention.</p>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span>High-Risk Case Approval Waiting</span>
                <span className="text-[10px] font-mono text-amber-400">CASE-9021</span>
              </div>
              <p className="text-xs text-slate-300">Account 21 DPD (₹34,500 balance). Requires Operations Manager clearance before outreach.</p>
              <button
                onClick={() => onNavigate('/cases/CASE-9021')}
                className="text-xs text-amber-300 underline font-medium pt-1 block"
              >
                Review Case & Approve →
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
                <span>Customer Support Summariser Latency</span>
                <span className="text-[10px] font-mono text-slate-400">INC-1042</span>
              </div>
              <p className="text-xs text-slate-400">Agent latency 1,250ms breached threshold. Trust score decreased to 78.</p>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
                <span>Evaluation Benchmark Complete</span>
                <span className="text-[10px] font-mono text-blue-400">v2.4.1</span>
              </div>
              <p className="text-xs text-slate-300">Collections Agent v2.4.1 achieved 93% pass rate vs 84% on v2.3.0.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Pause Confirmation Modal */}
      <ConfirmationModal
        isOpen={pauseModalOpen}
        onClose={() => setPauseModalOpen(false)}
        onConfirm={handleConfirmPause}
        title="Pause AI Agent Execution?"
        description="Pausing this agent will suspend automated recommendation generation and route all incoming cases directly to manual operations queues."
        confirmText="Pause Agent"
        confirmVariant="danger"
        icon="shield"
      />
    </div>
  );
};
