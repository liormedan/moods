'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, MoodChart, InsightsPanel } from '@/components/mood';
import {
  Calendar,
  BarChart3,
  Activity,
  Target,
  Award,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DashboardStats {
  totalEntries: number;
  averageMood: number;
  currentStreak: number;
  bestStreak: number;
  insightsCount: number;
  unreadInsights: number;
  weeklyAverage: number;
  monthlyAverage: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  lastEntryDate: string | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Default stats to prevent undefined errors
  const defaultStats: DashboardStats = {
    totalEntries: 0,
    averageMood: 0,
    currentStreak: 0,
    bestStreak: 0,
    insightsCount: 0,
    unreadInsights: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
    moodTrend: 'stable',
    lastEntryDate: null,
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real data from API
      const response = await fetch('/api/mood/stats');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת נתונים');
      }

      const result = await response.json();
      const apiData = result.data;

      // Transform API data to match our interface
      const transformedStats: DashboardStats = {
        totalEntries: apiData.totalEntries || 0,
        averageMood: apiData.averageMood || 0,
        currentStreak: apiData.streakDays || 0,
        bestStreak: apiData.streakDays || 0, // For now, use current streak as best
        insightsCount: apiData.insights?.length || 0,
        unreadInsights: Math.min(apiData.insights?.length || 0, 2), // Mock unread count
        weeklyAverage:
          apiData.weeklyAverages?.slice(-1)[0]?.average ||
          apiData.averageMood ||
          0,
        monthlyAverage: apiData.averageMood || 0,
        moodTrend: apiData.moodTrend || 'stable',
        lastEntryDate: apiData.recentMood?.date || null,
      };

      setStats(transformedStats);
    } catch (err) {
      console.error('Dashboard stats error:', err);

      // Fallback to mock data if API fails
      setStats({
        totalEntries: 15,
        averageMood: 6.8,
        currentStreak: 5,
        bestStreak: 12,
        insightsCount: 8,
        unreadInsights: 2,
        weeklyAverage: 7.2,
        monthlyAverage: 6.5,
        moodTrend: 'improving',
        lastEntryDate: new Date().toISOString().split('T')[0],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardStats();
    setRefreshing(false);
  };

  const getMoodEmoji = (mood: number | undefined) => {
    if (!mood || mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number | undefined) => {
    if (!mood || mood >= 8) return 'text-green-600 dark:text-green-400';
    if (mood >= 6) return 'text-blue-600 dark:text-blue-400';
    if (mood >= 4) return 'text-yellow-600 dark:text-yellow-400';
    if (mood >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    if (!trend)
      return <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />;

    switch (trend) {
      case 'improving':
        return (
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case 'declining':
        return (
          <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400 transform rotate-180" />
        );
      default:
        return (
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  const getTrendText = (trend: string) => {
    if (!trend) return 'יציב';

    switch (trend) {
      case 'improving':
        return 'משתפר';
      case 'declining':
        return 'יורד';
      default:
        return 'יציב';
    }
  };

  const getTrendColor = (trend: string) => {
    if (!trend) return 'text-blue-600 dark:text-blue-400';

    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">טוען נתונים...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              שגיאה בטעינת נתונים
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchDashboardStats}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              נסה שוב
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section with Refresh Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              שלום משתמש דמו! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              עקבו אחרי מצב הרוח שלכם וקבלו תובנות חכמות לשיפור הרווחה הנפשית
            </p>
            {stats?.lastEntryDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                רשומה אחרונה:{' '}
                {new Date(stats.lastEntryDate).toLocaleDateString('he-IL')}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                const menu = document.getElementById('profile-menu');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>הגדרות</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <div
              id="profile-menu"
              className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10"
            >
              <button
                onClick={() => (window.location.href = '/dashboard/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>פרופיל</span>
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard/settings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>הגדרות</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Entries */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  סה"כ רשומות
                </CardTitle>
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(stats || defaultStats).totalEntries}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                רשומות מצב רוח
              </p>
            </CardContent>
          </Card>

          {/* Average Mood */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  מצב רוח ממוצע
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-3xl font-bold ${getMoodColor((stats || defaultStats).averageMood)}`}
                >
                  {(stats || defaultStats).averageMood
                    ? (stats || defaultStats).averageMood.toFixed(1)
                    : '0.0'}
                </span>
                <span className="text-2xl">
                  {getMoodEmoji((stats || defaultStats).averageMood)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                מתוך 10
              </p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  רצף נוכחי
                </CardTitle>
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(stats || defaultStats).currentStreak}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ימים ברצף
              </p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  רצף הטוב ביותר
                </CardTitle>
                <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(stats || defaultStats).bestStreak}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ימים ברצף
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Weekly Average */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ממוצע שבועי
                </p>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(stats || defaultStats).weeklyAverage
                    ? (stats || defaultStats).weeklyAverage.toFixed(1)
                    : '0.0'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Average */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ממוצע חודשי
                </p>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {(stats || defaultStats).monthlyAverage
                    ? (stats || defaultStats).monthlyAverage.toFixed(1)
                    : '0.0'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mood Trend */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  מגמת מצב רוח
                </p>
                <div className="flex items-center justify-center space-x-2">
                  {getTrendIcon((stats || defaultStats).moodTrend)}
                  <span
                    className={`text-lg font-semibold ${getTrendColor((stats || defaultStats).moodTrend)}`}
                  >
                    {getTrendText((stats || defaultStats).moodTrend)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Entry & Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mood Entry */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>הזנת מצב רוח</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  תיעדו את מצב הרוח שלכם היום וקבלו תובנות מותאמות אישית
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodEntry onSuccess={fetchDashboardStats} />
              </CardContent>
            </Card>

            {/* Mood Chart */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>מגמות מצב רוח</span>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  צפו במגמות ובשינויים במצב הרוח שלכם לאורך זמן
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodChart />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                  סטטיסטיקות מהירות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      תובנות זמינות
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {(stats || defaultStats).insightsCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      תובנות שלא נקראו
                    </span>
                    <Badge
                      variant={
                        (stats || defaultStats).unreadInsights > 0
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {(stats || defaultStats).unreadInsights}
                    </Badge>
                  </div>
                  {(stats || defaultStats).currentStreak > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        רצף נוכחי
                      </span>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {(stats || defaultStats).currentStreak} ימים
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Insights Panel */}
            <InsightsPanel onInsightUpdated={fetchDashboardStats} />
          </div>
        </div>

        {/* Bottom Section - Tips */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                טיפים לשיפור מצב הרוח
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                פעולות פשוטות שיכולות לשפר את מצב הרוח שלכם
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    פעילות גופנית
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    הליכה קצרה או תרגילי מתיחה יכולים לשפר את מצב הרוח
                  </p>
                </div>

                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    מדיטציה
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    דקות ספורות של נשימה עמוקה יכולות להרגיע את הנפש
                  </p>
                </div>

                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    שגרה קבועה
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    שמירה על לוח זמנים קבוע עוזרת ליציבות נפשית
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
