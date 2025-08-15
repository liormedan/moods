import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Fetching mood stats...');
    
    // Try to get real data from database
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    });

    console.log('👤 Demo user found:', !!demoUser);

    if (demoUser) {
      // Get mood entries for calculations
      const moodEntries = await prisma.moodEntry.findMany({
        where: { userId: demoUser.id },
        orderBy: { date: 'desc' }
      });

      console.log('📊 Mood entries found:', moodEntries.length);

      const totalEntries = moodEntries.length;
      const averageMood = totalEntries > 0 
        ? moodEntries.reduce((sum, entry) => sum + entry.moodValue, 0) / totalEntries 
        : 0;

      // Calculate streak (consecutive days with entries)
      let streakDays = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        const hasEntry = moodEntries.some(entry => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === checkDate.getTime();
        });
        
        if (hasEntry) {
          streakDays++;
        } else {
          break;
        }
      }

      // Calculate mood trend (last 7 days vs previous 7 days)
      const last7Days = moodEntries.slice(0, 7);
      const previous7Days = moodEntries.slice(7, 14);
      
      let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (last7Days.length > 0 && previous7Days.length > 0) {
        const recentAvg = last7Days.reduce((sum, entry) => sum + entry.moodValue, 0) / last7Days.length;
        const previousAvg = previous7Days.reduce((sum, entry) => sum + entry.moodValue, 0) / previous7Days.length;
        
        if (recentAvg > previousAvg + 0.5) moodTrend = 'improving';
        else if (recentAvg < previousAvg - 0.5) moodTrend = 'declining';
      }

      // Get recent mood
      const recentMood = moodEntries.length > 0 ? {
        date: moodEntries[0].date.toISOString(),
        mood: moodEntries[0].moodValue,
        note: moodEntries[0].notes || ''
      } : null;

      // Generate insights
      const insights = [];
      if (moodTrend === 'improving') {
        insights.push({ id: '1', text: 'המצב רוח שלך משתפר השבוע! 📈' });
      } else if (moodTrend === 'declining') {
        insights.push({ id: '1', text: 'שים לב לירידה במצב הרוח. אולי כדאי לנסות פעילות מרגיעה? 🧘‍♀️' });
      }
      
      if (streakDays >= 7) {
        insights.push({ id: '2', text: `כל הכבוד! ${streakDays} ימים רצופים של מעקב! 🔥` });
      }
      
      if (averageMood >= 8) {
        insights.push({ id: '3', text: 'המצב רוח הכללי שלך מעולה! המשך כך! ✨' });
      }

      return NextResponse.json({
        success: true,
        data: {
          totalEntries,
          averageMood: Math.round(averageMood * 10) / 10,
          streakDays,
          moodTrend,
          weeklyAverages: [], // TODO: Implement weekly averages calculation
          recentMood,
          insights
        }
      });
    }

    // Fallback to mock data if no database data
    return NextResponse.json({
      success: true,
      data: {
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
          note: 'מרגיש טוב היום!'
        },
        insights: [
          { id: '1', text: 'המצב רוח שלך משתפר השבוע! 📈' },
          { id: '2', text: 'כל הכבוד! 5 ימים רצופים של מעקב! 🔥' }
        ]
      }
    });
  } catch (error) {
    console.error('❌ Mood stats error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}