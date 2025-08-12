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
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  Brain,
  TrendingUp,
  AlertTriangle,
  Heart,
  Activity,
  Clock,
  Target,
  CheckCircle,
  RefreshCw,
  Sparkles,
  BarChart3,
  Calendar,
  Star,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Insight {
  id: string;
  type: 'recommendation' | 'pattern' | 'warning' | 'celebration' | 'milestone';
  title: string;
  description: string;
  category: 'mood' | 'activity' | 'sleep' | 'social' | 'general';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  isRead: boolean;
  createdAt: string;
  tags: string[];
  relatedData?: {
    moodTrend: string;
    sleepQuality: string;
    activityLevel: string;
    socialInteractions: string;
  };
  actionItems?: string[];
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  strength: number;
  category: string;
  frequency: string;
  impact: 'positive' | 'negative' | 'neutral';
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'pattern',
    title: 'דפוס שבועי במצב הרוח',
    description:
      'נראה שמצב הרוח שלך טוב יותר בימי שלישי וחמישי. זה יכול להיות קשור ללוח הזמנים השבועי שלך או לפעילויות מסוימות.',
    category: 'mood',
    priority: 'medium',
    confidence: 85,
    actionable: true,
    isRead: false,
    createdAt: '2025-08-12',
    tags: ['דפוס', 'מגמה', 'שבועי', 'מצב רוח'],
    relatedData: {
      moodTrend: 'משתפר',
      sleepQuality: 'טובה',
      activityLevel: 'בינונית',
      socialInteractions: 'גבוהה',
    },
    actionItems: [
      'נסה לזהות מה קורה בימי שלישי וחמישי שמשפר את מצב הרוח',
      'תכנן פעילויות נעימות לימים אחרים בשבוע',
      'שמור על שגרה דומה לימים הטובים',
    ],
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'המלצה לשיפור השינה',
    description:
      'תבסס על הנתונים שלך, נראה שמצב הרוח טוב יותר כשיש לך שינה טובה. מומלץ לשמור על לוח זמנים קבוע לשינה.',
    category: 'sleep',
    priority: 'high',
    confidence: 92,
    actionable: true,
    isRead: true,
    createdAt: '2025-08-10',
    tags: ['שינה', 'מצב רוח', 'שגרה', 'בריאות'],
    relatedData: {
      moodTrend: 'יציב',
      sleepQuality: 'בינונית',
      activityLevel: 'נמוכה',
      socialInteractions: 'בינונית',
    },
    actionItems: [
      'הגדר זמן שינה קבוע',
      'צור שגרת ערב מרגיעה',
      'הפחת שימוש במסכים לפני השינה',
      'שמור על חדר השינה קריר וחשוך',
    ],
  },
  {
    id: '3',
    type: 'celebration',
    title: 'כל הכבוד! שבוע מעולה',
    description:
      'השבוע היה שבוע מעולה עם מצב רוח גבוה ויציב. המשך כך! זה מראה שאתה על הדרך הנכונה.',
    category: 'mood',
    priority: 'low',
    confidence: 95,
    actionable: false,
    isRead: false,
    createdAt: '2025-08-08',
    tags: ['הישג', 'מצוינות', 'מגמה חיובית', 'שבועי'],
    relatedData: {
      moodTrend: 'מעולה',
      sleepQuality: 'טובה מאוד',
      activityLevel: 'גבוהה',
      socialInteractions: 'גבוהה מאוד',
    },
  },
  {
    id: '4',
    type: 'warning',
    title: 'שימו לב: ירידה במצב הרוח',
    description:
      'בשבועיים האחרונים יש מגמה של ירידה קלה במצב הרוח. מומלץ לשים לב ולשקול פעילויות שמשפרות את המצב.',
    category: 'mood',
    priority: 'high',
    confidence: 78,
    actionable: true,
    isRead: true,
    createdAt: '2025-08-05',
    tags: ['אזהרה', 'מגמה שלילית', 'פעולה נדרשת', 'מעקב'],
    relatedData: {
      moodTrend: 'יורד',
      sleepQuality: 'בינונית',
      activityLevel: 'נמוכה',
      socialInteractions: 'נמוכה',
    },
    actionItems: [
      'הגדל את הפעילות הגופנית',
      'פנה לחברים ומשפחה לתמיכה',
      'נסה פעילויות חדשות ומעניינות',
      'שקול לפנות למטפל אם המצב נמשך',
    ],
  },
  {
    id: '5',
    type: 'milestone',
    title: 'הישג: 30 ימים ברצף!',
    description:
      'הגעת ל-30 ימים רצופים של תיעוד מצב רוח! זה הישג מדהים שמראה על מחויבות לרווחה הנפשית שלך.',
    category: 'general',
    priority: 'low',
    confidence: 100,
    actionable: false,
    isRead: false,
    createdAt: '2025-08-01',
    tags: ['הישג', 'רצף', 'מחויבות', 'מעקב'],
    relatedData: {
      moodTrend: 'יציב',
      sleepQuality: 'טובה',
      activityLevel: 'בינונית',
      socialInteractions: 'בינונית',
    },
  },
];

const patterns: Pattern[] = [
  {
    id: '1',
    name: 'דפוס שבועי במצב הרוח',
    description: 'מצב הרוח נוטה להיות טוב יותר באמצע השבוע',
    strength: 85,
    category: 'מצב רוח',
    frequency: 'שבועי',
    impact: 'positive',
  },
  {
    id: '2',
    name: 'קשר בין שינה למצב רוח',
    description: 'שינה טובה מקושרת למצב רוח טוב יותר',
    strength: 92,
    category: 'שינה',
    frequency: 'יומי',
    impact: 'positive',
  },
  {
    id: '3',
    name: 'פעילות גופנית ומצב רוח',
    description: 'פעילות גופנית משפרת את מצב הרוח',
    strength: 78,
    category: 'פעילות',
    frequency: 'יומי',
    impact: 'positive',
  },
  {
    id: '4',
    name: 'מגמה שלילית בשבועות האחרונים',
    description: 'ירידה הדרגתית במצב הרוח',
    strength: 65,
    category: 'מצב רוח',
    frequency: 'שבועי',
    impact: 'negative',
  },
];

export default function InsightsPage() {
  const [currentInsights, setCurrentInsights] = useState<Insight[]>(insights);
  const [currentPatterns, setCurrentPatterns] = useState<Pattern[]>(patterns);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insightsHistory, setInsightsHistory] = useState<
    Array<{
      id: string;
      action: string;
      completedAt: string;
    }>
  >([]);

  useEffect(() => {
    // Load insights history from localStorage
    const saved = localStorage.getItem('insights-actions');
    if (saved) {
      setInsightsHistory(JSON.parse(saved));
    }
  }, []);

  const generateNewInsights = async () => {
    setIsGenerating(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate new insight based on patterns
    const newInsight: Insight = {
      id: Date.now().toString(),
      type: 'recommendation',
      title: 'המלצה חדשה מבוססת על דפוסים',
      description:
        'תבסס על הניתוח החדש של הנתונים שלך, זיהינו הזדמנות לשיפור נוסף במצב הרוח.',
      category: 'mood',
      priority: 'medium',
      confidence: 82,
      actionable: true,
      isRead: false,
      createdAt: new Date().toISOString().split('T')[0],
      tags: ['המלצה חדשה', 'דפוסים', 'שיפור'],
      actionItems: [
        'נסה פעילות חדשה השבוע',
        'עקוב אחרי ההשפעה על מצב הרוח',
        'שתף את התוצאות עם המטפל שלך',
      ],
    };

    setCurrentInsights((prev) => [newInsight, ...prev]);
    setIsGenerating(false);
  };

  const markInsightAsRead = (insightId: string) => {
    setCurrentInsights((prev) =>
      prev.map((insight) =>
        insight.id === insightId ? { ...insight, isRead: true } : insight
      )
    );
  };

  const markActionAsCompleted = (insightId: string, actionIndex: number) => {
    const action = currentInsights.find((i) => i.id === insightId)
      ?.actionItems?.[actionIndex];
    if (action) {
      const newAction = {
        id: Date.now().toString(),
        action: `${action} (מתוך: ${currentInsights.find((i) => i.id === insightId)?.title})`,
        completedAt: new Date().toISOString(),
      };

      const newHistory = [newAction, ...insightsHistory];
      setInsightsHistory(newHistory);
      localStorage.setItem('insights-actions', JSON.stringify(newHistory));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return (
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case 'pattern':
        return (
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        );
      case 'warning':
        return (
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case 'celebration':
        return <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />;
      case 'milestone':
        return (
          <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        );
      default:
        return <Brain className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'המלצה';
      case 'pattern':
        return 'דפוס';
      case 'warning':
        return 'אזהרה';
      case 'celebration':
        return 'חגיגה';
      case 'milestone':
        return 'הישג';
      default:
        return type;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mood':
        return <Heart className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'sleep':
        return <Clock className="w-4 h-4" />;
      case 'social':
        return <Brain className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredInsights = currentInsights.filter((insight) => {
    if (selectedCategory !== 'all' && insight.category !== selectedCategory)
      return false;
    if (selectedType !== 'all' && insight.type !== selectedType) return false;
    if (showUnreadOnly && insight.isRead) return false;
    return true;
  });

  const unreadCount = currentInsights.filter(
    (insight) => !insight.isRead
  ).length;
  const highPriorityCount = currentInsights.filter(
    (insight) => insight.priority === 'high'
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            תובנות AI חכמות 🧠✨
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            קבל תובנות מותאמות אישית מבוססות על הנתונים שלך וזיהוי דפוסים מתקדם
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentInsights.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  סה"כ תובנות
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {unreadCount}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  חדשות
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {highPriorityCount}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  חשובות
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {patterns.length}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  דפוסים זוהו
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate New Insights */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>צור תובנות חדשות</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              השתמש ב-AI כדי לנתח את הנתונים שלך ולגלות תובנות חדשות
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateNewInsights}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>מנתח נתונים...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>צור תובנות חדשות</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">כל הקטגוריות</option>
            <option value="mood">מצב רוח</option>
            <option value="activity">פעילות</option>
            <option value="sleep">שינה</option>
            <option value="social">חברתי</option>
            <option value="general">כללי</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">כל הסוגים</option>
            <option value="recommendation">המלצות</option>
            <option value="pattern">דפוסים</option>
            <option value="warning">אזהרות</option>
            <option value="celebration">חגיגות</option>
            <option value="milestone">הישגים</option>
          </select>

          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              showUnreadOnly
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {showUnreadOnly ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            <span>{showUnreadOnly ? 'הצג הכל' : 'רק שלא נקראו'}</span>
          </button>
        </div>

        {/* Patterns Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>דפוסים שזוהו</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              דפוסים שהמערכת זיהתה בנתונים שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {pattern.name}
                    </h4>
                    <Badge className={getImpactColor(pattern.impact)}>
                      {pattern.impact === 'positive'
                        ? 'חיובי'
                        : pattern.impact === 'negative'
                          ? 'שלילי'
                          : 'ניטרלי'}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {pattern.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        עוצמת הדפוס
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {pattern.strength}%
                      </span>
                    </div>
                    <Progress value={pattern.strength} className="w-full" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{pattern.category}</span>
                    <span>{pattern.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights List */}
        <div className="space-y-6">
          {filteredInsights.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  אין תובנות להצגה
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCategory !== 'all' ||
                  selectedType !== 'all' ||
                  showUnreadOnly
                    ? 'נסה לשנות את הסינון או צור תובנות חדשות'
                    : 'צור תובנות חדשות כדי להתחיל'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInsights.map((insight) => (
              <Card
                key={insight.id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(insight.type)}
                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                          {insight.title}
                        </CardTitle>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority === 'high'
                            ? 'גבוה'
                            : insight.priority === 'medium'
                              ? 'בינוני'
                              : 'נמוך'}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeText(insight.type)}
                        </Badge>
                        {!insight.isRead && (
                          <Badge variant="destructive">חדש</Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(insight.category)}
                          <span>
                            {insight.category === 'mood'
                              ? 'מצב רוח'
                              : insight.category === 'activity'
                                ? 'פעילות'
                                : insight.category === 'sleep'
                                  ? 'שינה'
                                  : insight.category === 'social'
                                    ? 'חברתי'
                                    : 'כללי'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(insight.createdAt).toLocaleDateString(
                              'he-IL'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>ביטחון: {insight.confidence}%</span>
                        </div>
                      </div>

                      <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                        {insight.description}
                      </CardDescription>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!insight.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markInsightAsRead(insight.id)}
                        >
                          סמן כנקרא
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Related Data */}
                  {insight.relatedData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          מגמת מצב רוח
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {insight.relatedData.moodTrend}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          איכות שינה
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {insight.relatedData.sleepQuality}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          רמת פעילות
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {insight.relatedData.activityLevel}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          אינטראקציות חברתיות
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {insight.relatedData.socialInteractions}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Items */}
                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        פעולות מומלצות:
                      </h4>
                      <div className="space-y-2">
                        {insight.actionItems.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {action}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                markActionAsCompleted(insight.id, index)
                              }
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              הושלם
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {insight.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action History */}
        {insightsHistory.length > 0 && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>היסטוריית פעולות</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                הפעולות שהשלמת מתוך התובנות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insightsHistory.slice(0, 10).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {action.action}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(action.completedAt).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
