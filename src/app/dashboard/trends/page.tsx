'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  LineChart,
  AreaChart,
  PieChart,
  Download,
  Share2,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Activity,
  Heart,
  Brain,
  Zap,
  Target,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { trackPageView, trackTrendsAnalysis, trackFeatureUsage, trackDataAction } from '@/lib/analytics';

interface TrendData {
  period: string;
  moodTrend: number;
  activityTrend: number;
  sleepTrend: number;
  socialTrend: number;
  stressTrend: number;
  energyTrend: number;
}

interface SeasonalPattern {
  season: string;
  averageMood: number;
  commonActivities: string[];
  recommendations: string[];
}

interface LongTermGoal {
  id: string;
  title: string;
  startDate: string;
  targetDate: string;
  currentProgress: number;
  trend: 'improving' | 'declining' | 'stable';
  milestones: Array<{
    id: string;
    title: string;
    date: string;
    completed: boolean;
  }>;
}

export default function TrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year' | '2years'>('6months');
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'activity' | 'sleep' | 'social' | 'stress' | 'energy'>('mood');
  const [loading, setLoading] = useState(true);
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([]);
  const [longTermGoals, setLongTermGoals] = useState<LongTermGoal[]>([]);

  useEffect(() => {
    // Track page view
    trackPageView('trends_page');
    loadTrendsData();
  }, [selectedPeriod]);

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockTrendsData: TrendData[] = [
        {
          period: 'ינואר-מרץ 2025',
          moodTrend: 12,
          activityTrend: 8,
          sleepTrend: 15,
          socialTrend: -5,
          stressTrend: -10,
          energyTrend: 20
        },
        {
          period: 'אפריל-יוני 2025',
          moodTrend: 18,
          activityTrend: 25,
          sleepTrend: 8,
          socialTrend: 15,
          stressTrend: -15,
          energyTrend: 30
        },
        {
          period: 'יולי-ספטמבר 2025',
          moodTrend: 25,
          activityTrend: 30,
          sleepTrend: 12,
          socialTrend: 20,
          stressTrend: -20,
          energyTrend: 35
        },
        {
          period: 'אוקטובר-דצמבר 2025',
          moodTrend: 15,
          activityTrend: 18,
          sleepTrend: 10,
          socialTrend: 12,
          stressTrend: -8,
          energyTrend: 25
        }
      ];

      const mockSeasonalPatterns: SeasonalPattern[] = [
        {
          season: 'חורף',
          averageMood: 6.2,
          commonActivities: ['מדיטציה', 'קריאה', 'תרגילי נשימה'],
          recommendations: ['הוסף אור מלאכותי', 'שמור על שגרה קבועה', 'הוסף פעילות גופנית בבית']
        },
        {
          season: 'אביב',
          averageMood: 7.8,
          commonActivities: ['הליכה בחוץ', 'גינון', 'פעילויות חברתיות'],
          recommendations: ['נצל את מזג האוויר', 'הוסף פעילויות בחוץ', 'תכנן מפגשים חברתיים']
        },
        {
          season: 'קיץ',
          averageMood: 7.5,
          commonActivities: ['שחייה', 'ספורט חוץ', 'חופשות'],
          recommendations: ['שמור על קור רוח', 'הימנע מחשיפה ממושכת לשמש', 'שמור על שגרת שינה']
        },
        {
          season: 'סתיו',
          averageMood: 6.8,
          commonActivities: ['יוגה', 'בישול', 'אמנות'],
          recommendations: ['התכונן לשינויי מזג אוויר', 'שמור על פעילות גופנית', 'תכנן פעילויות פנים']
        }
      ];

      const mockLongTermGoals: LongTermGoal[] = [
        {
          id: '1',
          title: 'שיפור מצב הרוח הכללי',
          startDate: '2025-01-01',
          targetDate: '2025-12-31',
          currentProgress: 75,
          trend: 'improving',
          milestones: [
            { id: '1', title: 'השלמת 30 ימי תיעוד רצוף', date: '2025-02-01', completed: true },
            { id: '2', title: 'התחלת תרגילי נשימה יומיים', date: '2025-04-01', completed: true },
            { id: '3', title: 'השלמת 100 תרגילי מדיטציה', date: '2025-06-01', completed: true },
            { id: '4', title: 'השגת ממוצע מצב רוח של 7.5+', date: '2025-09-01', completed: false },
            { id: '5', title: 'השלמת שנה שלמה של מעקב', date: '2025-12-31', completed: false }
          ]
        },
        {
          id: '2',
          title: 'הגדלת רשת התמיכה החברתית',
          startDate: '2025-03-01',
          targetDate: '2025-12-31',
          currentProgress: 60,
          trend: 'improving',
          milestones: [
            { id: '1', title: 'הצטרפות לקבוצת תמיכה', date: '2025-04-01', completed: true },
            { id: '2', title: 'התחלת מפגשים שבועיים', date: '2025-05-01', completed: true },
            { id: '3', title: 'יצירת 3 קשרים חדשים', date: '2025-07-01', completed: true },
            { id: '4', title: 'ארגון מפגש חברתי חודשי', date: '2025-10-01', completed: false },
            { id: '5', title: 'הפיכה למנטור בקבוצה', date: '2025-12-31', completed: false }
          ]
        },
        {
          id: '3',
          title: 'שיפור איכות השינה',
          startDate: '2025-01-01',
          targetDate: '2025-12-31',
          currentProgress: 45,
          trend: 'stable',
          milestones: [
            { id: '1', title: 'הקמת שגרת שינה קבועה', date: '2025-02-01', completed: true },
            { id: '2', title: 'הסרת מסכים שעה לפני השינה', date: '2025-04-01', completed: true },
            { id: '3', title: 'השלמת 30 לילות של 7+ שעות שינה', date: '2025-06-01', completed: false },
            { id: '4', title: 'הפחתת זמן ההרדמות ל-15 דקות', date: '2025-09-01', completed: false },
            { id: '5', title: 'השגת ממוצע איכות שינה של 8+', date: '2025-12-31', completed: false }
          ]
        }
      ];

      setTrendsData(mockTrendsData);
      setSeasonalPatterns(mockSeasonalPatterns);
      setLongTermGoals(mockLongTermGoals);
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGoalTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'stable': return <Minus className="w-5 h-5 text-gray-600" />;
      default: return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getGoalTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'mood': return 'מצב רוח';
      case 'activity': return 'פעילות גופנית';
      case 'sleep': return 'איכות שינה';
      case 'social': return 'מעורבות חברתית';
      case 'stress': return 'רמת לחץ';
      case 'energy': return 'רמת אנרגיה';
      default: return metric;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען מגמות ארוכות טווח...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">מגמות ארוכות טווח</h1>
            <p className="text-gray-600 dark:text-gray-400">ניתוח מגמות והתקדמות לאורך זמן</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => trackDataAction('export', 'trends_data')}
            >
              <Download className="w-4 h-4 mr-2" />
              ייצא נתונים
            </Button>
            <Button 
              variant="outline"
              onClick={() => trackDataAction('share', 'trends_report')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              שתף דוח
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              הגדרות ניתוח
            </CardTitle>
            <CardDescription>בחר את תקופת הניתוח והמדד שברצונך לבדוק</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  תקופת ניתוח
                </label>
                <Select value={selectedPeriod} onValueChange={(value: any) => {
                  setSelectedPeriod(value);
                  trackTrendsAnalysis(value, selectedMetric);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">3 חודשים</SelectItem>
                    <SelectItem value="6months">6 חודשים</SelectItem>
                    <SelectItem value="1year">שנה</SelectItem>
                    <SelectItem value="2years">שנתיים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  מדד לניתוח
                </label>
                <Select value={selectedMetric} onValueChange={(value: any) => {
                  setSelectedMetric(value);
                  trackTrendsAnalysis(selectedPeriod, value);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mood">מצב רוח</SelectItem>
                    <SelectItem value="activity">פעילות גופנית</SelectItem>
                    <SelectItem value="sleep">איכות שינה</SelectItem>
                    <SelectItem value="social">מעורבות חברתית</SelectItem>
                    <SelectItem value="stress">רמת לחץ</SelectItem>
                    <SelectItem value="energy">רמת אנרגיה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              סקירת מגמות
            </CardTitle>
            <CardDescription>מגמות לאורך זמן במדדים השונים</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendsData.map((period, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">{period.period}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">מצב רוח</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(period.moodTrend)}
                        <span className={`font-medium ${getTrendColor(period.moodTrend)}`}>
                          {period.moodTrend > 0 ? '+' : ''}{period.moodTrend}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">פעילות</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(period.activityTrend)}
                        <span className={`font-medium ${getTrendColor(period.activityTrend)}`}>
                          {period.activityTrend > 0 ? '+' : ''}{period.activityTrend}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">שינה</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(period.sleepTrend)}
                        <span className={`font-medium ${getTrendColor(period.sleepTrend)}`}>
                          {period.sleepTrend > 0 ? '+' : ''}{period.sleepTrend}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">חברתי</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(period.socialTrend)}
                        <span className={`font-medium ${getTrendColor(period.socialTrend)}`}>
                          {period.socialTrend > 0 ? '+' : ''}{period.socialTrend}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seasonal Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              דפוסים עונתיים
            </CardTitle>
            <CardDescription>מגמות עונתיות במצב הרוח והפעילויות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seasonalPatterns.map((pattern, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{pattern.season}</h4>
                    <div className="text-3xl font-bold text-blue-600">{pattern.averageMood}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ממוצע מצב רוח</p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">פעילויות נפוצות</h5>
                    <div className="space-y-1">
                      {pattern.commonActivities.map((activity, idx) => (
                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">המלצות</h5>
                    <div className="space-y-1">
                      {pattern.recommendations.map((rec, idx) => (
                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-500" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Long Term Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              התקדמות מטרות ארוכות טווח
            </CardTitle>
            <CardDescription>מעקב אחר מטרות שנתיות ומגמות התקדמות</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {longTermGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
                        <div className="flex items-center gap-1">
                          {getGoalTrendIcon(goal.trend)}
                          <span className={`text-sm font-medium ${getGoalTrendColor(goal.trend)}`}>
                            {goal.trend === 'improving' ? 'משתפר' : goal.trend === 'declining' ? 'יורד' : 'יציב'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <span>התחלה: {new Date(goal.startDate).toLocaleDateString('he-IL')}</span>
                        <span>יעד: {new Date(goal.targetDate).toLocaleDateString('he-IL')}</span>
                        <span>התקדמות: {goal.currentProgress}%</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.currentProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Milestones */}
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">אבני דרך</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goal.milestones.map((milestone) => (
                        <div 
                          key={milestone.id} 
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            milestone.completed 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            milestone.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                          }`}>
                            {milestone.completed ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              milestone.completed 
                                ? 'text-green-800 dark:text-green-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {milestone.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(milestone.date).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights and Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              תובנות והמלצות
            </CardTitle>
            <CardDescription>ניתוח מגמות והמלצות לשיפור</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">תובנות עיקריות</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">מגמה חיובית במצב הרוח</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        מצב הרוח שלך השתפר ב-18% בממוצע לאורך השנה האחרונה
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">עלייה בפעילות גופנית</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        רמת הפעילות הגופנית עלתה ב-25% עם שיפור בעקביות
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">התפתחות חברתית</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        המעורבות החברתית השתפרה משמעותית בחודשי האביב והקיץ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">המלצות לשיפור</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">שמירה על שגרה</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        המשך בשגרה הקיימת של פעילות גופנית ומדיטציה
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">תכנון עונתי</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        תכנן פעילויות מותאמות לכל עונה לשמירה על מגמה חיובית
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">מעקב מתמשך</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        המשך במעקב היומי לשמירה על התקדמות עקבית
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
