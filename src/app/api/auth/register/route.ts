import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'נתונים לא תקינים',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, email } = validationResult.data;

    // Check if user already exists in Firestore
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      return NextResponse.json(
        { error: 'משתמש עם כתובת אימייל זו כבר קיים' },
        { status: 409 }
      );
    }

    // With Auth0, users are created automatically when they sign in
    // This API route is now just for validation and checking existing users
    return NextResponse.json(
      {
        message: 'המשתמש יכול להירשם דרך Auth0',
        redirectTo: '/auth/signin',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
