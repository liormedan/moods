import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { PaginationSchema, DateRangeSchema } from '@/lib/validation';

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
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).user.id;

    const { searchParams } = new URL(request.url);

    const paginationSchema = PaginationSchema.pick({ limit: true }).extend({
      offset: z.coerce.number().int().min(0).default(0),
    });

    const paginationResult = paginationSchema.safeParse({
      limit: searchParams.get('limit') ?? '30',
      offset: searchParams.get('offset') ?? '0',
    });

    if (!paginationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: paginationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { limit, offset } = paginationResult.data;

    const date = searchParams.get('date');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Build where clause for demo
    const where: any = { userId: userId };

    if (date) {
      // Single date filter
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            error: 'Invalid input',
            details: [{ path: ['date'], message: 'Invalid date' }],
          },
          { status: 400 }
        );
      }

      const endDate = new Date(parsedDate);
      endDate.setDate(endDate.getDate() + 1);

      where.date = {
        gte: parsedDate,
        lt: endDate,
      };
    } else if (startDateParam || endDateParam) {
      const dateRangeResult = DateRangeSchema.safeParse({
        startDate: startDateParam,
        endDate: endDateParam,
      });

      if (!dateRangeResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid input',
            details: dateRangeResult.error.issues,
          },
          { status: 400 }
        );
      }

      const { startDate, endDate } = dateRangeResult.data;

      where.date = {
        gte: startDate,
        lte: endDate,
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

    // Format the data to match the expected interface
    const formattedEntries = moodEntries.map((entry) => ({
      id: entry.id,
      moodValue: entry.moodValue,
      notes: entry.notes,
      date: entry.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    }));

    // Get total count for pagination
    const totalCount = await prisma.moodEntry.count({ where });

    return NextResponse.json({
      data: formattedEntries,
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
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).user.id;

    const body = await request.json();

    // Validate input
    const validationResult = moodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
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

