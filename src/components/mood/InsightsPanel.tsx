'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lightbulb,
  AlertTriangle,
  PartyPopper,
  TrendingUp,
  Target,
  RefreshCw,
  Eye,
  EyeOff,
  Brain,
  Heart,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'recommendation' | 'warning' | 'celebration' | 'pattern' | 'milestone';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  isRead: boolean;
  createdAt: string;
  category?: 'mood' | 'activity' | 'sleep' | 'social' | 'general';
  tags?: string[];
}

interface InsightsPanelProps {
  className?: string;
  onInsightUpdated?: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  medium:
    'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
};

const typeIcons = {
  recommendation: Lightbulb,
  warning: AlertTriangle,
  celebration: PartyPopper,
  pattern: TrendingUp,
  milestone: Target,
};

const typeColors = {
  recommendation:
    'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  warning:
    'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
  celebration:
    'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
  pattern:
    'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
  milestone:
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
};

const categoryIcons = {
  mood: Heart,
  activity: Activity,
  sleep: Clock,
  social: Brain,
  general: Target,
};

export default function InsightsPanel({
  className,
  onInsightUpdated,
}: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [showUnreadOnly, selectedCategory]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real insights from API
      const response = await fetch('/api/insights');
      if (response.ok) {
        const data = await response.json();
        // Handle both array and { data: array } responses
        const insightsData = Array.isArray(data) ? data : data.data || [];
        setInsights(insightsData);
      } else {
        throw new Error('שגיאה בטעינת תובנות מהשרת');
      }
    } catch (err) {
      console.error('Error fetching insights:', err);

      // Fallback to mock data if API fails
      const mockInsights: Insight[] = generateMockInsights();
      setInsights(mockInsights);

      // Show error but don't block the UI
      setError('התובנות המוצגות הן לדוגמה בלבד');
    } finally {
      setLoading(false);
    }
  };

  const generateMockInsights = (): Insight[] => {
    return [
      {
        id: '1',
        type: 'recommendation',
        title: 'המלצה לשיפור מצב הרוח',
        description:
          'תבסס על הנתונים שלך, מומלץ לנסות פעילות גופנית קלה כמו הליכה של 15 דקות ביום. זה יכול לשפר את מצב הרוח שלך באופן משמעותי.',
        priority: 'medium',
        actionable: true,
        isRead: false,
        createdAt: new Date().toISOString(),
        category: 'activity',
        tags: ['פעילות גופנית', 'הליכה', 'מצב רוח'],
      },
      {
        id: '2',
        type: 'pattern',
        title: 'דפוס שזוהה במצב הרוח',
        description:
          'נראה שמצב הרוח שלך טוב יותר בימי שלישי וחמישי. אולי יש קשר לפעילויות מסוימות או ללוח הזמנים השבועי שלך?',
        priority: 'low',
        actionable: false,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        category: 'mood',
        tags: ['דפוס', 'מגמה', 'שבועי'],
      },
      {
        id: '3',
        type: 'celebration',
        title: 'כל הכבוד! שבוע מעולה',
        description:
          'השבוע היה שבוע מעולה עם מצב רוח גבוה. המשך כך! זה מראה שאתה על הדרך הנכונה.',
        priority: 'low',
        actionable: false,
        isRead: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'mood',
        tags: ['הישג', 'מצוינות', 'מגמה חיובית'],
      },
      {
        id: '4',
        type: 'warning',
        title: 'שימו לב: ירידה במצב הרוח',
        description:
          'בשבועיים האחרונים יש מגמה של ירידה קלה במצב הרוח. מומלץ לשים לב ולשקול פעילויות שמשפרות את המצב.',
        priority: 'high',
        actionable: true,
        isRead: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        category: 'mood',
        tags: ['אזהרה', 'מגמה שלילית', 'פעולה נדרשת'],
      },
      {
        id: '5',
        type: 'milestone',
        title: 'הישג: 30 ימים ברצף!',
        description:
          'הגעת ל-30 ימים רצופים של תיעוד מצב רוח! זה הישג מדהים שמראה על מחויבות לרווחה הנפשית שלך.',
        priority: 'low',
        actionable: false,
        isRead: false,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        category: 'general',
        tags: ['הישג', 'רצף', 'מחויבות'],
      },
      {
        id: '6',
        type: 'recommendation',
        title: 'טיפ לשינה טובה יותר',
        description:
          'תבסס על הנתונים, נראה שמצב הרוח שלך טוב יותר כשיש לך שינה טובה. נסה לשמור על לוח זמנים קבוע לשינה.',
        priority: 'medium',
        actionable: true,
        isRead: true,
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        category: 'sleep',
        tags: ['שינה', 'לוח זמנים', 'רווחה'],
      },
    ];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights();
    setRefreshing(false);
  };

  const markAsRead = async (insightId: string) => {
    try {
      // Try to update on server
      const response = await fetch(`/api/insights/${insightId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        // Update local state
        setInsights((prev) =>
          prev.map((insight) =>
            insight.id === insightId ? { ...insight, isRead: true } : insight
          )
        );
        onInsightUpdated?.();
      }
    } catch (err) {
      console.error('Error marking insight as read:', err);

      // Update local state anyway
      setInsights((prev) =>
        prev.map((insight) =>
          insight.id === insightId ? { ...insight, isRead: true } : insight
        )
      );
    }
  };

  // Ensure insights is always an array
  const insightsArray = Array.isArray(insights) ? insights : [];

  const filteredInsights = insightsArray.filter((insight) => {
    if (showUnreadOnly && insight.isRead) return false;
    if (selectedCategory !== 'all' && insight.category !== selectedCategory)
      return false;
    return true;
  });

  const unreadCount = insightsArray.filter((insight) => !insight.isRead).length;
  const categories = ['all', 'mood', 'activity', 'sleep', 'social', 'general'];

  if (loading && insightsArray.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>תובנות חכמות</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                טוען תובנות...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>תובנות חכמות</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
            title="רענן תובנות"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {error}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {/* Show Unread Only Toggle */}
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
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

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all'
                  ? 'כל הקטגוריות'
                  : category === 'mood'
                    ? 'מצב רוח'
                    : category === 'activity'
                      ? 'פעילות'
                      : category === 'sleep'
                        ? 'שינה'
                        : category === 'social'
                          ? 'חברתי'
                          : 'כללי'}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              {showUnreadOnly ? 'אין תובנות שלא נקראו' : 'אין תובנות זמינות'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              המשך לעקוב אחרי מצב הרוח שלך כדי לקבל תובנות חדשות
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => {
            const TypeIcon = typeIcons[insight.type];
            const CategoryIcon = insight.category
              ? categoryIcons[insight.category]
              : Target;

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border transition-all ${
                  insight.isRead
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <TypeIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {insight.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={typeColors[insight.type]}>
                      {insight.type === 'recommendation'
                        ? 'המלצה'
                        : insight.type === 'warning'
                          ? 'אזהרה'
                          : insight.type === 'celebration'
                            ? 'חגיגה'
                            : insight.type === 'pattern'
                              ? 'דפוס'
                              : 'הישג'}
                    </Badge>
                    <Badge className={priorityColors[insight.priority]}>
                      {insight.priority === 'high'
                        ? 'גבוה'
                        : insight.priority === 'medium'
                          ? 'בינוני'
                          : 'נמוך'}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed">
                  {insight.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <CategoryIcon className="w-3 h-3" />
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
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(insight.createdAt).toLocaleDateString(
                          'he-IL'
                        )}
                      </span>
                    </div>
                    {insight.isRead && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>נקרא</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {insight.actionable && (
                      <Button size="sm" variant="outline" className="text-xs">
                        פעל עכשיו
                      </Button>
                    )}
                    {!insight.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(insight.id)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        סמן כנקרא
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {insight.tags && insight.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {insight.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
