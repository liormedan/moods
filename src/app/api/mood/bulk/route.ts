import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  writeBatch, 
  Timestamp 
} from 'firebase/firestore';
import { z } from 'zod';

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

    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = bulkMoodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validationResult.error.issues,
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
    const existingQuery = query(
      collection(db, 'mood_entries'),
      where('userId', '==', (session as any).user.id),
      where('date', 'in', dates.map((date) => Timestamp.fromDate(new Date(date))))
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    if (!existingSnapshot.empty) {
      const existingDates = existingSnapshot.docs.map(doc => {
        const data = doc.data();
        return data.date.toDate().toISOString().split('T')[0];
      });
      return NextResponse.json(
        {
          error: 'Some dates already have mood entries',
          existingDates,
        },
        { status: 409 }
      );
    }

    // Create all mood entries using batch
    const batch = writeBatch(db);
    const createdEntries = [];

    for (const entry of entries) {
      const moodEntryData = {
        userId: (session as any).user.id,
        moodValue: entry.moodValue,
        notes: entry.notes || '',
        date: Timestamp.fromDate(new Date(entry.date)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(collection(db, 'mood_entries'));
      batch.set(docRef, moodEntryData);
      
      createdEntries.push({
        id: docRef.id,
        moodValue: entry.moodValue,
        notes: entry.notes || '',
        date: entry.date,
        createdAt: moodEntryData.createdAt.toDate().toISOString(),
        updatedAt: moodEntryData.updatedAt.toDate().toISOString(),
      });
    }

    await batch.commit();

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

    if (!(session as any)?.user?.id) {
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

    let deleteQuery;

    if (ids) {
      // Delete by specific IDs
      const idArray = ids.split(',').filter((id) => id.trim());
      if (idArray.length === 0) {
        return NextResponse.json(
          { error: 'Invalid IDs provided' },
          { status: 400 }
        );
      }
      
      // Delete documents by IDs
      const batch = writeBatch(db);
      for (const id of idArray) {
        const docRef = doc(db, 'mood_entries', id);
        batch.delete(docRef);
      }
      
      await batch.commit();
      
      return NextResponse.json({
        message: `Successfully deleted ${idArray.length} mood entries`,
        deletedCount: idArray.length,
      });
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

      deleteQuery = query(
        collection(db, 'mood_entries'),
        where('userId', '==', (session as any).user.id),
        where('date', '>=', Timestamp.fromDate(start)),
        where('date', '<=', Timestamp.fromDate(end))
      );
    } else {
      return NextResponse.json(
        {
          error:
            'Both startDate and endDate must be provided for date range deletion',
        },
        { status: 400 }
      );
    }

    if (deleteQuery) {
      // Get entries to delete
      const deleteSnapshot = await getDocs(deleteQuery);
      
      if (deleteSnapshot.empty) {
        return NextResponse.json(
          { error: 'No mood entries found to delete' },
          { status: 404 }
        );
      }

      // Delete entries using batch
      const batch = writeBatch(db);
      deleteSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();

      return NextResponse.json({
        message: `Successfully deleted ${deleteSnapshot.docs.length} mood entries`,
        deletedCount: deleteSnapshot.docs.length,
      });
    }
  } catch (error) {
    console.error('Error deleting bulk mood entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
