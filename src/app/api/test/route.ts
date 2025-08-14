import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    // Test Firebase connection
    const usersRef = collection(db, 'users');
    const userCountSnapshot = await getCountFromServer(usersRef);
    const userCount = userCountSnapshot.data().count;

    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      data: {
        userCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Firebase test error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Firebase connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
