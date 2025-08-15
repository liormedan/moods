import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete mood entry (only if it belongs to the user)
    const deletedEntry = await prisma.moodEntry.deleteMany({
      where: {
        id,
        userId: user.id
      }
    });

    if (deletedEntry.count === 0) {
      return NextResponse.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Mood deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { moodValue, notes, date } = body;

    // Validate input
    if (moodValue && (moodValue < 1 || moodValue > 10)) {
      return NextResponse.json(
        { error: 'Mood value must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update mood entry (only if it belongs to the user)
    const updatedEntry = await prisma.moodEntry.updateMany({
      where: {
        id,
        userId: user.id
      },
      data: {
        ...(moodValue && { moodValue }),
        ...(notes !== undefined && { notes }),
        ...(date && { date: new Date(date) })
      }
    });

    if (updatedEntry.count === 0) {
      return NextResponse.json({ error: 'Mood entry not found' }, { status: 404 });
    }

    // Get the updated entry to return
    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: moodEntry
    });
  } catch (error) {
    console.error('Mood update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}