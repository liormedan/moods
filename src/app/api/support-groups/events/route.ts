import { NextRequest, NextResponse } from 'next/server';

interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'meeting' | 'workshop' | 'webinar' | 'social';
  isOnline: boolean;
  location?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isRegistered: boolean;
}

// Generate demo events
function generateEvents(): Event[] {
  const now = new Date();
  const events: Event[] = [];

  // Sample events for the next few weeks
  const sampleEvents = [
    {
      groupId: 'group-1',
      title: 'סדנת טכניקות הרגעה',
      description: 'נלמד טכניקות נשימה ומדיטציה להתמודדות עם חרדה יומיומית',
      type: 'workshop' as const,
      duration: 90,
      isOnline: true,
      maxParticipants: 25,
      currentParticipants: 18,
      isRegistered: true
    },
    {
      groupId: 'group-2',
      title: 'מפגש תמיכה שבועי',
      description: 'המפגש השבועי שלנו לשיתוף חוויות ותמיכה הדדית',
      type: 'meeting' as const,
      duration: 60,
      isOnline: true,
      maxParticipants: undefined,
      currentParticipants: 23,
      isRegistered: false
    },
    {
      groupId: 'group-3',
      title: 'הרצאה: זכויות הורים',
      description: 'הרצאה מקצועית על זכויות הורים לילדים עם צרכים מיוחדים',
      type: 'webinar' as const,
      duration: 120,
      isOnline: true,
      maxParticipants: 100,
      currentParticipants: 67,
      isRegistered: true
    },
    {
      groupId: 'group-6',
      title: 'ערב זוגות',
      description: 'ערב חברתי לזוגות עם פעילויות לחיזוק הקשר',
      type: 'social' as const,
      duration: 180,
      isOnline: false,
      location: 'מרכז קהילתי, תל אביב',
      maxParticipants: 20,
      currentParticipants: 14,
      isRegistered: false
    },
    {
      groupId: 'group-8',
      title: 'סדנת ניהול זמן ומתח',
      description: 'כלים מעשיים לניהול זמן יעיל והפחתת מתח בעבודה',
      type: 'workshop' as const,
      duration: 120,
      isOnline: true,
      maxParticipants: 30,
      currentParticipants: 22,
      isRegistered: false
    },
    {
      groupId: 'group-9',
      title: 'מפגש צעירים - בניית זהות',
      description: 'דיון פתוח על אתגרי בניית זהות אישית ומקצועית',
      type: 'meeting' as const,
      duration: 75,
      isOnline: true,
      maxParticipants: undefined,
      currentParticipants: 15,
      isRegistered: true
    },
    {
      groupId: 'group-1',
      title: 'מדיטציה קבוצתית',
      description: 'סשן מדיטציה מונחה לשקט הנפש והרגעה',
      type: 'meeting' as const,
      duration: 45,
      isOnline: true,
      maxParticipants: 50,
      currentParticipants: 31,
      isRegistered: false
    },
    {
      groupId: 'group-4',
      title: 'סדנת מניעת נפילות',
      description: 'כלים והתמודדות עם רגעי חולשה בתהליך ההחלמה',
      type: 'workshop' as const,
      duration: 90,
      isOnline: true,
      maxParticipants: 15,
      currentParticipants: 12,
      isRegistered: false
    }
  ];

  sampleEvents.forEach((event, index) => {
    // Generate dates for the next 2 weeks
    const daysFromNow = Math.floor(Math.random() * 14) + 1;
    const eventDate = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    
    // Generate random time between 18:00-21:00
    const hours = 18 + Math.floor(Math.random() * 3);
    const minutes = Math.random() > 0.5 ? 0 : 30;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    events.push({
      id: `event-${index + 1}`,
      ...event,
      date: eventDate.toISOString().split('T')[0],
      time: timeString,
    });
  });

  return events.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
}

// GET /api/support-groups/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming') === 'true';

    let events = generateEvents();

    // Filter by group if specified
    if (groupId) {
      events = events.filter(event => event.groupId === groupId);
    }

    // Filter by type if specified
    if (type && type !== 'all') {
      events = events.filter(event => event.type === type);
    }

    // Filter upcoming events only
    if (upcoming) {
      const now = new Date();
      events = events.filter(event => new Date(event.date + ' ' + event.time) > now);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: events,
      metadata: {
        total: events.length,
        byType: events.reduce((acc, e) => {
          acc[e.type] = (acc[e.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        registered: events.filter(e => e.isRegistered).length,
        totalParticipants: events.reduce((sum, e) => sum + e.currentParticipants, 0),
        onlineEvents: events.filter(e => e.isOnline).length,
      },
      message: 'Events loaded successfully'
    });
  } catch (error) {
    console.error('Error loading events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load events',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/support-groups/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      groupId: body.groupId || 'group-1',
      title: body.title || 'אירוע חדש',
      description: body.description || 'תיאור האירוע',
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '20:00',
      duration: body.duration || 60,
      type: body.type || 'meeting',
      isOnline: body.isOnline !== false, // Default to online
      location: body.location,
      maxParticipants: body.maxParticipants,
      currentParticipants: 0,
      isRegistered: false
    };

    console.log('New event created:', newEvent);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create event',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}