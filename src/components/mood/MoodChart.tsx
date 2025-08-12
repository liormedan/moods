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
  Area,
  AreaChart,
} from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  const fetchMoodData = async (range: TimeRange) => {
    setLoading(true);
    setError(null);

    try {
      // Try to fetch real data from API
      const response = await fetch(`/api/mood?range=${range}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setMoodData(data);
          onDataLoad?.(data);
        } else {
          console.warn('API returned non-array data:', data);
          // Fallback to mock data if API returns invalid data
          const mockData: MoodDataPoint[] = generateMockData(range);
          setMoodData(mockData);
          onDataLoad?.(mockData);
          setError(
            'הנתונים המוצגים הם לדוגמה בלבד - השרת החזיר נתונים לא תקינים'
          );
        }
      } else {
        throw new Error('שגיאה בטעינת נתונים מהשרת');
      }
    } catch (err) {
      console.error('Error fetching mood data:', err);

      // Fallback to mock data if API fails
      const mockData: MoodDataPoint[] = generateMockData(range);
      setMoodData(mockData);
      onDataLoad?.(mockData);

      // Show error but don't block the UI
      setError('הנתונים המוצגים הם לדוגמה בלבד');
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (range: TimeRange): MoodDataPoint[] => {
    const today = new Date();
    const data: MoodDataPoint[] = [];

    let days: number;
    switch (range) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case '3months':
        days = 90;
        break;
      default:
        days = 7;
    }

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic mood data with some variation
      const baseMood = 6.5;
      const variation = (Math.random() - 0.5) * 3;
      const mood = Math.max(1, Math.min(10, baseMood + variation));

      data.push({
        date: date.toISOString().split('T')[0],
        mood: Math.round(mood * 10) / 10,
        notes: i === 0 ? 'היום' : undefined,
      });
    }

    return data;
  };

  useEffect(() => {
    fetchMoodData(timeRange);
  }, [timeRange]);

  const handleTimeRangeChange = (value: string) => {
    const newRange = value as TimeRange;
    setTimeRange(newRange);
  };

  const handleRefresh = () => {
    fetchMoodData(timeRange);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {new Date(label).toLocaleDateString('he-IL')}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            מצב רוח: {data.mood}/10
          </p>
          {data.notes && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              הערות: {data.notes}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10b981'; // green
    if (mood >= 6) return '#3b82f6'; // blue
    if (mood >= 4) return '#f59e0b'; // yellow
    if (mood >= 2) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const calculateTrend = () => {
    // Ensure moodData is an array and has the expected structure
    if (!Array.isArray(moodData) || moodData.length < 2) return 'stable';

    // Filter out any invalid entries
    const validEntries = moodData.filter(
      (item) =>
        item && typeof item === 'object' && typeof item.mood === 'number'
    );

    if (validEntries.length < 2) return 'stable';

    const recent = validEntries.slice(-7);
    const older = validEntries.slice(-14, -7);

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg =
      recent.reduce((sum, item) => sum + item.mood, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, item) => sum + item.mood, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  };

  const trend = calculateTrend();
  const trendIcon =
    trend === 'improving'
      ? TrendingUp
      : trend === 'declining'
        ? TrendingDown
        : Activity;
  const trendColor =
    trend === 'improving'
      ? 'text-green-600'
      : trend === 'declining'
        ? 'text-red-600'
        : 'text-blue-600';

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            גרף מצב רוח
          </h3>

          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              קו
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              אזור
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Trend Indicator */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">מגמה:</span>
            <div className="flex items-center space-x-1">
              {React.createElement(trendIcon, {
                className: `w-4 h-4 ${trendColor}`,
              })}
              <span className={trendColor}>
                {trend === 'improving'
                  ? 'משתפר'
                  : trend === 'declining'
                    ? 'יורד'
                    : 'יציב'}
              </span>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              טווח זמן:
            </span>
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="week">שבוע</option>
              <option value="month">חודש</option>
              <option value="3months">3 חודשים</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
            title="רענן נתונים"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {error}
          </p>
        </div>
      )}

      {/* Chart Container */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                טוען נתונים...
              </p>
            </div>
          </div>
        ) : !Array.isArray(moodData) || moodData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">
                אין נתונים להצגה
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                התחילו להזין מצב רוח כדי לראות גרפים
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'line' ? (
              <LineChart
                data={Array.isArray(moodData) ? moodData : []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('he-IL', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis stroke="#6b7280" domain={[0, 10]} tickCount={11} />
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
            ) : (
              <AreaChart
                data={Array.isArray(moodData) ? moodData : []}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('he-IL', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis stroke="#6b7280" domain={[0, 10]} tickCount={11} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>מצוין (8-10)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>טוב (6-7)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>בסדר (4-5)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>לא טוב (2-3)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>רע מאוד (1)</span>
        </div>
      </div>
    </div>
  );
}
