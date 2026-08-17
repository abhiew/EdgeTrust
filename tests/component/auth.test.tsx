import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { LoginView } from '../../src/views/LoginView';

describe('1. Demo Authentication & Login Workflow', () => {
  it('renders login view with headline, onboarding checklist, and synthetic demo banner', () => {
    const handleLoginSuccess = vi.fn();
    renderWithProviders(<LoginView onLoginSuccess={handleLoginSuccess} />);

    expect(screen.getByText(/Control every AI decision with confidence/i)).toBeInTheDocument();
    expect(screen.getByText(/Demo Sandbox Ready/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Demo Workspace \(1-Click Login\)/i)).toBeInTheDocument();
  });

  it('allows 1-click instant demo login and triggers success callback', () => {
    const handleLoginSuccess = vi.fn();
    renderWithProviders(<LoginView onLoginSuccess={handleLoginSuccess} />);

    const quickDemoBtn = screen.getByRole('button', { name: /Use Demo Workspace \(1-Click Login\)/i });
    fireEvent.click(quickDemoBtn);

    expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it('displays error state when invalid credentials are submitted', async () => {
    const handleLoginSuccess = vi.fn();
    renderWithProviders(<LoginView onLoginSuccess={handleLoginSuccess} />);

    // Clear email input
    const emailInput = screen.getByPlaceholderText(/admin@edgetrust.demo/i);
    fireEvent.change(emailInput, { target: { value: '' } });

    const form = emailInput.closest('form');
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    await waitFor(
      () => {
        expect(screen.getByText(/Please enter valid email and password/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(handleLoginSuccess).not.toHaveBeenCalled();
  });
});
