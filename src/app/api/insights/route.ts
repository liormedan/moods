import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserFromSession, getCurrentUserFromCookies } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching insights...');
    
    // Try to get current user from session
    let dbUser = await getCurrentUserFromSession();
    
    // If no session user, try cookies
    if (!dbUser) {
      dbUser = await getCurrentUserFromCookies(request);
    }
    
    // Fallback to your user
    if (!dbUser) {
      dbUser = await prisma.user.findUnique({
        where: { email: 'liormedan1@gmail.com' }
      });
    }
    
    // Last resort: demo user
    if (!dbUser) {
      dbUser = await prisma.user.findUnique({
        where: { email: 'demo@example.com' }
      });
    }

    console.log('👤 Using user for insights:', dbUser?.email);

    if (dbUser) {
      // Get insights for the user
      const insights = await prisma.insight.findMany({
        where: { 
          userId: dbUser.id,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      console.log('💡 Insights found:', insights.length);

      // Transform to match expected format
      const transformedInsights = insights.map(insight => ({
        id: insight.id,
        title: insight.title,
        content: insight.description,
        type: insight.type,
        date: insight.createdAt.toISOString(),
        read: insight.isRead,
        priority: insight.priority,
        actionable: insight.actionable
      }));

      return NextResponse.json({
        success: true,
        data: transformedInsights
      });
    }

    // Fallback to mock data
    const mockInsights = [
      {
        id: '1',
        title: 'מגמת מצב רוח חיובית',
        content: 'מצב הרוח שלך השתפר ב-15% השבוע האחרון. המשך כך!',
        type: 'celebration',
        date: new Date().toISOString(),
        read: false,
        priority: 'medium',
        actionable: false
      },
      {
        id: '2', 
        title: 'המלצה לפעילות',
        content: 'נראה שפעילות גופנית משפיעה חיובית על מצב הרוח שלך.',
        type: 'recommendation',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
        actionable: true
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockInsights
    });
  } catch (error) {
    console.error('❌ Insights fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}