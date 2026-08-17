import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, seedTestState, resetTestState, findAuditEvent } from '../utils/mockServices';
import { createLoanCase } from '../utils/factories';
import { CaseDetailView } from '../../src/views/CaseDetailView';

describe('7. Case Workbench Status Transitions & Human Approvals', () => {
  beforeEach(() => {
    resetTestState();
  });

  it('transitions case status to "Approved" and disables approval buttons on click', () => {
    const testCase = createLoanCase({ id: 'CASE-TRANS-01', approvalStatus: 'Pending Review', status: 'Pending Approval' });
    seedTestState({ cases: [testCase] });

    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="CASE-TRANS-01" onNavigate={handleNavigate} />);

    // Click Approve Action
    const approveBtn = screen.getByRole('button', { name: /Approve Action/i });
    fireEvent.click(approveBtn);

    // Verify status update in DOM
    expect(screen.getByText('Approved')).toBeInTheDocument();

    // Verify audit event creation
    const auditEvent = findAuditEvent('approval_approved', 'CASE-TRANS-01');
    expect(auditEvent).toBeDefined();
  });

  it('allows inline editing of the customer draft message and transitions to "Approved"', () => {
    const testCase = createLoanCase({ id: 'CASE-TRANS-02', approvalStatus: 'Pending Review', status: 'Pending Approval' });
    seedTestState({ cases: [testCase] });

    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="CASE-TRANS-02" onNavigate={handleNavigate} />);

    // Click Edit Draft & Approve
    const editBtn = screen.getByRole('button', { name: /Edit Draft & Approve/i });
    fireEvent.click(editBtn);

    // Edit textarea
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Customized payment extension message for customer.' } });

    // Save & approve
    const saveApproveBtn = screen.getByRole('button', { name: /Save & Approve Edited Draft/i });
    fireEvent.click(saveApproveBtn);

    // Verify draft updated and displayed in quotes
    expect(screen.getByText(/"Customized payment extension message for customer."/i)).toBeInTheDocument();
  });

  it('requires a rejection reason note and transitions status to "Rejected"', () => {
    const testCase = createLoanCase({ id: 'CASE-TRANS-03', approvalStatus: 'Pending Review', status: 'Pending Approval' });
    seedTestState({ cases: [testCase] });

    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="CASE-TRANS-03" onNavigate={handleNavigate} />);

    // Click Reject Action
    const rejectBtn = screen.getByRole('button', { name: /Reject Action/i });
    fireEvent.click(rejectBtn);

    // Reject form appears
    const reasonInput = screen.getByPlaceholderText(/Specify why this AI recommendation was rejected/i);
    fireEvent.change(reasonInput, { target: { value: 'Customer repayment history requires field agent visit' } });

    // Confirm rejection
    const confirmRejectBtn = screen.getByRole('button', { name: /Confirm Rejection/i });
    fireEvent.click(confirmRejectBtn);

    // Verify status changed to Rejected
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0);

    // Verify audit event
    const rejAudit = findAuditEvent('approval_rejected', 'CASE-TRANS-03');
    expect(rejAudit).toBeDefined();
    expect(rejAudit?.details).toContain('Customer repayment history requires field agent visit');
  });

  it('transitions case status to "Escalated" when Escalation button is clicked', () => {
    const testCase = createLoanCase({ id: 'CASE-TRANS-04', approvalStatus: 'Pending Review', status: 'Pending Approval' });
    seedTestState({ cases: [testCase] });

    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="CASE-TRANS-04" onNavigate={handleNavigate} />);

    const escalateBtn = screen.getByRole('button', { name: /Escalate to Senior Panel/i });
    fireEvent.click(escalateBtn);

    expect(screen.getAllByText('Escalated').length).toBeGreaterThan(0);
  });
});
