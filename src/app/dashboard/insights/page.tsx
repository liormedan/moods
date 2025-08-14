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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'neutral' | 'achievement';
  category: 'mood' | 'goals' | 'habits' | 'social' | 'health' | 'patterns';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  dataPoints: number;
  timestamp: string;
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  strength: number;
  trend: 'improving' | 'declining' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
  examples: string[];
}

interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  recommendation: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [category, setCategory] = useState('all');
  const [analysisDepth, setAnalysisDepth] = useState('standard');

  useEffect(() => {
    loadInsights();
  }, [timeRange, category, analysisDepth]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/insights?range=${timeRange}&category=${category}&depth=${analysisDepth}`);
      if (response.ok) {
        const result = await response.json();
        setInsights(result.data.insights);
        setPatterns(result.data.patterns);
        setPredictions(result.data.predictions);
        setAchievements(result.data.achievements);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    await loadInsights();
  };

  const exportInsights = () => {
    const csvContent = [
      ['סוג', 'קטגוריה', 'כותרת', 'תיאור', 'רמת ביטחון', 'עדיפות', 'תאריך'],
      ...insights.map(insight => [
        getTypeLabel(insight.type),
        getCategoryLabel(insight.category),
        insight.title,
        insight.description,
        `${insight.confidence}%`,
        getPriorityLabel(insight.priority),
        new Date(insight.timestamp).toLocaleDateString('he-IL')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `תובנות_AI_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'neutral': return <Info className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Award className="w-5 h-5 text-purple-500" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'positive': return 'חיובי';
      case 'warning': return 'אזהרה';
      case 'neutral': return 'נייטרלי';
      case 'achievement': return 'הישג';
      default: return 'כללי';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mood': return <Heart className="w-4 h-4" />;
      case 'goals': return <Target className="w-4 h-4" />;
      case 'habits': return <RefreshCw className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'health': return <Activity className="w-4 h-4" />;
      case 'patterns': return <BarChart3 className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mood': return 'מצב רוח';
      case 'goals': return 'מטרות';
      case 'habits': return 'הרגלים';
      case 'social': return 'חברתי';
      case 'health': return 'בריאות';
      case 'patterns': return 'דפוסים';
      default: return 'כללי';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
      case 'low': return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'קריטי';
      case 'high': return 'גבוה';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return 'רגיל';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const filteredInsights = insights.filter(insight => {
    if (category === 'all') return true;
    return insight.category === category;
  });

  const criticalInsights = insights.filter(i => i.priority === 'critical').length;
  const positiveInsights = insights.filter(i => i.type === 'positive').length;
  const averageConfidence = insights.length > 0 
    ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
    : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">מנתח נתונים ויוצר תובנות...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Brain className="w-8 h-8" />
              תובנות AI
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ניתוח חכם של הנתונים שלך עם המלצות מותאמות אישית
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={refreshAnalysis} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              רענן ניתוח
            </Button>
            <Button onClick={exportInsights} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              ייצא תובנות
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">שבוע אחרון</SelectItem>
                  <SelectItem value="month">חודש אחרון</SelectItem>
                  <SelectItem value="quarter">רבעון אחרון</SelectItem>
                  <SelectItem value="year">שנה אחרונה</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  <SelectItem value="mood">מצב רוח</SelectItem>
                  <SelectItem value="goals">מטרות</SelectItem>
                  <SelectItem value="habits">הרגלים</SelectItem>
                  <SelectItem value="social">חברתי</SelectItem>
                  <SelectItem value="health">בריאות</SelectItem>
                  <SelectItem value="patterns">דפוסים</SelectItem>
                </SelectContent>
              </Select>

              <Select value={analysisDepth} onValueChange={setAnalysisDepth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">בסיסי</SelectItem>
                  <SelectItem value="standard">סטנדרטי</SelectItem>
                  <SelectItem value="advanced">מתקדם</SelectItem>
                  <SelectItem value="deep">עמוק</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{insights.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">תובנות כולל</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{criticalInsights}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">תובנות קריטיות</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{positiveInsights}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">תובנות חיוביות</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{averageConfidence}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ביטחון ממוצע</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              תובנות מרכזיות
            </CardTitle>
            <CardDescription>
              ניתוח מתקדם של הנתונים שלך עם המלצות פעולה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <div key={insight.id} className={`p-4 border-l-4 rounded-lg ${getPriorityColor(insight.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            {getCategoryIcon(insight.category)}
                            {getCategoryLabel(insight.category)}
                          </span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {insight.confidence}% ביטחון
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {insight.description}
                        </p>
                        
                        {insight.recommendations.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">המלצות לפעולה:</h5>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <Plus className="w-3 h-3 mt-0.5 text-green-500" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500">
                      <div>{getPriorityLabel(insight.priority)}</div>
                      <div>{insight.dataPoints} נקודות נתונים</div>
                      <div>{new Date(insight.timestamp).toLocaleDateString('he-IL')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patterns Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              דפוסים שזוהו
            </CardTitle>
            <CardDescription>
              דפוסים חוזרים בהתנהגות ובמצב הרוח שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{pattern.name}</h4>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(pattern.trend)}
                      <span className="text-sm text-gray-500">{pattern.frequency}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {pattern.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">חוזק הדפוס:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pattern.strength}%` }}
                        />
                      </div>
                      <span className="text-sm">{pattern.strength}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium">דוגמאות:</h5>
                    {pattern.examples.map((example, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              תחזיות וחיזויים
            </CardTitle>
            <CardDescription>
              חיזויים מבוססי נתונים למדדים שונים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{prediction.metric}</h4>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {prediction.confidence}% ביטחון
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-500">ערך נוכחי:</span>
                      <div className="text-lg font-semibold">{prediction.currentValue}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">חיזוי ל{prediction.timeframe}:</span>
                      <div className="text-lg font-semibold flex items-center gap-2">
                        {prediction.predictedValue}
                        {prediction.predictedValue > prediction.currentValue ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : prediction.predictedValue < prediction.currentValue ? (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium mb-2">גורמים משפיעים:</h5>
                    <div className="flex flex-wrap gap-1">
                      {prediction.factors.map((factor, index) => (
                        <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      המלצה:
                    </h5>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {prediction.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              הישגים אחרונים
            </CardTitle>
            <CardDescription>
              הישגים שזכית בהם לאחרונה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center mb-3`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="font-semibold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {achievement.description}
                  </p>
                  
                  {achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>התקדמות</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{achievement.rarity}</span>
                    <span>{new Date(achievement.earnedAt).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}