import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/reset-password/request - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address',
          message: 'כתובת אימייל לא תקינה'
        },
        { status: 400 }
      );
    }

    // In a real app, this would:
    // 1. Check if email exists in database
    // 2. Generate secure reset token
    // 3. Store token with expiration time
    // 4. Send email with reset link/code
    // 5. Log the request for security

    // Generate demo verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Password reset requested:', {
      timestamp: new Date().toISOString(),
      email,
      verificationCode, // In real app, this would be hashed
      action: 'password_reset_request'
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      data: {
        email,
        codeSent: true,
        expiresIn: 600, // 10 minutes
      },
      message: 'קוד אימות נשלח לאימייל שלך'
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to request password reset',
        message: 'שגיאה בשליחת קוד האימות'
      },
      { status: 500 }
    );
  }
}