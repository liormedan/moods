import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for notification
const notificationSchema = z.object({
  type: z.enum(['reminder', 'achievement', 'insight', 'goal', 'system']),
  title: z.string().min(1, 'כותרת ההודעה נדרשת'),
  message: z.string().min(1, 'תוכן ההודעה נדרש'),
  isRead: z.boolean().default(false),
  data: z.any().optional() // Additional data for the notification
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
    const validationResult = notificationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { type, title, message, isRead, data } = validationResult.data;

    // Prepare notification data
    const notificationData = {
      userId,
      type,
      title,
      message,
      isRead,
      data: data || null
    };

    // Save to Firestore
    const notificationId = await notificationService.create(notificationData);

    return NextResponse.json({
      message: 'הודעה נשמרה בהצלחה',
      id: notificationId
    }, { status: 201 });

  } catch (error: any) {
    console.error('Save notification error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת ההודעה' },
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
    const validationResult = notificationSchema.extend({
      id: z.string().min(1, 'מזהה הודעה נדרש')
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, type, title, message, isRead, data } = validationResult.data;

    // Check if notification exists and belongs to user
    const existingNotification = await notificationService.getById(id);
    if (!existingNotification) {
      return NextResponse.json(
        { error: 'הודעה לא נמצאה' },
        { status: 404 }
      );
    }

    if (existingNotification.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך הודעה זו' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {
      type,
      title,
      message,
      isRead,
      data: data || null
    };

    // Update in Firestore
    await notificationService.update(id, updateData);

    return NextResponse.json({
      message: 'הודעה עודכנה בהצלחה'
    });

  } catch (error: any) {
    console.error('Update notification error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון ההודעה' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
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
    const validationResult = z.object({
      id: z.string().min(1, 'מזהה הודעה נדרש'),
      isRead: z.boolean()
    }).safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { id, isRead } = validationResult.data;

    // Check if notification exists and belongs to user
    const existingNotification = await notificationService.getById(id);
    if (!existingNotification) {
      return NextResponse.json(
        { error: 'הודעה לא נמצאה' },
        { status: 404 }
      );
    }

    if (existingNotification.userId !== userId) {
      return NextResponse.json(
        { error: 'אין הרשאה לערוך הודעה זו' },
        { status: 403 }
      );
    }

    // Update read status in Firestore
    await notificationService.update(id, { isRead });

    return NextResponse.json({
      message: isRead ? 'הודעה סומנה כנקראה' : 'הודעה סומנה כלא נקראה'
    });

  } catch (error: any) {
    console.error('Update notification read status error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בעדכון סטטוס ההודעה' },
      { status: 500 }
    );
  }
}
