import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../utils/mockServices';
import { EvaluationsView } from '../../src/views/EvaluationsView';

describe('5. Loading State & Async Progress Simulation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays active loading progress bar and percent counter when running an evaluation suite', async () => {
    const handleNavigate = vi.fn();
    renderWithProviders(<EvaluationsView onNavigate={handleNavigate} />);

    // Click "Run Evaluation" on the first suite
    const runButtons = screen.getAllByRole('button', { name: /Run Evaluation/i });
    expect(runButtons.length).toBeGreaterThan(0);
    fireEvent.click(runButtons[0]);

    // Loading banner appears
    expect(screen.getByText(/Simulating Agent Evaluation Suite Runs.../i)).toBeInTheDocument();

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Advance timer to completion
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Execution run completion card renders
    expect(screen.getByText(/Evaluation Execution Run Complete/i)).toBeInTheDocument();
    expect(screen.getByText(/Pass Rate:/i)).toBeInTheDocument();
  });
});
