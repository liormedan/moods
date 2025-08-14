import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { subDays, subWeeks, subMonths, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { he } from 'date-fns/locale';

// GET /api/analytics - Get analytics data for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'month';

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
      default: // month
        startDate = subMonths(now, 1);
    }

    // Fetch mood entries for the time range
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: now,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        moodValue: true,
        notes: true,
        date: true,
        createdAt: true,
      },
    });

    // Calculate daily moods
    const dailyMoods = moodEntries.map(entry => ({
      date: format(entry.date, 'yyyy-MM-dd'),
      mood: entry.moodValue,
      notes: entry.notes || '',
    }));

    // Calculate weekly averages
    const weeklyData = new Map<string, { total: number; count: number }>();
    moodEntries.forEach(entry => {
      const weekStart = startOfWeek(entry.date, { locale: he });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { total: 0, count: 0 });
      }
      
      const week = weeklyData.get(weekKey)!;
      week.total += entry.moodValue;
      week.count += 1;
    });

    const weeklyAverages = Array.from(weeklyData.entries()).map(([weekStart, data]) => ({
      week: format(new Date(weekStart), 'dd/MM', { locale: he }),
      average: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }));

    // Calculate monthly trends
    const monthlyData = new Map<string, { total: number; count: number; high: number; low: number }>();
    moodEntries.forEach(entry => {
      const monthStart = startOfMonth(entry.date);
      const monthKey = format(monthStart, 'yyyy-MM');
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { 
          total: 0, 
          count: 0, 
          high: entry.moodValue, 
          low: entry.moodValue 
        });
      }
      
      const month = monthlyData.get(monthKey)!;
      month.total += entry.moodValue;
      month.count += 1;
      month.high = Math.max(month.high, entry.moodValue);
      month.low = Math.min(month.low, entry.moodValue);
    });

    const monthlyTrends = Array.from(monthlyData.entries()).map(([monthStart, data]) => ({
      month: format(new Date(monthStart), 'MMMM', { locale: he }),
      average: Math.round((data.total / data.count) * 10) / 10,
      high: data.high,
      low: data.low,
    }));

    // Calculate mood distribution
    const moodCounts = { low: 0, medium: 0, high: 0, veryHigh: 0, veryLow: 0 };
    moodEntries.forEach(entry => {
      if (entry.moodValue <= 2) moodCounts.veryLow++;
      else if (entry.moodValue <= 4) moodCounts.low++;
      else if (entry.moodValue <= 6) moodCounts.medium++;
      else if (entry.moodValue <= 8) moodCounts.high++;
      else moodCounts.veryHigh++;
    });

    const totalEntries = moodEntries.length;
    const moodDistribution = [
      { 
        mood: '1-2 (רע מאוד)', 
        count: moodCounts.veryLow, 
        percentage: totalEntries > 0 ? Math.round((moodCounts.veryLow / totalEntries) * 100) : 0 
      },
      { 
        mood: '3-4 (לא טוב)', 
        count: moodCounts.low, 
        percentage: totalEntries > 0 ? Math.round((moodCounts.low / totalEntries) * 100) : 0 
      },
      { 
        mood: '5-6 (בסדר)', 
        count: moodCounts.medium, 
        percentage: totalEntries > 0 ? Math.round((moodCounts.medium / totalEntries) * 100) : 0 
      },
      { 
        mood: '7-8 (טוב)', 
        count: moodCounts.high, 
        percentage: totalEntries > 0 ? Math.round((moodCounts.high / totalEntries) * 100) : 0 
      },
      { 
        mood: '9-10 (מצוין)', 
        count: moodCounts.veryHigh, 
        percentage: totalEntries > 0 ? Math.round((moodCounts.veryHigh / totalEntries) * 100) : 0 
      },
    ];

    // Calculate time patterns (hour of day analysis)
    const hourlyData = new Map<number, { total: number; count: number }>();
    moodEntries.forEach(entry => {
      const hour = entry.createdAt.getHours();
      
      if (!hourlyData.has(hour)) {
        hourlyData.set(hour, { total: 0, count: 0 });
      }
      
      const hourData = hourlyData.get(hour)!;
      hourData.total += entry.moodValue;
      hourData.count += 1;
    });

    const timePatterns = Array.from(hourlyData.entries()).map(([hour, data]) => ({
      hour,
      averageMood: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    })).sort((a, b) => a.hour - b.hour);

    // Calculate streak data
    const sortedEntries = [...moodEntries].sort((a, b) => a.date.getTime() - b.date.getTime());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    sortedEntries.forEach(entry => {
      if (lastDate) {
        const daysDiff = Math.floor((entry.date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      lastDate = entry.date;
    });

    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate current streak from today backwards
    const today = new Date();
    const recentEntries = sortedEntries.reverse();
    for (let i = 0; i < recentEntries.length; i++) {
      const entry = recentEntries[i];
      const daysDiff = Math.floor((today.getTime() - entry.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    const streakData = {
      current: currentStreak,
      longest: longestStreak,
      total: totalEntries,
    };

    // Generate insights
    const insights = [];
    
    // Trend analysis
    if (monthlyTrends.length >= 2) {
      const lastMonth = monthlyTrends[monthlyTrends.length - 1];
      const previousMonth = monthlyTrends[monthlyTrends.length - 2];
      const trend = lastMonth.average - previousMonth.average;
      
      if (trend > 0.5) {
        insights.push({
          type: 'trend',
          message: `מצב הרוח שלך משתפר! עלייה של ${trend.toFixed(1)} נקודות מהחודש הקודם`,
          severity: 'success' as const,
        });
      } else if (trend < -0.5) {
        insights.push({
          type: 'trend',
          message: `שים לב - ירידה של ${Math.abs(trend).toFixed(1)} נקודות מהחודש הקודם`,
          severity: 'warning' as const,
        });
      }
    }

    // Streak insights
    if (currentStreak >= 7) {
      insights.push({
        type: 'streak',
        message: `כל הכבוד! אתה עוקב אחר מצב הרוח ${currentStreak} ימים ברצף`,
        severity: 'success' as const,
      });
    }

    // Time pattern insights
    if (timePatterns.length > 0) {
      const bestHour = timePatterns.reduce((best, current) => 
        current.averageMood > best.averageMood ? current : best
      );
      
      if (bestHour.hour >= 18) {
        insights.push({
          type: 'pattern',
          message: 'נראה שמצב הרוח שלך טוב יותר בערבים',
          severity: 'info' as const,
        });
      } else if (bestHour.hour <= 12) {
        insights.push({
          type: 'pattern',
          message: 'נראה שמצב הרוח שלך טוב יותר בבקרים',
          severity: 'info' as const,
        });
      }
    }

    // Frequency insights
    if (totalEntries >= 20) {
      insights.push({
        type: 'frequency',
        message: `מעולה! יש לך ${totalEntries} רשומות - זה עוזר לזהות דפוסים`,
        severity: 'success' as const,
      });
    }

    const analyticsData = {
      dailyMoods,
      weeklyAverages,
      monthlyTrends,
      moodDistribution,
      timePatterns,
      streakData,
      insights,
      summary: {
        totalEntries,
        averageMood: totalEntries > 0 ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.moodValue, 0) / totalEntries) * 10) / 10 : 0,
        highestMood: totalEntries > 0 ? Math.max(...moodEntries.map(e => e.moodValue)) : 0,
        lowestMood: totalEntries > 0 ? Math.min(...moodEntries.map(e => e.moodValue)) : 0,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}