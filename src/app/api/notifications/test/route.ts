import { NextRequest, NextResponse } from 'next/server';

// POST /api/notifications/test - Send test notification
export async function POST() {
  try {
    const testNotification = {
      id: `test-${Date.now()}`,
      type: 'system' as const,
      title: '🧪 התראת בדיקה',
      message: 'זוהי התראת בדיקה שנשלחה כדי לוודא שהמערכת עובדת כראוי. אם אתה רואה את ההודעה הזו, המערכת פועלת בהצלחה!',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'medium' as const,
      category: 'test',
      actionUrl: '/dashboard/notifications',
      actionText: 'צפה בהתראות',
    };

    console.log('Test notification sent:', {
      timestamp: new Date().toISOString(),
      notification: testNotification,
      action: 'test_notification'
    });

    // Simulate notification sending delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: testNotification,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test notification',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}