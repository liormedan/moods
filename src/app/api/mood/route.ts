import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for mood entry
const moodEntrySchema = z.object({
  moodValue: z.number().min(1).max(10),
  notes: z.string().optional(),
  date: z.string().optional(), // ISO date string
});

// Validation schema for mood update
const moodUpdateSchema = z.object({
  moodValue: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

// GET /api/mood - Get mood entries for the authenticated user
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
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause for demo
    const where: any = { userId: userId };

    if (date) {
      // Single date filter
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      where.date = {
        gte: startDate,
        lt: endDate,
      };
    } else if (startDate && endDate) {
      // Date range filter
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const moodEntries = await prisma.moodEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      take: Math.min(limit, 100), // Cap at 100 entries
      skip: offset,
      select: {
        id: true,
        moodValue: true,
        notes: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.moodEntry.count({ where });

    return NextResponse.json({
      data: moodEntries,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/mood - Create a new mood entry
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
    const validationResult = moodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { moodValue, notes, date } = validationResult.data;

    // Parse date or use current date
    const entryDate = date ? new Date(date) : new Date();

    // Check if entry already exists for this date
    const existingEntry = await prisma.moodEntry.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: entryDate,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Mood entry already exists for this date' },
        { status: 409 }
      );
    }

    // Create new mood entry
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: userId,
        moodValue,
        notes,
        date: entryDate,
      },
      select: {
        id: true,
        moodValue: true,
        notes: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Mood entry created successfully',
        data: moodEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating mood entry:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Mood entry already exists for this date' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
