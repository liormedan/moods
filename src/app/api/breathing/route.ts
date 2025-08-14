import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
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

    const breathingSessions = await prisma.breathingSession.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Cap at 100 sessions
      skip: offset,
      select: {
        id: true,
        exerciseId: true,
        exerciseName: true,
        duration: true,
        cycles: true,
        inhaleTime: true,
        holdTime: true,
        exhaleTime: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.breathingSession.count({
      where: { userId: userId },
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
    const breathingSession = await prisma.breathingSession.create({
      data: {
        userId: userId,
        exerciseId,
        exerciseName,
        duration,
        cycles,
        inhaleTime,
        holdTime,
        exhaleTime,
        completed,
      },
      select: {
        id: true,
        exerciseId: true,
        exerciseName: true,
        duration: true,
        cycles: true,
        inhaleTime: true,
        holdTime: true,
        exhaleTime: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
