import { NextRequest, NextResponse } from 'next/server';
import { moodEntryService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for mood entry
const moodEntrySchema = z.object({
  moodValue: z.number().min(1).max(10, 'ערך המצב רוח חייב להיות בין 1 ל-10'),
  moodType: z.enum(['happy', 'sad', 'anxious', 'angry', 'calm', 'excited', 'tired', 'neutral']),
  notes: z.string().optional(),
  activities: z.array(z.string()).min(1, 'יש לבחור לפחות פעילות אחת'),
  weather: z.string().optional(),
  sleepHours: z.number().min(0).max(24).optional(),
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
    const validationResult = moodEntrySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { moodValue, moodType, notes, activities, weather, sleepHours, date } = validationResult.data;

    // Prepare mood entry data
    const moodEntryData = {
      userId,
      moodValue,
      moodType,
      notes: notes || '',
      activities,
      weather: weather || '',
      sleepHours: sleepHours || 0,
      date: date ? new Date(date) : new Date()
    };

    // Save to Firestore
    const moodEntryId = await moodEntryService.create(moodEntryData);

    return NextResponse.json({
      message: 'רשומת מצב רוח נשמרה בהצלחה',
      id: moodEntryId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save mood entry error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת רשומת מצב רוח' },
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
    const validationResult = moodEntrySchema.extend({
      id: z.string().min(1, 'מזהה רשומה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, moodValue, moodType, notes, activities, weather, sleepHours, date } = validationResult.data;

    // Check if mood entry exists and belongs to user
    const existingEntry = await moodEntryService.getById(id);
    if (!existingEntry) {
      return NextResponse.json(
        { error: 'רשומת מצב רוח לא נמצאה' },
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
      moodValue,
      moodType,
      notes: notes || '',
      activities,
      weather: weather || '',
      sleepHours: sleepHours || 0,
      date: date ? new Date(date) : new Date()
    };

    // Update in Firestore
    await moodEntryService.update(id, updateData);

    return NextResponse.json({
      message: 'רשומת מצב רוח עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update mood entry error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון רשומת מצב רוח' },
      { status: 500 }
    );
  }
}
