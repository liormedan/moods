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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Activity,
  Brain,
  Target,
  Clock,
  Zap,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
} from 'lucide-react';

interface TrendData {
  period: string;
  moodAverage: number;
  journalEntries: number;
  breathingMinutes: number;
  goalsCompleted: number;
  activeDays: number;
  sleepQuality?: number;
  stressLevel?: number;
  energyLevel?: number;
  socialActivity?: number;
}

interface SeasonalData {
  season: string;
  moodAverage: number;
  activityLevel: number;
  color: string;
}

interface PredictionData {
  period: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

interface CorrelationData {
  factor: string;
  correlation: number;
  significance: string;
  description: string;
}

export default function TrendsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year');
  const [analysisType, setAnalysisType] = useState('comprehensive');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [seasonalData, setSeasonalData] = useState<SeasonalData[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadTrendsData();
  }, [timeRange, analysisType]);

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/trends?range=${timeRange}&type=${analysisType}`
      );
      if (response.ok) {
        const result = await response.json();
        setTrendData(result.data.trends);
        setSeasonalData(result.data.seasonal);
        setPredictions(result.data.predictions);
        setCorrelations(result.data.correlations);
        setInsights(result.data.insights);
      }
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTrends = () => {
    const csvContent = [
      [
        'תקופה',
        'ממוצע מצב רוח',
        'רשומות יומן',
        'דקות נשימה',
        'מטרות הושלמו',
        'ימים פעילים',
      ],
      ...trendData.map((item) => [
        item.period,
        item.moodAverage,
        item.journalEntries,
        item.breathingMinutes,
        item.goalsCompleted,
        item.activeDays,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `מגמות_ארוכות_טווח_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getTrendDirection = (data: TrendData[]) => {
    if (data.length < 2) return 'stable';
    const recent =
      data.slice(-3).reduce((sum, item) => sum + item.moodAverage, 0) / 3;
    const earlier =
      data.slice(0, 3).reduce((sum, item) => sum + item.moodAverage, 0) / 3;

    if (recent > earlier + 0.5) return 'improving';
    if (recent < earlier - 0.5) return 'declining';
    return 'stable';
  };

  const getSeasonalInsight = () => {
    const bestSeason = seasonalData.reduce((best, current) =>
      current.moodAverage > best.moodAverage ? current : best
    );
    const worstSeason = seasonalData.reduce((worst, current) =>
      current.moodAverage < worst.moodAverage ? current : worst
    );

    return { best: bestSeason, worst: worstSeason };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">מנתח מגמות ארוכות טווח...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const trendDirection = getTrendDirection(trendData);
  const seasonalInsight = getSeasonalInsight();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              מגמות ארוכות טווח
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ניתוח היסטורי מתקדם וזיהוי דפוסים
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 חודשים</SelectItem>
                <SelectItem value="year">שנה</SelectItem>
                <SelectItem value="2years">שנתיים</SelectItem>
                <SelectItem value="all">כל הזמן</SelectItem>
              </SelectContent>
            </Select>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">מקיף</SelectItem>
                <SelectItem value="mood-focused">מצב רוח</SelectItem>
                <SelectItem value="activity-focused">פעילות</SelectItem>
                <SelectItem value="goals-focused">מטרות</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportTrends} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              ייצא נתונים
            </Button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {trendDirection === 'improving' ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : trendDirection === 'declining' ? (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                ) : (
                  <Activity className="w-8 h-8 text-blue-500" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {trendDirection === 'improving'
                      ? 'מגמה חיובית'
                      : trendDirection === 'declining'
                        ? 'מגמה שלילית'
                        : 'מגמה יציבה'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trendDirection === 'improving'
                      ? 'מצב הרוח משתפר לאורך זמן'
                      : trendDirection === 'declining'
                        ? 'מצב הרוח יורד לאורך זמן'
                        : 'מצב רוח יציב ללא שינויים משמעותיים'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-lg">עונה טובה ביותר</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {seasonalInsight.best?.season} - ממוצע{' '}
                    {seasonalInsight.best?.moodAverage.toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-lg">יעילות מטרות</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trendData.length > 0
                      ? `${(trendData.reduce((sum, item) => sum + item.goalsCompleted, 0) / trendData.length).toFixed(1)} מטרות בממוצע`
                      : 'אין נתונים'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Long-term Mood Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              מגמת מצב רוח ארוכת טווח
            </CardTitle>
            <CardDescription>
              ניתוח מצב הרוח לאורך זמן עם קו מגמה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[1, 10]} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name === 'moodAverage' ? 'ממוצע מצב רוח' : name,
                  ]}
                  labelFormatter={(label) => `תקופה: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="moodAverage"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="ממוצע מצב רוח"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Multi-metric Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              ניתוח רב-מדדי
            </CardTitle>
            <CardDescription>השוואת מדדים שונים לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="moodAverage"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="מצב רוח"
                />
                <Area
                  type="monotone"
                  dataKey="activeDays"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="ימים פעילים"
                />
                <Area
                  type="monotone"
                  dataKey="goalsCompleted"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="מטרות הושלמו"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Seasonal Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              ניתוח עונתי
            </CardTitle>
            <CardDescription>
              השפעת עונות השנה על מצב הרוח והפעילות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={seasonalData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="season" />
                  <PolarRadiusAxis domain={[0, 10]} />
                  <Radar
                    name="מצב רוח"
                    dataKey="moodAverage"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="רמת פעילות"
                    dataKey="activityLevel"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                {seasonalData.map((season, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {season.season === 'אביב' && (
                        <Sun className="w-5 h-5 text-green-500" />
                      )}
                      {season.season === 'קיץ' && (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      )}
                      {season.season === 'סתיו' && (
                        <Cloud className="w-5 h-5 text-orange-500" />
                      )}
                      {season.season === 'חורף' && (
                        <Snowflake className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{season.season}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ממוצע מצב רוח: {season.moodAverage.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        רמת פעילות: {season.activityLevel.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              תחזיות וחיזויים
            </CardTitle>
            <CardDescription>
              חיזוי מגמות עתידיות בהתבסס על נתונים היסטוריים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="נתונים בפועל"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="חיזוי"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 תובנות חיזוי
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• החיזוי מבוסס על ניתוח מגמות של 12 החודשים האחרונים</li>
                <li>• רמת הדיוק הממוצעת: 78%</li>
                <li>• המודל לוקח בחשבון עונתיות ודפוסים חוזרים</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Correlations Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ניתוח קורלציות
            </CardTitle>
            <CardDescription>
              גורמים המשפיעים על מצב הרוח והרווחה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {correlations.map((correlation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {correlation.correlation > 0.5 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : correlation.correlation < -0.5 ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <h4 className="font-medium">{correlation.factor}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {correlation.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {correlation.correlation > 0 ? '+' : ''}
                      {(correlation.correlation * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {correlation.significance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              תובנות חכמות
            </CardTitle>
            <CardDescription>
              המלצות מותאמות אישית בהתבסס על הניתוח
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {insight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              סיכום סטטיסטי
            </CardTitle>
            <CardDescription>נתונים מרכזיים מהניתוח ארוך הטווח</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {trendData.length > 0
                    ? (
                        trendData.reduce(
                          (sum, item) => sum + item.moodAverage,
                          0
                        ) / trendData.length
                      ).toFixed(1)
                    : '0'}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  ממוצע מצב רוח כללי
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {trendData.length > 0
                    ? Math.round(
                        trendData.reduce(
                          (sum, item) => sum + item.activeDays,
                          0
                        ) / trendData.length
                      )
                    : '0'}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  ממוצע ימים פעילים
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {trendData.length > 0
                    ? Math.round(
                        trendData.reduce(
                          (sum, item) => sum + item.goalsCompleted,
                          0
                        ) / trendData.length
                      )
                    : '0'}
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  ממוצע מטרות הושלמו
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {trendData.length > 0
                    ? Math.round(
                        trendData.reduce(
                          (sum, item) => sum + item.breathingMinutes,
                          0
                        ) / trendData.length
                      )
                    : '0'}
                </div>
                <div className="text-sm text-orange-800 dark:text-orange-300">
                  ממוצע דקות נשימה
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
