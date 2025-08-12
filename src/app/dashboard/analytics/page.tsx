'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Clock
} from 'lucide-react';

interface AnalyticsData {
  dailyMoods: Array<{ date: string; mood: number; notes?: string }>;
  weeklyAverages: Array<{ week: string; average: number; count: number }>;
  monthlyTrends: Array<{ month: string; average: number; high: number; low: number }>;
  moodDistribution: Array<{ mood: string; count: number; percentage: number }>;
  timePatterns: Array<{ hour: number; averageMood: number; count: number }>;
  streakData: { current: number; longest: number; total: number };
  insights: Array<{ type: string; message: string; severity: 'info' | 'warning' | 'success' }>;
}

type TimeRange = 'week' | 'month' | '3months' | '6months' | 'year';
type ChartType = 'line' | 'area' | 'bar';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'frequency' | 'patterns'>('mood');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data for demo
      const mockData: AnalyticsData = {
        dailyMoods: [
          { date: '2025-08-01', mood: 6, notes: 'יום רגיל' },
          { date: '2025-08-02', mood: 7, notes: 'יום טוב' },
          { date: '2025-08-03', mood: 5, notes: 'קצת עייפות' },
          { date: '2025-08-04', mood: 8, notes: 'יום מעולה' },
          { date: '2025-08-05', mood: 6, notes: 'בסדר' },
          { date: '2025-08-06', mood: 9, notes: 'יום נהדר!' },
          { date: '2025-08-07', mood: 7, notes: 'טוב' },
          { date: '2025-08-08', mood: 4, notes: 'יום מאתגר' },
          { date: '2025-08-09', mood: 8, notes: 'השתפרתי' },
          { date: '2025-08-10', mood: 7, notes: 'יום נחמד' },
          { date: '2025-08-11', mood: 6, notes: 'רגיל' },
          { date: '2025-08-12', mood: 8, notes: 'סוף שבוע טוב' },
        ],
        weeklyAverages: [
          { week: 'שבוע 1', average: 6.2, count: 7 },
          { week: 'שבוע 2', average: 6.8, count: 7 },
          { week: 'שבוע 3', average: 7.1, count: 6 },
          { week: 'שבוע 4', average: 6.9, count: 7 },
        ],
        monthlyTrends: [
          { month: 'מאי', average: 6.1, high: 9, low: 3 },
          { month: 'יוני', average: 6.5, high: 8, low: 4 },
          { month: 'יולי', average: 6.8, high: 9, low: 4 },
          { month: 'אוגוסט', average: 6.9, high: 9, low: 4 },
        ],
        moodDistribution: [
          { mood: '1-2 (רע)', count: 2, percentage: 8 },
          { mood: '3-4 (לא טוב)', count: 4, percentage: 16 },
          { mood: '5-6 (בסדר)', count: 8, percentage: 32 },
          { mood: '7-8 (טוב)', count: 9, percentage: 36 },
          { mood: '9-10 (מצוין)', count: 2, percentage: 8 },
        ],
        timePatterns: [
          { hour: 8, averageMood: 5.5, count: 3 },
          { hour: 12, averageMood: 6.8, count: 8 },
          { hour: 16, averageMood: 6.2, count: 7 },
          { hour: 20, averageMood: 7.1, count: 7 },
        ],
        streakData: { current: 5, longest: 12, total: 25 },
        insights: [
          { type: 'trend', message: 'מצב הרוח שלך משתפר בהדרגה בחודש האחרון', severity: 'success' },
          { type: 'pattern', message: 'נראה שמצב הרוח שלך טוב יותר בערבים', severity: 'info' },
          { type: 'streak', message: 'כל הכבוד! אתה עוקב אחר מצב הרוח 5 ימים ברצף', severity: 'success' },
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export analytics data');
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
          <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
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
          <p className="text-gray-500 dark:text-gray-400">שגיאה בטעינת נתוני הניתוח</p>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">טווח זמן:</label>
                <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">סוג גרף:</label>
                <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">מדד:</label>
                <Select value={selectedMetric} onValueChange={(value: 'mood' | 'frequency' | 'patterns') => setSelectedMetric(value)}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">רצף נוכחי</CardTitle>
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
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">ממוצע החודש</CardTitle>
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">6.9</div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+0.4 מהחודש הקודם</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-gray-600 dark:text-gray-400">סה"כ רשומות</CardTitle>
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {analyticsData.streakData.total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">רשומות מצב רוח</div>
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
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'line' && (
                <LineChart data={analyticsData.dailyMoods}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Averages */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">ממוצעים שבועיים</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsData.weeklyAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
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
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">התפלגות מצב רוח</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
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
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

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
              {analyticsData.insights.map((insight, index) => (
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
                  <p className={`text-sm ${
                    insight.severity === 'success' 
                      ? 'text-green-700 dark:text-green-300' 
                      : insight.severity === 'warning'
                      ? 'text-yellow-700 dark:text-yellow-300'
                      : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}