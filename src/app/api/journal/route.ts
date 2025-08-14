import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for journal entry
const journalEntrySchema = z.object({
  title: z.string().min(1, 'כותרת נדרשת').max(200, 'כותרת ארוכה מדי'),
  content: z.string().min(1, 'תוכן נדרש').max(10000, 'תוכן ארוך מדי'),
  mood: z.number().min(1).max(10).optional(),
  tags: z.array(z.string()).default([]),
  template: z.string().optional(),
  isFavorite: z.boolean().default(false),
});

// GET /api/journal - Get journal entries for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');
    const sortBy = searchParams.get('sortBy') || 'date';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = { userId: userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag && tag !== 'all') {
      where.tags = { contains: tag };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'title') {
      orderBy = { title: 'asc' };
    } else if (sortBy === 'mood') {
      orderBy = { mood: 'desc' };
    }

    const journalEntries = await prisma.journalEntry.findMany({
      where,
      orderBy,
      take: Math.min(limit, 100), // Cap at 100 entries
      skip: offset,
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

    // Parse tags from JSON string
    const formattedEntries = journalEntries.map((entry) => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : [],
    }));

    // Get total count for pagination
    const totalCount = await prisma.journalEntry.count({ where });

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
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/journal - Create a new journal entry
export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();

    // Validate input
    const validationResult = journalEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, content, mood, tags, template, isFavorite } =
      validationResult.data;

    // Create new journal entry
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId: userId,
        title,
        content,
        mood,
        tags: JSON.stringify(tags), // Store tags as JSON string
        template,
        isFavorite,
      },
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
      ...journalEntry,
      tags: journalEntry.tags ? JSON.parse(journalEntry.tags) : [],
    };

    return NextResponse.json(
      {
        message: 'Journal entry created successfully',
        data: formattedEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
