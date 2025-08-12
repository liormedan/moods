import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for privacy settings
const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'friends']),
  moodHistoryVisibility: z.enum(['public', 'private', 'friends']),
  journalVisibility: z.enum(['public', 'private', 'friends']),
  goalsVisibility: z.enum(['public', 'private', 'friends']),
  allowDataSharing: z.boolean(),
  allowAnalytics: z.boolean(),
  allowNotifications: z.boolean()
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
    const validationResult = privacySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { 
      profileVisibility, 
      moodHistoryVisibility, 
      journalVisibility, 
      goalsVisibility, 
      allowDataSharing, 
      allowAnalytics, 
      allowNotifications 
    } = validationResult.data;

    // Prepare privacy settings data
    const privacyData = {
      preferences: {
        privacyLevel: profileVisibility,
        moodHistoryVisibility,
        journalVisibility,
        goalsVisibility,
        allowDataSharing,
        allowAnalytics,
        allowNotifications
      }
    };

    // Update user privacy settings in Firestore
    await userService.update(userId, privacyData);

    return NextResponse.json({
      message: 'הגדרות פרטיות נשמרו בהצלחה'
    });

  } catch (error: any) {
    console.error('Save privacy settings error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת הגדרות הפרטיות' },
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

    // Return privacy settings
    const privacySettings = {
      profileVisibility: userData.preferences.privacyLevel,
      moodHistoryVisibility: userData.preferences.moodHistoryVisibility || 'private',
      journalVisibility: userData.preferences.journalVisibility || 'private',
      goalsVisibility: userData.preferences.goalsVisibility || 'private',
      allowDataSharing: userData.preferences.allowDataSharing || false,
      allowAnalytics: userData.preferences.allowAnalytics || false,
      allowNotifications: userData.preferences.allowNotifications || true
    };

    return NextResponse.json({
      privacy: privacySettings
    });

  } catch (error: any) {
    console.error('Get privacy settings error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בקבלת הגדרות הפרטיות' },
      { status: 500 }
    );
  }
}
