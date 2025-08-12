'use client';

// Temporarily disabled NextAuth for demo
// import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoodEntry, MoodChart, InsightsPanel } from '@/components/mood';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Lightbulb, 
  Calendar,
  LogOut,
  User,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
// import { signOut } from 'next-auth/react';

interface DashboardStats {
  totalEntries: number;
  averageMood: number;
  currentStreak: number;
  bestStreak: number;
  insightsCount: number;
  unreadInsights: number;
}

export default function DashboardPage() {
  // Temporarily disabled for demo
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip authentication check for demo
    // if (status === 'unauthenticated') {
    //   router.push('/auth/signin');
    // }
  }, [router]);

  useEffect(() => {
    // Set mock stats immediately without API call
    setStats({
      totalEntries: 15,
      averageMood: 7.2,
      currentStreak: 5,
      bestStreak: 12,
      insightsCount: 8,
      unreadInsights: 3
    });
    setLoading(false);
  }, []);

  const fetchDashboardStats = async () => {
    // Skip if already loading
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demo
      setStats({
        totalEntries: 15,
        averageMood: 7.2,
        currentStreak: 5,
        bestStreak: 12,
        insightsCount: 8,
        unreadInsights: 3
      });
    } catch (err) {
      setError('שגיאה בטעינת נתוני Dashboard');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Temporarily disabled for demo
    // await signOut({ callbackUrl: '/' });
    router.push('/');
  };

  // Skip loading and auth checks for demo
  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
  //         <p className="text-lg text-gray-600">טוען Dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (status === 'unauthenticated') {
  //   return null; // Will redirect to signin
  // }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">שגיאה בטעינת Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchDashboardStats} className="w-full">
                נסה שוב
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600';
    if (mood >= 6) return 'text-blue-600';
    if (mood >= 4) return 'text-yellow-600';
    if (mood >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          שלום משתמש דמו! 👋
        </h2>
        <p className="text-gray-600 text-sm">
          עקבו אחרי מצב הרוח שלכם וקבלו תובנות חכמות לשיפור הרווחה הנפשית
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Entries */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">סה"כ רשומות</CardTitle>
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
              <p className="text-xs text-gray-500 mt-1">רשומות מצב רוח</p>
            </CardContent>
          </Card>

          {/* Average Mood */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">מצב רוח ממוצע</CardTitle>
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getMoodColor(stats.averageMood)}`}>
                  {stats.averageMood.toFixed(1)}
                </span>
                <span className="text-xl">{getMoodEmoji(stats.averageMood)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">מתוך 10</p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">רצף נוכחי</CardTitle>
                <Activity className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
              <p className="text-xs text-gray-500 mt-1">ימים ברצף</p>
            </CardContent>
          </Card>

          {/* Best Streak */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium text-gray-600">רצף הטוב ביותר</CardTitle>
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.bestStreak}</div>
              <p className="text-xs text-gray-500 mt-1">ימים ברצף</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Mood Entry & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Entry */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Target className="w-4 h-4 text-blue-600" />
                <span>הזנת מצב רוח</span>
              </CardTitle>
              <CardDescription className="text-sm">
                תיעדו את מצב הרוח שלכם היום וקבלו תובנות מותאמות אישית
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodEntry onSuccess={fetchDashboardStats} />
            </CardContent>
          </Card>

          {/* Mood Chart */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>מגמות מצב רוח</span>
              </CardTitle>
              <CardDescription className="text-sm">
                צפו במגמות ובשינויים במצב הרוח שלכם לאורך זמן
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MoodChart />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span>סטטיסטיקות מהירות</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">תובנות זמינות</span>
                    <Badge variant="secondary">{stats.insightsCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">תובנות שלא נקראו</span>
                    <Badge variant={stats.unreadInsights > 0 ? "destructive" : "secondary"}>
                      {stats.unreadInsights}
                    </Badge>
                  </div>
                  {stats.currentStreak > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">רצף נוכחי</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {stats.currentStreak} ימים
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Insights Panel */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span>תובנות והמלצות</span>
              </CardTitle>
              <CardDescription className="text-sm">
                קבלו תובנות חכמות והמלצות מותאמות אישית
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsPanel onInsightUpdated={fetchDashboardStats} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Tips */}
      <div className="mt-8">
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              טיפים לשיפור מצב הרוח
            </CardTitle>
            <CardDescription className="text-sm">
              פעולות פשוטות שיכולות לשפר את מצב הרוח שלכם
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">פעילות גופנית</h4>
                <p className="text-xs text-gray-600">
                  הליכה קצרה או תרגילי מתיחה יכולים לשפר את מצב הרוח
                </p>
              </div>
              
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">מדיטציה</h4>
                <p className="text-xs text-gray-600">
                  דקות ספורות של נשימה עמוקה יכולות להרגיע את הנפש
                </p>
              </div>
              
              <div className="text-center p-3 bg-white/60 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">שגרה קבועה</h4>
                <p className="text-xs text-gray-600">
                  שמירה על לוח זמנים קבוע עוזרת ליציבות נפשית
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}