import React from 'react';
import { RiskTier, CaseStatus, ApprovalStatus, AgentStatus } from '../../types';

export type StatusType =
  | CaseStatus
  | ApprovalStatus
  | AgentStatus
  | 'Active'
  | 'Inactive'
  | 'Open'
  | 'Resolved'
  | 'Under Investigation'
  | 'Critical'
  | 'Warning'
  | 'Info'
  | 'Success'
  | 'Failure';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showDot = true,
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  const normalized = status.toLowerCase();

  if (
    normalized === 'active' ||
    normalized === 'approved' ||
    normalized === 'healthy' ||
    normalized === 'resolved' ||
    normalized === 'success' ||
    normalized === 'passed'
  ) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (
    normalized === 'pending' ||
    normalized === 'pending approval' ||
    normalized === 'pending review' ||
    normalized === 'under investigation' ||
    normalized === 'review required' ||
    normalized === 'warning' ||
    normalized === 'draft'
  ) {
    colorClasses = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (
    normalized === 'rejected' ||
    normalized === 'escalated' ||
    normalized === 'drift detected' ||
    normalized === 'high risk' ||
    normalized === 'critical' ||
    normalized === 'failure' ||
    normalized === 'open'
  ) {
    colorClasses = 'bg-red-500/10 text-red-400 border-red-500/30';
    dotColor = 'bg-red-400';
  } else if (
    normalized === 'paused' ||
    normalized === 'inactive' ||
    normalized === 'archived'
  ) {
    colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
    dotColor = 'bg-slate-500';
  } else if (
    normalized === 'in review' ||
    normalized === 'info'
  ) {
    colorClasses = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    dotColor = 'bg-blue-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{status}</span>
    </span>
  );
};

interface RiskBadgeProps {
  risk: RiskTier | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  risk,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-0.5';

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  const normalized = risk.toLowerCase();

  if (normalized === 'low') {
    colorClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40';
  } else if (normalized === 'medium') {
    colorClasses = 'bg-amber-950/60 text-amber-300 border-amber-600/40';
  } else if (normalized === 'high') {
    colorClasses = 'bg-red-950/60 text-red-300 border-red-500/40';
  } else if (normalized === 'critical') {
    colorClasses = 'bg-red-900/80 text-red-200 border-red-400/50 font-bold';
  }

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded border ${sizeClasses} ${colorClasses} ${className}`}
    >
      {risk.toUpperCase()}
    </span>
  );
};
