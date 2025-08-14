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
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  FileText,
  Users,
  Smile,
  Moon
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ProgressReport {
  id: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  metrics: {
    moodImprovement: number;
    goalCompletion: number;
    activityConsistency: number;
    sleepQuality: number;
    socialEngagement: number;
    journalEntries: number;
    breathingSessions: number;
    streakDays: number;
  };
  trendData: TrendData[];
  insights: string[];
  recommendations: string[];
  comparison: {
    moodImprovement: number;
    goalCompletion: number;
    activityConsistency: number;
    sleepQuality: number;
    socialEngagement: number;
  };
  summary: {
    totalDays: number;
    activeDays: number;
    completedGoals: number;
    totalActivities: number;
  };
}

interface TrendData {
  date: string;
  moodAverage: number;
  activitiesCount: number;
  goalsProgress: number;
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
  const [currentReport, setCurrentReport] = useState<ProgressReport | null>(null);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'line' | 'area' | 'bar'>('line');

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load current report from API
      const response = await fetch(`/api/reports?period=${selectedPeriod}`);
      if (response.ok) {
        const result = await response.json();
        setCurrentReport(result.data);
      } else {
        console.error('Failed to load report');
      }

      // Load goals data (mock for now)
      // Load goals data (mock for now)
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
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: selectedPeriod }),
      });

      if (response.ok) {
        // Reload the current report
        await loadData();
      } else {
        console.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportReport = () => {
    if (!currentReport) return;

    const csvContent = [
      ['מדד', 'ערך', 'השוואה לתקופה קודמת'].join(','),
      ['שיפור מצב רוח', `${currentReport.metrics.moodImprovement}%`, `${currentReport.comparison.moodImprovement > 0 ? '+' : ''}${currentReport.comparison.moodImprovement}%`].join(','),
      ['השלמת מטרות', `${currentReport.metrics.goalCompletion}%`, `${currentReport.comparison.goalCompletion > 0 ? '+' : ''}${currentReport.comparison.goalCompletion}%`].join(','),
      ['עקביות פעילות', `${currentReport.metrics.activityConsistency}%`, `${currentReport.comparison.activityConsistency > 0 ? '+' : ''}${currentReport.comparison.activityConsistency}%`].join(','),
      ['איכות שינה', `${currentReport.metrics.sleepQuality}%`, `${currentReport.comparison.sleepQuality > 0 ? '+' : ''}${currentReport.comparison.sleepQuality}%`].join(','),
      ['מעורבות חברתית', `${currentReport.metrics.socialEngagement}%`, `${currentReport.comparison.socialEngagement > 0 ? '+' : ''}${currentReport.comparison.socialEngagement}%`].join(','),
      ['', '', ''].join(','),
      ['תובנות:', '', ''].join(','),
      ...currentReport.insights.map(insight => [`"${insight}"`, '', ''].join(',')),
      ['', '', ''].join(','),
      ['המלצות:', '', ''].join(','),
      ...currentReport.recommendations.map(rec => [`"${rec}"`, '', ''].join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `דוח_התקדמות_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
        {currentReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">ימים פעילים</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currentReport.summary.activeDays}/{currentReport.summary.totalDays}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300">מטרות הושלמו</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {currentReport.summary.completedGoals}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">סה"כ פעילויות</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {currentReport.summary.totalActivities}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">רצף ימים</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {currentReport.metrics.streakDays}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Period Selector and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                בחירת תקופה
              </CardTitle>
              <CardDescription>בחר את תקופת הדוח שברצונך לצפות</CardDescription>
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
                <Button
                  variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod('year')}
                >
                  שנתי
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                פעולות דוח
              </CardTitle>
              <CardDescription>צור, ייצא ושתף דוחות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={exportReport} variant="outline" disabled={!currentReport}>
                  <Download className="w-4 h-4 mr-2" />
                  ייצא
                </Button>
                <Button variant="outline" disabled={!currentReport}>
                  <Share2 className="w-4 h-4 mr-2" />
                  שתף
                </Button>
                <Button variant="outline" disabled={!currentReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Metrics Dashboard */}
        {currentReport && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  מדדים עיקריים
                </CardTitle>
                <CardDescription>השוואה לתקופה הקודמת</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smile className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">שיפור מצב רוח</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {currentReport.metrics.moodImprovement}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentReport.comparison.moodImprovement > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : currentReport.comparison.moodImprovement < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentReport.comparison.moodImprovement > 0 ? 'text-green-600' :
                        currentReport.comparison.moodImprovement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(currentReport.comparison.moodImprovement)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">השלמת מטרות</p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {currentReport.metrics.goalCompletion}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentReport.comparison.goalCompletion > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : currentReport.comparison.goalCompletion < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentReport.comparison.goalCompletion > 0 ? 'text-green-600' :
                        currentReport.comparison.goalCompletion < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(currentReport.comparison.goalCompletion)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-medium text-purple-900 dark:text-purple-100">עקביות פעילות</p>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {currentReport.metrics.activityConsistency}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentReport.comparison.activityConsistency > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : currentReport.comparison.activityConsistency < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentReport.comparison.activityConsistency > 0 ? 'text-green-600' :
                        currentReport.comparison.activityConsistency < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(currentReport.comparison.activityConsistency)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="font-medium text-orange-900 dark:text-orange-100">איכות שינה</p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {currentReport.metrics.sleepQuality}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentReport.comparison.sleepQuality > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : currentReport.comparison.sleepQuality < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentReport.comparison.sleepQuality > 0 ? 'text-green-600' :
                        currentReport.comparison.sleepQuality < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(currentReport.comparison.sleepQuality)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <p className="font-medium text-indigo-900 dark:text-indigo-100">מעורבות חברתית</p>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                          {currentReport.metrics.socialEngagement}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {currentReport.comparison.socialEngagement > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      ) : currentReport.comparison.socialEngagement < 0 ? (
                        <ArrowDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-gray-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        currentReport.comparison.socialEngagement > 0 ? 'text-green-600' :
                        currentReport.comparison.socialEngagement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(currentReport.comparison.socialEngagement)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trend Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      מגמות לאורך זמן
                    </CardTitle>
                    <CardDescription>התקדמות יומית במדדים השונים</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={selectedChart === 'line' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedChart('line')}
                    >
                      קו
                    </Button>
                    <Button
                      variant={selectedChart === 'area' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedChart('area')}
                    >
                      אזור
                    </Button>
                    <Button
                      variant={selectedChart === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedChart('bar')}
                    >
                      עמודות
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedChart === 'line' && (
                      <LineChart data={currentReport.trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('he-IL')}
                          formatter={(value: any, name: string) => [
                            typeof value === 'number' ? value.toFixed(1) : value,
                            name === 'moodAverage' ? 'ממוצע מצב רוח' :
                            name === 'activitiesCount' ? 'מספר פעילויות' :
                            name === 'goalsProgress' ? 'התקדמות מטרות' : name
                          ]}
                        />
                        <Line type="monotone" dataKey="moodAverage" stroke="#3B82F6" strokeWidth={2} name="moodAverage" />
                        <Line type="monotone" dataKey="activitiesCount" stroke="#10B981" strokeWidth={2} name="activitiesCount" />
                        <Line type="monotone" dataKey="goalsProgress" stroke="#8B5CF6" strokeWidth={2} name="goalsProgress" />
                      </LineChart>
                    )}
                    {selectedChart === 'area' && (
                      <AreaChart data={currentReport.trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('he-IL')}
                          formatter={(value: any, name: string) => [
                            typeof value === 'number' ? value.toFixed(1) : value,
                            name === 'moodAverage' ? 'ממוצע מצב רוח' :
                            name === 'activitiesCount' ? 'מספר פעילויות' :
                            name === 'goalsProgress' ? 'התקדמות מטרות' : name
                          ]}
                        />
                        <Area type="monotone" dataKey="moodAverage" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="moodAverage" />
                        <Area type="monotone" dataKey="activitiesCount" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="activitiesCount" />
                      </AreaChart>
                    )}
                    {selectedChart === 'bar' && (
                      <BarChart data={currentReport.trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleDateString('he-IL')}
                          formatter={(value: any, name: string) => [
                            typeof value === 'number' ? value.toFixed(1) : value,
                            name === 'moodAverage' ? 'ממוצע מצב רוח' :
                            name === 'activitiesCount' ? 'מספר פעילויות' :
                            name === 'goalsProgress' ? 'התקדמות מטרות' : name
                          ]}
                        />
                        <Bar dataKey="moodAverage" fill="#3B82F6" name="moodAverage" />
                        <Bar dataKey="activitiesCount" fill="#10B981" name="activitiesCount" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
