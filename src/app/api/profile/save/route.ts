import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/firebase-helpers';
import { getCurrentUserId } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for profile details
const profileSchema = z.object({
  fullName: z.string().min(2, 'השם המלא חייב להכיל לפחות 2 תווים'),
  avatarUrl: z.string().url('כתובת תמונה לא חוקית').optional(),
  bio: z.string().max(500, 'הביוגרפיה לא יכולה לעלות על 500 תווים').optional(),
  birthDate: z.string().datetime('תאריך לידה לא חוקי').optional(),
  phone: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'שם איש קשר חירום חייב להכיל לפחות 2 תווים'),
    phone: z.string().min(1, 'טלפון איש קשר חירום נדרש'),
    relationship: z.string().min(1, 'יחס איש קשר חירום נדרש')
  }).optional()
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
    const validationResult = profileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { fullName, avatarUrl, bio, birthDate, phone, emergencyContact } = validationResult.data;

    // Prepare profile data
    const profileData = {
      fullName,
      avatarUrl: avatarUrl || '',
      bio: bio || '',
      birthDate: birthDate ? new Date(birthDate) : undefined,
      phone: phone || '',
      emergencyContact: emergencyContact || null
    };

    // Update user profile in Firestore
    await userService.update(userId, profileData);

    return NextResponse.json({
      message: 'פרטי פרופיל נשמרו בהצלחה'
    });

  } catch (error: any) {
    console.error('Save profile error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בשמירת פרטי הפרופיל' },
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

    // Return profile data (excluding sensitive information)
    const profileData = {
      fullName: userData.fullName,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio,
      birthDate: userData.birthDate,
      phone: userData.phone,
      emergencyContact: userData.emergencyContact
    };

    return NextResponse.json({
      profile: profileData
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בקבלת פרטי הפרופיל' },
      { status: 500 }
    );
  }
}
