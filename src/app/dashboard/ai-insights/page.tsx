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
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Brain,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Heart,
  Activity,
  Calendar,
  Clock,
  Zap,
  Star,
  Award,
  BookOpen,
  Users,
  Smile,
  Frown,
  Meh,
  RefreshCw,
  Download,
  Settings,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Info,
  Sparkles,
  Crown,
  Lock,
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'pattern' | 'recommendation' | 'warning' | 'achievement';
  category: 'mood' | 'goals' | 'habits' | 'social' | 'health' | 'patterns';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  dataPoints: number;
  timestamp: string;
  aiModel: string;
  accuracy: number;
}

interface AIPrediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  recommendation: string;
  aiModel: string;
}

interface AIPattern {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  strength: number;
  trend: 'improving' | 'declining' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
  examples: string[];
  aiModel: string;
  confidence: number;
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [patterns, setPatterns] = useState<AIPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  useEffect(() => {
    loadAIInsights();
  }, [selectedCategory, selectedTimeframe]);

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Mock data for demo purposes
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          category: 'mood',
          title: 'מצב רוח צפוי להשתפר השבוע',
          description:
            'תבסס על הנתונים שלך, מצב הרוח שלך צפוי להשתפר ב-15% השבוע הבא',
          confidence: 87,
          priority: 'high',
          actionable: true,
          recommendations: [
            'המשך עם תרגילי הנשימה היומיים',
            'שמור על לוח זמנים קבוע לשינה',
            'הוסף פעילות גופנית קלה',
          ],
          dataPoints: 45,
          timestamp: new Date().toISOString(),
          aiModel: 'GPT-4 + Mood Analysis Model',
          accuracy: 92,
        },
        {
          id: '2',
          type: 'pattern',
          category: 'habits',
          title: 'זיהוי דפוס שינה לא יציב',
          description: 'המערכת זיהתה דפוס שינה לא יציב בימים שלישי ורביעי',
          confidence: 94,
          priority: 'medium',
          actionable: true,
          recommendations: [
            'הקפד על שעת שינה קבועה',
            'הימנע ממסכים שעה לפני השינה',
            'שמור על חדר השינה קריר וחשוך',
          ],
          dataPoints: 28,
          timestamp: new Date().toISOString(),
          aiModel: 'Sleep Pattern Recognition AI',
          accuracy: 89,
        },
        {
          id: '3',
          type: 'recommendation',
          category: 'goals',
          title: 'המלצה להתקדמות במטרות',
          description: 'תבסס על ההתקדמות שלך, מומלץ להתמקד במטרת הכושר הגופני',
          confidence: 76,
          priority: 'medium',
          actionable: true,
          recommendations: [
            'הגדל את זמן הפעילות הגופנית ב-10 דקות',
            'הוסף תרגילי כוח פעמיים בשבוע',
            'עקוב אחר התקדמות עם מדדי ביצוע',
          ],
          dataPoints: 32,
          timestamp: new Date().toISOString(),
          aiModel: 'Goal Optimization AI',
          accuracy: 84,
        },
      ];

      const mockPredictions: AIPrediction[] = [
        {
          id: '1',
          metric: 'מצב רוח ממוצע',
          currentValue: 7.2,
          predictedValue: 8.1,
          timeframe: 'שבוע הבא',
          confidence: 87,
          factors: ['שיפור באיכות השינה', 'הגדלת פעילות גופנית', 'הפחתת לחץ'],
          recommendation: 'המשך עם השינויים הנוכחיים',
          aiModel: 'Mood Prediction Model v2.1',
        },
        {
          id: '2',
          metric: 'השלמת מטרות',
          currentValue: 65,
          predictedValue: 78,
          timeframe: 'חודש הבא',
          confidence: 72,
          factors: ['התקדמות עקבית', 'הגדרת מטרות ריאליות', 'תמיכה חברתית'],
          recommendation: 'שמור על המומנטום הנוכחי',
          aiModel: 'Goal Achievement Predictor',
        },
      ];

      const mockPatterns: AIPattern[] = [
        {
          id: '1',
          name: 'דפוס מצב רוח שבועי',
          description: 'מצב הרוח נוטה להיות נמוך בימי ראשון ורביעי',
          frequency: 'weekly',
          strength: 0.78,
          trend: 'stable',
          impact: 'negative',
          examples: ['יום ראשון - ממוצע 5.2', 'יום רביעי - ממוצע 5.8'],
          aiModel: 'Weekly Pattern Analyzer',
          confidence: 82,
        },
        {
          id: '2',
          name: 'דפוס פעילות גופנית',
          description: 'פעילות גופנית גבוהה בימי שני וחמישי',
          frequency: 'weekly',
          strength: 0.85,
          trend: 'improving',
          impact: 'positive',
          examples: ['יום שני - ממוצע 45 דקות', 'יום חמישי - ממוצע 52 דקות'],
          aiModel: 'Activity Pattern Recognition',
          confidence: 91,
        },
      ];

      setInsights(mockInsights);
      setPredictions(mockPredictions);
      setPatterns(mockPatterns);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <TrendingUp className="w-5 h-5" />;
      case 'pattern':
        return <BarChart3 className="w-5 h-5" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'pattern':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'recommendation':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'achievement':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              תובנות AI מתקדמות
            </h1>
            <p className="text-muted-foreground">
              ניתוח חכם של הנתונים שלך עם בינה מלאכותית מתקדמת
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              PRO
            </Badge>
            <Button onClick={loadAIInsights} disabled={loading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              רענן תובנות
            </Button>
          </div>
        </div>

        {/* AI Models Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              מודלי AI פעילים
            </CardTitle>
            <CardDescription>
              המודלים שמנתחים את הנתונים שלך ומספקים תובנות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Mood Analysis AI</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  מנתח דפוסי מצב רוח ומספק תחזיות
                </p>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  דיוק: 92%
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold">Pattern Recognition</span>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  מזהה דפוסים חוזרים בהתנהגות
                </p>
                <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
                  דיוק: 89%
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Goal Optimization</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  ממליץ על דרכים להשיג מטרות
                </p>
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  דיוק: 84%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              תובנות AI בזמן אמת
            </CardTitle>
            <CardDescription>
              תובנות חכמות שמתעדכנות בהתבסס על הנתונים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">טוען תובנות AI...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">
                            דיוק: {insight.accuracy}%
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{insight.description}</p>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          מודל AI: {insight.aiModel} | ביטחון:{' '}
                          {insight.confidence}% | נקודות נתונים:{' '}
                          {insight.dataPoints}
                        </div>
                        {insight.recommendations.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">המלצות:</h4>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              תחזיות AI
            </CardTitle>
            <CardDescription>
              תחזיות עתידיות בהתבסס על הנתונים והדפוסים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">{prediction.metric}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {prediction.currentValue}
                      </div>
                      <div className="text-sm text-blue-700">ערך נוכחי</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {prediction.predictedValue}
                      </div>
                      <div className="text-sm text-green-700">תחזית</div>
                    </div>
                  </div>
                  <div className="text-sm mb-2">
                    <strong>זמן:</strong> {prediction.timeframe}
                  </div>
                  <div className="text-sm mb-2">
                    <strong>ביטחון:</strong> {prediction.confidence}%
                  </div>
                  <div className="text-sm mb-3">
                    <strong>המלצה:</strong> {prediction.recommendation}
                  </div>
                  <div className="text-xs text-gray-600">
                    מודל: {prediction.aiModel}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              דפוסים שזוהו על ידי AI
            </CardTitle>
            <CardDescription>
              דפוסים חוזרים שהמערכת זיהתה בהתנהגות שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{pattern.name}</h3>
                        <Badge variant="outline">
                          {pattern.frequency === 'daily'
                            ? 'יומי'
                            : pattern.frequency === 'weekly'
                              ? 'שבועי'
                              : 'חודשי'}
                        </Badge>
                        <Badge variant="outline">
                          עוצמה: {Math.round(pattern.strength * 100)}%
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{pattern.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {pattern.trend === 'improving'
                              ? '↗'
                              : pattern.trend === 'declining'
                                ? '↘'
                                : '→'}
                          </div>
                          <div className="text-xs text-purple-700">
                            {pattern.trend === 'improving'
                              ? 'משתפר'
                              : pattern.trend === 'declining'
                                ? 'יורד'
                                : 'יציב'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {pattern.impact === 'positive'
                              ? '😊'
                              : pattern.impact === 'negative'
                                ? '😞'
                                : '😐'}
                          </div>
                          <div className="text-xs text-purple-700">
                            {pattern.impact === 'positive'
                              ? 'חיובי'
                              : pattern.impact === 'negative'
                                ? 'שלילי'
                                : 'ניטרלי'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {pattern.confidence}%
                          </div>
                          <div className="text-xs text-purple-700">ביטחון</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        מודל: {pattern.aiModel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade to PRO */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              שדרג ל-PRO לקבלת תובנות מתקדמות יותר
            </CardTitle>
            <CardDescription>
              גישה למודלי AI מתקדמים, תחזיות מדויקות יותר, וניתוח מעמיק של
              הנתונים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">AI מתקדם</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  מודלי GPT-4 ו-Claude 3
                </p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">תחזיות מדויקות</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  דיוק של 95%+ בתחזיות
                </p>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">ניתוח מעמיק</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  זיהוי דפוסים מתקדם
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                שדרג ל-PRO
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
