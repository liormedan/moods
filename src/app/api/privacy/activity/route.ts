import { NextRequest, NextResponse } from 'next/server';

interface LoginActivity {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  ipAddress: string;
  success: boolean;
  userAgent: string;
}

// Generate demo login activity
function generateLoginActivity(): LoginActivity[] {
  const now = new Date();
  const activities: LoginActivity[] = [];

  const devices = [
    'iPhone 15 Pro',
    'MacBook Pro',
    'Windows PC',
    'Samsung Galaxy S24',
    'iPad Air',
    'Chrome Browser',
  ];

  const locations = [
    'תל אביב, ישראל',
    'חיפה, ישראל',
    'ירושלים, ישראל',
    'באר שבע, ישראל',
    'נתניה, ישראל',
  ];

  const ips = [
    '192.168.1.100',
    '10.0.0.50',
    '172.16.0.25',
    '192.168.0.200',
    '10.1.1.75',
  ];

  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(
      now.getTime() -
        i * 24 * 60 * 60 * 1000 -
        Math.random() * 24 * 60 * 60 * 1000
    );
    const success = Math.random() > 0.1; // 90% success rate

    activities.push({
      id: `activity-${i + 1}`,
      timestamp: timestamp.toISOString(),
      device: devices[Math.floor(Math.random() * devices.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      ipAddress: ips[Math.floor(Math.random() * ips.length)],
      success,
      userAgent: success
        ? 'Mozilla/5.0 (compatible; MentalHealthApp/1.0)'
        : 'Mozilla/5.0 (suspicious; Bot/1.0)',
    });
  }

  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// GET /api/privacy/activity - Get login activity
export async function GET() {
  try {
    const loginActivity = generateLoginActivity();

    return NextResponse.json({
      success: true,
      data: loginActivity,
      metadata: {
        total: loginActivity.length,
        successful: loginActivity.filter((a) => a.success).length,
        failed: loginActivity.filter((a) => !a.success).length,
        uniqueDevices: [...new Set(loginActivity.map((a) => a.device))].length,
        uniqueLocations: [...new Set(loginActivity.map((a) => a.location))]
          .length,
        lastActivity: loginActivity[0]?.timestamp,
      },
      message: 'Login activity loaded successfully',
    });
  } catch (error) {
    console.error('Error loading login activity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load login activity',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
