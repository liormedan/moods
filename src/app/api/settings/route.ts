import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Default settings (in a real app, these would be stored in a UserSettings table)
    const defaultSettings = {
      notifications: {
        email: true,
        push: false,
        dailyReminder: true,
        weeklyReport: true,
      },
      privacy: {
        shareData: false,
        publicProfile: false,
      },
      preferences: {
        theme: 'light',
        language: 'he',
        timezone: 'Asia/Jerusalem',
      },
    };

    return NextResponse.json({
      success: true,
      data: defaultSettings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // In a real app, you'd save settings to a UserSettings table
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      data: body,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
