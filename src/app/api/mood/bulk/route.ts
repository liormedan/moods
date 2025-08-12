import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'z';

// Validation schema for bulk mood entries
const bulkMoodEntrySchema = z.object({
  entries: z
    .array(
      z.object({
        moodValue: z.number().min(1).max(10),
        notes: z.string().optional(),
        date: z.string(), // ISO date string
      })
    )
    .min(1)
    .max(100), // Limit to 100 entries per request
});

// POST /api/mood/bulk - Create multiple mood entries
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = bulkMoodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { entries } = validationResult.data;

    // Check for duplicate dates within the request
    const dates = entries.map((entry) => entry.date);
    const uniqueDates = new Set(dates);
    if (dates.length !== uniqueDates.size) {
      return NextResponse.json(
        { error: 'Duplicate dates found in request' },
        { status: 400 }
      );
    }

    // Check for existing entries for these dates
    const existingEntries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
        date: {
          in: dates.map((date) => new Date(date)),
        },
      },
      select: { date: true },
    });

    if (existingEntries.length > 0) {
      const existingDates = existingEntries.map(
        (entry) => entry.date.toISOString().split('T')[0]
      );
      return NextResponse.json(
        {
          error: 'Some dates already have mood entries',
          existingDates,
        },
        { status: 409 }
      );
    }

    // Create all mood entries in a transaction
    const createdEntries = await prisma.$transaction(
      entries.map((entry) =>
        prisma.moodEntry.create({
          data: {
            userId: session.user.id,
            moodValue: entry.moodValue,
            notes: entry.notes,
            date: new Date(entry.date),
          },
          select: {
            id: true,
            moodValue: true,
            notes: true,
            date: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      )
    );

    return NextResponse.json(
      {
        message: `Successfully created ${createdEntries.length} mood entries`,
        data: createdEntries,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bulk mood entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/mood/bulk - Delete multiple mood entries
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const ids = searchParams.get('ids');

    if (!startDate && !endDate && !ids) {
      return NextResponse.json(
        { error: 'Must provide startDate/endDate range or specific IDs' },
        { status: 400 }
      );
    }

    let whereClause: any = { userId: session.user.id };

    if (ids) {
      // Delete by specific IDs
      const idArray = ids.split(',').filter((id) => id.trim());
      if (idArray.length === 0) {
        return NextResponse.json(
          { error: 'Invalid IDs provided' },
          { status: 400 }
        );
      }
      whereClause.id = { in: idArray };
    } else if (startDate && endDate) {
      // Delete by date range
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }

      whereClause.date = {
        gte: start,
        lte: end,
      };
    } else {
      return NextResponse.json(
        {
          error:
            'Both startDate and endDate must be provided for date range deletion',
        },
        { status: 400 }
      );
    }

    // Get count of entries to be deleted
    const countToDelete = await prisma.moodEntry.count({ where: whereClause });

    if (countToDelete === 0) {
      return NextResponse.json(
        { error: 'No mood entries found to delete' },
        { status: 404 }
      );
    }

    // Delete entries
    await prisma.moodEntry.deleteMany({ where: whereClause });

    return NextResponse.json({
      message: `Successfully deleted ${countToDelete} mood entries`,
      deletedCount: countToDelete,
    });
  } catch (error) {
    console.error('Error deleting bulk mood entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
