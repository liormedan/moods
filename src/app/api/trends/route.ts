import { NextRequest, NextResponse } from 'next/server';

// Helper function to generate realistic trend data
function generateTrendData(range: string, type: string) {
  const periods = getPeriods(range);
  const baseData = periods.map((period, index) => {
    // Simulate seasonal variations
    const seasonalFactor = getSeasonalFactor(period);
    const trendFactor = getTrendFactor(index, periods.length);

    return {
      period,
      moodAverage: Math.max(
        1,
        Math.min(
          10,
          6.5 + seasonalFactor + trendFactor + (Math.random() - 0.5) * 2
        )
      ),
      journalEntries: Math.floor(8 + seasonalFactor * 3 + Math.random() * 10),
      breathingMinutes: Math.floor(
        15 + seasonalFactor * 5 + Math.random() * 20
      ),
      goalsCompleted: Math.floor(2 + trendFactor + Math.random() * 3),
      activeDays: Math.floor(20 + seasonalFactor * 5 + Math.random() * 8),
      sleepQuality: Math.max(
        1,
        Math.min(10, 7 + seasonalFactor * 0.5 + (Math.random() - 0.5) * 2)
      ),
      stressLevel: Math.max(
        1,
        Math.min(10, 5 - seasonalFactor * 0.3 + (Math.random() - 0.5) * 2)
      ),
      energyLevel: Math.max(
        1,
        Math.min(10, 6.5 + seasonalFactor + (Math.random() - 0.5) * 1.5)
      ),
      socialActivity: Math.max(
        1,
        Math.min(10, 6 + seasonalFactor * 0.8 + (Math.random() - 0.5) * 2)
      ),
    };
  });

  return baseData;
}

function getPeriods(range: string): string[] {
  const now = new Date();
  const periods: string[] = [];

  switch (range) {
    case '6months':
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(
          date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
        );
      }
      break;
    case 'year':
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(
          date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
        );
      }
      break;
    case '2years':
      for (let i = 23; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(
          date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
        );
      }
      break;
    case 'all':
      for (let i = 35; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        periods.push(
          date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
        );
      }
      break;
    default:
      periods.push(
        now.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
      );
  }

  return periods;
}

function getSeasonalFactor(period: string): number {
  const month = new Date(period + ' 1').getMonth();

  // Spring (March-May): positive mood
  if (month >= 2 && month <= 4) return 0.8;
  // Summer (June-August): highest mood
  if (month >= 5 && month <= 7) return 1.2;
  // Fall (September-November): declining mood
  if (month >= 8 && month <= 10) return 0.3;
  // Winter (December-February): lowest mood
  return -0.5;
}

function getTrendFactor(index: number, total: number): number {
  // Simulate gradual improvement over time
  return (index / total) * 1.5 - 0.75;
}

function generateSeasonalData() {
  return [
    {
      season: 'אביב',
      moodAverage: 7.2,
      activityLevel: 7.8,
      color: '#10b981',
    },
    {
      season: 'קיץ',
      moodAverage: 8.1,
      activityLevel: 8.5,
      color: '#f59e0b',
    },
    {
      season: 'סתיו',
      moodAverage: 6.8,
      activityLevel: 6.9,
      color: '#f97316',
    },
    {
      season: 'חורף',
      moodAverage: 6.2,
      activityLevel: 6.1,
      color: '#3b82f6',
    },
  ];
}

function generatePredictions(trendData: any[]) {
  const predictions = [];
  const lastFew = trendData.slice(-3);
  const avgTrend =
    lastFew.reduce((sum, item, index) => {
      if (index === 0) return 0;
      return sum + (item.moodAverage - lastFew[index - 1].moodAverage);
    }, 0) /
    (lastFew.length - 1);

  // Add historical data points
  trendData.slice(-6).forEach((item) => {
    predictions.push({
      period: item.period,
      actual: item.moodAverage,
      predicted: item.moodAverage,
      confidence: 100,
    });
  });

  // Add future predictions
  const now = new Date();
  for (let i = 1; i <= 3; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const lastMood = trendData[trendData.length - 1].moodAverage;
    const predicted = Math.max(
      1,
      Math.min(10, lastMood + avgTrend * i + (Math.random() - 0.5) * 0.5)
    );

    predictions.push({
      period: futureDate.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
      }),
      predicted: Number(predicted.toFixed(1)),
      confidence: Math.max(60, 90 - i * 10),
    });
  }

  return predictions;
}

function generateCorrelations() {
  return [
    {
      factor: 'תרגילי נשימה',
      correlation: 0.73,
      significance: 'חזק מאוד',
      description: 'תרגול נשימה קבוע משפר משמעותית את מצב הרוח',
    },
    {
      factor: 'כתיבת יומן',
      correlation: 0.68,
      significance: 'חזק',
      description: 'כתיבה רגולרית ביומן מסייעת לעיבוד רגשות',
    },
    {
      factor: 'השלמת מטרות',
      correlation: 0.61,
      significance: 'בינוני-חזק',
      description: 'הצלחה במטרות מעלה את הביטחון העצמי',
    },
    {
      factor: 'פעילות חברתית',
      correlation: 0.55,
      significance: 'בינוני',
      description: 'קשרים חברתיים תורמים לרווחה נפשית',
    },
    {
      factor: 'איכות שינה',
      correlation: 0.49,
      significance: 'בינוני',
      description: 'שינה טובה משפיעה חיובית על מצב הרוח',
    },
    {
      factor: 'מזג אוויר',
      correlation: 0.34,
      significance: 'חלש-בינוני',
      description: 'ימים שמשיים משפרים מעט את מצב הרוח',
    },
    {
      factor: 'עומס עבודה',
      correlation: -0.42,
      significance: 'בינוני שלילי',
      description: 'עומס עבודה גבוה פוגע במצב הרוח',
    },
    {
      factor: 'רמת מתח',
      correlation: -0.67,
      significance: 'חזק שלילי',
      description: 'מתח גבוה פוגע משמעותית ברווחה',
    },
  ];
}

function generateInsights(
  trendData: any[],
  seasonalData: any[],
  correlations: any[]
) {
  const insights = [];

  // Trend analysis
  const recentTrend =
    trendData.slice(-3).reduce((sum, item) => sum + item.moodAverage, 0) / 3;
  const earlierTrend =
    trendData.slice(0, 3).reduce((sum, item) => sum + item.moodAverage, 0) / 3;

  if (recentTrend > earlierTrend + 0.5) {
    insights.push(
      'מצב הרוח שלך משתפר בהדרגה! המגמה החיובית מעידה על התקדמות טובה.'
    );
  } else if (recentTrend < earlierTrend - 0.5) {
    insights.push(
      'נצפתה ירידה במצב הרוח לאחרונה. כדאי לשקול הגברת פעילויות מועילות.'
    );
  } else {
    insights.push('מצב הרוח שלך יציב לאורך זמן, מה שמעיד על איזון טוב.');
  }

  // Seasonal insights
  const bestSeason = seasonalData.reduce((best, current) =>
    current.moodAverage > best.moodAverage ? current : best
  );
  insights.push(
    `${bestSeason.season} היא העונה הטובה ביותר עבורך. כדאי לתכנן פעילויות מיוחדות בתקופה זו.`
  );

  // Activity insights
  const avgBreathing =
    trendData.reduce((sum, item) => sum + item.breathingMinutes, 0) /
    trendData.length;
  if (avgBreathing > 20) {
    insights.push('אתה מתרגל נשימה באופן קבוע - זה תורם משמעותיות לרווחה שלך!');
  } else {
    insights.push(
      'הגברת תרגילי הנשימה יכולה לשפר את מצב הרוח שלך בצורה משמעותית.'
    );
  }

  // Goals insights
  const avgGoals =
    trendData.reduce((sum, item) => sum + item.goalsCompleted, 0) /
    trendData.length;
  if (avgGoals > 2.5) {
    insights.push('אתה מצליח להשלים מטרות באופן עקבי - המשך כך!');
  } else {
    insights.push(
      'הגדרת מטרות קטנות יותר ויותר ברות השגה יכולה לשפר את תחושת ההצלחה.'
    );
  }

  // Correlation insights
  const strongestPositive = correlations
    .filter((c) => c.correlation > 0)
    .reduce((max, current) =>
      current.correlation > max.correlation ? current : max
    );
  insights.push(
    `${strongestPositive.factor} הוא הגורם החיובי החזק ביותר עבורך - כדאי להתמקד בו.`
  );

  return insights;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'year';
    const type = searchParams.get('type') || 'comprehensive';

    // Generate trend data
    const trendData = generateTrendData(range, type);
    const seasonalData = generateSeasonalData();
    const predictions = generatePredictions(trendData);
    const correlations = generateCorrelations();
    const insights = generateInsights(trendData, seasonalData, correlations);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: {
        trends: trendData,
        seasonal: seasonalData,
        predictions,
        correlations,
        insights,
        metadata: {
          range,
          type,
          dataPoints: trendData.length,
          analysisDate: new Date().toISOString(),
          confidence: 'גבוהה',
          algorithm: 'Linear Regression + Seasonal Decomposition',
        },
      },
      message: 'Trends analysis completed successfully',
    });
  } catch (error) {
    console.error('Error generating trends analysis:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate trends analysis',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
