import React, { useState } from 'react';
import { getApprovals, approveCase, rejectCase, editAndApproveCase, escalateCase } from '../services/api';
import { Approval } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  ArrowRight,
  ShieldAlert,
  X
} from 'lucide-react';

interface ApprovalsViewProps {
  onNavigate: (route: string) => void;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [approvals, setApprovals] = useState<Approval[]>(getApprovals());
  const [activeTab, setActiveTab] = useState<
    'All' | 'My Queue' | 'High Risk' | 'Low Confidence' | 'Policy Warning' | 'SLA Breached'
  >('All');

  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedDraft, setEditedDraft] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const filteredApprovals = approvals.filter((a) => {
    if (activeTab === 'High Risk' && a.riskLevel !== 'High' && a.riskLevel !== 'Critical') return false;
    if (activeTab === 'Low Confidence' && a.confidence >= 80) return false;
    if (activeTab === 'Policy Warning' && a.policyChecks.every((p) => p.passed)) return false;
    if (activeTab === 'SLA Breached' && a.waitingTimeHours < 24) return false;
    return true;
  });

  const handleApproveItem = (item: Approval) => {
    if (!user) return;
    approveCase(item.caseId, 'Approved from Approval Queue', user);
    setApprovals(getApprovals());
    showToast('Approved Successfully', `Case ${item.caseId} approved and action queued for dispatch.`, 'success');
    setSelectedApproval(null);
  };

  const handleRejectItem = (item: Approval) => {
    if (!user || !rejectReason.trim()) return;
    rejectCase(item.caseId, rejectReason, user);
    setApprovals(getApprovals());
    showToast('Rejected', `Case ${item.caseId} recommendation rejected.`, 'warning');
    setSelectedApproval(null);
    setShowRejectInput(false);
  };

  const handleEditApproveItem = (item: Approval) => {
    if (!user) return;
    editAndApproveCase(item.caseId, editedDraft, 'Edited draft from Approval Queue drawer', user);
    setApprovals(getApprovals());
    showToast('Edited & Approved', `Modified draft approved for ${item.caseId}.`, 'success');
    setSelectedApproval(null);
    setEditMode(false);
  };

  const handleEscalateItem = (item: Approval) => {
    if (!user) return;
    escalateCase(item.caseId, 'Escalated from Approval Queue', user);
    setApprovals(getApprovals());
    showToast('Escalated', `Case ${item.caseId} escalated to senior review.`, 'warning');
    setSelectedApproval(null);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">Waiting for Review</p>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {approvals.filter((a) => a.status === 'Pending Review').length}
          </p>
          <p className="text-[10px] text-slate-500">Requires human action</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">High-Priority Queue</p>
          <p className="text-2xl font-bold text-red-400 font-mono">
            {approvals.filter((a) => a.priority === 'High' && a.status === 'Pending Review').length}
          </p>
          <p className="text-[10px] text-slate-500">Critical / High Risk</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">Avg Approval Time</p>
          <p className="text-2xl font-bold text-blue-400 font-mono">4.2 min</p>
          <p className="text-[10px] text-emerald-400 font-medium">-18% vs last week</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">Rejected This Week</p>
          <p className="text-2xl font-bold text-slate-300 font-mono">2</p>
          <p className="text-[10px] text-slate-500">Draft quality safety</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-xs text-slate-400">Escalated This Week</p>
          <p className="text-2xl font-bold text-purple-300 font-mono">1</p>
          <p className="text-[10px] text-slate-500">Complex exposure</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        {(['All', 'My Queue', 'High Risk', 'Low Confidence', 'Policy Warning', 'SLA Breached'] as const).map((tab) => (
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

      {/* Approvals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Pending Human Review Queue ({filteredApprovals.length})</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                <th className="py-3 px-4">CASE ID</th>
                <th className="py-3 px-4">PROPOSED ACTION</th>
                <th className="py-3 px-4">REASON FOR REVIEW</th>
                <th className="py-3 px-4">RISK LEVEL</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4">WAITING TIME</th>
                <th className="py-3 px-4">ASSIGNED TO</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApprovals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td
                    onClick={() => onNavigate(`/cases/${item.caseId}`)}
                    className="py-3.5 px-4 font-mono font-bold text-blue-400 hover:underline cursor-pointer"
                  >
                    {item.caseId}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium text-white" title={item.proposedAction}>
                    {item.proposedAction}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-400" title={item.requestedReason}>
                    {item.requestedReason}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        item.riskLevel === 'Critical'
                          ? 'bg-red-950/60 text-red-300 border-red-500/40'
                          : item.riskLevel === 'High'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{item.confidence}%</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{item.waitingTimeHours}h ago</td>
                  <td className="py-3.5 px-4 text-slate-300">{item.assignedTo}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedApproval(item);
                        setEditedDraft(item.aiDraft);
                      }}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Review Drawer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Popup */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-slide-up">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Review Case {selectedApproval.caseId}</h3>
                  <p className="text-xs text-slate-400">Approval Queue Item #{selectedApproval.id}</p>
                </div>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="font-semibold text-amber-300">Trigger Reason for Review:</p>
                <p className="text-slate-300">{selectedApproval.requestedReason}</p>
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-slate-200">Proposed Action & Message Draft:</h4>
                <p className="text-slate-400 font-medium">{selectedApproval.proposedAction}</p>

                {editMode ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      value={editedDraft}
                      onChange={(e) => setEditedDraft(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-blue-500 rounded p-3 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditMode(false)} className="px-3 py-1 bg-slate-800 text-xs text-slate-300 rounded">
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditApproveItem(selectedApproval)}
                        className="px-3 py-1 bg-blue-600 text-xs text-white font-medium rounded"
                      >
                        Approve Edited Draft
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 relative">
                    <p>"{selectedApproval.aiDraft}"</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-2 text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit message draft</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-slate-200">Verifiable Evidence:</h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {selectedApproval.evidence.map((ev, idx) => (
                    <li key={idx}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions Stack */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleApproveItem(selectedApproval)}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Action</span>
                </button>

                <button
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="py-2.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>

              {showRejectInput && (
                <div className="bg-slate-950 p-3 rounded-lg border border-red-500/30 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                  <button
                    onClick={() => handleRejectItem(selectedApproval)}
                    className="w-full py-1.5 bg-red-600 text-white text-xs font-medium rounded"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}

              <button
                onClick={() => handleEscalateItem(selectedApproval)}
                className="w-full py-2 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>Escalate to Senior Ops Panel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
