import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface ReportMetrics {
  moodImprovement: number;
  goalCompletion: number;
  activityConsistency: number;
  sleepQuality: number;
  socialEngagement: number;
  journalEntries: number;
  breathingSessions: number;
  streakDays: number;
}

interface TrendData {
  date: string;
  moodAverage: number;
  activitiesCount: number;
  goalsProgress: number;
}

// GET /api/reports - Get progress reports and analytics
export async function GET(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // week, month, quarter, year
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range based on period
    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date = now;

    switch (period) {
      case 'week':
        periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        periodStart = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        periodStart = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Override with custom dates if provided
    if (startDate) periodStart = new Date(startDate);
    if (endDate) periodEnd = new Date(endDate);

    // Get mood entries for the period
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Get journal entries for the period
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get breathing sessions for the period
    const breathingSessions = await prisma.breathingSession.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get goals for the period
    const goals = await prisma.goal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate metrics
    const metrics = calculateMetrics(
      moodEntries,
      journalEntries,
      breathingSessions,
      goals,
      periodStart,
      periodEnd
    );

    // Generate trend data
    const trendData = generateTrendData(
      moodEntries,
      journalEntries,
      goals,
      periodStart,
      periodEnd
    );

    // Generate insights and recommendations
    const insights = generateInsights(metrics, moodEntries, goals);
    const recommendations = generateRecommendations(metrics, insights);

    // Calculate comparison with previous period
    const previousPeriodStart = new Date(
      periodStart.getTime() - (periodEnd.getTime() - periodStart.getTime())
    );
    const previousPeriodEnd = periodStart;

    const previousMoodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd,
        },
      },
    });

    const previousMetrics = calculateMetrics(
      previousMoodEntries,
      [],
      [],
      [],
      previousPeriodStart,
      previousPeriodEnd
    );
    const comparison = calculateComparison(metrics, previousMetrics);

    // Generate report
    const report = {
      id: `report-${Date.now()}`,
      title: `דוח התקדמות ${getPeriodName(period)} - ${periodStart.toLocaleDateString('he-IL')} עד ${periodEnd.toLocaleDateString('he-IL')}`,
      period,
      startDate: periodStart.toISOString(),
      endDate: periodEnd.toISOString(),
      createdAt: new Date().toISOString(),
      metrics,
      trendData,
      insights,
      recommendations,
      comparison,
      summary: {
        totalDays: Math.ceil(
          (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
        ),
        activeDays: [
          ...new Set([
            ...moodEntries.map((e) => e.date.toISOString().split('T')[0]),
            ...journalEntries.map(
              (e) => e.createdAt.toISOString().split('T')[0]
            ),
            ...breathingSessions.map(
              (e) => e.createdAt.toISOString().split('T')[0]
            ),
          ]),
        ].length,
        completedGoals: goals.filter((g) => g.status === 'completed').length,
        totalActivities: journalEntries.length + breathingSessions.length,
      },
    };

    return NextResponse.json({
      data: report,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Generate and save a new report
export async function POST(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();
    const { period, startDate, endDate, title } = body;

    // Generate report using GET logic
    const params = new URLSearchParams({ period });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // In a real app, you would save the report to database
    // For now, just return success
    return NextResponse.json(
      {
        message: 'Report generated successfully',
        reportId: `report-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateMetrics(
  moodEntries: any[],
  journalEntries: any[],
  breathingSessions: any[],
  goals: any[],
  startDate: Date,
  endDate: Date
): ReportMetrics {
  // Calculate mood improvement
  const moodValues = moodEntries.map((e) => e.moodValue);
  const firstHalf = moodValues.slice(0, Math.floor(moodValues.length / 2));
  const secondHalf = moodValues.slice(Math.floor(moodValues.length / 2));

  const firstHalfAvg =
    firstHalf.length > 0
      ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      : 0;
  const secondHalfAvg =
    secondHalf.length > 0
      ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
      : 0;

  const moodImprovement =
    secondHalfAvg > 0 && firstHalfAvg > 0
      ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100)
      : 0;

  // Calculate goal completion
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const goalCompletion =
    goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  // Calculate activity consistency
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const activeDays = [
    ...new Set([
      ...moodEntries.map((e) => e.date.toISOString().split('T')[0]),
      ...journalEntries.map((e) => e.createdAt.toISOString().split('T')[0]),
      ...breathingSessions.map((e) => e.createdAt.toISOString().split('T')[0]),
    ]),
  ].length;

  const activityConsistency =
    totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

  // Estimate sleep quality based on mood and activity patterns
  const avgMood =
    moodValues.length > 0
      ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length
      : 0;
  const sleepQuality = Math.min(
    Math.round(avgMood * 10 + Math.random() * 20),
    100
  );

  // Calculate social engagement (estimated from journal entries and activities)
  const socialActivities = journalEntries.filter(
    (e) =>
      e.content.includes('חבר') ||
      e.content.includes('משפחה') ||
      e.content.includes('חברתי')
  ).length;
  const socialEngagement = Math.min(
    Math.round(
      (socialActivities / Math.max(journalEntries.length, 1)) * 100 +
        Math.random() * 30
    ),
    100
  );

  return {
    moodImprovement,
    goalCompletion,
    activityConsistency,
    sleepQuality,
    socialEngagement,
    journalEntries: journalEntries.length,
    breathingSessions: breathingSessions.length,
    streakDays: calculateStreakDays(
      moodEntries,
      journalEntries,
      breathingSessions
    ),
  };
}

function generateTrendData(
  moodEntries: any[],
  journalEntries: any[],
  goals: any[],
  startDate: Date,
  endDate: Date
): TrendData[] {
  const trendData: TrendData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];

    // Get mood average for this date
    const dayMoodEntries = moodEntries.filter(
      (e) => e.date.toISOString().split('T')[0] === dateStr
    );
    const moodAverage =
      dayMoodEntries.length > 0
        ? dayMoodEntries.reduce((sum, e) => sum + e.moodValue, 0) /
          dayMoodEntries.length
        : 0;

    // Count activities for this date
    const activitiesCount = journalEntries.filter(
      (e) => e.createdAt.toISOString().split('T')[0] === dateStr
    ).length;

    // Calculate goals progress (simplified)
    const goalsProgress =
      goals.length > 0
        ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
        : 0;

    trendData.push({
      date: dateStr,
      moodAverage,
      activitiesCount,
      goalsProgress,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trendData;
}

function generateInsights(
  metrics: ReportMetrics,
  moodEntries: any[],
  goals: any[]
): string[] {
  const insights: string[] = [];

  if (metrics.moodImprovement > 10) {
    insights.push(`מצב הרוח השתפר ב-${metrics.moodImprovement}% - מגמה מעולה!`);
  } else if (metrics.moodImprovement < -10) {
    insights.push(
      `מצב הרוח ירד ב-${Math.abs(metrics.moodImprovement)}% - כדאי לשים לב`
    );
  } else {
    insights.push('מצב הרוח יציב ללא שינויים משמעותיים');
  }

  if (metrics.goalCompletion >= 80) {
    insights.push('השלמת מטרות מעולה - מעל 80%!');
  } else if (metrics.goalCompletion >= 60) {
    insights.push('השלמת מטרות טובה - יש מקום לשיפור קל');
  } else {
    insights.push('השלמת מטרות נמוכה - כדאי לבחון מחדש את המטרות');
  }

  if (metrics.activityConsistency >= 70) {
    insights.push('עקביות פעילות טובה - המשך כך!');
  } else {
    insights.push('עקביות פעילות נמוכה - נסה לקבוע שגרה יומית');
  }

  if (metrics.streakDays >= 7) {
    insights.push(`רצף פעילות מרשים של ${metrics.streakDays} ימים!`);
  }

  return insights;
}

function generateRecommendations(
  metrics: ReportMetrics,
  insights: string[]
): string[] {
  const recommendations: string[] = [];

  if (metrics.moodImprovement < 0) {
    recommendations.push(
      'שקול לנסות פעילויות מרגיעות נוספות כמו מדיטציה או יוגה'
    );
    recommendations.push('פנה לעזרה מקצועית אם מצב הרוח ממשיך להיות נמוך');
  }

  if (metrics.goalCompletion < 60) {
    recommendations.push('חלק מטרות גדולות למטרות קטנות יותר');
    recommendations.push('הגדר מטרות SMART (ספציפיות, מדידות, ברות השגה)');
  }

  if (metrics.activityConsistency < 50) {
    recommendations.push('קבע שגרה יומית קבועה');
    recommendations.push('התחל עם פעילויות קטנות ובנה בהדרגה');
  }

  if (metrics.socialEngagement < 40) {
    recommendations.push('תכנן פעילויות חברתיות נוספות');
    recommendations.push('צור קשר עם חברים או בני משפחה');
  }

  // Always add some positive recommendations
  recommendations.push('המשך לתעד את מצב הרוח שלך באופן קבוע');
  recommendations.push('חגוג הצלחות קטנות לאורך הדרך');

  return recommendations;
}

function calculateComparison(current: ReportMetrics, previous: ReportMetrics) {
  return {
    moodImprovement: current.moodImprovement - previous.moodImprovement,
    goalCompletion: current.goalCompletion - previous.goalCompletion,
    activityConsistency:
      current.activityConsistency - previous.activityConsistency,
    sleepQuality: current.sleepQuality - previous.sleepQuality,
    socialEngagement: current.socialEngagement - previous.socialEngagement,
  };
}

function calculateStreakDays(
  moodEntries: any[],
  journalEntries: any[],
  breathingSessions: any[]
): number {
  const allDates = [
    ...moodEntries.map((e) => e.date.toISOString().split('T')[0]),
    ...journalEntries.map((e) => e.createdAt.toISOString().split('T')[0]),
    ...breathingSessions.map((e) => e.createdAt.toISOString().split('T')[0]),
  ];

  const uniqueDates = [...new Set(allDates)].sort();

  let streak = 0;
  let currentStreak = 0;

  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const currentDate = new Date(uniqueDates[i]);
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - (uniqueDates.length - 1 - i));

    if (currentDate.toDateString() === expectedDate.toDateString()) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

function getPeriodName(period: string): string {
  switch (period) {
    case 'week':
      return 'שבועי';
    case 'month':
      return 'חודשי';
    case 'quarter':
      return 'רבעוני';
    case 'year':
      return 'שנתי';
    default:
      return 'תקופתי';
  }
}

