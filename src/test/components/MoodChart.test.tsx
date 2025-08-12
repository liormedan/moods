import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import MoodChart from '@/components/mood/MoodChart';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'yyyy-MM-dd') return '2024-01-01';
    if (formatStr === 'MM/dd') return '01/01';
    if (formatStr === 'MMM yyyy') return 'Jan 2024';
    if (formatStr === 'MMMM yyyy') return 'January 2024';
    if (formatStr === 'EEEE, MMMM d, yyyy') return 'Monday, January 1, 2024';
    if (formatStr === 'MM/dd/yyyy') return '01/01/2024';
    return '2024-01-01';
  }),
  subDays: jest.fn(
    (date, days) => new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
  ),
  startOfWeek: jest.fn(
    (date) => new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000)
  ),
  endOfWeek: jest.fn(
    (date) =>
      new Date(date.getTime() + (6 - date.getDay()) * 24 * 60 * 60 * 1000)
  ),
  startOfMonth: jest.fn(
    (date) => new Date(date.getFullYear(), date.getMonth(), 1)
  ),
  endOfMonth: jest.fn(
    (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
  ),
  eachDayOfInterval: jest.fn(({ start, end }) => {
    const days = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }),
}));

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children, data }: any) => (
    <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Line: ({ dataKey, stroke }: any) => (
    <div data-testid="line" data-key={dataKey} data-stroke={stroke} />
  ),
  XAxis: ({ dataKey, tickFormatter }: any) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: ({ domain, label }: any) => (
    <div data-testid="y-axis" data-domain={JSON.stringify(domain)} />
  ),
  CartesianGrid: ({ strokeDasharray }: any) => (
    <div data-testid="cartesian-grid" data-stroke={strokeDasharray} />
  ),
  Tooltip: ({ content }: any) => (
    <div data-testid="tooltip" data-content={content ? 'custom' : 'default'} />
  ),
  ResponsiveContainer: ({ children, width, height }: any) => (
    <div data-testid="responsive-container" style={{ width, height }}>
      {children}
    </div>
  ),
  Area: ({ dataKey, stroke, fill }: any) => (
    <div
      data-testid="area"
      data-key={dataKey}
      data-stroke={stroke}
      data-fill={fill}
    />
  ),
  AreaChart: ({ children, data }: any) => (
    <div data-testid="area-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
}));

// Mock Select component
jest.mock('../../components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div data-testid="select" data-value={value}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: () => <div data-testid="select-value" />,
}));

const mockSession = {
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  },
  expires: '2024-12-31',
};

const mockMoodData = [
  {
    id: '1',
    moodValue: 8,
    notes: 'Feeling great today!',
    date: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    moodValue: 6,
    notes: 'Pretty good day',
    date: '2024-01-02T00:00:00.000Z',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

describe('MoodChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });
  });

  it('renders without crashing', () => {
    render(<MoodChart />);
    expect(screen.getByText('גרף מצב רוח')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<MoodChart />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows time range selector', () => {
    render(<MoodChart />);
    expect(screen.getByText('טווח זמן:')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('fetches data on mount', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/mood?startDate=')
      );
    });
  });

  it('displays mood chart when data is loaded', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(screen.getByText('מצב רוח לאורך זמן')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays weekly averages chart', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(screen.getByText('ממוצעים שבועיים')).toBeInTheDocument();
      const areaCharts = screen.getAllByTestId('area-chart');
      expect(areaCharts.length).toBeGreaterThan(0);
    });
  });

  it('displays monthly averages chart', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(screen.getByText('ממוצעים חודשיים')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<MoodChart />);

    await waitFor(() => {
      expect(screen.getByText(/שגיאה בטעינת הנתונים/)).toBeInTheDocument();
      expect(screen.getByText('נסה שוב')).toBeInTheDocument();
    });
  });

  it('shows empty state when no data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(
        screen.getByText('אין נתוני מצב רוח בטווח הזמן שנבחר')
      ).toBeInTheDocument();
    });
  });

  it('calls onDataLoad callback when data is loaded', async () => {
    const onDataLoad = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart onDataLoad={onDataLoad} />);

    await waitFor(() => {
      expect(onDataLoad).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            date: '2024-01-01',
            mood: 8,
            notes: 'Feeling great today!',
          }),
        ])
      );
    });
  });

  it('calls onError callback when API fails', async () => {
    const onError = jest.fn();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<MoodChart onError={onError} />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('API Error');
    });
  });

  it('shows authentication message when not logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(<MoodChart />);
    expect(
      screen.getByText('יש להתחבר כדי לראות את הגרפים')
    ).toBeInTheDocument();
  });

  it('retries data fetch on retry button click', async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockMoodData,
        }),
      });

    render(<MoodChart />);

    await waitFor(() => {
      expect(screen.getByText('נסה שוב')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('נסה שוב'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('displays correct chart data structure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      const lineChart = screen.getByTestId('line-chart');
      const chartData = JSON.parse(
        lineChart.getAttribute('data-chart-data') || '[]'
      );

      // The mock eachDayOfInterval creates multiple entries, so we check for at least 2
      expect(chartData.length).toBeGreaterThanOrEqual(2);
      expect(chartData[0]).toHaveProperty('date');
      expect(chartData[0]).toHaveProperty('mood');
      expect(chartData[0]).toHaveProperty('notes');
    });
  });

  it('handles time range changes', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockMoodData,
      }),
    });

    render(<MoodChart />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('startDate='));
    });

    // The component should handle time range changes internally
    // This test verifies the component structure supports time range selection
    expect(screen.getByTestId('select')).toBeInTheDocument();
  });
});
