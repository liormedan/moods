import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { InsightTypeSchema, CreateInsightSchema } from '@/types/insights';

// GET /api/insights - Get insights for the authenticated user
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
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Build where clause
    const where: any = { userId: userId };

    if (type && InsightTypeSchema.safeParse(type).success) {
      where.type = type;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    // Get insights with pagination
    const insights = await prisma.insight.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.insight.count({ where });

    return NextResponse.json({
      data: insights,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/insights - Create new insight or generate insights from mood data
export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();

    // Check if this is a request to generate insights or create a manual insight
    if (body.action === 'generate') {
      return await generateInsights(userId);
    }

    // Validate manual insight creation
    const validationResult = CreateInsightSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { type, title, description, priority, actionable, expiresAt } =
      validationResult.data;

    // Create the insight
    const insight = await prisma.insight.create({
      data: {
        userId: userId,
        type,
        title,
        description,
        priority,
        actionable,
        expiresAt,
        isRead: false,
      },
    });

    return NextResponse.json({ data: insight }, { status: 201 });
  } catch (error) {
    console.error('Error creating insight:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate insights based on user's mood data
async function generateInsights(userId: string) {
  try {
    // Get recent mood entries (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'asc' },
      select: {
        moodValue: true,
        date: true,
        notes: true,
      },
    });

    if (moodEntries.length === 0) {
      return NextResponse.json({
        data: [],
        message: 'No mood data available for insight generation',
      });
    }

    const insights = await analyzeMoodDataAndGenerateInsights(
      userId,
      moodEntries
    );

    return NextResponse.json({
      data: insights,
      message: `Generated ${insights.length} new insights`,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

// Analyze mood data and generate relevant insights
async function analyzeMoodDataAndGenerateInsights(
  userId: string,
  moodEntries: Array<{ moodValue: number; date: Date; notes?: string | null }>
) {
  const insights: any[] = [];

  // Calculate basic statistics
  const totalEntries = moodEntries.length;
  const averageMood =
    moodEntries.reduce((sum, entry) => sum + entry.moodValue, 0) / totalEntries;

  // Calculate trend (comparing first and last week)
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

  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (lastWeekAvg > firstWeekAvg + 1) trend = 'improving';
  else if (lastWeekAvg < firstWeekAvg - 1) trend = 'declining';

  // Calculate streak days
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
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

  // Generate insights based on analysis
  if (averageMood <= 3) {
    insights.push({
      userId,
      type: 'warning',
      title: 'מצב רוח נמוך מתמשך',
      description:
        'מצב הרוח שלך נמוך בשבועות האחרונים. שקול לפנות לעזרה מקצועית או לשוחח עם חברים קרובים.',
      priority: 'high',
      actionable: true,
      isRead: false,
    });
  }

  if (trend === 'declining') {
    insights.push({
      userId,
      type: 'warning',
      title: 'מגמה יורדת במצב הרוח',
      description:
        'מצב הרוח שלך יורד בשבועות האחרונים. זהה מה השתנה בחייך וחפש דרכים לשיפור.',
      priority: 'medium',
      actionable: true,
      isRead: false,
    });
  }

  if (trend === 'improving') {
    insights.push({
      userId,
      type: 'celebration',
      title: 'שיפור במצב הרוח!',
      description:
        'מצוין! מצב הרוח שלך משתפר. המשך בפעילויות שמשפרות את הרגשתך.',
      priority: 'low',
      actionable: false,
      isRead: false,
    });
  }

  if (streakDays >= 7) {
    insights.push({
      userId,
      type: 'milestone',
      title: 'עקביות בטיפול עצמי',
      description: `כל הכבוד! אתה עוקב אחר מצב הרוח שלך ${streakDays} ימים ברציפות. זה מראה על מחויבות לבריאות הנפש שלך.`,
      priority: 'low',
      actionable: false,
      isRead: false,
    });
  }

  if (averageMood >= 8) {
    insights.push({
      userId,
      type: 'celebration',
      title: 'מצב רוח מעולה!',
      description:
        'מצב הרוח שלך מעולה! שמור על הפעילויות והאנשים שמשפרים את הרגשתך.',
      priority: 'low',
      actionable: false,
      isRead: false,
    });
  }

  // Check for patterns in mood distribution
  const moodDistribution: Record<number, number> = {};
  moodEntries.forEach((entry) => {
    moodDistribution[entry.moodValue] =
      (moodDistribution[entry.moodValue] || 0) + 1;
  });

  const highMoodDays =
    (moodDistribution[8] || 0) +
    (moodDistribution[9] || 0) +
    (moodDistribution[10] || 0);
  const lowMoodDays =
    (moodDistribution[1] || 0) +
    (moodDistribution[2] || 0) +
    (moodDistribution[3] || 0);

  if (lowMoodDays > highMoodDays * 2) {
    insights.push({
      userId,
      type: 'recommendation',
      title: 'צריך יותר ימים טובים',
      description:
        'יש לך הרבה יותר ימים עם מצב רוח נמוך מאשר גבוה. חפש פעילויות שמשפרות את מצב הרוח שלך.',
      priority: 'medium',
      actionable: true,
      isRead: false,
    });
  }

  // Create insights in database
  const createdInsights = [];
  for (const insight of insights) {
    try {
      const created = await prisma.insight.create({ data: insight });
      createdInsights.push(created);
    } catch (error) {
      console.error('Error creating insight:', error);
    }
  }

  return createdInsights;
}
