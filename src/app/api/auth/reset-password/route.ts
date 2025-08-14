import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema for reset password
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'טוקן נדרש'),
  password: z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'נתונים לא תקינים',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // For demo purposes, we'll implement a simple token validation
    // In a real application, you would:
    // 1. Find user by reset token
    // 2. Check if token hasn't expired
    // 3. Update password and clear reset token

    // Demo implementation - accept any token for demo user
    if (token === 'demo-reset-token') {
      // Find demo user
      const user = await prisma.user.findUnique({
        where: { email: 'demo@example.com' },
      });

      if (!user) {
        return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          // In a real app, you would also clear the reset token here
          // resetToken: null,
          // resetTokenExpiry: null,
        },
      });

      return NextResponse.json({
        message: 'הסיסמה אופסה בהצלחה',
      });
    }

    // For other tokens, return error (in real app, check database)
    return NextResponse.json(
      { error: 'טוקן איפוס לא תקין או פג תוקף' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
