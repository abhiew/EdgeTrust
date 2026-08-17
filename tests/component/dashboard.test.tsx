import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { DashboardView } from '../../src/views/DashboardView';

describe('4. Dashboard Data Loading & Executive Overview', () => {
  it('loads and renders top 6 executive KPI cards with values and labels', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<DashboardView onNavigate={handleNavigate} />);

    // Verify KPI metric values
    expect(screen.getByText('12,486')).toBeInTheDocument(); // Cases processed
    expect(screen.getByText('72.4%')).toBeInTheDocument();  // Automation rate
    expect(screen.getByText('18.9%')).toBeInTheDocument();  // Human review rate
    expect(screen.getByText('97.8%')).toBeInTheDocument();  // Policy compliance
    expect(screen.getAllByText(/₹2.40/).length).toBeGreaterThan(0);  // Avg AI cost
    expect(screen.getByText('₹8.6L')).toBeInTheDocument();  // Operational savings
  });

  it('triggers quick action navigation to approval queue, evaluations, and audit trail', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<DashboardView onNavigate={handleNavigate} />);

    const reviewApprovalsBtn = screen.getByRole('button', { name: /Review Approvals/i });
    fireEvent.click(reviewApprovalsBtn);
    expect(handleNavigate).toHaveBeenCalledWith('/approvals');

    const runEvalBtn = screen.getByRole('button', { name: /Run Evaluation/i });
    fireEvent.click(runEvalBtn);
    expect(handleNavigate).toHaveBeenCalledWith('/evaluations');

    const auditBtn = screen.getByRole('button', { name: /Audit Trail/i });
    fireEvent.click(auditBtn);
    expect(handleNavigate).toHaveBeenCalledWith('/audit');
  });

  it('renders automation funnel steps and agent health overview cards', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<DashboardView onNavigate={handleNavigate} />);

    expect(screen.getByText(/Automation & Approval Funnel/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Value & ROI Impact/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Collections Conversation Agent/).length).toBeGreaterThan(0);
  });
});
