import { NextRequest, NextResponse } from 'next/server';

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

// Generate AI insights based on user data
function generateInsights(range: string, category: string, depth: string): Insight[] {
  const insights: Insight[] = [];
  
  // Mood-related insights
  if (category === 'all' || category === 'mood') {
    insights.push({
      id: 'insight-mood-1',
      type: 'positive',
      category: 'mood',
      title: 'שיפור משמעותי במצב הרוח',
      description: 'זוהה שיפור של 23% במצב הרוח הממוצע שלך ב-3 השבועות האחרונים. המגמה החיובית קשורה לעלייה בפעילות גופנית ותרגילי נשימה.',
      confidence: 87,
      priority: 'high',
      actionable: true,
      recommendations: [
        'המשך עם תרגילי הנשימה היומיים - הם מראים השפעה חיובית',
        'שמור על קצב הפעילות הגופנית הנוכחי',
        'שקול להוסיף מדיטציה קצרה לשגרת הבוקר'
      ],
      dataPoints: 156,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    });

    insights.push({
      id: 'insight-mood-2',
      type: 'warning',
      category: 'mood',
      title: 'ירידה במצב הרוח בימי ראשון',
      description: 'נצפתה מגמה של מצב רוח נמוך יותר בימי ראשון לעומת שאר ימות השבוע. זה עלול להיות קשור ל"דיכאון יום ראשון" הידוע.',
      confidence: 74,
      priority: 'medium',
      actionable: true,
      recommendations: [
        'תכנן פעילות נעימה לימי ראשון בערב',
        'הכן את השבוע מראש כדי להפחית חרדה',
        'שקול שיחה עם מטפל על התמודדות עם מעברים'
      ],
      dataPoints: 89,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    });
  }

  // Goals-related insights
  if (category === 'all' || category === 'goals') {
    insights.push({
      id: 'insight-goals-1',
      type: 'achievement',
      category: 'goals',
      title: 'הישג מרשים בהשלמת מטרות',
      description: 'השלמת 85% מהמטרות שהגדרת החודש, שיעור גבוה משמעותית מהממוצע הכללי של 60%. המטרות הקטנות והמדידות הראו הצלחה גבוהה יותר.',
      confidence: 92,
      priority: 'high',
      actionable: true,
      recommendations: [
        'המשך עם אסטרטגיית המטרות הקטנות - היא עובדת עבורך',
        'שקול להגדיר מטרה חודשית גדולה יותר',
        'שתף את ההצלחות שלך עם חברים או משפחה'
      ],
      dataPoints: 67,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    });
  }

  // Habits-related insights
  if (category === 'all' || category === 'habits') {
    insights.push({
      id: 'insight-habits-1',
      type: 'positive',
      category: 'habits',
      title: 'הרגל יומן מתבסס בהצלחה',
      description: 'כתבת ביומן 18 מתוך 21 הימים האחרונים - רצף מרשים! הכתיבה הקבועה תורמת לעיבוד רגשות ולבהירות מחשבתית.',
      confidence: 89,
      priority: 'medium',
      actionable: true,
      recommendations: [
        'המשך עם הכתיבה היומית - היא מראה תוצאות',
        'נסה להוסיף שאלות מנחות לכתיבה',
        'שקול לכתוב גם ברגעי שמחה, לא רק בקשיים'
      ],
      dataPoints: 45,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    });

    insights.push({
      id: 'insight-habits-2',
      type: 'warning',
      category: 'habits',
      title: 'פערים בתרגילי נשימה',
      description: 'זוהו פערים של 3-4 ימים בתרגילי הנשימה. הימים ללא תרגול מתאמים לירידה קלה במצב הרוח.',
      confidence: 71,
      priority: 'medium',
      actionable: true,
      recommendations: [
        'הגדר תזכורת יומית לתרגילי נשימה',
        'התחל עם תרגילים קצרים של 2-3 דקות',
        'קשר את התרגיל לפעילות קיימת (כמו קפה בוקר)'
      ],
      dataPoints: 34,
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    });
  }

  // Health-related insights
  if (category === 'all' || category === 'health') {
    insights.push({
      id: 'insight-health-1',
      type: 'neutral',
      category: 'health',
      title: 'קשר בין שינה למצב רוח',
      description: 'נמצא קשר חזק (r=0.73) בין איכות השינה למצב הרוח למחרת. לילות עם פחות מ-7 שעות שינה מתאמים למצב רוח נמוך יותר.',
      confidence: 84,
      priority: 'high',
      actionable: true,
      recommendations: [
        'שאף ל-7-8 שעות שינה בלילה',
        'צור שגרת שינה קבועה',
        'הימנע ממסכים שעה לפני השינה'
      ],
      dataPoints: 78,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    });
  }

  // Social insights
  if (category === 'all' || category === 'social') {
    insights.push({
      id: 'insight-social-1',
      type: 'positive',
      category: 'social',
      title: 'פעילות חברתית משפרת את הרווחה',
      description: 'בימים עם פעילות חברתية (פגישות, שיחות טלפון, הודעות) מצב הרוח שלך גבוה ב-15% בממוצע. הקשרים החברתיים הם משאב חשוב עבורך.',
      confidence: 79,
      priority: 'medium',
      actionable: true,
      recommendations: [
        'תכנן לפחות פעילות חברתית אחת בשבוע',
        'שמור על קשר קבוע עם חברים קרובים',
        'שקול הצטרפות לקבוצת תחביב או פעילות'
      ],
      dataPoints: 52,
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
    });
  }

  // Critical insight if needed
  if (depth === 'advanced' || depth === 'deep') {
    insights.push({
      id: 'insight-critical-1',
      type: 'warning',
      category: 'patterns',
      title: 'דפוס דאגה - ירידה חדה בפעילות',
      description: 'זוהתה ירידה של 40% בפעילות הכללית ב-5 הימים האחרונים. זה כולל פחות תיעוד מצב רוח, פחות תרגילי נשימה ופחות כתיבה ביומן.',
      confidence: 91,
      priority: 'critical',
      actionable: true,
      recommendations: [
        'שקול לפנות למטפל או לאדם קרוב',
        'התחל עם פעילות קטנה אחת ביום',
        'זכור שתקופות קשות הן זמניות',
        'השתמש במשאבי החירום אם נדרש'
      ],
      dataPoints: 123,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Generate patterns analysis
function generatePatterns(): Pattern[] {
  return [
    {
      id: 'pattern-1',
      name: 'דפוס שבועי של מצב רוח',
      description: 'מצב הרוח שלך נוטה להיות גבוה יותר באמצע השבוע (רביעי-חמישי) ונמוך יותר בסופי השבוע.',
      frequency: 'weekly',
      strength: 78,
      trend: 'stable',
      impact: 'neutral',
      examples: [
        'ימי רביעי: ממוצע 7.2/10',
        'ימי שבת: ממוצע 5.8/10',
        'חזרה על הדפוס 8 מתוך 10 שבועות'
      ]
    },
    {
      id: 'pattern-2',
      name: 'קשר בין תרגילי נשימה למצב רוח',
      description: 'בימים עם תרגילי נשימה, מצב הרוח גבוה ב-1.3 נקודות בממוצע. האפקט נמשך גם למחרת.',
      frequency: 'daily',
      strength: 85,
      trend: 'improving',
      impact: 'positive',
      examples: [
        'ימים עם נשימה: 7.1/10 ממוצע',
        'ימים ללא נשימה: 5.8/10 ממוצע',
        'שיפור של 22% בחודש האחרון'
      ]
    },
    {
      id: 'pattern-3',
      name: 'השפעת מזג האוויר',
      description: 'ימים שמשיים מתאמים למצב רוח טוב יותר ב-0.8 נקודות. ימים גשומים מראים ירידה קלה.',
      frequency: 'daily',
      strength: 62,
      trend: 'stable',
      impact: 'neutral',
      examples: [
        'ימים שמשיים: 6.9/10 ממוצע',
        'ימים גשומים: 6.1/10 ממוצע',
        'קורלציה של 0.62 עם תחזית מזג אוויר'
      ]
    },
    {
      id: 'pattern-4',
      name: 'מחזור השלמת מטרות',
      description: 'נוטה להשלים יותר מטרות בתחילת החודש ופחות לקראת הסוף. דפוס טיפוסי של מוטיבציה מחזורית.',
      frequency: 'monthly',
      strength: 71,
      trend: 'declining',
      impact: 'negative',
      examples: [
        'שבוע ראשון: 90% השלמה',
        'שבוע אחרון: 45% השלמה',
        'חזרה על הדפוס 4 מתוך 5 חודשים'
      ]
    }
  ];
}

// Generate predictions
function generatePredictions(): Prediction[] {
  return [
    {
      id: 'pred-1',
      metric: 'מצב רוח ממוצע',
      currentValue: 6.8,
      predictedValue: 7.2,
      timeframe: 'שבועיים',
      confidence: 82,
      factors: ['עלייה בתרגילי נשימה', 'שיפור בשגרת שינה', 'מזג אוויר טוב יותר'],
      recommendation: 'המשך עם התרגילים הנוכחיים והוסף מדיטציה קצרה לשיפור נוסף.'
    },
    {
      id: 'pred-2',
      metric: 'השלמת מטרות חודשיות',
      currentValue: 75,
      predictedValue: 82,
      timeframe: 'חודש',
      confidence: 76,
      factors: ['שיפור בתכנון', 'מטרות ריאליות יותר', 'מעקב קבוע'],
      recommendation: 'חלק מטרות גדולות למטרות קטנות יותר לשיפור נוסף בהצלחה.'
    },
    {
      id: 'pred-3',
      metric: 'ימי כתיבה ביומן',
      currentValue: 18,
      predictedValue: 22,
      timeframe: 'חודש',
      confidence: 71,
      factors: ['הרגל מתבסס', 'תזכורות יומיות', 'תוצאות חיוביות'],
      recommendation: 'הוסף שאלות מנחות לכתיבה כדי להעמיק את התהליך.'
    }
  ];
}

// Generate achievements
function generateAchievements(): Achievement[] {
  const now = new Date();
  return [
    {
      id: 'ach-1',
      title: 'רצף נשימה מושלם',
      description: 'השלמת 7 ימים רצופים של תרגילי נשימה',
      category: 'הרגלים',
      earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'rare',
      progress: 7,
      maxProgress: 7
    },
    {
      id: 'ach-2',
      title: 'כותב מסור',
      description: 'כתבת ביומן 20 פעמים החודש',
      category: 'יומן',
      earnedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'epic',
      progress: 20,
      maxProgress: 20
    },
    {
      id: 'ach-3',
      title: 'מצב רוח יציב',
      description: 'שמרת על מצב רוח מעל 6/10 במשך שבועיים',
      category: 'מצב רוח',
      earnedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'legendary'
    },
    {
      id: 'ach-4',
      title: 'מגיע למטרות',
      description: 'השלמת 5 מטרות החודש',
      category: 'מטרות',
      earnedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'rare',
      progress: 5,
      maxProgress: 5
    },
    {
      id: 'ach-5',
      title: 'התחלה טובה',
      description: 'השלמת את השבוע הראשון באפליקציה',
      category: 'כללי',
      earnedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'common'
    },
    {
      id: 'ach-6',
      title: 'חברתי פעיל',
      description: 'השתתפת ב-3 קבוצות תמיכה השבוע',
      category: 'חברתי',
      earnedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      rarity: 'rare'
    }
  ];
}

// GET /api/insights - Get AI insights and analysis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';
    const category = searchParams.get('category') || 'all';
    const depth = searchParams.get('depth') || 'standard';

    // Generate insights based on parameters
    const insights = generateInsights(range, category, depth);
    const patterns = generatePatterns();
    const predictions = generatePredictions();
    const achievements = generateAchievements();

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      data: {
        insights,
        patterns,
        predictions,
        achievements,
        metadata: {
          analysisRange: range,
          category,
          depth,
          totalInsights: insights.length,
          criticalInsights: insights.filter(i => i.priority === 'critical').length,
          positiveInsights: insights.filter(i => i.type === 'positive').length,
          averageConfidence: Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length),
          dataPointsAnalyzed: insights.reduce((sum, i) => sum + i.dataPoints, 0),
          analysisTimestamp: new Date().toISOString(),
          aiModel: 'Mental Health Insights v2.1',
          processingTime: '1.2s'
        }
      },
      message: 'AI insights generated successfully'
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate AI insights',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}