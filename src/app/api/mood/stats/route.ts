import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return mock data since we don't have mood entries in the database yet
    const mockData = {
      totalEntries: 15,
      averageMood: 7.2,
      streakDays: 5,
      moodTrend: 'improving' as const,
      weeklyAverages: [
        { week: '2024-01-01', average: 6.8 },
        { week: '2024-01-08', average: 7.2 },
      ],
      recentMood: {
        date: new Date().toISOString(),
        mood: 8,
        note: 'Feeling good today!'
      },
      insights: [
        { id: '1', text: 'Your mood has been improving this week!' },
        { id: '2', text: 'Consider maintaining your current routine.' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Mood stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}