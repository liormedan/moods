import { NextRequest, NextResponse } from 'next/server';
import { logoutUser } from '@/lib/firebase-auth';

export async function POST(request: NextRequest) {
  try {
    // Logout user from Firebase
    await logoutUser();

    return NextResponse.json({
      message: 'התנתקות בהצלחה'
    });

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'שגיאה בהתנתקות' },
      { status: 500 }
    );
  }
}
