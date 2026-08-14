import React from 'react';
import { HelpCircle, Play, ShieldAlert, Sparkles, BookOpen, UserCheck, Layers, Terminal } from 'lucide-react';

interface HelpViewProps {
  onNavigate: (route: string) => void;
}

export const HelpView: React.FC<HelpViewProps> = ({ onNavigate }) => {
  const demoSteps = [
    { step: 1, title: 'Login & Executive Overview', route: '/dashboard', desc: 'Sign in as Admin/CEO -> Review KPI cards (+18.4% cases processed, ₹8.6L estimated savings) & automation funnel.' },
    { step: 2, title: 'Open Approval Queue', route: '/approvals', desc: 'Navigate to Approval Queue -> Review high-risk accounts waiting for human review clearance.' },
    { step: 3, title: 'Inspect High-Risk Case Workbench', route: '/cases/CASE-9021', desc: 'Select CASE-9021 (₹34,500 balance, 21 DPD) -> Inspect verifiable evidence & policy compliance scan -> Edit message draft & approve.' },
    { step: 4, title: 'Verify Immutable Audit Event', route: '/audit', desc: 'Navigate to Audit Log -> Confirm new approval_approved event logged with correlation ID & actor name.' },
    { step: 5, title: 'Evaluation Studio & Version Comparison', route: '/evaluations/EV-RUN-241', desc: 'Open Evaluation Studio -> Compare Agent v2.3.0 vs v2.4.1 side-by-side (93% pass rate vs 84%) -> Test "Run Evaluation" live simulator.' },
    { step: 6, title: 'Policy Engine & Guardrail Rules', route: '/policies', desc: 'Inspect compliance policies (High-risk approval, No threatening language, Low-confidence escalation).' },
    { step: 7, title: 'Generate Audit-Ready Report', route: '/reports', desc: 'Generate Monthly AI Operations Report -> Export downloadable CSV.' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Banner */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">EdgeTrust Demo Hub & Documentation</h3>
          <p className="text-xs text-slate-400">Step-by-step reviewer guide, AI governance model, user personas, and safety boundaries.</p>
        </div>
      </div>

      {/* 3-Minute Executive Demo Script Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            3-Minute Executive Reviewer Demo Journey
          </h4>
          <span className="text-xs font-mono text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-500/30">
            RECOMMENDED WALKTHROUGH
          </span>
        </div>

        <div className="space-y-3">
          {demoSteps.map((s) => (
            <div
              key={s.step}
              onClick={() => onNavigate(s.route)}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30">
                    {s.step}
                  </span>
                  <h5 className="text-xs font-bold text-white hover:text-blue-400 transition-colors">{s.title}</h5>
                </div>
                <p className="text-xs text-slate-400 pl-7">{s.desc}</p>
              </div>
              <span className="text-[11px] font-mono text-blue-400 hover:underline shrink-0 pt-1">Go to step →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Prohibited Boundaries */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          AI Safety Guardrails & Prohibited Actions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-xl space-y-2">
            <h5 className="font-bold text-red-300">Strict Non-Autonomous Prohibitions:</h5>
            <ul className="list-disc list-inside text-red-200/90 space-y-1">
              <li>Must never threaten a customer with illegal claims.</li>
              <li>Must never alter loan repayment principal or terms autonomously.</li>
              <li>Must never mark a customer profile as fraudulent without human review.</li>
              <li>Must never issue lending or creditworthiness underwriting decisions.</li>
              <li>Must never contact opted-out or vulnerable customers without clearance.</li>
            </ul>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl space-y-2">
            <h5 className="font-bold text-emerald-300">Human-in-the-Loop Approval Model:</h5>
            <ul className="list-disc list-inside text-emerald-200/90 space-y-1">
              <li>AI only provides recommendations & communication draft proposals.</li>
              <li>Final outreach dispatch requires explicit human operator clearance.</li>
              <li>All evidence & policy scans are verifiable in the 3-column workbench.</li>
              <li>100% of actions are recorded in the append-only correlation audit trail.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Slash Commands Cheatsheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          Supported Platform Workflow Commands
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <p className="text-blue-400 font-bold">/goal</p>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Autonomous thorough task execution until completion.</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <p className="text-blue-400 font-bold">/schedule</p>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Recurring evaluation suites or cron timer jobs.</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <p className="text-blue-400 font-bold">/grill-me</p>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Interactive design interview & policy alignment.</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <p className="text-blue-400 font-bold">/learn</p>
            <p className="text-[11px] text-slate-400 font-sans mt-1">Persist governance guidelines and setup context.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
