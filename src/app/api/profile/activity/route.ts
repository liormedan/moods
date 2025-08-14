import { NextRequest, NextResponse } from 'next/server';

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type:
    | 'mood'
    | 'journal'
    | 'breathing'
    | 'goal'
    | 'login'
    | 'settings'
    | 'profile'
    | 'export';
  ipAddress?: string;
  device?: string;
  location?: string;
}

// Mock activity logs data
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'התחברות למערכת',
    description: 'התחברות מוצלחת מהדפדפן Chrome',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: 'login',
    ipAddress: '192.168.1.100',
    device: 'Chrome 120.0 on Windows 11',
    location: 'תל אביב, ישראל',
  },
  {
    id: '2',
    action: 'עדכון מצב רוח',
    description: 'הוספת רשומת מצב רוח חדשה (דירוג: 7)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: 'mood',
  },
  {
    id: '3',
    action: 'כתיבת יומן',
    description: 'הוספת רשומה חדשה ליומן: "רפלקציה על היום"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    type: 'journal',
  },
  {
    id: '4',
    action: 'תרגיל נשימה',
    description: 'השלמת תרגיל נשימה 4-7-8 (5 מחזורים)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    type: 'breathing',
  },
  {
    id: '5',
    action: 'עדכון מטרה',
    description: 'עדכון התקדמות במטרה: "תרגול מדיטציה יומי" (80%)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'goal',
  },
  {
    id: '6',
    action: 'עדכון פרופיל',
    description: 'עדכון פרטי פרופיל אישי',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    type: 'profile',
  },
  {
    id: '7',
    action: 'ייצוא נתונים',
    description: 'ייצוא נתוני מצב רוח לקובץ CSV',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    type: 'export',
  },
  {
    id: '8',
    action: 'עדכון הגדרות',
    description: 'שינוי הגדרות התראות והודעות',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    type: 'settings',
  },
  {
    id: '9',
    action: 'התחברות למערכת',
    description: 'התחברות מוצלחת מהטלפון הנייד',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    type: 'login',
    ipAddress: '10.0.0.50',
    device: 'Safari on iPhone 15',
    location: 'חיפה, ישראל',
  },
  {
    id: '10',
    action: 'יצירת מטרה חדשה',
    description: 'הוספת מטרה חדשה: "שיפור איכות השינה"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    type: 'goal',
  },
  {
    id: '11',
    action: 'כתיבת יומן',
    description: 'הוספת רשומה ליומן עם תבנית "הכרת תודה"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
    type: 'journal',
  },
  {
    id: '12',
    action: 'תרגיל נשימה',
    description: 'השלמת תרגיל נשימת קופסה (10 מחזורים)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    type: 'breathing',
  },
];

// GET /api/profile/activity - Get user activity logs
export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const days = parseInt(searchParams.get('days') || '30');

    // Filter logs
    let filteredLogs = [...mockActivityLogs];

    // Filter by type
    if (type && type !== 'all') {
      filteredLogs = filteredLogs.filter((log) => log.type === type);
    }

    // Filter by date range
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    filteredLogs = filteredLogs.filter(
      (log) => new Date(log.timestamp) >= cutoffDate
    );

    // Sort by timestamp (newest first)
    filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: filteredLogs.length,
      byType: filteredLogs.reduce(
        (acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      uniqueDevices: [
        ...new Set(filteredLogs.map((log) => log.device).filter(Boolean)),
      ].length,
      uniqueLocations: [
        ...new Set(filteredLogs.map((log) => log.location).filter(Boolean)),
      ].length,
      lastActivity: filteredLogs[0]?.timestamp,
    };

    return NextResponse.json({
      data: paginatedLogs,
      pagination: {
        total: filteredLogs.length,
        limit,
        offset,
        hasMore: offset + limit < filteredLogs.length,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile/activity - Log new activity
export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const body = await request.json();
    const { action, description, type } = body;

    if (!action || !description || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new activity log
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      description,
      type,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      device: request.headers.get('user-agent') || 'unknown',
    };

    // In a real app, save to database
    // await prisma.activityLog.create({
    //   data: {
    //     userId,
    //     ...newLog,
    //   },
    // });

    // For demo, add to mock data
    mockActivityLogs.unshift(newLog);

    return NextResponse.json(
      {
        message: 'Activity logged successfully',
        data: newLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/activity - Clear activity logs
export async function DELETE(request: NextRequest) {
  try {
    // Temporarily disabled authentication for demo
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Mock user ID for demo
    const userId = 'demo-user';

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '0');

    if (days > 0) {
      // Delete logs older than specified days
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // In a real app, delete from database
      // await prisma.activityLog.deleteMany({
      //   where: {
      //     userId,
      //     timestamp: { lt: cutoffDate },
      //   },
      // });

      // For demo, filter mock data
      const initialCount = mockActivityLogs.length;
      mockActivityLogs.splice(
        0,
        mockActivityLogs.length,
        ...mockActivityLogs.filter(
          (log) => new Date(log.timestamp) >= cutoffDate
        )
      );
      const deletedCount = initialCount - mockActivityLogs.length;

      return NextResponse.json({
        message: `Deleted ${deletedCount} activity logs older than ${days} days`,
        deletedCount,
      });
    } else {
      // Delete all logs
      // In a real app, delete from database
      // await prisma.activityLog.deleteMany({
      //   where: { userId },
      // });

      // For demo, clear mock data
      const deletedCount = mockActivityLogs.length;
      mockActivityLogs.splice(0, mockActivityLogs.length);

      return NextResponse.json({
        message: 'All activity logs deleted',
        deletedCount,
      });
    }
  } catch (error) {
    console.error('Error deleting activity logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

