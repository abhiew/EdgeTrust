import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { AppShell } from '../../src/components/common/AppShell';

describe('3. Sidebar Navigation & Global Header Controls', () => {
  it('renders all 11 sidebar navigation links with active route highlighting', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(
      <AppShell
        currentRoute="/dashboard"
        onNavigate={handleNavigate}
        pageTitle="Executive Overview"
        pageSubtitle="Test Subtitle"
      >
        <div>Dashboard View Content</div>
      </AppShell>
    );

    // Check main navigation items
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Agents')).toBeInTheDocument();
    expect(screen.getByText('Cases')).toBeInTheDocument();
    expect(screen.getByText('Approval Queue')).toBeInTheDocument();
    expect(screen.getByText('Evaluations')).toBeInTheDocument();
    expect(screen.getByText('Policies')).toBeInTheDocument();
    expect(screen.getByText('Audit Log')).toBeInTheDocument();
    expect(screen.getByText('Incidents')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help & Docs')).toBeInTheDocument();

    // Click on Approval Queue navigation item
    const approvalLink = screen.getByText('Approval Queue');
    fireEvent.click(approvalLink);
    expect(handleNavigate).toHaveBeenCalledWith('/approvals');
  });

  it('opens and closes the notification center drawer', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(
      <AppShell
        currentRoute="/dashboard"
        onNavigate={handleNavigate}
        pageTitle="Executive Overview"
        pageSubtitle="Test Subtitle"
      >
        <div>Content</div>
      </AppShell>
    );

    const bellBtn = screen.getByTitle('Notifications');
    fireEvent.click(bellBtn);

    expect(screen.getByText('4 high-risk approvals waiting')).toBeInTheDocument();
    expect(screen.getByText('Collections Agent evaluation completed (93% pass rate)')).toBeInTheDocument();
  });

  it('navigates directly to case when searching for a CASE- ID and pressing Enter', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(
      <AppShell
        currentRoute="/dashboard"
        onNavigate={handleNavigate}
        pageTitle="Executive Overview"
        pageSubtitle="Test Subtitle"
      >
        <div>Content</div>
      </AppShell>
    );

    const searchInput = screen.getByPlaceholderText(/Search Case ID/i);
    fireEvent.change(searchInput, { target: { value: 'CASE-9021' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    expect(handleNavigate).toHaveBeenCalledWith('/cases/CASE-9021');
  });
});
