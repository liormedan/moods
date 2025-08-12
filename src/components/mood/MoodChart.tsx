'use client';

import React, { useState, useEffect } from 'react';
// Temporarily disabled for demo
// import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from 'date-fns';
import { he } from 'date-fns/locale';

interface MoodDataPoint {
  date: string;
  mood: number;
  notes?: string;
}

interface WeeklyAverage {
  weekStart: string;
  average: number;
  count: number;
}

interface MonthlyAverage {
  month: string;
  average: number;
  count: number;
}

interface MoodChartProps {
  onDataLoad?: (data: MoodDataPoint[]) => void;
  onError?: (error: string) => void;
}

type TimeRange = 'week' | 'month' | '3months';

export default function MoodChart({ onDataLoad, onError }: MoodChartProps) {
  // Temporarily disabled for demo
  // const { data: session } = useSession();
  const session = { user: { id: 'demo-user' } }; // Mock session for demo
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [weeklyAverages, setWeeklyAverages] = useState<WeeklyAverage[]>([]);
  const [monthlyAverages, setMonthlyAverages] = useState<MonthlyAverage[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate date range based on selected time range
  const getDateRange = (range: TimeRange) => {
    const end = new Date();
    let start: Date;

    switch (range) {
      case 'week':
        start = subDays(end, 7);
        break;
      case 'month':
        start = subDays(end, 30);
        break;
      case '3months':
        start = subDays(end, 90);
        break;
      default:
        start = subDays(end, 7);
    }

    return { start, end };
  };

  // Fetch mood data from API
  const fetchMoodData = async (range: TimeRange) => {
    // Skip if already loading
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Use mock data for demo to prevent API overload
      const mockData = [
        { date: '2025-08-06', mood: 7, notes: 'יום טוב' },
        { date: '2025-08-07', mood: 6, notes: 'בסדר' },
        { date: '2025-08-08', mood: 8, notes: 'מצוין' },
        { date: '2025-08-09', mood: 5, notes: 'קשה' },
        { date: '2025-08-10', mood: 7, notes: 'טוב' },
        { date: '2025-08-11', mood: 9, notes: 'נהדר' },
        { date: '2025-08-12', mood: 6, notes: 'בסדר' },
      ];

      setMoodData(mockData);
      calculateAverages(mockData, range);

      if (onDataLoad) {
        onDataLoad(mockData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate weekly and monthly averages
  const calculateAverages = (data: MoodDataPoint[], range: TimeRange) => {
    if (data.length === 0) return;

    // Calculate weekly averages
    const weeklyMap = new Map<string, { sum: number; count: number }>();

    data.forEach((point) => {
      const date = new Date(point.date);
      const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { sum: 0, count: 0 });
      }

      const week = weeklyMap.get(weekKey)!;
      week.sum += point.mood;
      week.count += 1;
    });

    const weekly = Array.from(weeklyMap.entries())
      .map(([weekStart, { sum, count }]) => ({
        weekStart,
        average: Math.round((sum / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));

    setWeeklyAverages(weekly);

    // Calculate monthly averages
    const monthlyMap = new Map<string, { sum: number; count: number }>();

    data.forEach((point) => {
      const date = new Date(point.date);
      const monthKey = format(date, 'yyyy-MM');

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { sum: 0, count: 0 });
      }

      const month = monthlyMap.get(monthKey)!;
      month.sum += point.mood;
      month.count += 1;
    });

    const monthly = Array.from(monthlyMap.entries())
      .map(([month, { sum, count }]) => ({
        month,
        average: Math.round((sum / count) * 10) / 10,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyAverages(monthly);
  };

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    const newRange = value as TimeRange;
    setTimeRange(newRange);
    fetchMoodData(newRange);
  };

  // Load data on component mount - only once
  useEffect(() => {
    fetchMoodData(timeRange);
  }, []); // Empty dependency array to run only once

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">
            {format(new Date(label), 'EEEE, MMMM d, yyyy', { locale: he })}
          </p>
          <p className="text-blue-600">מצב רוח: {data.mood}/10</p>
          {data.notes && (
            <p className="text-gray-600 text-sm mt-1">הערות: {data.notes}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get mood color based on value
  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10b981'; // Green for high mood
    if (mood >= 6) return '#3b82f6'; // Blue for good mood
    if (mood >= 4) return '#f59e0b'; // Yellow for neutral mood
    return '#ef4444'; // Red for low mood
  };

  // Generate empty data points for missing dates
  const generateCompleteData = (data: MoodDataPoint[], range: TimeRange) => {
    const { start, end } = getDateRange(range);
    const allDates = eachDayOfInterval({ start, end });

    const dataMap = new Map(data.map((point) => [point.date, point]));

    return allDates
      .map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingData = dataMap.get(dateStr);

        if (existingData) {
          return existingData;
        }

        // Return null for missing dates to show gaps in the chart
        return {
          date: dateStr,
          mood: null,
          notes: '',
        };
      })
      .filter((point) => point.mood !== null); // Remove null points
  };

  const completeData = generateCompleteData(moodData, timeRange);

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            יש להתחבר כדי לראות את הגרפים
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">גרף מצב רוח</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">טווח זמן:</span>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">שבוע</SelectItem>
              <SelectItem value="month">חודש</SelectItem>
              <SelectItem value="3months">3 חודשים</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div
              data-testid="loading-spinner"
              className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
            ></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 p-3">
            <p className="text-sm">שגיאה בטעינת הנתונים: {error}</p>
            <Button
              onClick={() => fetchMoodData(timeRange)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              נסה שוב
            </Button>
          </div>
        )}

        {!loading && !error && completeData.length > 0 && (
          <div className="space-y-4">
            {/* Main Mood Chart */}
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={completeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      format(new Date(value), 'MM/dd')
                    }
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    domain={[1, 10]}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                    activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {!loading && !error && completeData.length === 0 && (
          <div className="text-center text-gray-500 p-4">
            <p className="text-sm">אין נתוני מצב רוח בטווח הזמן שנבחר</p>
            <p className="text-xs mt-1">
              נסה לבחור טווח זמן אחר או להוסיף רשומות מצב רוח
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
