import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/reset-password/confirm - Confirm password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, newPassword, token } = body;

    if (!email || !newPassword || (!code && !token)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'שדות חובה חסרים'
        },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password too weak',
          message: 'הסיסמה חלשה מדי. אנא בחר סיסמה חזקה יותר'
        },
        { status: 400 }
      );
    }

    // In a real app, this would:
    // 1. Verify the reset token/code is still valid
    // 2. Hash the new password securely
    // 3. Update the password in the database
    // 4. Invalidate all existing sessions
    // 5. Log the password change for security
    // 6. Send confirmation email
    // 7. Clear the reset token

    console.log('Password reset completed:', {
      timestamp: new Date().toISOString(),
      email,
      action: 'password_reset_completed',
      method: token ? 'email_link' : 'verification_code'
    });

    // Simulate password update delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      data: {
        email,
        passwordReset: true,
        timestamp: new Date().toISOString(),
      },
      message: 'הסיסמה אופסה בהצלחה'
    });
  } catch (error) {
    console.error('Error confirming password reset:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset password',
        message: 'שגיאה באיפוס הסיסמה'
      },
      { status: 500 }
    );
  }
}