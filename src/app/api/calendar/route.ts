import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/calendar - Get calendar events and mood data
export async function GET(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // 'mood', 'activity', 'goal', 'reminder'

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // Get mood entries
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
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

    // Get journal entries (as activities)
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId: userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        template: true,
        createdAt: true,
      },
    });

    // Get breathing sessions (as activities)
    const breathingSessions = await prisma.breathingSession.findMany({
      where: {
        userId: userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        exerciseName: true,
        duration: true,
        cycles: true,
        completed: true,
        createdAt: true,
      },
    });

    // Get goals
    const goals = await prisma.goal.findMany({
      where: {
        userId: userId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        progress: true,
        status: true,
        priority: true,
        targetDate: true,
        completedAt: true,
        createdAt: true,
      },
    });

    // Transform data to calendar events format
    const events: any[] = [];

    // Add mood entries
    if (!type || type === 'mood') {
      moodEntries.forEach((entry) => {
        events.push({
          id: `mood-${entry.id}`,
          date: entry.date.toISOString().split('T')[0],
          type: 'mood',
          title: `מצב רוח: ${entry.moodValue}/10`,
          description: entry.notes || '',
          moodValue: entry.moodValue,
          moodEmoji: getMoodEmoji(entry.moodValue),
          createdAt: entry.createdAt,
        });
      });
    }

    // Add journal entries as activities
    if (!type || type === 'activity') {
      journalEntries.forEach((entry) => {
        events.push({
          id: `journal-${entry.id}`,
          date: entry.createdAt.toISOString().split('T')[0],
          type: 'activity',
          title: `יומן: ${entry.title}`,
          description: entry.content.substring(0, 100) + '...',
          activityType: 'כתיבה',
          duration: Math.ceil(entry.content.length / 10), // Estimate reading time
          tags: entry.tags ? JSON.parse(entry.tags) : [],
          createdAt: entry.createdAt,
        });
      });

      // Add breathing sessions as activities
      breathingSessions.forEach((session) => {
        events.push({
          id: `breathing-${session.id}`,
          date: session.createdAt.toISOString().split('T')[0],
          type: 'activity',
          title: `תרגיל נשימה: ${session.exerciseName}`,
          description: `${session.cycles} מחזורים, ${Math.floor(session.duration / 60)} דקות`,
          activityType: 'תרגילי נשימה',
          duration: Math.floor(session.duration / 60),
          completed: session.completed,
          createdAt: session.createdAt,
        });
      });
    }

    // Add goals
    if (!type || type === 'goal') {
      goals.forEach((goal) => {
        events.push({
          id: `goal-${goal.id}`,
          date: goal.createdAt.toISOString().split('T')[0],
          type: 'goal',
          title: goal.title,
          description: goal.description,
          completed: goal.status === 'completed',
          priority: goal.priority,
          progress: goal.progress,
          targetDate: goal.targetDate.toISOString().split('T')[0],
          createdAt: goal.createdAt,
        });

        // Add completion event if completed
        if (goal.completedAt) {
          events.push({
            id: `goal-completed-${goal.id}`,
            date: goal.completedAt.toISOString().split('T')[0],
            type: 'goal',
            title: `הושלם: ${goal.title}`,
            description: `מטרה הושלמה בהצלחה!`,
            completed: true,
            priority: goal.priority,
            progress: 100,
            createdAt: goal.completedAt,
          });
        }
      });
    }

    // Calculate statistics
    const stats = {
      totalEvents: events.length,
      moodEntries: moodEntries.length,
      activities: journalEntries.length + breathingSessions.length,
      goals: goals.length,
      completedGoals: goals.filter((g) => g.status === 'completed').length,
      averageMood:
        moodEntries.length > 0
          ? Math.round(
              (moodEntries.reduce((sum, entry) => sum + entry.moodValue, 0) /
                moodEntries.length) *
                10
            ) / 10
          : 0,
      moodTrend: calculateMoodTrend(moodEntries),
      activeDays: [...new Set(events.map((e) => e.date))].length,
    };

    return NextResponse.json({
      data: events.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      stats,
    });
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/calendar - Add a new calendar event
export async function POST(request: NextRequest) {
  try {
    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();
    const {
      type,
      date,
      title,
      description,
      moodValue,
      activityType,
      duration,
      priority,
    } = body;

    if (!type || !date || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let createdEvent = null;

    // Handle different event types
    switch (type) {
      case 'mood':
        if (!moodValue) {
          return NextResponse.json(
            { error: 'Mood value is required for mood events' },
            { status: 400 }
          );
        }

        // Check if mood entry already exists for this date
        const existingMood = await prisma.moodEntry.findFirst({
          where: {
            userId: userId,
            date: new Date(date),
          },
        });

        if (existingMood) {
          // Update existing mood entry
          createdEvent = await prisma.moodEntry.update({
            where: { id: existingMood.id },
            data: {
              moodValue: moodValue,
              notes: description || '',
            },
          });
        } else {
          // Create new mood entry
          createdEvent = await prisma.moodEntry.create({
            data: {
              userId: userId,
              moodValue: moodValue,
              notes: description || '',
              date: new Date(date),
            },
          });
        }
        break;

      case 'activity':
        if (activityType === 'כתיבה') {
          // Create journal entry
          createdEvent = await prisma.journalEntry.create({
            data: {
              userId: userId,
              title: title,
              content: description || '',
              mood: moodValue || null,
              tags: JSON.stringify([]),
              template: null,
            },
          });
        } else if (activityType === 'תרגילי נשימה') {
          // Create breathing session
          createdEvent = await prisma.breathingSession.create({
            data: {
              userId: userId,
              exerciseId: 'custom',
              exerciseName: title,
              duration: (duration || 10) * 60, // Convert to seconds
              cycles: Math.ceil((duration || 10) / 2),
              inhaleTime: 4,
              holdTime: 4,
              exhaleTime: 4,
              completed: true,
            },
          });
        }
        break;

      case 'goal':
        // Create goal
        createdEvent = await prisma.goal.create({
          data: {
            userId: userId,
            title: title,
            description: description || '',
            category: 'personal',
            targetDate: new Date(date),
            progress: 0,
            status: 'not-started',
            priority: priority || 'medium',
            milestones: JSON.stringify([]),
          },
        });
        break;

      case 'reminder':
        // For reminders, we'll store them as goals with a special category
        createdEvent = await prisma.goal.create({
          data: {
            userId: userId,
            title: title,
            description: description || '',
            category: 'reminder',
            targetDate: new Date(date),
            progress: 0,
            status: 'not-started',
            priority: priority || 'medium',
            milestones: JSON.stringify([]),
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        message: 'Event created successfully',
        data: createdEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getMoodEmoji(moodValue: number): string {
  const emojis = ['😢', '😢', '😕', '😕', '😐', '😐', '🙂', '🙂', '😊', '😄'];
  return emojis[moodValue - 1] || '😐';
}

function calculateMoodTrend(moodEntries: any[]): 'up' | 'down' | 'stable' {
  if (moodEntries.length < 2) return 'stable';

  const recent = moodEntries.slice(-7); // Last 7 entries
  const older = moodEntries.slice(-14, -7); // Previous 7 entries

  if (recent.length === 0 || older.length === 0) return 'stable';

  const recentAvg =
    recent.reduce((sum, entry) => sum + entry.moodValue, 0) / recent.length;
  const olderAvg =
    older.reduce((sum, entry) => sum + entry.moodValue, 0) / older.length;

  const diff = recentAvg - olderAvg;

  if (diff > 0.5) return 'up';
  if (diff < -0.5) return 'down';
  return 'stable';
}
