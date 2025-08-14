import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, getCountFromServer, orderBy, limit as firestoreLimit, Timestamp } from 'firebase/firestore';
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

    // Build Firebase query
    let journalQuery = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId)
    );

    // Note: Firebase doesn't support OR queries with multiple fields easily
    // For demo purposes, we'll fetch all entries and filter in memory
    // In production, you'd use Firebase's full-text search or Algolia

    // Get total count for pagination
    const countQuery = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId)
    );
    const countSnapshot = await getCountFromServer(countQuery);
    const totalCount = countSnapshot.data().count;

    // Get journal entries from Firebase
    journalQuery = query(
      journalQuery,
      orderBy('createdAt', 'desc'),
      firestoreLimit(Math.min(limit, 100)) // Cap at 100 entries
    );

    const journalSnapshot = await getDocs(journalQuery);
    let journalEntries = journalSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        tags: data.tags || [],
        template: data.template,
        isFavorite: data.isFavorite || false,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      };
    });

    // Apply search filter in memory (for demo)
    if (search) {
      journalEntries = journalEntries.filter(entry => 
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.content.toLowerCase().includes(search.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Apply tag filter in memory (for demo)
    if (tag && tag !== 'all') {
      journalEntries = journalEntries.filter(entry => 
        entry.tags.includes(tag)
      );
    }

    // Apply sorting in memory (for demo)
    if (sortBy === 'title') {
      journalEntries.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'mood') {
      journalEntries.sort((a, b) => (b.mood || 0) - (a.mood || 0));
    }

    // Apply pagination in memory (for demo)
    journalEntries = journalEntries.slice(offset, offset + limit);

    return NextResponse.json({
      data: journalEntries,
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
    const journalData = {
      userId: userId,
      title,
      content,
      mood,
      tags: tags, // Store tags as array
      template,
      isFavorite,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'journal_entries'), journalData);

    const journalEntry = {
      id: docRef.id,
      title,
      content,
      mood,
      tags: tags,
      template,
      isFavorite,
      createdAt: journalData.createdAt.toDate().toISOString(),
      updatedAt: journalData.updatedAt.toDate().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'Journal entry created successfully',
        data: journalEntry,
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
