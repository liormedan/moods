import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock mood entries for now
    const mockMoods = [
      {
        id: '1',
        mood: 8,
        note: 'Great day at work!',
        date: new Date().toISOString(),
        userId: session.user.email
      },
      {
        id: '2', 
        mood: 6,
        note: 'Feeling okay',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId: session.user.email
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockMoods
    });
  } catch (error) {
    console.error('Mood fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mood, note } = body;

    // For now, just return success without actually saving to database
    const newMoodEntry = {
      id: Date.now().toString(),
      mood,
      note,
      date: new Date().toISOString(),
      userId: session.user.email
    };

    return NextResponse.json({
      success: true,
      data: newMoodEntry
    });
  } catch (error) {
    console.error('Mood creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}