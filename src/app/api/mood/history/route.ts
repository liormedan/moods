import { NextRequest, NextResponse } from 'next/server';
import { moodEntryService, firebaseHelpers } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for query parameters
const querySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional(),
  page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional()
});

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validationResult = querySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'פרמטרים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { startDate, endDate, limit = 20, page = 1 } = validationResult.data;

    let moodEntries: any[] = [];

    if (startDate && endDate) {
      // Get entries within date range
      moodEntries = await firebaseHelpers.getMoodEntriesByDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      // Get recent entries with pagination
      const result = await moodEntryService.getPaginated(
        limit,
        undefined,
        'date',
        'desc'
      );
      moodEntries = result.data;
    }

    // Apply pagination if no date range specified
    if (!startDate && !endDate) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      moodEntries = moodEntries.slice(startIndex, endIndex);
    }

    // Calculate pagination info
    const totalEntries = moodEntries.length;
    const totalPages = Math.ceil(totalEntries / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: moodEntries,
      pagination: {
        currentPage: page,
        totalPages,
        totalEntries,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error: any) {
    console.error('Get mood history error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בקבלת היסטוריית מצב רוח' },
      { status: 500 }
    );
  }
}
