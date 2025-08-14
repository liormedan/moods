import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs, 
  addDoc, 
  getCountFromServer, 
  Timestamp 
} from 'firebase/firestore';
import { z } from 'zod';

// Validation schema for breathing session
const breathingSessionSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise ID required'),
  exerciseName: z.string().min(1, 'Exercise name required'),
  duration: z.number().min(1, 'Duration must be positive'),
  cycles: z.number().min(1, 'Cycles must be positive'),
  inhaleTime: z.number().min(1, 'Inhale time must be positive'),
  holdTime: z.number().min(0, 'Hold time must be non-negative'),
  exhaleTime: z.number().min(1, 'Exhale time must be positive'),
  completed: z.boolean().default(true),
});

// GET /api/breathing - Get breathing sessions for the authenticated user
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get total count for pagination
    const countQuery = query(
      collection(db, 'breathing_sessions'),
      where('userId', '==', userId)
    );
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    // Get breathing sessions from Firebase
    const breathingQuery = query(
      collection(db, 'breathing_sessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(Math.min(limit, 100)) // Cap at 100 sessions
    );

    const breathingSnapshot = await getDocs(breathingQuery);
    const breathingSessions = breathingSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        exerciseId: data.exerciseId,
        exerciseName: data.exerciseName,
        duration: data.duration,
        cycles: data.cycles,
        inhaleTime: data.inhaleTime,
        holdTime: data.holdTime,
        exhaleTime: data.exhaleTime,
        completed: data.completed,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      };
    });

    return NextResponse.json({
      data: breathingSessions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching breathing sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/breathing - Create a new breathing session
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

    // Validate input
    const validationResult = breathingSessionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const {
      exerciseId,
      exerciseName,
      duration,
      cycles,
      inhaleTime,
      holdTime,
      exhaleTime,
      completed,
    } = validationResult.data;

    // Create new breathing session
    const breathingSessionData = {
      userId: userId,
      exerciseId,
      exerciseName,
      duration,
      cycles,
      inhaleTime,
      holdTime,
      exhaleTime,
      completed,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'breathing_sessions'), breathingSessionData);

    const breathingSession = {
      id: docRef.id,
      exerciseId,
      exerciseName,
      duration,
      cycles,
      inhaleTime,
      holdTime,
      exhaleTime,
      completed,
      createdAt: breathingSessionData.createdAt.toDate().toISOString(),
      updatedAt: breathingSessionData.updatedAt.toDate().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'Breathing session created successfully',
        data: breathingSession,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating breathing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
