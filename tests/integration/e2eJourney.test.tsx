import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, seedTestState, resetTestState, findAuditEvent } from '../utils/mockServices';
import { createLoanCase, createApproval } from '../utils/factories';
import { App } from '../../src/App';

describe('10. End-to-End Operational Journey Integration Test', () => {
  beforeEach(() => {
    resetTestState();
    window.location.hash = '#/login';
  });

  it('completes the full operator journey: Login -> Dashboard -> Approvals -> Workbench Approval -> Audit Trail', async () => {
    const highRiskCase = createLoanCase({
      id: 'CASE-E2E-99',
      outstandingAmountInr: 45000,
      daysPastDue: 24,
      riskBand: 'High',
      approvalStatus: 'Pending Review',
      status: 'Pending Approval'
    });

    const approvalItem = createApproval({
      id: 'APP-E2E-99',
      caseId: 'CASE-E2E-99',
      priority: 'High',
      status: 'Pending Review'
    });

    seedTestState({
      cases: [highRiskCase],
      approvals: [approvalItem]
    });

    renderWithProviders(<App />);

    // Step 1: Demo Login
    expect(screen.getByText(/Control every AI decision with confidence/i)).toBeInTheDocument();
    const quickDemoBtn = screen.getByRole('button', { name: /Use Demo Workspace \(1-Click Login\)/i });
    fireEvent.click(quickDemoBtn);

    // Step 2: Executive Dashboard
    await waitFor(() => {
      expect(screen.getByText(/Executive Control Tower View/i)).toBeInTheDocument();
    });
    expect(screen.getByText('12,486')).toBeInTheDocument();

    // Step 3: Navigate to Approval Queue
    const approvalQueueLink = screen.getByText('Approval Queue');
    fireEvent.click(approvalQueueLink);

    await waitFor(() => {
      expect(screen.getByText('Waiting for Review')).toBeInTheDocument();
    });
    expect(screen.getByText('CASE-E2E-99')).toBeInTheDocument();

    // Step 4: Open Case Detail in 3-Column Workbench
    const openCaseBtn = screen.getByText('CASE-E2E-99');
    fireEvent.click(openCaseBtn);

    await waitFor(() => {
      expect(screen.getByText(/AI Collections Recommendation/i)).toBeInTheDocument();
      expect(screen.getByText(/Human Approval Workbench/i)).toBeInTheDocument();
    });

    // Step 5: Approve Case Action
    const approveActionBtn = screen.getByRole('button', { name: /Approve Action/i });
    fireEvent.click(approveActionBtn);

    // Step 6: Verify Immutable Audit Log
    const auditLink = screen.getByText('Audit Log');
    fireEvent.click(auditLink);

    await waitFor(() => {
      expect(screen.getByText(/Immutable Audit Trail/i)).toBeInTheDocument();
    });

    // Confirm that the approval audit event exists
    const auditRecord = findAuditEvent('approval_approved', 'CASE-E2E-99');
    expect(auditRecord).toBeDefined();
    expect(auditRecord?.actorName).toBe('EdgeTrust SuperAdmin');
  });
});
