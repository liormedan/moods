import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsightsPanel from '@/components/mood/InsightsPanel';

// Mock fetch
global.fetch = jest.fn();

const mockInsights = [
  {
    id: '1',
    type: 'recommendation' as const,
    title: 'המלצה חשובה',
    description: 'זהו תיאור של ההמלצה',
    priority: 'high' as const,
    actionable: true,
    isRead: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'אזהרה',
    description: 'זהו תיאור של האזהרה',
    priority: 'medium' as const,
    actionable: false,
    isRead: true,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    type: 'celebration' as const,
    title: 'הישג!',
    description: 'כל הכבוד על ההישג',
    priority: 'low' as const,
    actionable: false,
    isRead: false,
    createdAt: '2024-01-03T00:00:00Z',
  },
];

describe('InsightsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders insights panel with title', () => {
    render(<InsightsPanel />);
    expect(screen.getByText('תובנות והמלצות')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<InsightsPanel />);
    expect(screen.getByText('טוען תובנות...')).toBeInTheDocument();
  });

  it('displays insights when loaded', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('המלצה חשובה')).toBeInTheDocument();
      expect(screen.getByText('אזהרה')).toBeInTheDocument();
      expect(screen.getByText('הישג!')).toBeInTheDocument();
    });
  });

  it('shows unread count badge', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('2 חדשות')).toBeInTheDocument();
    });
  });

  it('shows high priority count badge', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('1 חשובות')).toBeInTheDocument();
    });
  });

  it('filters insights by unread only', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('המלצה חשובה')).toBeInTheDocument();
      expect(screen.getByText('אזהרה')).toBeInTheDocument();
      expect(screen.getByText('הישג!')).toBeInTheDocument();
    });

    const unreadOnlyButton = screen.getByText('רק לא נקראו');
    fireEvent.click(unreadOnlyButton);

    // Should refetch with unreadOnly=true
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('unreadOnly=true')
    );
  });

  it('filters insights by type', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('המלצה חשובה')).toBeInTheDocument();
    });

    const typeSelect = screen.getByDisplayValue('כל הסוגים');
    fireEvent.change(typeSelect, { target: { value: 'recommendation' } });

    // Should refetch with type=recommendation
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('type=recommendation')
    );
  });

  it('generates new insights when button is clicked', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockInsights }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: '4', type: 'recommendation', title: 'תובנה חדשה' }],
        }),
      });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('המלצה חשובה')).toBeInTheDocument();
    });

    const generateButton = screen.getByText('צור תובנות');
    fireEvent.click(generateButton);

    // Should call POST to generate insights
    expect(global.fetch).toHaveBeenCalledWith('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    });
  });

  it('marks insight as read when button is clicked', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockInsights }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { ...mockInsights[0], isRead: true } }),
      });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('המלצה חשובה')).toBeInTheDocument();
    });

    const markAsReadButton = screen.getByText('סמן כנקרא');
    fireEvent.click(markAsReadButton);

    // Should call PATCH to mark as read
    expect(global.fetch).toHaveBeenCalledWith('/api/insights/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    });
  });

  it('shows help resources when high priority warnings exist', async () => {
    const highPriorityWarning = {
      id: '4',
      type: 'warning' as const,
      title: 'אזהרה חשובה',
      description: 'מצב רוח נמוך מתמשך',
      priority: 'high' as const,
      actionable: true,
      isRead: false,
      createdAt: '2024-01-04T00:00:00Z',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [...mockInsights, highPriorityWarning] }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('משאבי עזרה זמינים')).toBeInTheDocument();
      expect(screen.getByText(/קו חם/)).toBeInTheDocument();
      expect(screen.getByText(/ער"ן/)).toBeInTheDocument();
    });
  });

  it('handles fetch errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch insights')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch insights')).toBeInTheDocument();
    });
  });

  it('shows empty state when no insights available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      expect(screen.getByText('אין תובנות זמינות')).toBeInTheDocument();
    });
  });

  it('displays priority badges with correct colors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      const highPriorityBadge = screen.getByText('גבוה');
      const mediumPriorityBadge = screen.getByText('בינוני');
      const lowPriorityBadge = screen.getByText('נמוך');

      expect(highPriorityBadge).toBeInTheDocument();
      expect(mediumPriorityBadge).toBeInTheDocument();
      expect(lowPriorityBadge).toBeInTheDocument();
    });
  });

  it('displays actionable badge for actionable insights', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockInsights }),
    });

    render(<InsightsPanel />);

    await waitFor(() => {
      const actionableBadge = screen.getByText('פעיל');
      expect(actionableBadge).toBeInTheDocument();
    });
  });
});






