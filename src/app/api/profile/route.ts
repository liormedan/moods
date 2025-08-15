import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock profile data based on session
    const mockProfile = {
      id: session.user.email,
      name: session.user.name || 'משתמש',
      email: session.user.email,
      avatar: session.user.image || null,
      joinDate: '2024-01-01',
      totalEntries: 15,
      currentStreak: 5,
      longestStreak: 12,
      preferences: {
        theme: 'light',
        language: 'he',
        notifications: true
      }
    };

    return NextResponse.json({
      success: true,
      data: mockProfile
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // For now, just return success without actually saving
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}