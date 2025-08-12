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
}

interface InsightsPanelProps {
  className?: string;
  onInsightUpdated?: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200',
};

const typeIcons = {
  recommendation: Lightbulb,
  warning: AlertTriangle,
  celebration: PartyPopper,
  pattern: TrendingUp,
  milestone: Target,
};

const typeColors = {
  recommendation: 'bg-blue-100 text-blue-800 border-blue-200',
  warning: 'bg-orange-100 text-orange-800 border-orange-200',
  celebration: 'bg-purple-100 text-purple-800 border-purple-200',
  pattern: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  milestone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function InsightsPanel({ className, onInsightUpdated }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, [showUnreadOnly]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demo
      const mockInsights: Insight[] = [
        {
          id: '1',
          type: 'recommendation',
          title: 'המלצה לשיפור מצב הרוח',
          description: 'בהתבסס על הנתונים שלך, מומלץ לנסות פעילות גופנית קלה כמו הליכה של 15 דקות ביום.',
          priority: 'medium',
          actionable: true,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'pattern',
          title: 'דפוס שזוהה במצב הרוח',
          description: 'נראה שמצב הרוח שלך טוב יותר בימי שלישי וחמישי. אולי יש קשר לפעילויות מסוימות?',
          priority: 'low',
          actionable: false,
          isRead: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'celebration',
          title: 'כל הכבוד!',
          description: 'השבוע היה שבוע מעולה עם מצב רוח גבוה. המשך כך!',
          priority: 'low',
          actionable: false,
          isRead: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        }
      ];

      setInsights(mockInsights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock generating new insights
      const newInsight: Insight = {
        id: Date.now().toString(),
        type: 'recommendation',
        title: 'המלצה חדשה',
        description: 'נוצרה המלצה חדשה בהתבסס על הנתונים העדכניים שלך.',
        priority: 'medium',
        actionable: true,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setInsights(prev => [newInsight, ...prev]);
      onInsightUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (insightId: string) => {
    setInsights(prev =>
      prev.map(insight =>
        insight.id === insightId ? { ...insight, isRead: true } : insight
      )
    );
    onInsightUpdated?.();
  };

  const filteredInsights = insights.filter(insight => {
    if (showUnreadOnly && insight.isRead) return false;
    return true;
  });

  const unreadCount = insights.filter(insight => !insight.isRead).length;
  const highPriorityCount = insights.filter(insight => insight.priority === 'high').length;

  if (loading && insights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5" />
            תובנות והמלצות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">טוען תובנות...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg mb-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              תובנות והמלצות
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              קבלו תובנות חכמות והמלצות מותאמות אישית
            </p>
          </div>
          <Button
            onClick={generateInsights}
            disabled={loading}
            size="sm"
            variant="outline"
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            צור תובנות
          </Button>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} חדשות
            </Badge>
          )}
          {highPriorityCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {highPriorityCount} חשובות
            </Badge>
          )}
        </div>

        {/* Filter button */}
        <div className="flex gap-2">
          <Button
            variant={showUnreadOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className="text-xs h-8"
          >
            {showUnreadOnly ? (
              <EyeOff className="h-3 w-3 mr-1" />
            ) : (
              <Eye className="h-3 w-3 mr-1" />
            )}
            {showUnreadOnly ? 'הצג הכל' : 'רק לא נקראו'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {filteredInsights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">
              {showUnreadOnly ? 'אין תובנות חדשות' : 'אין תובנות זמינות'}
            </div>
            <Button
              onClick={generateInsights}
              disabled={loading}
              variant="link"
              className="mt-2 text-xs"
            >
              צור תובנות חדשות
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInsights.map((insight) => {
              const IconComponent = typeIcons[insight.type];

              return (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border transition-all ${
                    insight.isRead
                      ? 'bg-muted/50 border-border'
                      : 'bg-card border-border shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full shrink-0 ${typeColors[insight.type]}`}>
                      <IconComponent className="h-3 w-3" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight mb-1 text-foreground">
                            {insight.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs px-1.5 py-0.5 ${priorityColors[insight.priority]}`}
                            >
                              {insight.priority === 'high'
                                ? 'גבוה'
                                : insight.priority === 'medium'
                                  ? 'בינוני'
                                  : 'נמוך'}
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                פעיל
                              </Badge>
                            )}
                            {!insight.isRead && (
                              <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary">
                                חדש
                              </Badge>
                            )}
                          </div>
                        </div>

                        {!insight.isRead && (
                          <Button
                            onClick={() => markAsRead(insight.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2 shrink-0"
                          >
                            סמן כנקרא
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {insight.description}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        {new Date(insight.createdAt).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {insights.some(
          (insight) =>
            insight.type === 'warning' &&
            insight.priority === 'high' &&
            !insight.isRead
        ) && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              משאבי עזרה זמינים
            </h4>
            <p className="text-sm text-orange-700 mb-3">
              אם אתה מרגיש מצוקה, יש עזרה זמינה:
            </p>
            <div className="space-y-1 text-sm text-orange-700">
              <div>• <strong>קו חם:</strong> 1201 - קו התמיכה של משרד הבריאות</div>
              <div>• <strong>ער"ן:</strong> 1201 - עזרה ראשונה נפשית</div>
              <div>• <strong>פסיכולוג:</strong> פנה לרופא המשפחה לקבלת הפניה</div>
              <div>• <strong>חברים ומשפחה:</strong> אל תהסס לפנות לתמיכה</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


