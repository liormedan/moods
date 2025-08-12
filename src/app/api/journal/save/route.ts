import { NextRequest, NextResponse } from 'next/server';
import { journalEntryService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for journal entry
const journalEntrySchema = z.object({
  title: z.string().min(1, 'כותרת הרשומה נדרשת'),
  content: z.string().min(1, 'תוכן הרשומה נדרש'),
  mood: z.number().min(1).max(10, 'ערך המצב רוח חייב להיות בין 1 ל-10'),
  tags: z.array(z.string()).min(1, 'יש לבחור לפחות תג אחד'),
  isPrivate: z.boolean().default(true),
  date: z.string().datetime().optional() // ISO string
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = journalEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, content, mood, tags, isPrivate, date } = validationResult.data;

    // Prepare journal entry data
    const journalEntryData = {
      userId,
      title,
      content,
      mood,
      tags,
      isPrivate,
      date: date ? new Date(date) : new Date()
    };

    // Save to Firestore
    const journalEntryId = await journalEntryService.create(journalEntryData);

    return NextResponse.json({
      message: 'רשומת יומן נשמרה בהצלחה',
      id: journalEntryId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save journal entry error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת רשומת היומן' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'נדרשת התחברות' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = journalEntrySchema.extend({
      id: z.string().min(1, 'מזהה רשומה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, title, content, mood, tags, isPrivate, date } = validationResult.data;

    // Check if journal entry exists and belongs to user
    const existingEntry = await journalEntryService.getById(id);
    if (!existingEntry) {
      return NextResponse.json(
        { error: 'רשומת יומן לא נמצאה' },
        { status: 404 }
      );
    }

    if (existingEntry.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך רשומה זו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      content,
      mood,
      tags,
      isPrivate,
      date: date ? new Date(date) : new Date()
    };

    // Update in Firestore
    await journalEntryService.update(id, updateData);

    return NextResponse.json({
      message: 'רשומת יומן עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update journal entry error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון רשומת היומן' },
      { status: 500 }
    );
  }
}
