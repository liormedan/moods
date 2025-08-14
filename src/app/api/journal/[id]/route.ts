import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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

    const journalEntry = await prisma.journalEntry.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        template: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    if (!journalEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    // Check if user owns this journal entry
    if (journalEntry.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove userId from response and parse tags
    const { userId: _, ...entryData } = journalEntry;
    const formattedEntry = {
      ...entryData,
      tags: entryData.tags ? JSON.parse(entryData.tags) : [],
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
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = { ...validationResult.data };
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags);
    }

    // Update journal entry
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        mood: true,
        tags: true,
        template: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse tags for response
    const formattedEntry = {
      ...updatedEntry,
      tags: updatedEntry.tags ? JSON.parse(updatedEntry.tags) : [],
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
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete journal entry
    await prisma.journalEntry.delete({
      where: { id },
    });

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
