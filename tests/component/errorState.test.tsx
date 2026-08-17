import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { CaseDetailView } from '../../src/views/CaseDetailView';
import { AgentDetailView } from '../../src/views/AgentDetailView';

describe('6. Error States & Fallback Views', () => {
  it('renders graceful fallback and recovery button when a non-existent case ID is requested', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<CaseDetailView caseId="NON-EXISTENT-CASE" onNavigate={handleNavigate} />);

    expect(screen.getByText(/Case not found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Cases/i })).toBeInTheDocument();
  });

  it('renders graceful fallback and recovery button when a non-existent agent ID is requested', () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<AgentDetailView agentId="non-existent-agent-id" onNavigate={handleNavigate} />);

    expect(screen.getByText(/Agent not found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Agent Registry/i })).toBeInTheDocument();
  });
});
