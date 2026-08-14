import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';

// Views
import { LoginView } from '../src/views/LoginView';
import { DashboardView } from '../src/views/DashboardView';
import { AgentsView } from '../src/views/AgentsView';
import { AgentDetailView } from '../src/views/AgentDetailView';
import { AgentRunsView } from '../src/views/AgentRunsView';
import { CasesView } from '../src/views/CasesView';
import { CaseDetailView } from '../src/views/CaseDetailView';
import { ApprovalsView } from '../src/views/ApprovalsView';
import { EvaluationsView } from '../src/views/EvaluationsView';
import { EvaluationDetailView } from '../src/views/EvaluationDetailView';
import { PoliciesView } from '../src/views/PoliciesView';
import { PolicyDetailView } from '../src/views/PolicyDetailView';
import { AuditView } from '../src/views/AuditView';
import { IncidentsView } from '../src/views/IncidentsView';
import { ReportsView } from '../src/views/ReportsView';
import { SettingsView } from '../src/views/SettingsView';
import { HelpView } from '../src/views/HelpView';
import { AppShell } from '../src/components/common/AppShell';

const wrapWithContext = (element: React.ReactElement) => (
  <AuthProvider>
    <ToastProvider>{element}</ToastProvider>
  </AuthProvider>
);

describe('EdgeTrust Route Smoke & Render Suite (All 17 Views)', () => {
  const noop = () => {};

  it('1. LoginView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<LoginView onLoginSuccess={noop} />));
    expect(html).toContain('EdgeTrust');
    expect(html).toContain('Control every AI decision with confidence');
    expect(html).toContain('Use Demo Workspace (1-Click Login)');
  });

  it('2. DashboardView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<DashboardView onNavigate={noop} />));
    expect(html).toContain('Executive Control Tower View');
    expect(html).toContain('12,486');
    expect(html).toContain('Review Approvals');
  });

  it('3. AgentsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<AgentsView onNavigate={noop} />));
    expect(html).toContain('Registered AI Agents');
    expect(html).toContain('Collections Conversation Agent');
  });

  it('4. AgentDetailView renders cleanly', () => {
    const html = renderToString(
      wrapWithContext(<AgentDetailView agentId="agent-collections-conv" onNavigate={noop} />)
    );
    expect(html).toContain('Collections Conversation Agent');
    expect(html).toContain('Rollback Version');
  });

  it('5. AgentRunsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<AgentRunsView onNavigate={noop} />));
    expect(html).toContain('Agent Execution Log (Runs)');
    expect(html).toContain('RUN-88192');
  });

  it('6. CasesView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<CasesView onNavigate={noop} />));
    expect(html).toContain('Synthetic Loan Repayment Accounts');
    expect(html).toContain('CASE-9021');
  });

  it('7. CaseDetailView (3-Column Workbench) renders cleanly', () => {
    const html = renderToString(wrapWithContext(<CaseDetailView caseId="CASE-9021" onNavigate={noop} />));
    expect(html).toContain('Customer Profile &amp; History');
    expect(html).toContain('AI Collections Recommendation');
    expect(html).toContain('Human Approval Workbench');
    expect(html).toContain('Approve Action');
  });

  it('8. ApprovalsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<ApprovalsView onNavigate={noop} />));
    expect(html).toContain('Waiting for Review');
    expect(html).toContain('High-Priority Queue');
  });

  it('9. EvaluationsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<EvaluationsView onNavigate={noop} />));
    expect(html).toContain('AI Evaluation Studio');
    expect(html).toContain('Compare Agent v2.3.0 vs v2.4.1');
  });

  it('10. EvaluationDetailView renders cleanly', () => {
    const html = renderToString(
      wrapWithContext(<EvaluationDetailView evaluationId="EV-RUN-241" onNavigate={noop} />)
    );
    expect(html).toContain('BENCHMARK COMPARISON');
    expect(html).toContain('Collections Conversation Agent Version Evaluation');
    expect(html).toContain('Agent v2.3.0');
    expect(html).toContain('Agent v2.4.1');
  });

  it('11. PoliciesView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<PoliciesView onNavigate={noop} />));
    expect(html).toContain('Compliance Policy Engine');
    expect(html).toContain('POL-01');
    expect(html).toContain('Create New Policy');
  });

  it('12. PolicyDetailView renders cleanly', () => {
    const html = renderToString(
      wrapWithContext(<PolicyDetailView policyId="POL-01" onNavigate={noop} />)
    );
    expect(html).toContain('Rule DSL Condition');
    expect(html).toContain('POL-01');
  });

  it('13. AuditView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<AuditView onNavigate={noop} />));
    expect(html).toContain('Immutable Audit Trail');
    expect(html).toContain('Export CSV');
  });

  it('14. IncidentsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<IncidentsView onNavigate={noop} />));
    expect(html).toContain('AI Safety &amp; Incident Management');
    expect(html).toContain('INC-1042');
  });

  it('15. ReportsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<ReportsView onNavigate={noop} />));
    expect(html).toContain('Audit-Ready Reports Generator');
    expect(html).toContain('Monthly AI Operations Report');
  });

  it('16. SettingsView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<SettingsView onNavigate={noop} />));
    expect(html).toContain('Platform Settings &amp; RBAC Governance');
    expect(html).toContain('Role-Based Access Control (RBAC Matrix)');
  });

  it('17. HelpView renders cleanly', () => {
    const html = renderToString(wrapWithContext(<HelpView onNavigate={noop} />));
    expect(html).toContain('EdgeTrust Demo Hub &amp; Documentation');
    expect(html).toContain('3-Minute Executive Reviewer Demo Journey');
  });

  it('18. AppShell Navigation Shell renders cleanly', () => {
    const html = renderToString(
      wrapWithContext(
        <AppShell
          currentRoute="/dashboard"
          onNavigate={noop}
          pageTitle="Executive Overview"
          pageSubtitle="Test Subtitle"
        >
          <div>Child Content</div>
        </AppShell>
      )
    );
    expect(html).toContain('EdgeTrust');
    expect(html).toContain('Executive Overview');
    expect(html).toContain('Child Content');
    expect(html).toContain('Admin');
  });
});
