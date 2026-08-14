import React, { useState } from 'react';
import { mockWorkspace } from '../data/mockData';
import { getAnalyticsEvents } from '../services/analytics';
import { Settings, ShieldCheck, Users, Activity, BarChart2, Lock } from 'lucide-react';

interface SettingsViewProps {
  onNavigate: (route: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const analyticsEvents = getAnalyticsEvents();

  const rbacMatrix = [
    { role: 'CEO', overview: 'Full', cases: 'View', approvals: 'View', policies: 'View', eval: 'View', audit: 'View' },
    { role: 'COO', overview: 'Full', cases: 'Full', approvals: 'Approve/Reject', policies: 'View', eval: 'View', audit: 'View' },
    { role: 'Operations Manager', overview: 'View', cases: 'Full', approvals: 'Approve/Edit/Escalate', policies: 'View', eval: 'View', audit: 'View' },
    { role: 'Compliance Manager', overview: 'View', cases: 'View', approvals: 'Audit Review', policies: 'Create/Edit/Disable', eval: 'View', audit: 'Full Export' },
    { role: 'AI Product Manager', overview: 'View', cases: 'View', approvals: 'View', policies: 'View', eval: 'Run/Compare/Promote', audit: 'View' },
    { role: 'Collection Agent', overview: 'Restricted', cases: 'Assigned Only', approvals: 'None', policies: 'None', eval: 'None', audit: 'None' },
    { role: 'Admin', overview: 'Full', cases: 'Full', approvals: 'Full', policies: 'Full', eval: 'Full', audit: 'Full Config' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Platform Settings & RBAC Governance</h3>
          <p className="text-xs text-slate-400">Workspace configuration, role permissions matrix, and product usage analytics.</p>
        </div>
      </div>

      {/* Workspace Config Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Workspace Configuration
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400">Workspace Name:</span>
            <p className="font-bold text-white mt-0.5">{mockWorkspace.name}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400">Region:</span>
            <p className="font-mono text-blue-300 mt-0.5">{mockWorkspace.region}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400">Tier Plan:</span>
            <p className="font-semibold text-emerald-400 mt-0.5">{mockWorkspace.plan}</p>
          </div>
        </div>
      </div>

      {/* RBAC Role Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          Role-Based Access Control (RBAC Matrix)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">ROLE</th>
                <th className="py-2.5 px-3">OVERVIEW</th>
                <th className="py-2.5 px-3">CASES</th>
                <th className="py-2.5 px-3">APPROVAL QUEUE</th>
                <th className="py-2.5 px-3">POLICIES</th>
                <th className="py-2.5 px-3">EVALUATIONS</th>
                <th className="py-2.5 px-3">AUDIT LOG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rbacMatrix.map((row) => (
                <tr key={row.role} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-sans font-bold text-white">{row.role}</td>
                  <td className="py-3 px-3 text-slate-300">{row.overview}</td>
                  <td className="py-3 px-3 text-slate-300">{row.cases}</td>
                  <td className="py-3 px-3 text-amber-300">{row.approvals}</td>
                  <td className="py-3 px-3 text-blue-300">{row.policies}</td>
                  <td className="py-3 px-3 text-purple-300">{row.eval}</td>
                  <td className="py-3 px-3 text-emerald-300">{row.audit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Product Usage Analytics Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            Internal Product Usage Analytics ({analyticsEvents.length} Events Tracked)
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
            Local Event Bus Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-3">EVENT NAME</th>
                <th className="py-2 px-3">USER ROLE</th>
                <th className="py-2 px-3">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {analyticsEvents.slice(0, 6).map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 text-blue-300 font-bold">{ev.eventName}</td>
                  <td className="py-2 px-3 text-slate-200">{ev.role}</td>
                  <td className="py-2 px-3 text-slate-500">{new Date(ev.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
