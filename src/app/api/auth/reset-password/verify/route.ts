import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/reset-password/verify - Verify reset code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing email or code',
          message: 'אימייל או קוד חסרים'
        },
        { status: 400 }
      );
    }

    // In a real app, this would:
    // 1. Check if code exists and is valid
    // 2. Check if code hasn't expired
    // 3. Verify email matches the code
    // 4. Mark code as used (one-time use)
    // 5. Generate session token for password reset

    // For demo, accept any 6-digit code
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid code format',
          message: 'קוד אימות לא תקין'
        },
        { status: 400 }
      );
    }

    console.log('Password reset code verified:', {
      timestamp: new Date().toISOString(),
      email,
      code,
      action: 'password_reset_code_verified'
    });

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: {
        email,
        codeVerified: true,
        canResetPassword: true,
      },
      message: 'קוד אומת בהצלחה'
    });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify code',
        message: 'שגיאה באימות הקוד'
      },
      { status: 500 }
    );
  }
}