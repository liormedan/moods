import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// Validation schema for journal entry update
const journalUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  mood: z.number().min(1).max(10).optional(),
  tags: z.array(z.string()).optional(),
  template: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

// GET /api/journal/[id] - Get a specific journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid journal entry ID' },
        { status: 400 }
      );
    }

    const journalDoc = await getDoc(doc(db, 'journal_entries', id));

    if (!journalDoc.exists()) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const journalData = journalDoc.data();

    // Check if user owns this journal entry
    if (journalData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove userId from response and format tags
    const { userId: _, ...entryData } = journalData;
    const formattedEntry = {
      id: journalDoc.id,
      ...entryData,
      tags: entryData.tags || [],
      createdAt: entryData.createdAt.toDate().toISOString(),
      updatedAt: entryData.updatedAt.toDate().toISOString(),
    };

    return NextResponse.json({ data: formattedEntry });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/journal/[id] - Update a specific journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid journal entry ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = journalUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Check if journal entry exists and user owns it
    const existingDoc = await getDoc(doc(db, 'journal_entries', id));

    if (!existingDoc.exists()) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const existingData = existingDoc.data();
    if (existingData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = { 
      ...validationResult.data,
      updatedAt: Timestamp.now()
    };

    // Update journal entry
    await updateDoc(doc(db, 'journal_entries', id), updateData);

    // Get updated entry
    const updatedDoc = await getDoc(doc(db, 'journal_entries', id));
    const updatedData = updatedDoc.data();

    const formattedEntry = {
      id: updatedDoc.id,
      title: updatedData.title,
      content: updatedData.content,
      mood: updatedData.mood,
      tags: updatedData.tags || [],
      template: updatedData.template,
      isFavorite: updatedData.isFavorite || false,
      createdAt: updatedData.createdAt.toDate().toISOString(),
      updatedAt: updatedData.updatedAt.toDate().toISOString(),
    };

    return NextResponse.json({
      message: 'Journal entry updated successfully',
      data: formattedEntry,
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/journal/[id] - Delete a specific journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Temporarily disabled authentication for demo
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid journal entry ID' },
        { status: 400 }
      );
    }

    // Check if journal entry exists and user owns it
    const existingDoc = await getDoc(doc(db, 'journal_entries', id));

    if (!existingDoc.exists()) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    const existingData = existingDoc.data();
    if (existingData.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete journal entry
    await deleteDoc(doc(db, 'journal_entries', id));

    return NextResponse.json({
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
