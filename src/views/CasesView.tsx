import React, { useState } from 'react';
import { getCases } from '../services/api';
import { LoanCase, RiskTier, ApprovalStatus } from '../types';
import { DataMask } from '../components/common/DataMask';
import { Briefcase, Search, Filter, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

interface CasesViewProps {
  onNavigate: (route: string) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({ onNavigate }) => {
  const [cases, setCases] = useState<LoanCase[]>(getCases());
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredCases = cases.filter((c) => {
    if (riskFilter !== 'All' && c.riskBand !== riskFilter) return false;
    if (statusFilter !== 'All' && c.approvalStatus !== statusFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchCust = c.maskedCustomerName.toLowerCase().includes(q);
      const matchPhone = c.maskedPhone.includes(q);
      const matchAcc = c.maskedAccount.includes(q);
      if (!matchId && !matchCust && !matchPhone && !matchAcc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Case ID (CASE-9021), customer name, masked phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Risk Bands</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Edited & Approved">Edited & Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Synthetic Loan Repayment Accounts ({filteredCases.length})</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Pushed to Human Approval Queue: {filteredCases.filter(c => c.approvalStatus === 'Pending Review').length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                <th className="py-3 px-4">CASE ID</th>
                <th className="py-3 px-4">CUSTOMER</th>
                <th className="py-3 px-4">PRODUCT</th>
                <th className="py-3 px-4">OUTSTANDING</th>
                <th className="py-3 px-4">DPD</th>
                <th className="py-3 px-4">RISK BAND</th>
                <th className="py-3 px-4">CONFIDENCE</th>
                <th className="py-3 px-4">RECOMMENDED ACTION</th>
                <th className="py-3 px-4">APPROVAL STATUS</th>
                <th className="py-3 px-4 text-right">WORKBENCH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                    <span
                      onClick={() => onNavigate(`/cases/${item.id}`)}
                      className="cursor-pointer hover:underline"
                    >
                      {item.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-white">{item.maskedCustomerName}</p>
                      <DataMask value="+91 9876544821" maskedValue={item.maskedPhone} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{item.loanProduct}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-100">
                    ₹{item.outstandingAmountInr.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">{item.daysPastDue} DPD</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        item.riskBand === 'Critical'
                          ? 'bg-red-950/60 text-red-300 border-red-500/40'
                          : item.riskBand === 'High'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {item.riskBand}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{item.confidence}%</td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-300" title={item.recommendedAction}>
                    {item.recommendedAction}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        item.approvalStatus === 'Approved' || item.approvalStatus === 'Edited & Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.approvalStatus === 'Pending Review'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : item.approvalStatus === 'Rejected'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate(`/cases/${item.id}`)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium rounded-lg inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
