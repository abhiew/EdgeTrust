import { describe, it, expect } from 'vitest';
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { AppShell } from '../../src/components/common/AppShell';
import { SettingsView } from '../../src/views/SettingsView';

describe('2. Role-Based Access Control (RBAC) & Role Selection', () => {
  it('displays the active role in the AppShell topbar pill and switches roles on click', () => {
    const handleNavigate = () => {};
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

    // Initial role is Admin
    const roleButton = screen.getByTitle(/Switch Role for Demo Review/i);
    expect(roleButton).toHaveTextContent(/Admin/i);

    // Open role dropdown
    fireEvent.click(roleButton);
    expect(screen.getByText(/SELECT DEMO ROLE \(RBAC VIEW\)/i)).toBeInTheDocument();

    // Select CEO
    const ceoOption = screen.getByRole('button', { name: /^CEO$/i });
    fireEvent.click(ceoOption);

    // Role pill now displays CEO
    expect(roleButton).toHaveTextContent(/CEO/i);
  });

  it('renders the complete 7-role RBAC governance matrix in SettingsView', () => {
    const handleNavigate = () => {};
    renderWithProviders(<SettingsView onNavigate={handleNavigate} />);

    expect(screen.getByText(/Role-Based Access Control \(RBAC Matrix\)/i)).toBeInTheDocument();
    expect(screen.getAllByText('CEO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('COO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Operations Manager').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Compliance Manager').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI Product Manager').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Collection Agent').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
  });
});
