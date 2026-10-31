import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockRuns } from '../data/runs';
import { selectRuns } from '../utils/runs';
import { App } from '../App';

describe('Runs dashboard', () => {
  it('filters by status', () => {
    const filtered = selectRuns(mockRuns, '', 'failed', 'createdAt', true);

    expect(filtered).toHaveLength(2);
    expect(filtered.every(run => run.status === 'failed')).toBe(true);
  });

  it('searches names and repositories together with status', () => {
    expect(selectRuns(mockRuns, 'checkout', 'all', 'createdAt', true)).toHaveLength(1);
    expect(selectRuns(mockRuns, 'web-platform', 'succeeded', 'createdAt', true)).toHaveLength(0);
    expect(selectRuns(mockRuns, 'web-platform', 'running', 'createdAt', true)).toHaveLength(2);
  });

  it('updates status counts when searching', async () => {
    render(<App />);
    const search = await screen.findByRole('textbox', { name: 'Search runs' });
    fireEvent.change(search, { target: { value: 'auth' } });
    expect(screen.getByRole('button', { name: /All runs 1/i })).toBeInTheDocument();
  });

  it('opens and closes run details', async () => {
    vi.stubGlobal('scrollTo', vi.fn());
    render(<App />);

    const row = await screen.findByRole('row', {
      name: /Open details for Refactor authentication flow/,
    });
    fireEvent.click(row);

    expect(screen.getByRole('complementary', { name: 'Run details' })).toBeInTheDocument();
    expect(screen.getByText('Execution details')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    await waitFor(() => {
      expect(screen.queryByRole('complementary', { name: 'Run details' })).not.toBeInTheDocument();
    });
  });
});
