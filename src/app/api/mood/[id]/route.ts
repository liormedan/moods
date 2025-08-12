import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for mood update
const moodUpdateSchema = z.object({
  moodValue: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

// GET /api/mood/[id] - Get a specific mood entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mood entry ID' },
        { status: 400 }
      );
    }

    const moodEntry = await prisma.moodEntry.findUnique({
      where: { id },
      select: {
        id: true,
        moodValue: true,
        notes: true,
        date: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    if (!moodEntry) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    // Check if user owns this mood entry
    if (moodEntry.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove userId from response for security
    const { userId, ...entryData } = moodEntry;

    return NextResponse.json({ data: entryData });
  } catch (error) {
    console.error('Error fetching mood entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/mood/[id] - Update a specific mood entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mood entry ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = moodUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Check if mood entry exists and user owns it
    const existingEntry = await prisma.moodEntry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update mood entry
    const updatedEntry = await prisma.moodEntry.update({
      where: { id },
      data: validationResult.data,
      select: {
        id: true,
        moodValue: true,
        notes: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Mood entry updated successfully',
      data: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating mood entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/mood/[id] - Delete a specific mood entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mood entry ID' },
        { status: 400 }
      );
    }

    // Check if mood entry exists and user owns it
    const existingEntry = await prisma.moodEntry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete mood entry
    await prisma.moodEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Mood entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
