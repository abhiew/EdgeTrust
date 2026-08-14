import React, { useState } from 'react';
import { getCaseById, approveCase, rejectCase, escalateCase, editAndApproveCase, pauseCaseAutomation } from '../services/api';
import { LoanCase } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DataMask } from '../components/common/DataMask';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  CornerUpRight,
  Pause,
  Bot,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  HeartHandshake
} from 'lucide-react';

interface CaseDetailViewProps {
  caseId: string;
  onNavigate: (route: string) => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseId, onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loanCase, setLoanCase] = useState<LoanCase | undefined>(() => getCaseById(caseId));

  const [editMode, setEditMode] = useState(false);
  const [editedDraft, setEditedDraft] = useState(loanCase?.draftMessage || '');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [confirmPauseModal, setConfirmPauseModal] = useState(false);

  if (!loanCase) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-slate-400">Case not found.</p>
        <button onClick={() => onNavigate('/cases')} className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg">
          Back to Cases
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    if (!user) return;
    try {
      const updated = approveCase(loanCase.id, 'Approved via Case Workbench', user);
      setLoanCase({ ...updated });
      showToast('Recommendation Approved', `Case ${loanCase.id} approved and audit trail updated.`, 'success');
    } catch (e) {
      showToast('Error', 'Could not approve case.', 'error');
    }
  };

  const handleEditAndApprove = () => {
    if (!user) return;
    try {
      const updated = editAndApproveCase(loanCase.id, editedDraft, 'Edited draft via workbench', user);
      setLoanCase({ ...updated });
      setEditMode(false);
      showToast('Draft Edited & Approved', 'Customized customer communication dispatched.', 'success');
    } catch (e) {
      showToast('Error', 'Could not edit and approve case.', 'error');
    }
  };

  const handleRejectSubmit = () => {
    if (!user || !rejectReason.trim()) return;
    try {
      const updated = rejectCase(loanCase.id, rejectReason, user);
      setLoanCase({ ...updated });
      setShowRejectForm(false);
      showToast('Recommendation Rejected', `Case ${loanCase.id} recommendation rejected.`, 'warning');
    } catch (e) {
      showToast('Error', 'Could not reject case.', 'error');
    }
  };

  const handleEscalate = () => {
    if (!user) return;
    try {
      const updated = escalateCase(loanCase.id, 'Escalated to Senior Operations Committee', user);
      setLoanCase({ ...updated });
      showToast('Case Escalated', `Case ${loanCase.id} routed to senior operations queue.`, 'warning');
    } catch (e) {
      showToast('Error', 'Could not escalate case.', 'error');
    }
  };

  const handleConfirmPause = () => {
    if (!user) return;
    try {
      const updated = pauseCaseAutomation(loanCase.id, user);
      setLoanCase({ ...updated });
      setConfirmPauseModal(false);
      showToast('Case Automation Paused', 'AI actions suspended for this individual case.', 'warning');
    } catch (e) {
      showToast('Error', 'Could not pause case automation.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('/cases')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Loan Accounts</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">CASE ID:</span>
          <span className="text-white font-bold">{loanCase.id}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">STATUS:</span>
          <span className="text-blue-400 font-semibold">{loanCase.status}</span>
        </div>
      </div>

      {/* 3-COLUMN WORKBENCH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL (3 COLS): Customer Profile & Account Context */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Customer Profile & History
          </h4>

          <div className="space-y-3">
            <div>
              <p className="text-base font-bold text-white">{loanCase.maskedCustomerName}</p>
              <p className="text-xs text-slate-400">ID: {loanCase.customerId}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <DataMask label="Phone" value="+91 9876544821" maskedValue={loanCase.maskedPhone} />
              <DataMask label="Account" value="881920398392" maskedValue={loanCase.maskedAccount} />
              <DataMask label="PAN Ref" value="ABCDE1234F" maskedValue="XXXXX1234X" />
            </div>

            {loanCase.vulnerabilityFlag && (
              <div className="bg-red-950/60 border border-red-500/40 p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-red-300 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-red-400" />
                  <span>Vulnerability Flag Active</span>
                </p>
                <p className="text-red-200 text-[11px]">
                  {loanCase.vulnerabilityReason || 'Medical Emergency reported.'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h5 className="text-xs font-semibold text-slate-300">Loan Product Summary</h5>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-semibold text-white">{loanCase.loanProduct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balance:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{loanCase.outstandingAmountInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Past Due:</span>
                <span className="font-mono text-amber-400 font-bold">{loanCase.daysPastDue} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Tier:</span>
                <span className="font-mono text-amber-300">{loanCase.riskBand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consent Status:</span>
                <span className={`font-medium ${loanCase.consentStatus === 'Consent Granted' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {loanCase.consentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h5 className="text-xs font-semibold text-slate-300">Case Timeline</h5>
            <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
              {loanCase.timeline.map((event) => (
                <div key={event.id} className="p-2.5 rounded bg-slate-950/40 border border-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                    <span>{event.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE PANEL (6 COLS): AI Recommendation & Evidence Card */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {/* Recommendation Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">AI Collections Recommendation</h3>
              </div>
              <p className="text-xs text-slate-400">Generated by Collections Conversation Agent v2.4.1</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-500/40 text-xs font-mono font-bold">
                <span>AI Confidence: {loanCase.confidence}%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">POLICY THRESHOLD: 80%</p>
            </div>
          </div>

          {/* Decision Summary */}
          <div className="bg-slate-950/80 border border-blue-500/30 p-4 rounded-xl space-y-2">
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
              RECOMMENDED NEXT BEST ACTION
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">{loanCase.recommendedAction}</p>
          </div>

          {/* Verifiable Evidence Used */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Verifiable Evidence Used ({loanCase.evidence.length})
            </h4>
            <div className="space-y-2">
              {loanCase.evidence.map((ev, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Compliance Checks */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Real-Time Policy Compliance Scan
            </h4>
            <div className="space-y-2">
              {loanCase.policyChecks.map((pc) => (
                <div
                  key={pc.policyId}
                  className={`p-3 rounded-lg border flex items-start justify-between gap-3 text-xs ${
                    pc.passed
                      ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                      : 'bg-red-950/40 border-red-500/30 text-red-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200">{pc.policyName} ({pc.policyId})</p>
                    <p className="text-[11px] text-slate-400">{pc.details}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      pc.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {pc.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Draft Customer Communication Card */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Draft Customer Communication Message
              </h4>
              {!editMode && (
                <button
                  onClick={() => {
                    setEditedDraft(loanCase.draftMessage);
                    setEditMode(true);
                  }}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Draft</span>
                </button>
              )}
            </div>

            {editMode ? (
              <div className="space-y-3">
                <textarea
                  value={editedDraft}
                  onChange={(e) => setEditedDraft(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-blue-500/60 rounded-xl p-3 text-xs text-slate-100 focus:outline-none font-sans leading-relaxed"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAndApprove}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg"
                  >
                    Save & Approve Edited Draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans relative">
                <p>"{loanCase.draftMessage}"</p>
                <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-900 pt-2">
                  <span>OUTBOUND CHANNEL: SMS / WHATSAPP</span>
                  <span>SAFETY GUARDRAIL VERIFIED ✓</span>
                </div>
              </div>
            )}
          </div>

          {/* Why This Recommendation Modal Button */}
          <button
            onClick={() => setShowWhyModal(!showWhyModal)}
            className="w-full py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Why this recommendation? (Explainability & Rule Breakdown)</span>
            {showWhyModal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showWhyModal && (
            <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 text-xs space-y-3 animate-slide-up">
              <h5 className="font-semibold text-purple-300">Auditable Explanation Breakdown:</h5>
              <div className="space-y-2 text-slate-300">
                <p><strong>1. Data Used:</strong> Repayment history (8/10 on time), current DPD ({loanCase.daysPastDue}), consent flag active.</p>
                <p><strong>2. Rules Applied:</strong> Policy POL-01 (High-risk human review mandatory), POL-02 (Zero threat scan passed).</p>
                <p><strong>3. Confidence Score Factors:</strong> Repayment consistency +35%, DPD severity +40%, Policy compliance +25%.</p>
                <p><strong>4. Limitations:</strong> Synthetic model simulation. Final dispatch requires human operator click.</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL (3 COLS): Approval Actions & Governance Workbench */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Human Approval Workbench
          </h4>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Reviewer:</span>
              <span className="font-semibold text-slate-200">{loanCase.assignedTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Role:</span>
              <span className="font-mono text-blue-400 font-bold">{user?.role}</span>
            </div>
          </div>

          {/* Actions Stack */}
          <div className="space-y-3">
            <button
              onClick={handleApprove}
              disabled={loanCase.approvalStatus === 'Approved'}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Action</span>
            </button>

            <button
              onClick={() => {
                setEditedDraft(loanCase.draftMessage);
                setEditMode(true);
              }}
              disabled={loanCase.approvalStatus === 'Approved'}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Draft & Approve</span>
            </button>

            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              disabled={loanCase.approvalStatus === 'Rejected'}
              className="w-full py-2.5 bg-red-950/60 hover:bg-red-900/60 disabled:opacity-50 text-red-300 border border-red-500/40 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Action</span>
            </button>

            {showRejectForm && (
              <div className="bg-slate-950 p-3 rounded-lg border border-red-500/30 space-y-2 animate-slide-up">
                <label className="text-[11px] text-slate-300 font-medium">Rejection Reason:</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify why this AI recommendation was rejected..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleRejectSubmit}
                  className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded"
                >
                  Confirm Rejection
                </button>
              </div>
            )}

            <button
              onClick={handleEscalate}
              className="w-full py-2.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 font-medium text-xs rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <CornerUpRight className="w-4 h-4" />
              <span>Escalate to Senior Panel</span>
            </button>

            <button
              onClick={() => setConfirmPauseModal(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Pause className="w-3.5 h-3.5 text-slate-400" />
              <span>Pause Case Automation</span>
            </button>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Audit Safety Notice:</p>
            <p>Every click logs your user ID (<code className="text-blue-300">{user?.id}</code>) and timestamp in the immutable audit log.</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmPauseModal}
        onClose={() => setConfirmPauseModal(false)}
        onConfirm={handleConfirmPause}
        title="Pause Case Automation?"
        description={`This will halt all future AI automated outreach recommendations for Case ${loanCase.id}.`}
        confirmText="Pause Automation"
        confirmVariant="warning"
        icon="shield"
      />
    </div>
  );
};
