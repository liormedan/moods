import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Fetching mood entries...');
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    console.log('👤 Demo user found for mood:', !!demoUser);

    if (demoUser) {
      // Get mood entries for the user
      const moodEntries = await prisma.moodEntry.findMany({
        where: { userId: demoUser.id },
        orderBy: { date: 'desc' },
        take: 30 // Last 30 entries
      });

      console.log('📝 Mood entries found:', moodEntries.length);

      return NextResponse.json({
        success: true,
        data: moodEntries
      });
    }

    // Fallback to mock data
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    const mockMoods = [
      {
        id: '1',
        moodValue: 8,
        notes: 'יום נהדר בעבודה!',
        date: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        userId: 'demo-user'
      },
      {
        id: '2', 
        moodValue: 6,
        notes: 'מרגיש בסדר',
        date: yesterday.toISOString(),
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
        userId: 'demo-user'
      },
      {
        id: '3', 
        moodValue: 7,
        notes: 'יום טוב עם החברים',
        date: twoDaysAgo.toISOString(),
        createdAt: twoDaysAgo.toISOString(),
        updatedAt: twoDaysAgo.toISOString(),
        userId: 'demo-user'
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
    const body = await request.json();
    const { moodValue, notes, date } = body;

    // Validate input
    if (!moodValue || moodValue < 1 || moodValue > 10) {
      return NextResponse.json(
        { error: 'Mood value must be between 1 and 10' },
        { status: 400 }
      );
    }

    // For now, use demo user
    // TODO: Implement proper Auth0 authentication
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    if (demoUser) {
      const entryDate = date ? new Date(date) : new Date();
      
      // Create or update mood entry for the date
      const moodEntry = await prisma.moodEntry.upsert({
        where: {
          userId_date: {
            userId: demoUser.id,
            date: entryDate
          }
        },
        update: {
          moodValue,
          notes: notes || null
        },
        create: {
          userId: demoUser.id,
          moodValue,
          notes: notes || null,
          date: entryDate
        }
      });

      return NextResponse.json({
        success: true,
        data: moodEntry
      });
    }

    // Fallback to mock response
    const now = new Date();
    const entryDate = date ? new Date(date) : now;
    
    const newMoodEntry = {
      id: Date.now().toString(),
      moodValue: moodValue || 5,
      notes: notes || '',
      date: entryDate.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      userId: 'demo-user'
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