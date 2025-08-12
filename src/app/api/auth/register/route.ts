import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/firebase-auth';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email('כתובת אימייל לא חוקית'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
  fullName: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'נתונים לא חוקיים', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password, fullName } = validationResult.data;

    // Register user with Firebase
    const userCredential = await registerUser(email, password, fullName);

    return NextResponse.json({
      message: 'המשתמש נרשם בהצלחה',
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        fullName
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      return NextResponse.json(
        { error: 'כתובת האימייל כבר בשימוש' },
        { status: 409 }
      );
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' },
        { status: 400 }
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'כתובת אימייל לא חוקית' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'שגיאה בהרשמת המשתמש' },
      { status: 500 }
    );
  }
}
