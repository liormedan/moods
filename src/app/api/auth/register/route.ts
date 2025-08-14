import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'משתמש עם כתובת אימייל זו כבר קיים' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'המשתמש נוצר בהצלחה',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'משתמש עם כתובת אימייל זו כבר קיים' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
