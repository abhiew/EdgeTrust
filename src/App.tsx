import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/common/AppShell';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { AgentsView } from './views/AgentsView';
import { AgentDetailView } from './views/AgentDetailView';
import { AgentRunsView } from './views/AgentRunsView';
import { CasesView } from './views/CasesView';
import { CaseDetailView } from './views/CaseDetailView';
import { ApprovalsView } from './views/ApprovalsView';
import { EvaluationsView } from './views/EvaluationsView';
import { EvaluationDetailView } from './views/EvaluationDetailView';
import { PoliciesView } from './views/PoliciesView';
import { PolicyDetailView } from './views/PolicyDetailView';
import { AuditView } from './views/AuditView';
import { IncidentsView } from './views/IncidentsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { HelpView } from './views/HelpView';

const RouterContainer: React.FC = () => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash.replace('#', '') || '/dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace('#', '') || '/dashboard';
      setCurrentRoute(route);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  };

  // If not logged in, show Login page
  if (!user && currentRoute !== '/login') {
    return <LoginView onLoginSuccess={() => navigate('/dashboard')} />;
  }

  if (currentRoute === '/login') {
    return <LoginView onLoginSuccess={() => navigate('/dashboard')} />;
  }

  // Page title mapping
  let pageTitle = 'Executive Overview';
  let pageSubtitle = 'Monitor AI agent performance, compliance risks, and business ROI across your NBFC workflows.';

  if (currentRoute.startsWith('/agents/')) {
    if (currentRoute.includes('/runs')) {
      pageTitle = 'Agent Execution Logs (Runs)';
      pageSubtitle = 'Individual AI recommendation runs and execution traces.';
    } else {
      pageTitle = 'Agent Workbench & Specifications';
      pageSubtitle = 'Manage capabilities, version deployments, and permission scopes.';
    }
  } else if (currentRoute === '/agents') {
    pageTitle = 'Agent Registry';
    pageSubtitle = 'Monitor health, trust scores, and operational risk tiers across registered AI agents.';
  } else if (currentRoute.startsWith('/cases/')) {
    pageTitle = 'Loan Account Workbench & Human Approval';
    pageSubtitle = 'Inspect customer history, AI recommendations, verifiable evidence, and policy compliance.';
  } else if (currentRoute === '/cases') {
    pageTitle = 'Operations Loan Accounts Workspace';
    pageSubtitle = 'Filter and triage synthetic collection cases with PII data masking.';
  } else if (currentRoute === '/approvals') {
    pageTitle = 'Human-in-the-Loop Approval Queue';
    pageSubtitle = 'Review high-risk customer touchpoint recommendations before dispatch.';
  } else if (currentRoute.startsWith('/evaluations/')) {
    pageTitle = 'Version Comparison Workbench';
    pageSubtitle = 'Side-by-side benchmark comparison of Agent releases.';
  } else if (currentRoute === '/evaluations') {
    pageTitle = 'AI Evaluation Studio';
    pageSubtitle = 'Test agent versions against safety, grounding, quality, and prompt injection suites.';
  } else if (currentRoute.startsWith('/policies/')) {
    pageTitle = 'Compliance Policy Rule Details';
    pageSubtitle = 'DSL rule conditions, escalation targets, and version history.';
  } else if (currentRoute === '/policies') {
    pageTitle = 'Compliance Policy Engine';
    pageSubtitle = 'Configure financial collection safety guardrails, consent rules, and human approval conditions.';
  } else if (currentRoute === '/audit') {
    pageTitle = 'Immutable Audit Log';
    pageSubtitle = 'Append-only audit trail of all AI recommendations, policy evaluations, and human decisions.';
  } else if (currentRoute === '/incidents') {
    pageTitle = 'AI Incidents & Emergency Containment';
    pageSubtitle = 'Triage model drift, policy violations, and prompt injection signals.';
  } else if (currentRoute === '/reports') {
    pageTitle = 'Audit-Ready Reports Generator';
    pageSubtitle = 'Generate executive ROI summaries, policy compliance reports, and operational metrics.';
  } else if (currentRoute === '/settings') {
    pageTitle = 'Workspace Settings & RBAC';
    pageSubtitle = 'Configure workspace details, role access permissions matrix, and product analytics.';
  } else if (currentRoute === '/help') {
    pageTitle = 'Help & Reviewer Demo Hub';
    pageSubtitle = 'Interactive 3-minute demo script guide, user personas, and AI safety guardrails.';
  }

  // Render view container
  const renderView = () => {
    if (currentRoute === '/dashboard') return <DashboardView onNavigate={navigate} />;
    if (currentRoute === '/agents') return <AgentsView onNavigate={navigate} />;
    if (currentRoute.startsWith('/agents/')) {
      const parts = currentRoute.split('/');
      const agentId = parts[2];
      if (currentRoute.includes('/runs')) return <AgentRunsView onNavigate={navigate} />;
      return <AgentDetailView agentId={agentId} onNavigate={navigate} />;
    }
    if (currentRoute === '/cases') return <CasesView onNavigate={navigate} />;
    if (currentRoute.startsWith('/cases/')) {
      const caseId = currentRoute.split('/')[2];
      return <CaseDetailView caseId={caseId} onNavigate={navigate} />;
    }
    if (currentRoute === '/approvals') return <ApprovalsView onNavigate={navigate} />;
    if (currentRoute === '/evaluations') return <EvaluationsView onNavigate={navigate} />;
    if (currentRoute.startsWith('/evaluations/')) {
      const evalId = currentRoute.split('/')[2];
      return <EvaluationDetailView evaluationId={evalId} onNavigate={navigate} />;
    }
    if (currentRoute === '/policies') return <PoliciesView onNavigate={navigate} />;
    if (currentRoute.startsWith('/policies/')) {
      const polId = currentRoute.split('/')[2];
      return <PolicyDetailView policyId={polId} onNavigate={navigate} />;
    }
    if (currentRoute === '/audit') return <AuditView onNavigate={navigate} />;
    if (currentRoute === '/incidents') return <IncidentsView onNavigate={navigate} />;
    if (currentRoute === '/reports') return <ReportsView onNavigate={navigate} />;
    if (currentRoute === '/settings') return <SettingsView onNavigate={navigate} />;
    if (currentRoute === '/help') return <HelpView onNavigate={navigate} />;

    return <DashboardView onNavigate={navigate} />;
  };

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={navigate}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
    >
      {renderView()}
    </AppShell>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterContainer />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
