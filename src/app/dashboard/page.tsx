'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, MoodChart, InsightsPanel } from '@/components/mood';
import { 
  Calendar,
  BarChart3,
  Activity,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DashboardStats {
  totalEntries: number;
  averageMood: number;
  currentStreak: number;
  bestStreak: number;
  insightsCount: number;
  unreadInsights: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock stats for demo
      setStats({
        totalEntries: 15,
        averageMood: 6.8,
        currentStreak: 5,
        bestStreak: 12,
        insightsCount: 8,
        unreadInsights: 2
      });
    } catch (err) {
      setError('שגיאה בטעינת נתוני Dashboard');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600 dark:text-green-400';
    if (mood >= 6) return 'text-blue-600 dark:text-blue-400';
    if (mood >= 4) return 'text-yellow-600 dark:text-yellow-400';
    if (mood >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            שלום משתמש דמו! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            עקבו אחרי מצב הרוח שלכם וקבלו תובנות חכמות לשיפור הרווחה הנפשית
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Entries */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">סה"כ רשומות</CardTitle>
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalEntries}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">רשומות מצב רוח</p>
              </CardContent>
            </Card>

            {/* Average Mood */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">מצב רוח ממוצע</CardTitle>
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className={`text-3xl font-bold ${getMoodColor(stats.averageMood)}`}>
                    {stats.averageMood.toFixed(1)}
                  </span>
                  <span className="text-2xl">{getMoodEmoji(stats.averageMood)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">מתוך 10</p>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">רצף נוכחי</CardTitle>
                  <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.currentStreak}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ימים ברצף</p>
              </CardContent>
            </Card>

            {/* Best Streak */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">רצף הטוב ביותר</CardTitle>
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.bestStreak}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ימים ברצף</p>
              </CardContent>
            </Card>
          </div>
        )}

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
                {stats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">תובנות זמינות</span>
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        {stats.insightsCount}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">תובנות שלא נקראו</span>
                      <Badge variant={stats.unreadInsights > 0 ? "destructive" : "secondary"}>
                        {stats.unreadInsights}
                      </Badge>
                    </div>
                    {stats.currentStreak > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">רצף נוכחי</span>
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {stats.currentStreak} ימים
                        </Badge>
                      </div>
                    )}
                  </>
                )}
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
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">פעילות גופנית</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    הליכה קצרה או תרגילי מתיחה יכולים לשפר את מצב הרוח
                  </p>
                </div>
                
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">מדיטציה</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    דקות ספורות של נשימה עמוקה יכולות להרגיע את הנפש
                  </p>
                </div>
                
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">שגרה קבועה</h4>
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