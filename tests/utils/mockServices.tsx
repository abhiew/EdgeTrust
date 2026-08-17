import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../../src/context/AuthContext';
import { ToastProvider } from '../../src/context/ToastContext';
import { getAuditEvents } from '../../src/services/auditLogger';
import { LoanCase, Agent, Approval, Policy, Incident, AuditEvent } from '../../src/types';

const AGENTS_KEY = 'edgetrust_agents_v1';
const CASES_KEY = 'edgetrust_cases_v1';
const APPROVALS_KEY = 'edgetrust_approvals_v1';
const POLICIES_KEY = 'edgetrust_policies_v1';
const INCIDENTS_KEY = 'edgetrust_incidents_v1';

/**
 * Seed LocalStorage with specific mock datasets for deterministic component tests
 */
export function seedTestState(data: {
  cases?: LoanCase[];
  agents?: Agent[];
  approvals?: Approval[];
  policies?: Policy[];
  incidents?: Incident[];
}) {
  if (data.cases) localStorage.setItem(CASES_KEY, JSON.stringify(data.cases));
  if (data.agents) localStorage.setItem(AGENTS_KEY, JSON.stringify(data.agents));
  if (data.approvals) localStorage.setItem(APPROVALS_KEY, JSON.stringify(data.approvals));
  if (data.policies) localStorage.setItem(POLICIES_KEY, JSON.stringify(data.policies));
  if (data.incidents) localStorage.setItem(INCIDENTS_KEY, JSON.stringify(data.incidents));
}

/**
 * Reset all test storage keys
 */
export function resetTestState() {
  localStorage.clear();
}

/**
 * Helper to get all currently logged audit events
 */
export function getLastAuditEvent(): AuditEvent | undefined {
  const events = getAuditEvents();
  return events[0];
}

/**
 * Find audit event by eventType and resourceId
 */
export function findAuditEvent(eventType: string, resourceId?: string): AuditEvent | undefined {
  const events = getAuditEvents();
  return events.find(
    (e) => e.eventType === eventType && (!resourceId || e.resourceId === resourceId)
  );
}

/**
 * Custom render helper that wraps components with all necessary EdgeTrust providers (Auth, Toast)
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialRole?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: ExtendedRenderOptions
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}
