import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, seedTestState, resetTestState, findAuditEvent } from '../utils/mockServices';
import { createLoanCase, createUser } from '../utils/factories';
import { CaseDetailView } from '../../src/views/CaseDetailView';
import { AuditView } from '../../src/views/AuditView';
import { pauseAgent } from '../../src/services/api';

describe('9. Immutable Audit Event Creation & Export', () => {
  beforeEach(() => {
    resetTestState();
  });

  it('creates an audit event with correlation ID when sensitive PII is unmasked', () => {
    const testCase = createLoanCase({ id: 'CASE-AUDIT-01', maskedPhone: '+91 ****** 4821' });
    seedTestState({ cases: [testCase] });

    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="CASE-AUDIT-01" onNavigate={handleNavigate} />);

    // Click unmask button on Phone DataMask
    const revealBtns = screen.getAllByTitle(/Temporarily unmask/i);
    expect(revealBtns.length).toBeGreaterThan(0);
    fireEvent.click(revealBtns[0]);

    // Check audit event
    const unmaskAudit = findAuditEvent('data_unmasked', 'Phone');
    expect(unmaskAudit).toBeDefined();
    expect(unmaskAudit?.correlationId).toMatch(/^CORR-/);
  });

  it('records an audit event when an agent is paused', () => {
    const adminUser = createUser({ role: 'Admin', name: 'Admin Lead' });
    pauseAgent('agent-collections-conv', adminUser);

    const pauseAudit = findAuditEvent('agent_paused', 'agent-collections-conv');
    expect(pauseAudit).toBeDefined();
    expect(pauseAudit?.actorName).toBe('Admin Lead');
    expect(pauseAudit?.severity).toBe('Warning');
  });

  it('renders the audit log table in AuditView with search and filter controls', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<AuditView onNavigate={handleNavigate} />);

    expect(screen.getByText('Immutable Audit Trail')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });
});
