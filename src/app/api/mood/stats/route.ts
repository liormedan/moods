import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/mood/stats - Get mood statistics for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const periodDays = parseInt(period);

    if (isNaN(periodDays) || periodDays <= 0 || periodDays > 365) {
      return NextResponse.json(
        { error: 'Invalid period. Must be between 1 and 365 days.' },
        { status: 400 }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get mood entries for the specified period
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        moodValue: true,
        date: true,
      },
    });

    if (moodEntries.length === 0) {
      return NextResponse.json({
        data: {
          period: periodDays,
          totalEntries: 0,
          averageMood: 0,
          moodTrend: 'stable',
          moodDistribution: {},
          streakDays: 0,
          recentMood: null,
        },
      });
    }

    // Calculate statistics
    const totalEntries = moodEntries.length;
    const averageMood =
      moodEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
      totalEntries;

    // Calculate mood trend (comparing first and last week)
    const firstWeekEntries = moodEntries.slice(
      0,
      Math.min(7, moodEntries.length)
    );
    const lastWeekEntries = moodEntries.slice(-7);

    const firstWeekAvg =
      firstWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
      firstWeekEntries.length;
    const lastWeekAvg =
      lastWeekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
      lastWeekEntries.length;

    let moodTrend = 'stable';
    if (lastWeekAvg > firstWeekAvg + 1) moodTrend = 'improving';
    else if (lastWeekAvg < firstWeekAvg - 1) moodTrend = 'declining';

    // Calculate mood distribution
    const moodDistribution: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      moodDistribution[i] = 0;
    }

    moodEntries.forEach((entry) => {
      moodDistribution[entry.moodValue]++;
    });

    // Calculate current streak (consecutive days with entries)
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < periodDays; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasEntry = moodEntries.some((entry) => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });

      if (hasEntry) {
        streakDays++;
      } else {
        break;
      }
    }

    // Get most recent mood
    const recentMood = moodEntries[moodEntries.length - 1];

    // Get weekly averages for chart data
    const weeklyAverages = [];
    const currentWeek = new Date(startDate);

    while (currentWeek <= new Date()) {
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekEntries = moodEntries.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= currentWeek && entryDate <= weekEnd;
      });

      if (weekEntries.length > 0) {
        const weekAvg =
          weekEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
          weekEntries.length;
        weeklyAverages.push({
          week: currentWeek.toISOString().split('T')[0],
          average: Math.round(weekAvg * 10) / 10,
          entries: weekEntries.length,
        });
      }

      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    return NextResponse.json({
      data: {
        period: periodDays,
        totalEntries,
        averageMood: Math.round(averageMood * 10) / 10,
        moodTrend,
        moodDistribution,
        streakDays,
        recentMood: {
          value: recentMood.moodValue,
          date: recentMood.date,
        },
        weeklyAverages,
        insights: generateInsights(
          averageMood,
          moodTrend,
          streakDays,
          moodDistribution
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching mood statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate insights
function generateInsights(
  averageMood: number,
  moodTrend: string,
  streakDays: number,
  moodDistribution: Record<number, number>
): string[] {
  const insights: string[] = [];

  if (averageMood >= 8) {
    insights.push('Great job maintaining a positive mood!');
  } else if (averageMood >= 6) {
    insights.push('Your mood is generally positive. Keep it up!');
  } else if (averageMood >= 4) {
    insights.push(
      'Your mood is moderate. Consider activities that boost your spirits.'
    );
  } else {
    insights.push(
      'Your mood has been low. Consider reaching out to friends or professionals for support.'
    );
  }

  if (moodTrend === 'improving') {
    insights.push('Your mood is trending upward - excellent progress!');
  } else if (moodTrend === 'declining') {
    insights.push(
      'Your mood has been declining. Consider what might be contributing to this.'
    );
  }

  if (streakDays >= 7) {
    insights.push(
      `You've been tracking your mood for ${streakDays} consecutive days - great consistency!`
    );
  } else if (streakDays >= 3) {
    insights.push(
      `You're building a good habit with ${streakDays} consecutive days of tracking.`
    );
  }

  // Check for mood patterns
  const highMoodDays =
    moodDistribution[8] + moodDistribution[9] + moodDistribution[10];
  const lowMoodDays =
    moodDistribution[1] + moodDistribution[2] + moodDistribution[3];

  if (highMoodDays > lowMoodDays * 2) {
    insights.push(
      'You have many more high-mood days than low-mood days - this is wonderful!'
    );
  } else if (lowMoodDays > highMoodDays * 2) {
    insights.push(
      'You have many more low-mood days. Consider what activities or people help improve your mood.'
    );
  }

  return insights;
}
