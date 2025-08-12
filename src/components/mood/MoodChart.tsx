'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MoodDataPoint {
  date: string;
  mood: number;
  notes?: string;
}

interface MoodChartProps {
  onDataLoad?: (data: MoodDataPoint[]) => void;
  onError?: (error: string) => void;
}

type TimeRange = 'week' | 'month' | '3months';

export default function MoodChart({ onDataLoad, onError }: MoodChartProps) {
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const fetchMoodData = async (range: TimeRange) => {
    setLoading(true);
    setError(null);

    try {
      // Mock data for demo
      const mockData: MoodDataPoint[] = [
        { date: '2025-08-06', mood: 6, notes: 'יום טוב' },
        { date: '2025-08-07', mood: 7, notes: 'יום מעולה' },
        { date: '2025-08-08', mood: 5, notes: 'יום בסדר' },
        { date: '2025-08-09', mood: 8, notes: 'יום נהדר' },
        { date: '2025-08-10', mood: 6, notes: 'יום רגיל' },
        { date: '2025-08-11', mood: 7, notes: 'יום טוב' },
        { date: '2025-08-12', mood: 6, notes: 'היום' },
      ];

      setMoodData(mockData);
      onDataLoad?.(mockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'שגיאה בטעינת נתונים';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData(timeRange);
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    const newRange = value as TimeRange;
    setTimeRange(newRange);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {new Date(label).toLocaleDateString('he-IL')}
          </p>
          <p className="text-blue-600 dark:text-blue-400">מצב רוח: {data.mood}/10</p>
          {data.notes && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">הערות: {data.notes}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">גרף מצב רוח</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">טווח זמן:</span>
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">שבוע</option>
            <option value="month">חודש</option>
            <option value="3months">3 חודשים</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 p-4">
          <p>שגיאה בטעינת הנתונים: {error}</p>
          <Button
            onClick={() => fetchMoodData(timeRange)}
            variant="outline"
            className="mt-2"
          >
            נסה שוב
          </Button>
        </div>
      )}

      {!loading && !error && moodData.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
            מצב רוח לאורך זמן
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                domain={[1, 10]}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
                label={{
                  value: 'מצב רוח',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'currentColor' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && moodData.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
          <p>אין נתוני מצב רוח בטווח הזמן שנבחר</p>
          <p className="text-sm mt-2">
            נסה לבחור טווח זמן אחר או להוסיף רשומות מצב רוח
          </p>
        </div>
      )}
    </div>
  );
}