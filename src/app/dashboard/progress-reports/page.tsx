'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  BarChart3,
  Download,
  Share2,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Activity,
  Heart,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ProgressReport {
  id: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'completed' | 'shared';
  createdAt: string;
  updatedAt: string;
  metrics: {
    moodImprovement: number;
    goalCompletion: number;
    activityConsistency: number;
    sleepQuality: number;
    socialEngagement: number;
  };
  insights: string[];
  recommendations: string[];
  nextSteps: string[];
}

interface GoalProgress {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'behind' | 'completed' | 'at-risk';
}

export default function ProgressReportsPage() {
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [showCompleted, setShowCompleted] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API calls
      const mockReports: ProgressReport[] = [
        {
          id: '1',
          title: 'דוח התקדמות חודשי - אוגוסט 2025',
          period: 'month',
          startDate: '2025-08-01',
          endDate: '2025-08-31',
          status: 'completed',
          createdAt: '2025-08-12T10:00:00Z',
          updatedAt: '2025-08-12T10:00:00Z',
          metrics: {
            moodImprovement: 15,
            goalCompletion: 80,
            activityConsistency: 70,
            sleepQuality: 85,
            socialEngagement: 60
          },
          insights: [
            'מצב הרוח השתפר ב-15% לעומת החודש הקודם',
            'המטרות הושלמו ב-80% - מעל הממוצע',
            'איכות השינה יציבה וטובה',
            'יש מקום לשיפור בעקביות הפעילות הגופנית'
          ],
          recommendations: [
            'המשך בשגרה הנוכחית של שינה',
            'הוסף עוד 2-3 אימונים בשבוע',
            'שמור על המגמה החיובית במצב הרוח'
          ],
          nextSteps: [
            'הגדר מטרות חדשות לספטמבר',
            'תכנן פעילויות חברתיות נוספות',
            'עקוב אחר התקדמות הפעילות הגופנית'
          ]
        },
        {
          id: '2',
          title: 'דוח התקדמות שבועי - שבוע 32',
          period: 'week',
          startDate: '2025-08-05',
          endDate: '2025-08-11',
          status: 'completed',
          createdAt: '2025-08-11T18:00:00Z',
          updatedAt: '2025-08-11T18:00:00Z',
          metrics: {
            moodImprovement: 8,
            goalCompletion: 90,
            activityConsistency: 85,
            sleepQuality: 80,
            socialEngagement: 75
          },
          insights: [
            'שבוע מעולה עם התקדמות טובה במטרות',
            'פעילות גופנית עקבית יותר מהרגיל',
            'מצב הרוח יציב עם מגמה חיובית'
          ],
          recommendations: [
            'המשך ברמת הפעילות הגופנית הנוכחית',
            'שמור על שגרת השינה הקיימת'
          ],
          nextSteps: [
            'תכנן מטרות לשבוע הבא',
            'הוסף פעילויות חברתיות נוספות'
          ]
        }
      ];

      const mockGoals: GoalProgress[] = [
        {
          id: '1',
          title: 'פעילות גופנית יומית',
          target: 30,
          current: 25,
          unit: 'דקות',
          deadline: '2025-08-31',
          status: 'on-track'
        },
        {
          id: '2',
          title: 'תיעוד מצב רוח יומי',
          target: 31,
          current: 31,
          unit: 'ימים',
          deadline: '2025-08-31',
          status: 'completed'
        },
        {
          id: '3',
          title: 'מדיטציה שבועית',
          target: 4,
          current: 2,
          unit: 'פעמים',
          deadline: '2025-08-31',
          status: 'behind'
        },
        {
          id: '4',
          title: 'שיפור איכות שינה',
          target: 8,
          current: 7.5,
          unit: 'שעות',
          deadline: '2025-08-31',
          status: 'on-track'
        }
      ];

      setReports(mockReports);
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewReport = async () => {
    setGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ProgressReport = {
        id: Date.now().toString(),
        title: `דוח התקדמות ${selectedPeriod === 'week' ? 'שבועי' : selectedPeriod === 'month' ? 'חודשי' : 'רבעוני'} - ${new Date().toLocaleDateString('he-IL')}`,
        period: selectedPeriod,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metrics: {
          moodImprovement: Math.floor(Math.random() * 30) + 5,
          goalCompletion: Math.floor(Math.random() * 40) + 50,
          activityConsistency: Math.floor(Math.random() * 30) + 60,
          sleepQuality: Math.floor(Math.random() * 20) + 70,
          socialEngagement: Math.floor(Math.random() * 30) + 50
        },
        insights: [
          'דוח חדש נוצר בהצלחה',
          'הנתונים נאספו ומנותחים',
          'המלצות הוכנו'
        ],
        recommendations: [
          'עיין בנתונים החדשים',
          'השווה עם דוחות קודמים',
          'הגדר מטרות חדשות'
        ],
        nextSteps: [
          'שתף את הדוח עם המטפל',
          'עדכן את המטרות שלך',
          'תכנן פעילויות חדשות'
        ]
      };

      setReports(prev => [newReport, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'shared': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'הושלם';
      case 'draft': return 'טיוטה';
      case 'shared': return 'שותף';
      default: return 'לא ידוע';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'behind': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'at-risk': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getGoalStatusText = (status: string) => {
    switch (status) {
      case 'on-track': return 'בדרך הנכונה';
      case 'behind': return 'מאחור';
      case 'completed': return 'הושלם';
      case 'at-risk': return 'בסיכון';
      default: return 'לא ידוע';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">טוען דוחות התקדמות...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">דוחות התקדמות</h1>
            <p className="text-gray-600 dark:text-gray-400">עקוב אחר ההתקדמות שלך וצור דוחות מפורטים</p>
          </div>
          <Button 
            onClick={generateNewReport} 
            disabled={generatingReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {generatingReport ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                יוצר דוח...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                צור דוח חדש
              </>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">סה"כ דוחות</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">הושלמו</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">מטרות פעילות</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goals.filter(g => g.status !== 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">ממוצע התקדמות</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(goals.reduce((acc, goal) => acc + (goal.current / goal.target) * 100, 0) / goals.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              בחירת תקופה
            </CardTitle>
            <CardDescription>בחר את תקופת הדוח שברצונך ליצור</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('week')}
              >
                שבועי
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('month')}
              >
                חודשי
              </Button>
              <Button
                variant={selectedPeriod === 'quarter' ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod('quarter')}
              >
                רבעוני
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              דוחות התקדמות
            </CardTitle>
            <CardDescription>הדוחות שלך לאורך זמן</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">אין דוחות התקדמות</p>
                  <p className="text-sm">צור דוח ראשון כדי להתחיל לעקוב אחר ההתקדמות שלך</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {report.title}
                          </h3>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusText(report.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {new Date(report.startDate).toLocaleDateString('he-IL')} - {new Date(report.endDate).toLocaleDateString('he-IL')}
                        </p>
                        
                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{report.metrics.moodImprovement}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">שיפור מצב רוח</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{report.metrics.goalCompletion}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">השלמת מטרות</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{report.metrics.activityConsistency}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">עקביות פעילות</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{report.metrics.sleepQuality}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">איכות שינה</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{report.metrics.socialEngagement}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">מעורבות חברתית</div>
                          </div>
                        </div>

                        {/* Insights */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            תובנות עיקריות
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {report.insights.slice(0, 2).map((insight, index) => (
                              <li key={index}>{insight}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          צפה
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          הורד
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          שתף
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              התקדמות מטרות
            </CardTitle>
            <CardDescription>עקוב אחר ההתקדמות במטרות שלך</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {getGoalStatusText(goal.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{goal.current} / {goal.target} {goal.unit}</span>
                        <span>דדליין: {new Date(goal.deadline).toLocaleDateString('he-IL')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
