import { NextRequest, NextResponse } from 'next/server';

interface Message {
  id: string;
  therapistId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'appointment' | 'report';
}

// Generate demo messages
function generateMessages(): Message[] {
  const now = new Date();
  const messages: Message[] = [];

  // Recent conversation with therapist
  messages.push({
    id: 'msg-1',
    therapistId: 'therapist-1',
    senderId: 'therapist-1',
    senderName: 'ד"ר שרה כהן',
    content: 'שלום! איך אתה מרגיש אחרי התרגילים שתרגלנו בפגישה הקודמת?',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    type: 'text'
  });

  messages.push({
    id: 'msg-2',
    therapistId: 'therapist-1',
    senderId: 'user',
    senderName: 'אתה',
    content: 'שלום ד"ר כהן, תרגלתי את תרגילי הנשימה כמו שהסכמנו. אני מרגיש שיפור קל, אבל עדיין יש לי רגעים קשים.',
    timestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text'
  });

  messages.push({
    id: 'msg-3',
    therapistId: 'therapist-1',
    senderId: 'therapist-1',
    senderName: 'ד"ר שרה כהן',
    content: 'זה נהדר לשמוע על השיפור! זה תהליך הדרגתי. בפגישה הבאה נעבוד על טכניקות נוספות להתמודדות עם הרגעים הקשים.',
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text'
  });

  messages.push({
    id: 'msg-4',
    therapistId: 'therapist-1',
    senderId: 'user',
    senderName: 'אתה',
    content: 'תודה רבה! אני מצרף את הדוח השבועי שלי כמו שביקשת.',
    timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text'
  });

  messages.push({
    id: 'msg-5',
    therapistId: 'therapist-1',
    senderId: 'therapist-1',
    senderName: 'ד"ר שרה כהן',
    content: 'קיבלתי את הדוח, תודה! אני רואה התקדמות יפה בנתונים. נדבר על זה בפגישה ביום רביעי.',
    timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    isRead: false,
    type: 'text'
  });

  // Older messages
  messages.push({
    id: 'msg-6',
    therapistId: 'therapist-1',
    senderId: 'therapist-1',
    senderName: 'ד"ר שרה כהן',
    content: 'שלום! רק רציתי לוודא שהקישור לפגישה המקוונת עובד אצלך. נתראה מחר ב-16:00.',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'appointment'
  });

  messages.push({
    id: 'msg-7',
    therapistId: 'therapist-1',
    senderId: 'user',
    senderName: 'אתה',
    content: 'הכל עובד מצוין, תודה! אני מצפה לפגישה.',
    timestamp: new Date(now.getTime() - 23.5 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'text'
  });

  messages.push({
    id: 'msg-8',
    therapistId: 'therapist-1',
    senderId: 'therapist-1',
    senderName: 'ד"ר שרה כהן',
    content: 'שלום! שלחתי לך חומר קריאה על טכניקות התמודדות עם חרדה. אשמח אם תעיין בו לפני הפגישה הבאה.',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    type: 'file'
  });

  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// GET /api/therapists/messages - Get messages with therapists
export async function GET() {
  try {
    const messages = generateMessages();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: messages,
      metadata: {
        total: messages.length,
        unread: messages.filter(m => !m.isRead && m.senderId !== 'user').length,
        byType: messages.reduce((acc, m) => {
          acc[m.type] = (acc[m.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        conversations: [...new Set(messages.map(m => m.therapistId))].length,
        lastMessage: messages[messages.length - 1]?.timestamp,
      },
      message: 'Messages loaded successfully'
    });
  } catch (error) {
    console.error('Error loading messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load messages',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/therapists/messages - Send new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      therapistId: body.therapistId || 'therapist-1',
      senderId: 'user',
      senderName: 'אתה',
      content: body.content || '',
      timestamp: new Date().toISOString(),
      isRead: true, // User's own message is automatically read
      type: body.type || 'text'
    };

    console.log('New message sent:', newMessage);

    return NextResponse.json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}