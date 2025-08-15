import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock insights data
    const mockInsights = [
      {
        id: '1',
        title: 'מגמת מצב רוח חיובית',
        content: 'מצב הרוח שלך השתפר ב-15% השבוע האחרון. המשך כך!',
        type: 'positive',
        date: new Date().toISOString(),
        read: false
      },
      {
        id: '2', 
        title: 'המלצה לפעילות',
        content: 'נראה שפעילות גופנית משפיעה חיובית על מצב הרוח שלך.',
        type: 'recommendation',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockInsights
    });
  } catch (error) {
    console.error('Insights fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}