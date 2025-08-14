import { NextRequest, NextResponse } from 'next/server';

interface Notification {
  id: string;
  type:
    | 'mood'
    | 'goal'
    | 'journal'
    | 'breathing'
    | 'report'
    | 'reminder'
    | 'social'
    | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  actionUrl?: string;
  actionText?: string;
}

// Generate demo notifications
function generateNotifications(): Notification[] {
  const now = new Date();
  const notifications: Notification[] = [];

  // Recent notifications (last 7 days)
  for (let i = 0; i < 15; i++) {
    const date = new Date(
      now.getTime() -
        i * 24 * 60 * 60 * 1000 +
        Math.random() * 24 * 60 * 60 * 1000
    );

    const types = [
      'mood',
      'goal',
      'journal',
      'breathing',
      'report',
      'reminder',
      'social',
      'system',
    ] as const;
    const type = types[Math.floor(Math.random() * types.length)];

    const priorities = ['low', 'medium', 'high', 'urgent'] as const;
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    let title = '';
    let message = '';
    let actionUrl = '';
    let actionText = '';

    switch (type) {
      case 'mood':
        title = 'תזכורת לתיעוד מצב רוח';
        message = 'זה הזמן לתעד את מצב הרוח שלך היום. איך אתה מרגיש?';
        actionUrl = '/dashboard/mood-entry';
        actionText = 'תעד מצב רוח';
        break;
      case 'goal':
        title = 'מטרה מתקרבת לדדליין';
        message = 'המטרה "שיפור כושר גופני" מתקרבת לתאריך היעד. איך ההתקדמות?';
        actionUrl = '/dashboard/goals';
        actionText = 'עדכן מטרה';
        break;
      case 'journal':
        title = 'הצעה לכתיבה ביומן';
        message = 'מה היה הדבר הטוב ביותר שקרה לך היום?';
        actionUrl = '/dashboard/journal';
        actionText = 'כתוב ביומן';
        break;
      case 'breathing':
        title = 'זמן לתרגיל נשימה';
        message = 'תרגיל נשימה קצר יכול לעזור לך להירגע. בואו נתחיל?';
        actionUrl = '/dashboard/breathing';
        actionText = 'התחל תרגיל';
        break;
      case 'report':
        title = 'הדוח השבועי שלך מוכן';
        message = 'הדוח השבועי שלך מציג התקדמות מרשימה במצב הרוח!';
        actionUrl = '/dashboard/progress-reports';
        actionText = 'צפה בדוח';
        break;
      case 'reminder':
        title = 'תזכורת יומית';
        message = 'זכור לשתות מים ולקחת הפסקות במהלך היום.';
        break;
      case 'social':
        title = 'עדכון מקבוצת התמיכה';
        message = 'יש הודעות חדשות בקבוצת התמיכה "התמודדות עם חרדה".';
        actionUrl = '/dashboard/support-groups';
        actionText = 'צפה בקבוצה';
        break;
      case 'system':
        title = 'עדכון מערכת';
        message = 'גרסה חדשה של האפליקציה זמינה עם תכונות משופרות.';
        break;
    }

    notifications.push({
      id: `notif-${i + 1}`,
      type,
      title,
      message,
      timestamp: date.toISOString(),
      read: Math.random() > 0.4, // 60% chance of being read
      priority,
      category: type,
      actionUrl: actionUrl || undefined,
      actionText: actionText || undefined,
    });
  }

  // Sort by timestamp (newest first)
  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// GET /api/notifications - Get all notifications
export async function GET() {
  try {
    const notifications = generateNotifications();

    return NextResponse.json({
      success: true,
      data: notifications,
      metadata: {
        total: notifications.length,
        unread: notifications.filter((n) => !n.read).length,
        byType: notifications.reduce(
          (acc, n) => {
            acc[n.type] = (acc[n.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        byPriority: notifications.reduce(
          (acc, n) => {
            acc[n.priority] = (acc[n.priority] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      message: 'Notifications loaded successfully',
    });
  } catch (error) {
    console.error('Error loading notifications:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load notifications',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create new notification (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: body.type || 'system',
      title: body.title || 'התראת בדיקה',
      message: body.message || 'זוהי התראת בדיקה שנוצרה על ידי המערכת.',
      timestamp: new Date().toISOString(),
      read: false,
      priority: body.priority || 'medium',
      category: body.category || 'test',
      actionUrl: body.actionUrl,
      actionText: body.actionText,
    };

    console.log('Test notification created:', newNotification);

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: 'Test notification created successfully',
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test notification',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
