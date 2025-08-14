import { NextRequest, NextResponse } from 'next/server';

interface NotificationSettings {
  enabled: boolean;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  types: {
    moodReminders: boolean;
    goalDeadlines: boolean;
    journalPrompts: boolean;
    breathingReminders: boolean;
    weeklyReports: boolean;
    socialUpdates: boolean;
    systemAlerts: boolean;
    achievements: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    frequency: {
      moodReminders: 'daily' | 'twice-daily' | 'weekly';
      goalCheckins: 'daily' | 'weekly' | 'monthly';
      reports: 'weekly' | 'monthly' | 'quarterly';
    };
    customTimes: {
      morningReminder: string;
      eveningReminder: string;
      weeklyReport: string;
    };
  };
  preferences: {
    sound: boolean;
    vibration: boolean;
    preview: boolean;
    groupSimilar: boolean;
    autoMarkRead: boolean;
    maxPerDay: number;
  };
}

// Default notification settings
const defaultSettings: NotificationSettings = {
  enabled: true,
  channels: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
  types: {
    moodReminders: true,
    goalDeadlines: true,
    journalPrompts: true,
    breathingReminders: true,
    weeklyReports: true,
    socialUpdates: false,
    systemAlerts: true,
    achievements: true,
  },
  schedule: {
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
    frequency: {
      moodReminders: 'daily',
      goalCheckins: 'weekly',
      reports: 'weekly',
    },
    customTimes: {
      morningReminder: '09:00',
      eveningReminder: '20:00',
      weeklyReport: '18:00',
    },
  },
  preferences: {
    sound: true,
    vibration: true,
    preview: true,
    groupSimilar: true,
    autoMarkRead: false,
    maxPerDay: 10,
  },
};

// GET /api/notifications/settings - Get notification settings
export async function GET() {
  try {
    // In a real app, fetch from database based on user ID
    // For demo, return default settings with some customizations
    const settings = {
      ...defaultSettings,
      // Add some demo customizations
      types: {
        ...defaultSettings.types,
        moodReminders: true,
        breathingReminders: true,
      },
      schedule: {
        ...defaultSettings.schedule,
        customTimes: {
          ...defaultSettings.schedule.customTimes,
          morningReminder: '08:30',
          eveningReminder: '21:00',
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Notification settings loaded successfully',
    });
  } catch (error) {
    console.error('Error loading notification settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load notification settings',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/settings - Update notification settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate settings structure (basic validation)
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid settings data',
          message: 'Settings must be a valid object',
        },
        { status: 400 }
      );
    }

    // Merge with default settings to ensure all fields are present
    const updatedSettings = {
      ...defaultSettings,
      ...body,
      channels: { ...defaultSettings.channels, ...body.channels },
      types: { ...defaultSettings.types, ...body.types },
      schedule: {
        ...defaultSettings.schedule,
        ...body.schedule,
        quietHours: {
          ...defaultSettings.schedule.quietHours,
          ...body.schedule?.quietHours,
        },
        frequency: {
          ...defaultSettings.schedule.frequency,
          ...body.schedule?.frequency,
        },
        customTimes: {
          ...defaultSettings.schedule.customTimes,
          ...body.schedule?.customTimes,
        },
      },
      preferences: { ...defaultSettings.preferences, ...body.preferences },
    };

    // In a real app, save to database
    console.log('Notification settings updated:', {
      timestamp: new Date().toISOString(),
      settings: updatedSettings,
    });

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Notification settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update notification settings',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
