import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedUser } from '@/lib/auth-middleware';

export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    try {
      console.log('🔍 Fetching profile for user:', user.email);

      // Get user with mood entries
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          moodEntries: {
            orderBy: { date: 'desc' },
          },
        },
      });

      if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Calculate streaks
      const totalEntries = dbUser.moodEntries.length;
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate current streak
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);

        const hasEntry = dbUser.moodEntries.some((entry) => {
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
      const sortedEntries = dbUser.moodEntries.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      for (let i = 0; i < sortedEntries.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const prevDate = new Date(sortedEntries[i - 1].date);
          const currDate = new Date(sortedEntries[i].date);
          const dayDiff = Math.floor(
            (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
          );

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
        id: dbUser.id,
        name: dbUser.name || 'משתמש',
        email: dbUser.email,
        avatar: dbUser.image || null,
        joinDate: dbUser.createdAt.toISOString().split('T')[0],
        totalEntries,
        currentStreak,
        longestStreak,
        preferences: {
          theme: 'light',
          language: 'he',
          notifications: true,
        },
      };

      return NextResponse.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    try {
      const body = await request.json();
      const { name, preferences } = body;

      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || undefined,
          // Add preferences to user model if needed
        },
      });

      console.log('✅ Profile updated for user:', user.email);

      return NextResponse.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);
