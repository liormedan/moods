import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import crypto from 'crypto';

// Validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email('כתובת אימייל לא תקינה'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'כתובת אימייל לא תקינה',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save reset token to database
      await prisma.user.update({
        where: { email },
        data: {
          // Note: You'll need to add these fields to your User model
          // resetToken,
          // resetTokenExpiry,
        },
      });

      // TODO: Send email with reset link
      // In a real application, you would send an email here
      // For demo purposes, we'll just log the token
      console.log(`Reset token for ${email}: ${resetToken}`);
      console.log(
        `Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
      );
    }

    return NextResponse.json({
      message: 'אם כתובת האימייל קיימת במערכת, נשלח אליה קישור לאיפוס הסיסמה',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'שגיאה פנימית בשרת' }, { status: 500 });
  }
}
