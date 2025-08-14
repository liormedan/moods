import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, Timestamp } from 'firebase/firestore';

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
    let startTimestamp = null;
    let endTimestamp = null;
    
    if (startDate) {
      startTimestamp = Timestamp.fromDate(new Date(startDate));
    }
    if (endDate) {
      endTimestamp = Timestamp.fromDate(new Date(endDate));
    }

    // Get mood entries
    let moodQuery = query(
      collection(db, 'mood_entries'),
      where('userId', '==', userId),
      where('date', '>=', startTimestamp || Timestamp.fromDate(new Date('2020-01-01')))
    );
    
    if (endTimestamp) {
      moodQuery = query(moodQuery, where('date', '<=', endTimestamp));
    }
    
    const moodSnapshot = await getDocs(moodQuery);
    const moodEntries = moodSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        moodValue: data.moodValue,
        notes: data.notes || '',
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
      };
    });

    // Get journal entries (as activities)
    let journalQuery = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId),
      where('createdAt', '>=', startTimestamp || Timestamp.fromDate(new Date('2020-01-01')))
    );
    
    if (endTimestamp) {
      journalQuery = query(journalQuery, where('createdAt', '<=', endTimestamp));
    }
    
    const journalSnapshot = await getDocs(journalQuery);
    const journalEntries = journalSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        tags: data.tags || [],
        template: data.template,
        createdAt: data.createdAt.toDate(),
      };
    });

    // Get breathing sessions (as activities)
    let breathingQuery = query(
      collection(db, 'breathing_sessions'),
      where('userId', '==', userId),
      where('createdAt', '>=', startTimestamp || Timestamp.fromDate(new Date('2020-01-01')))
    );
    
    if (endTimestamp) {
      breathingQuery = query(breathingQuery, where('createdAt', '<=', endTimestamp));
    }
    
    const breathingSnapshot = await getDocs(breathingQuery);
    const breathingSessions = breathingSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        exerciseName: data.exerciseName,
        duration: data.duration,
        cycles: data.cycles,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
      };
    });

    // Get goals
    let goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      where('createdAt', '>=', startTimestamp || Timestamp.fromDate(new Date('2020-01-01')))
    );
    
    if (endTimestamp) {
      goalsQuery = query(goalsQuery, where('createdAt', '<=', endTimestamp));
    }
    
    const goalsSnapshot = await getDocs(goalsQuery);
    const goals = goalsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        progress: data.progress,
        status: data.status,
        priority: data.priority,
        targetDate: data.targetDate.toDate(),
        completedAt: data.completedAt ? data.completedAt.toDate() : null,
        createdAt: data.createdAt.toDate(),
      };
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
          tags: entry.tags || [],
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
        const existingMoodQuery = query(
          collection(db, 'mood_entries'),
          where('userId', '==', userId),
          where('date', '==', Timestamp.fromDate(new Date(date)))
        );
        
        const existingMoodSnapshot = await getDocs(existingMoodQuery);
        
        if (!existingMoodSnapshot.empty) {
          // Update existing mood entry
          const existingMoodDoc = existingMoodSnapshot.docs[0];
          await updateDoc(existingMoodDoc.ref, {
            moodValue: moodValue,
            notes: description || '',
            updatedAt: Timestamp.now(),
          });
          createdEvent = { id: existingMoodDoc.id, moodValue, notes: description || '' };
        } else {
          // Create new mood entry
          const moodData = {
            userId: userId,
            moodValue: moodValue,
            notes: description || '',
            date: Timestamp.fromDate(new Date(date)),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
          
          const docRef = await addDoc(collection(db, 'mood_entries'), moodData);
          createdEvent = { id: docRef.id, ...moodData };
        }
        break;

      case 'activity':
        if (activityType === 'כתיבה') {
          // Create journal entry
          const journalData = {
            userId: userId,
            title: title,
            content: description || '',
            mood: moodValue || null,
            tags: [],
            template: null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
          
          const docRef = await addDoc(collection(db, 'journal_entries'), journalData);
          createdEvent = { id: docRef.id, ...journalData };
        } else if (activityType === 'תרגילי נשימה') {
          // Create breathing session
          const breathingData = {
            userId: userId,
            exerciseId: 'custom',
            exerciseName: title,
            duration: (duration || 10) * 60, // Convert to seconds
            cycles: Math.ceil((duration || 10) / 2),
            inhaleTime: 4,
            holdTime: 4,
            exhaleTime: 4,
            completed: true,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };
          
          const docRef = await addDoc(collection(db, 'breathing_sessions'), breathingData);
          createdEvent = { id: docRef.id, ...breathingData };
        }
        break;

      case 'goal':
        // Create goal
        const goalData = {
          userId: userId,
          title: title,
          description: description || '',
          category: 'personal',
          targetDate: Timestamp.fromDate(new Date(date)),
          progress: 0,
          status: 'not-started',
          priority: priority || 'medium',
          milestones: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        const docRef = await addDoc(collection(db, 'goals'), goalData);
        createdEvent = { id: docRef.id, ...goalData };
        break;

      case 'reminder':
        // For reminders, we'll store them as goals with a special category
        const reminderData = {
          userId: userId,
          title: title,
          description: description || '',
          category: 'reminder',
          targetDate: Timestamp.fromDate(new Date(date)),
          progress: 0,
          status: 'not-started',
          priority: priority || 'medium',
          milestones: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        const reminderRef = await addDoc(collection(db, 'goals'), reminderData);
        createdEvent = { id: reminderRef.id, ...reminderData };
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
