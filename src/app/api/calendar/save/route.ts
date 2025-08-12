import { NextRequest, NextResponse } from 'next/server';
import { calendarEventService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for calendar event
const calendarEventSchema = z.object({
  title: z.string().min(1, 'כותרת האירוע נדרשת'),
  description: z.string().optional(),
  startTime: z.string().datetime('זמן התחלה לא חוקי'),
  endTime: z.string().datetime('זמן סיום לא חוקי'),
  type: z.enum(['therapy', 'medication', 'exercise', 'social', 'work', 'personal']),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  reminders: z.array(z.object({
    id: z.string().optional(),
    time: z.string().datetime('זמן תזכורת לא חוקי'),
    type: z.enum(['push', 'email', 'sms'])
  })).optional()
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
    const validationResult = calendarEventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { title, description, startTime, endTime, type, isRecurring, recurrencePattern, reminders } = validationResult.data;

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'זמן ההתחלה חייב להיות לפני זמן הסיום' },
        { status: 400 }
      );
    }

    // Prepare calendar event data
    const calendarEventData = {
      userId,
      title,
      description: description || '',
      startTime: start,
      endTime: end,
      type,
      isRecurring,
      recurrencePattern: recurrencePattern || '',
      reminders: reminders?.map(reminder => ({
        id: reminder.id || Math.random().toString(36).substr(2, 9),
        time: new Date(reminder.time),
        type: reminder.type
      })) || []
    };

    // Save to Firestore
    const calendarEventId = await calendarEventService.create(calendarEventData);

    return NextResponse.json({
      message: 'אירוע לוח שנה נשמר בהצלחה',
      id: calendarEventId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save calendar event error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת אירוע לוח השנה' },
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
    const validationResult = calendarEventSchema.extend({
      id: z.string().min(1, 'מזהה אירוע נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, title, description, startTime, endTime, type, isRecurring, recurrencePattern, reminders } = validationResult.data;

    // Check if calendar event exists and belongs to user
    const existingEvent = await calendarEventService.getById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'אירוע לוח שנה לא נמצא' },
        { status: 404 }
      );
    }

    if (existingEvent.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך אירוע זה' },
        { status: 403 }
      );
    }

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return NextResponse.json(
        { error: 'זמן ההתחלה חייב להיות לפני זמן הסיום' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      title,
      description: description || '',
      startTime: start,
      endTime: end,
      type,
      isRecurring,
      recurrencePattern: recurrencePattern || '',
      reminders: reminders?.map(reminder => ({
        id: reminder.id || Math.random().toString(36).substr(2, 9),
        time: new Date(reminder.time),
        type: reminder.type
      })) || []
    };

    // Update in Firestore
    await calendarEventService.update(id, updateData);

    return NextResponse.json({
      message: 'אירוע לוח שנה עודכן בהצלחה'
    });

  } catch (error: any) {
    console.error('Update calendar event error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון אירוע לוח השנה' },
      { status: 500 }
    );
  }
}
