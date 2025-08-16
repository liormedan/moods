import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedUser } from '@/lib/auth-middleware';

export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    try {
      console.log('🔍 Fetching mood entries for user:', user.email);

      // Get mood entries for the authenticated user only
      const moodEntries = await prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30, // Last 30 entries
      });

      console.log('📝 Mood entries found:', moodEntries.length);

      return NextResponse.json({
        success: true,
        data: moodEntries,
      });
    } catch (error) {
      console.error('Mood fetch error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);

export const POST = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
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

      const entryDate = date ? new Date(date) : new Date();

      // Create or update mood entry for the authenticated user
      const moodEntry = await prisma.moodEntry.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: entryDate,
          },
        },
        update: {
          moodValue,
          notes: notes || null,
        },
        create: {
          userId: user.id,
          moodValue,
          notes: notes || null,
          date: entryDate,
        },
      });

      console.log('✅ Mood entry created/updated for user:', user.email);

      return NextResponse.json({
        success: true,
        data: moodEntry,
      });
    } catch (error) {
      console.error('Mood creation error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
);
