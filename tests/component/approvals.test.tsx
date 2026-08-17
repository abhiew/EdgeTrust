import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, seedTestState, resetTestState } from '../utils/mockServices';
import { createApproval, createLoanCase } from '../utils/factories';
import { ApprovalsView } from '../../src/views/ApprovalsView';

describe('8. Approval Queue Filtering & Status Transitions', () => {
  beforeEach(() => {
    resetTestState();
  });

  it('renders queue tabs, waiting counts, and approval cards', () => {
    const app1 = createApproval({ id: 'APP-Q-01', caseId: 'CASE-Q-01', priority: 'High', status: 'Pending Review' });
    const case1 = createLoanCase({ id: 'CASE-Q-01' });
    seedTestState({ approvals: [app1], cases: [case1] });

    const handleNavigate = vi.fn();
    renderWithProviders(<ApprovalsView onNavigate={handleNavigate} />);

    expect(screen.getByText('Waiting for Review')).toBeInTheDocument();
    expect(screen.getByText('High-Priority Queue')).toBeInTheDocument();
    expect(screen.getByText('CASE-Q-01')).toBeInTheDocument();
  });

  it('filters queue items by risk tab', () => {
    const highRiskApp = createApproval({ id: 'APP-HIGH', caseId: 'CASE-HIGH', riskLevel: 'High', status: 'Pending Review' });
    const lowRiskApp = createApproval({ id: 'APP-LOW', caseId: 'CASE-LOW', riskLevel: 'Low', status: 'Pending Review' });
    seedTestState({ approvals: [highRiskApp, lowRiskApp] });

    const handleNavigate = vi.fn();
    renderWithProviders(<ApprovalsView onNavigate={handleNavigate} />);

    // Click "High Risk" tab filter
    const highRiskTab = screen.getByRole('button', { name: /^High Risk$/i });
    fireEvent.click(highRiskTab);

    // Only high risk item is shown
    expect(screen.getByText('CASE-HIGH')).toBeInTheDocument();
    expect(screen.queryByText('CASE-LOW')).not.toBeInTheDocument();
  });
});
