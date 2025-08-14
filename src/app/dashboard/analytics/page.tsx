'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Target,
  Award,
  Clock,
} from 'lucide-react';

interface AnalyticsData {
  dailyMoods: Array<{ date: string; mood: number; notes?: string }>;
  weeklyAverages: Array<{ week: string; average: number; count: number }>;
  monthlyTrends: Array<{
    month: string;
    average: number;
    high: number;
    low: number;
  }>;
  moodDistribution: Array<{ mood: string; count: number; percentage: number }>;
  timePatterns: Array<{ hour: number; averageMood: number; count: number }>;
  streakData: { current: number; longest: number; total: number };
  insights: Array<{
    type: string;
    message: string;
    severity: 'info' | 'warning' | 'success';
  }>;
  summary: {
    totalEntries: number;
    averageMood: number;
    highestMood: number;
    lowestMood: number;
  };
}

type TimeRange = 'week' | 'month' | '3months' | '6months' | 'year';
type ChartType = 'line' | 'area' | 'bar';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<
    'mood' | 'frequency' | 'patterns'
  >('mood');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error('Failed to fetch analytics data:', response.status);
        setAnalyticsData(null);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!analyticsData) return;

    try {
      // Create comprehensive analytics report
      const reportData = [
        ['דוח ניתוח מצב רוח מתקדם'],
        [''],
        ['סיכום כללי'],
        ['סה"כ רשומות', analyticsData.summary.totalEntries.toString()],
        ['ממוצע כללי', analyticsData.summary.averageMood.toString()],
        ['מצב רוח גבוה ביותר', analyticsData.summary.highestMood.toString()],
        ['מצב רוח נמוך ביותר', analyticsData.summary.lowestMood.toString()],
        ['רצף נוכחי', analyticsData.streakData.current.toString()],
        ['רצף הארוך ביותר', analyticsData.streakData.longest.toString()],
        [''],
        ['נתונים יומיים'],
        ['תאריך', 'מצב רוח', 'הערות'],
        ...analyticsData.dailyMoods.map(day => [
          day.date,
          day.mood.toString(),
          day.notes || ''
        ]),
        [''],
        ['ממוצעים שבועיים'],
        ['שבוע', 'ממוצע', 'מספר רשומות'],
        ...analyticsData.weeklyAverages.map(week => [
          week.week,
          week.average.toString(),
          week.count.toString()
        ]),
        [''],
        ['התפלגות מצב רוח'],
        ['טווח', 'כמות', 'אחוז'],
        ...analyticsData.moodDistribution.map(dist => [
          dist.mood,
          dist.count.toString(),
          `${dist.percentage}%`
        ]),
        [''],
        ['תובנות'],
        ...analyticsData.insights.map(insight => [insight.message])
      ];

      // Add BOM for Hebrew support
      const BOM = '\uFEFF';
      const csvContent = reportData
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      // Show success message (you could use a toast library here)
      console.log('דוח נוצר בהצלחה!');
    } catch (error) {
      console.error('שגיאה ביצירת הדוח:', error);
      alert('שגיאה ביצירת הדוח. נסה שוב.');
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return '#10b981'; // green
    if (mood >= 6) return '#3b82f6'; // blue
    if (mood >= 4) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const pieColors = ['#ef4444', '#f59e0b', '#6b7280', '#3b82f6', '#10b981'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            שגיאה בטעינת נתוני הניתוח
          </p>
          <Button onClick={fetchAnalyticsData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            נסה שוב
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              גרפים וניתוחים
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              ניתוח מעמיק של מגמות ודפוסים במצב הרוח שלכם
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
              disabled={!analyticsData || analyticsData.summary.totalEntries === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              ייצוא דוח
            </Button>
            <Button onClick={fetchAnalyticsData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              רענן
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  טווח זמן:
                </label>
                <Select
                  value={timeRange}
                  onValueChange={(value: TimeRange) => setTimeRange(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">שבוע</SelectItem>
                    <SelectItem value="month">חודש</SelectItem>
                    <SelectItem value="3months">3 חודשים</SelectItem>
                    <SelectItem value="6months">6 חודשים</SelectItem>
                    <SelectItem value="year">שנה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  סוג גרף:
                </label>
                <Select
                  value={chartType}
                  onValueChange={(value: ChartType) => setChartType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">קו</SelectItem>
                    <SelectItem value="area">אזור</SelectItem>
                    <SelectItem value="bar">עמודות</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  מדד:
                </label>
                <Select
                  value={selectedMetric}
                  onValueChange={(value: 'mood' | 'frequency' | 'patterns') =>
                    setSelectedMetric(value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mood">מצב רוח</SelectItem>
                    <SelectItem value="frequency">תדירות</SelectItem>
                    <SelectItem value="patterns">דפוסים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  רצף נוכחי
                </CardTitle>
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.streakData.current}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  מתוך {analyticsData.streakData.longest} הרצף הארוך ביותר
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  ממוצע כללי
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.summary.averageMood || 0}
              </div>
              <div className="flex items-center mt-2">
                {analyticsData.monthlyTrends.length >= 2 ? (
                  <>
                    {analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 1].average > 
                     analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 2].average ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 1].average > 
                      analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 2].average 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {Math.abs(
                        analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 1].average - 
                        analyticsData.monthlyTrends[analyticsData.monthlyTrends.length - 2].average
                      ).toFixed(1)} מהתקופה הקודמת
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    בטווח {timeRange === 'week' ? 'השבוע' : timeRange === 'month' ? 'החודש' : 'התקופה'}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  סה"כ רשומות
                </CardTitle>
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.summary.totalEntries}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                רשומות מצב רוח
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">
                  טווח מצב רוח
                </CardTitle>
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.summary.highestMood > 0 
                  ? `${analyticsData.summary.lowestMood}-${analyticsData.summary.highestMood}`
                  : '-'
                }
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                מנמוך לגבוה
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>מגמות מצב רוח יומיות</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              מעקב אחר השינויים במצב הרוח לאורך זמן
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer key="analytics-chart" width="100%" height={400}>
              <div>
                {chartType === 'line' && (
                  <LineChart data={analyticsData.dailyMoods}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('he-IL', {
                          day: 'numeric',
                          month: 'short',
                        })
                      }
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
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
                )}

                {chartType === 'area' && (
                  <AreaChart data={analyticsData.dailyMoods}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('he-IL', {
                          day: 'numeric',
                          month: 'short',
                        })
                      }
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                )}

                {chartType === 'bar' && (
                  <BarChart data={analyticsData.dailyMoods}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('he-IL', {
                          day: 'numeric',
                          month: 'short',
                        })
                      }
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="mood" fill="#3b82f6" />
                  </BarChart>
                )}
              </div>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Averages */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                ממוצעים שבועיים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer key="weekly-chart" width="100%" height={250}>
                <BarChart data={analyticsData.weeklyAverages}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-600"
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis
                    domain={[1, 10]}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mood Distribution */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                התפלגות מצב רוח
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer key="pie-chart" width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.moodDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ mood, percentage }) => `${mood}: ${percentage}%`}
                  >
                    {analyticsData.moodDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          {analyticsData.monthlyTrends.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  מגמות חודשיות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer key="monthly-chart" width="100%" height={250}>
                  <LineChart data={analyticsData.monthlyTrends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="ממוצע"
                    />
                    <Line
                      type="monotone"
                      dataKey="high"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="גבוה"
                    />
                    <Line
                      type="monotone"
                      dataKey="low"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="נמוך"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Time Patterns */}
          {analyticsData.timePatterns.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  דפוסי זמן (שעות ביום)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer key="time-chart" width="100%" height={250}>
                  <BarChart data={analyticsData.timePatterns}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${hour}:00`}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip 
                      content={<CustomTooltip />}
                      labelFormatter={(hour) => `שעה ${hour}:00`}
                    />
                    <Bar dataKey="averageMood" fill="#f59e0b" name="ממוצע מצב רוח" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Insights and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span>תובנות מהנתונים</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.insights.length > 0 ? (
                  analyticsData.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        insight.severity === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : insight.severity === 'warning'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          insight.severity === 'success'
                            ? 'text-green-700 dark:text-green-300'
                            : insight.severity === 'warning'
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {insight.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      צבור עוד נתונים כדי לקבל תובנות מותאמות אישית
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>המלצות מותאמות</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.summary.averageMood < 5 && (
                  <div className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💙 נסה לתרגל נשימות עמוקות או מדיטציה קצרה
                    </p>
                  </div>
                )}
                
                {analyticsData.streakData.current === 0 && (
                  <div className="p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      📝 התחל לתעד את מצב הרוח שלך באופן קבוע
                    </p>
                  </div>
                )}

                {analyticsData.streakData.current >= 7 && (
                  <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      🎉 כל הכבוד על העקביות! המשך כך
                    </p>
                  </div>
                )}

                {analyticsData.summary.totalEntries >= 30 && (
                  <div className="p-3 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      📊 יש לך מספיק נתונים - בדוק את הדפוסים החודשיים
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    💡 טיפ: תיעוד קבוע עוזר לזהות מה משפיע על מצב הרוח שלך
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
