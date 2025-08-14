import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { z } from 'zod';

// Validation schema for mood update
const moodUpdateSchema = z.object({
  moodValue: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

// GET /api/mood/[id] - Get a specific mood entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).user.id;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mood entry ID' },
        { status: 400 }
      );
    }

    const moodEntryRef = doc(db, 'mood_entries', id);
    const moodEntrySnap = await getDoc(moodEntryRef);

    if (!moodEntrySnap.exists()) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    const moodEntryData = moodEntrySnap.data();

    // Check if user owns this mood entry
    if (moodEntryData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Format the data
    const entryData = {
      id: moodEntrySnap.id,
      moodValue: moodEntryData.moodValue,
      notes: moodEntryData.notes || '',
      date: moodEntryData.date.toDate().toISOString().split('T')[0],
      createdAt: moodEntryData.createdAt.toDate().toISOString(),
      updatedAt: moodEntryData.updatedAt.toDate().toISOString(),
    };

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).user.id;

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
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Check if mood entry exists and user owns it
    const existingEntryRef = doc(db, 'mood_entries', id);
    const existingEntrySnap = await getDoc(existingEntryRef);

    if (!existingEntrySnap.exists()) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    const existingEntryData = existingEntrySnap.data();
    if (existingEntryData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update mood entry
    const updateData = {
      ...validationResult.data,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(existingEntryRef, updateData);

    // Get updated data
    const updatedEntrySnap = await getDoc(existingEntryRef);
    const updatedEntryData = updatedEntrySnap.data()!;

    const updatedEntry = {
      id: updatedEntrySnap.id,
      moodValue: updatedEntryData.moodValue,
      notes: updatedEntryData.notes || '',
      date: updatedEntryData.date.toDate().toISOString().split('T')[0],
      createdAt: updatedEntryData.createdAt.toDate().toISOString(),
      updatedAt: updatedEntryData.updatedAt.toDate().toISOString(),
    };

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session as any).user.id;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid mood entry ID' },
        { status: 400 }
      );
    }

    // Check if mood entry exists and user owns it
    const existingEntryRef = doc(db, 'mood_entries', id);
    const existingEntrySnap = await getDoc(existingEntryRef);

    if (!existingEntrySnap.exists()) {
      return NextResponse.json(
        { error: 'Mood entry not found' },
        { status: 404 }
      );
    }

    const existingEntryData = existingEntrySnap.data();
    if (existingEntryData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete mood entry
    await deleteDoc(existingEntryRef);

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
