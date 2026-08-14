import React, { useState } from 'react';
import { getAuditEvents } from '../services/auditLogger';
import { AuditEvent } from '../types';
import { useToast } from '../context/ToastContext';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { FileText, Download, ShieldCheck, Search, Filter, X, ArrowRight } from 'lucide-react';

interface AuditViewProps {
  onNavigate: (route: string) => void;
}

export const AuditView: React.FC<AuditViewProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<AuditEvent[]>(getAuditEvents());
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [retentionModalOpen, setRetentionModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEvents = events.filter((e) => {
    if (filterType !== 'All' && e.eventType !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = e.id.toLowerCase().includes(q);
      const matchActor = e.actorName.toLowerCase().includes(q);
      const matchCorr = e.correlationId.toLowerCase().includes(q);
      const matchRes = e.resourceId.toLowerCase().includes(q);
      if (!matchId && !matchActor && !matchCorr && !matchRes) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Actor', 'Role', 'Event Type', 'Resource', 'Correlation ID', 'Details'];
    const rows = filteredEvents.map((e) => [
      e.id,
      e.timestamp,
      `"${e.actorName}"`,
      e.role,
      e.eventType,
      e.resourceId,
      e.correlationId,
      `"${e.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `edgetrust_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit Log Exported', 'CSV file generated successfully.', 'success');
  };

  const handleExportPDF = () => {
    showToast('PDF Export Simulated', 'Audit PDF report payload formatted for compliance archiving.', 'info');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Immutable Audit Trail</h3>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                Append-only audit view — demo implementation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Every AI recommendation, policy check, user approval, and administrative action is logged with correlation IDs.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRetentionModalOpen(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Retention Policy
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Event Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search event ID, actor name, correlation ID (CORR-10091)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Event Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Event Types</option>
            <option value="user_login">User Login</option>
            <option value="approval_approved">Approval Approved</option>
            <option value="approval_rejected">Approval Rejected</option>
            <option value="recommendation_generated">AI Recommendation</option>
            <option value="policy_updated">Policy Updated</option>
            <option value="agent_paused">Agent Paused</option>
            <option value="evaluation_completed">Evaluation Completed</option>
          </select>
        </div>
      </div>

      {/* Audit Trail Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                <th className="py-3 px-4">EVENT ID</th>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTOR / ROLE</th>
                <th className="py-3 px-4">EVENT TYPE</th>
                <th className="py-3 px-4">RESOURCE ID</th>
                <th className="py-3 px-4">CORRELATION ID</th>
                <th className="py-3 px-4">OUTCOME</th>
                <th className="py-3 px-4 text-right">DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredEvents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-400">{item.id}</td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <p className="font-semibold text-white">{item.actorName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{item.role}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                      {item.eventType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{item.resourceId}</td>
                  <td className="py-3.5 px-4 text-purple-300">{item.correlationId}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">
                      {item.outcome}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedEvent(item)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-slide-up">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Audit Event Details</h3>
                <p className="text-xs font-mono text-blue-400">{selectedEvent.id}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono">
                <p className="text-slate-400">CORRELATION ID: <span className="text-purple-300 font-bold">{selectedEvent.correlationId}</span></p>
                <p className="text-slate-400">TIMESTAMP: <span className="text-slate-200">{selectedEvent.timestamp}</span></p>
                <p className="text-slate-400">ACTOR: <span className="text-white">{selectedEvent.actorName} ({selectedEvent.role})</span></p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Event Description:</p>
                <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedEvent.details}
                </p>
              </div>

              {selectedEvent.previousState && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200">Previous State:</p>
                  <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-amber-300 font-mono">
                    {selectedEvent.previousState}
                  </pre>
                </div>
              )}

              {selectedEvent.newState && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200">New State:</p>
                  <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-emerald-300 font-mono">
                    {selectedEvent.newState}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Retention Settings Modal */}
      <ConfirmationModal
        isOpen={retentionModalOpen}
        onClose={() => setRetentionModalOpen(false)}
        onConfirm={() => {
          showToast('Retention Policy Updated', 'Audit retention locked to 7 years per regulatory guidelines.', 'info');
          setRetentionModalOpen(false);
        }}
        title="Audit Trail Retention Settings"
        description="Audit logs are configured for 7-year append-only storage compliance in encrypted cold storage."
        confirmText="Confirm 7-Year Retention"
        confirmVariant="primary"
        icon="shield"
      />
    </div>
  );
};
