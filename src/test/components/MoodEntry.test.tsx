import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import MoodEntry from '@/components/mood/MoodEntry';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock console methods
const mockConsoleError = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('MoodEntry Component', () => {
  const mockSession = {
    user: {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
    },
    expires: '2024-12-31',
  };

  const mockMoodEntry = {
    id: 'entry123',
    moodValue: 7,
    notes: 'Had a good day',
    date: '2024-01-15',
    userId: 'user123',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    });
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<MoodEntry />);
      expect(screen.getByText('תיעוד מצב רוח יומי')).toBeInTheDocument();
    });

    it('shows login message when not authenticated', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn(),
      });

      render(<MoodEntry />);
      expect(
        screen.getByText('יש להתחבר כדי לתעד מצב רוח')
      ).toBeInTheDocument();
    });

    it('renders all form elements', () => {
      render(<MoodEntry />);

      expect(screen.getByLabelText('תאריך')).toBeInTheDocument();
      expect(screen.getByText('איך אתה מרגיש היום?')).toBeInTheDocument();
      expect(screen.getByLabelText('הערות (אופציונלי)')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'שמור מצב רוח' })
      ).toBeInTheDocument();
    });

    it('renders with initial data when provided', () => {
      const initialData = {
        moodValue: 8,
        notes: 'Initial notes',
        date: '2024-01-15',
      };

      render(<MoodEntry initialData={initialData} />);

      expect(screen.getByDisplayValue('8')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Initial notes')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    });

    it('shows editing title when isEditing is true', () => {
      render(<MoodEntry isEditing={true} />);
      expect(screen.getByText('עריכת מצב רוח')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('updates mood value when slider changes', () => {
      render(<MoodEntry />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '9' } });

      expect(screen.getByDisplayValue('9')).toBeInTheDocument();
      expect(screen.getByText('מצוין')).toBeInTheDocument();
      expect(screen.getByText('😊')).toBeInTheDocument();
    });

    it('updates notes when textarea changes', () => {
      render(<MoodEntry />);

      const textarea = screen.getByPlaceholderText(
        'איך היה היום שלך? מה השפיע על מצב הרוח שלך?'
      );
      fireEvent.change(textarea, { target: { value: 'New notes' } });

      expect(textarea).toHaveValue('New notes');
    });

    it('updates date when date input changes', () => {
      render(<MoodEntry />);

      const dateInput = screen.getByLabelText('תאריך');
      fireEvent.change(dateInput, { target: { value: '2024-01-20' } });

      expect(dateInput).toHaveValue('2024-01-20');
    });

    it('shows correct mood emoji and description for different values', () => {
      render(<MoodEntry />);

      const slider = screen.getByRole('slider');

      // Test mood value 1
      fireEvent.change(slider, { target: { value: '1' } });
      expect(screen.getByText('😢')).toBeInTheDocument();
      expect(screen.getByText('רע מאוד')).toBeInTheDocument();

      // Test mood value 5
      fireEvent.change(slider, { target: { value: '5' } });
      expect(screen.getByText('😐')).toBeInTheDocument();
      expect(screen.getByText('בסדר')).toBeInTheDocument();

      // Test mood value 10
      fireEvent.change(slider, { target: { value: '10' } });
      expect(screen.getByText('😊')).toBeInTheDocument();
      expect(screen.getByText('מצוין')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('creates new mood entry successfully', async () => {
      // Mock the initial check for existing entry (returns no existing entry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      // Mock the successful creation
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockMoodEntry }),
      } as Response);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      render(<MoodEntry onSuccess={onSuccess} onError={onError} />);

      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The component makes multiple API calls, so we check the last one (the actual submission)
        const calls = mockFetch.mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBe('/api/mood');
        expect(lastCall[1]).toEqual({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodValue: 5,
            notes: '',
            date: expect.any(String),
          }),
        });
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
        expect(screen.getByText('מצב הרוח נשמר בהצלחה!')).toBeInTheDocument();
      });
    });

    it('updates existing mood entry when editing', async () => {
      // Mock existing entry check
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockMoodEntry] }),
      } as Response);

      // Mock update response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { ...mockMoodEntry, moodValue: 9 },
        }),
      } as Response);

      const onSuccess = jest.fn();
      render(<MoodEntry isEditing={true} onSuccess={onSuccess} />);

      // Wait for existing entry to be loaded
      await waitFor(() => {
        expect(screen.getByDisplayValue('7')).toBeInTheDocument();
      });

      // Change mood value
      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '9' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'עדכן מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The component makes multiple API calls, so we check the last one (the actual submission)
        const calls = mockFetch.mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBe(`/api/mood/${mockMoodEntry.id}`);
        expect(lastCall[1]).toEqual({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodValue: 9,
            notes: 'Had a good day',
            date: '2024-01-15',
          }),
        });
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
        expect(screen.getByText('מצב הרוח עודכן בהצלחה!')).toBeInTheDocument();
      });
    });

    it('handles API errors gracefully', async () => {
      // Mock the initial check for existing entry (returns no existing entry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      const errorMessage = 'שגיאה בשמירת מצב הרוח';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage }),
      } as Response);

      const onError = jest.fn();
      render(<MoodEntry onError={onError} />);

      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(errorMessage);
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('shows loading state during submission', async () => {
      // Mock a delayed response
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => mockMoodEntry,
                } as Response),
              100
            )
          )
      );

      render(<MoodEntry />);

      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      expect(screen.getByText('שומר...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Existing Entry Handling', () => {
    it('shows existing entry info when entry exists for selected date', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ entries: [mockMoodEntry] }),
      } as Response);

      render(<MoodEntry />);

      await waitFor(() => {
        expect(
          screen.getByText(/כבר קיים תיעוד מצב רוח לתאריך זה/)
        ).toBeInTheDocument();
        expect(screen.getByText('לחץ כאן לעריכה')).toBeInTheDocument();
      });
    });

    it('populates form with existing data when edit button is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [mockMoodEntry] }),
      } as Response);

      render(<MoodEntry />);

      await waitFor(() => {
        expect(screen.getByText('לחץ כאן לעריכה')).toBeInTheDocument();
      });

      const editButton = screen.getByText('לחץ כאן לעריכה');
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('7')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Had a good day')).toBeInTheDocument();
    });

    it('clears error and success messages when date changes', async () => {
      // Mock the initial check for existing entry (returns no existing entry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Some error' }),
      } as Response);

      render(<MoodEntry />);

      // Submit to trigger error
      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Some error')).toBeInTheDocument();
      });

      // Change date
      const dateInput = screen.getByLabelText('תאריך');
      fireEvent.change(dateInput, { target: { value: '2024-01-16' } });

      // Error should be cleared
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('requires date field', () => {
      render(<MoodEntry />);

      const dateInput = screen.getByLabelText('תאריך');
      expect(dateInput).toHaveAttribute('required');
    });

    it('limits date to today or earlier', () => {
      render(<MoodEntry />);

      const dateInput = screen.getByLabelText('תאריך');
      const today = new Date().toISOString().split('T')[0];
      expect(dateInput).toHaveAttribute('max', today);
    });

    it('trims notes before submission', async () => {
      // Mock the initial check for existing entry (returns no existing entry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockMoodEntry }),
      } as Response);

      render(<MoodEntry />);

      const textarea = screen.getByPlaceholderText(
        'איך היה היום שלך? מה השפיע על מצב הרוח שלך?'
      );
      fireEvent.change(textarea, {
        target: { value: '  Notes with spaces  ' },
      });

      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // The component makes multiple API calls, so we check the last one (the actual submission)
        const calls = mockFetch.mock.calls;
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBe('/api/mood');
        expect(lastCall[1]).toEqual({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moodValue: 5,
            notes: 'Notes with spaces',
            date: expect.any(String),
          }),
        });
      });
    });
  });

  describe('Success Message Handling', () => {
    it('clears success message after 3 seconds', async () => {
      jest.useFakeTimers();

      // Mock the initial check for existing entry (returns no existing entry)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockMoodEntry }),
      } as Response);

      render(<MoodEntry />);

      const submitButton = screen.getByRole('button', { name: 'שמור מצב רוח' });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('מצב הרוח נשמר בהצלחה!')).toBeInTheDocument();
      });

      // Fast-forward time
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(
          screen.queryByText('מצב הרוח נשמר בהצלחה!')
        ).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });
  });
});
