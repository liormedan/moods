import { NextRequest, NextResponse } from 'next/server';
import { loginUser, getCurrentUserData } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('כתובת אימייל לא חוקית'),
  password: z.string().min(1, 'הסיסמה נדרשת')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Login user with Firebase
    const userCredential = await loginUser(email, password);
    
    // Get additional user data from Firestore
    const userData = await getCurrentUserData();

    return NextResponse.json({
      message: 'התחברות בהצלחה',
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        fullName: userData?.fullName,
        preferences: userData?.preferences
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      );
    }
    
    if (error.code === 'auth/wrong-password') {
      return NextResponse.json(
        { error: 'סיסמה שגויה' },
        { status: 401 }
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'כתובת אימייל לא חוקית' },
        { status: 400 }
      );
    }
    
    if (error.code === 'auth/too-many-requests') {
      return NextResponse.json(
        { error: 'יותר מדי ניסיונות כניסה. נסה שוב מאוחר יותר' },
        { status: 429 }
      );
    }
    
    if (error.code === 'auth/user-disabled') {
      return NextResponse.json(
        { error: 'החשבון הושבת' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'שגיאה בהתחברות' },
      { status: 500 }
    );
  }
}
