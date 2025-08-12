import { NextRequest, NextResponse } from 'next/server';
import { breathingSessionService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for breathing session
const breathingSessionSchema = z.object({
  technique: z.enum(['box', '4-7-8', 'diaphragmatic', 'alternate-nostril', 'custom']),
  duration: z.number().min(1, 'משך התרגיל חייב להיות לפחות דקה אחת'),
  breathsPerMinute: z.number().min(1).max(60, 'קצב הנשימה חייב להיות בין 1 ל-60').optional(),
  notes: z.string().optional(),
  moodBefore: z.number().min(1).max(10, 'מצב רוח לפני חייב להיות בין 1 ל-10'),
  moodAfter: z.number().min(1).max(10, 'מצב רוח אחרי חייב להיות בין 1 ל-10'),
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
    const validationResult = breathingSessionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { technique, duration, breathsPerMinute, notes, moodBefore, moodAfter, date } = validationResult.data;

    // Prepare breathing session data
    const breathingSessionData = {
      userId,
      technique,
      duration,
      breathsPerMinute: breathsPerMinute || 0,
      notes: notes || '',
      moodBefore,
      moodAfter,
      date: date ? new Date(date) : new Date()
    };

    // Save to Firestore
    const breathingSessionId = await breathingSessionService.create(breathingSessionData);

    return NextResponse.json({
      message: 'תרגיל נשימה נשמר בהצלחה',
      id: breathingSessionId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save breathing session error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת תרגיל הנשימה' },
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
    const validationResult = breathingSessionSchema.extend({
      id: z.string().min(1, 'מזהה תרגיל נשימה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, technique, duration, breathsPerMinute, notes, moodBefore, moodAfter, date } = validationResult.data;

    // Check if breathing session exists and belongs to user
    const existingSession = await breathingSessionService.getById(id);
    if (!existingSession) {
      return NextResponse.json(
        { error: 'תרגיל נשימה לא נמצא' },
        { status: 404 }
      );
    }

    if (existingSession.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך תרגיל זה' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      technique,
      duration,
      breathsPerMinute: breathsPerMinute || 0,
      notes: notes || '',
      moodBefore,
      moodAfter,
      date: date ? new Date(date) : new Date()
    };

    // Update in Firestore
    await breathingSessionService.update(id, updateData);

    return NextResponse.json({
      message: 'תרגיל נשימה עודכן בהצלחה'
    });

  } catch (error: any) {
    console.error('Update breathing session error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון תרגיל הנשימה' },
      { status: 500 }
    );
  }
}
