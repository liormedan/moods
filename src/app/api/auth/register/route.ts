import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'השם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
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

    const { name, email, password } = validationResult.data;

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

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userData = {
        uid: firebaseUser.uid, // Firebase Auth UID
        name,
        email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Note: We don't store the password in Firestore anymore
        // Firebase Auth handles password management
      };

      const docRef = await addDoc(usersRef, userData);

      const user = {
        id: docRef.id,
        uid: firebaseUser.uid,
        name,
        email,
        createdAt: userData.createdAt.toDate().toISOString(),
      };

      return NextResponse.json(
        {
          message: 'המשתמש נוצר בהצלחה',
          user,
        },
        { status: 201 }
      );
    } catch (firebaseError: any) {
      console.error('Firebase Auth error:', firebaseError);
      
      // Handle specific Firebase Auth errors
      if (firebaseError.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { error: 'משתמש עם כתובת אימייל זו כבר קיים' },
          { status: 409 }
        );
      } else if (firebaseError.code === 'auth/weak-password') {
        return NextResponse.json(
          { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' },
          { status: 400 }
        );
      } else if (firebaseError.code === 'auth/invalid-email') {
        return NextResponse.json(
          { error: 'כתובת אימייל לא תקינה' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: 'שגיאה ביצירת המשתמש', details: firebaseError.message },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error in registration:', error);

    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
