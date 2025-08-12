import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for user settings
const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['he', 'en', 'ar']),
  notificationsEnabled: z.boolean(),
  privacyLevel: z.enum(['public', 'private', 'friends'])
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
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { theme, language, notificationsEnabled, privacyLevel } = validationResult.data;

    // Prepare settings data
    const settingsData = {
      preferences: {
        theme,
        language,
        notificationsEnabled,
        privacyLevel
      }
    };

    // Update user preferences in Firestore
    await userService.update(userId, settingsData);

    return NextResponse.json({
      message: 'הגדרות נשמרו בהצלחה'
    });

  } catch (error: any) {
    console.error('Save settings error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת ההגדרות' },
      { status: 500 }
    );
  }
}

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

    // Get user data from Firestore
    const userData = await userService.getById(userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      settings: userData.preferences
    });

  } catch (error: any) {
    console.error('Get settings error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בקבלת ההגדרות' },
      { status: 500 }
    );
  }
}
