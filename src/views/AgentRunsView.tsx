import React from 'react';
import { Bot, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

interface AgentRunsViewProps {
  onNavigate: (route: string) => void;
}

export const AgentRunsView: React.FC<AgentRunsViewProps> = ({ onNavigate }) => {
  const sampleRuns = [
    {
      id: 'RUN-88192',
      agentName: 'Collections Conversation Agent',
      caseId: 'CASE-9021',
      version: 'v2.4.1',
      startedAt: '2026-08-12T09:01:00Z',
      status: 'completed',
      confidence: 88,
      costInr: 2.40,
      requiresApproval: true
    },
    {
      id: 'RUN-88193',
      agentName: 'Collections Conversation Agent',
      caseId: 'CASE-9022',
      version: 'v2.4.1',
      startedAt: '2026-08-13T08:30:00Z',
      status: 'completed',
      confidence: 94,
      costInr: 2.40,
      requiresApproval: false
    },
    {
      id: 'RUN-88194',
      agentName: 'Case Prioritisation Agent',
      caseId: 'CASE-9023',
      version: 'v1.8.3',
      startedAt: '2026-08-11T14:00:00Z',
      status: 'completed',
      confidence: 76,
      costInr: 0.85,
      requiresApproval: true
    }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <button
        onClick={() => onNavigate('/agents')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Agent Registry</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          Agent Execution Log (Runs)
        </h3>
        <p className="text-xs text-slate-400">Detailed execution traces for all AI recommendation runs.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">RUN ID</th>
                <th className="py-2.5 px-3">AGENT</th>
                <th className="py-2.5 px-3">CASE ID</th>
                <th className="py-2.5 px-3">VERSION</th>
                <th className="py-2.5 px-3">CONFIDENCE</th>
                <th className="py-2.5 px-3">COST</th>
                <th className="py-2.5 px-3">APPROVAL REQ</th>
                <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sampleRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-blue-400">{run.id}</td>
                  <td className="py-3 px-3 font-sans text-white">{run.agentName}</td>
                  <td
                    className="py-3 px-3 text-blue-300 underline cursor-pointer"
                    onClick={() => onNavigate(`/cases/${run.caseId}`)}
                  >
                    {run.caseId}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{run.version}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{run.confidence}%</td>
                  <td className="py-3 px-3 text-purple-300">₹{run.costInr.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    {run.requiresApproval ? (
                      <span className="text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded text-[10px] border border-amber-500/30">
                        YES (HUMAN)
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">
                        AUTO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500 font-sans">
                    {new Date(run.startedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
