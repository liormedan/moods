import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        moodEntries: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.picture || null
        },
        include: {
          moodEntries: true
        }
      });
    }

    // Calculate streaks
    const totalEntries = user.moodEntries.length;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = user.moodEntries.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak (simplified)
    const sortedEntries = user.moodEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
    for (let i = 0; i < sortedEntries.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedEntries[i - 1].date);
        const currDate = new Date(sortedEntries[i].date);
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    const profile = {
      id: user.id,
      name: user.name || 'משתמש',
      email: user.email,
      avatar: user.image || null,
      joinDate: user.createdAt.toISOString().split('T')[0],
      totalEntries,
      currentStreak,
      longestStreak,
      preferences: {
        theme: 'light',
        language: 'he',
        notifications: true
      }
    };

    return NextResponse.json({
      success: true,
      data: profile
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
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, preferences } = body;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name })
        // Note: preferences would need a separate table or JSON field
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}