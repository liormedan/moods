import { NextRequest, NextResponse } from 'next/server';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: 'anxiety' | 'depression' | 'general' | 'addiction' | 'trauma' | 'relationships' | 'grief' | 'stress';
  type: 'public' | 'private' | 'closed';
  memberCount: number;
  isJoined: boolean;
  isModerator: boolean;
  lastActivity: string;
  tags: string[];
  meetingSchedule?: {
    day: string;
    time: string;
    frequency: 'weekly' | 'biweekly' | 'monthly';
  };
  onlineStatus: 'online' | 'offline' | 'scheduled';
  rating: number;
  language: 'hebrew' | 'english' | 'arabic';
}

// Generate demo support groups
function generateSupportGroups(): SupportGroup[] {
  return [
    {
      id: 'group-1',
      name: 'התמודדות עם חרדה יומיומית',
      description: 'קבוצה תומכת למי שמתמודד עם חרדה בחיי היום יום. נפגשים כדי לשתף כלים וטכניקות להתמודדות.',
      category: 'anxiety',
      type: 'public',
      memberCount: 127,
      isJoined: true,
      isModerator: false,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      tags: ['חרדה', 'טכניקות הרגעה', 'תמיכה הדדית'],
      meetingSchedule: {
        day: 'רביעי',
        time: '20:00',
        frequency: 'weekly'
      },
      onlineStatus: 'online',
      rating: 4.8,
      language: 'hebrew'
    },
    {
      id: 'group-2',
      name: 'דיכאון - יחד נתגבר',
      description: 'מרחב בטוח לשיתוף חוויות והתמודדות עם דיכאון. כאן אפשר להיות אמיתיים ולקבל תמיכה.',
      category: 'depression',
      type: 'private',
      memberCount: 89,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      tags: ['דיכאון', 'תמיכה רגשית', 'החלמה'],
      meetingSchedule: {
        day: 'ראשון',
        time: '19:30',
        frequency: 'weekly'
      },
      onlineStatus: 'scheduled',
      rating: 4.6,
      language: 'hebrew'
    },
    {
      id: 'group-3',
      name: 'הורים לילדים עם צרכים מיוחדים',
      description: 'קבוצת תמיכה להורים המתמודדים עם אתגרי הורות לילדים עם צרכים מיוחדים.',
      category: 'general',
      type: 'public',
      memberCount: 156,
      isJoined: true,
      isModerator: true,
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      tags: ['הורות', 'צרכים מיוחדים', 'תמיכה משפחתית'],
      meetingSchedule: {
        day: 'שני',
        time: '21:00',
        frequency: 'biweekly'
      },
      onlineStatus: 'online',
      rating: 4.9,
      language: 'hebrew'
    },
    {
      id: 'group-4',
      name: 'התמכרויות - דרך להחלמה',
      description: 'קבוצה לתמיכה בתהליך החלמה מהתמכרויות שונות. מרחב ללא שיפוטיות עם הבנה עמוקה.',
      category: 'addiction',
      type: 'closed',
      memberCount: 43,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      tags: ['התמכרות', 'החלמה', 'תמיכה'],
      meetingSchedule: {
        day: 'חמישי',
        time: '18:00',
        frequency: 'weekly'
      },
      onlineStatus: 'offline',
      rating: 4.7,
      language: 'hebrew'
    },
    {
      id: 'group-5',
      name: 'טראומה ופוסט טראומה',
      description: 'קבוצת תמיכה למי שעבר טראומה ומתמודד עם השלכותיה. עם הדרכה מקצועית.',
      category: 'trauma',
      type: 'private',
      memberCount: 67,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      tags: ['טראומה', 'PTSD', 'החלמה'],
      meetingSchedule: {
        day: 'שלישי',
        time: '19:00',
        frequency: 'weekly'
      },
      onlineStatus: 'scheduled',
      rating: 4.5,
      language: 'hebrew'
    },
    {
      id: 'group-6',
      name: 'מערכות יחסים בריאות',
      description: 'קבוצה לשיפור מערכות יחסים, תקשורת זוגית ובניית קשרים בריאים.',
      category: 'relationships',
      type: 'public',
      memberCount: 203,
      isJoined: true,
      isModerator: false,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      tags: ['זוגיות', 'תקשורת', 'מערכות יחסים'],
      meetingSchedule: {
        day: 'שישי',
        time: '20:30',
        frequency: 'weekly'
      },
      onlineStatus: 'online',
      rating: 4.4,
      language: 'hebrew'
    },
    {
      id: 'group-7',
      name: 'התמודדות עם אבל',
      description: 'מרחב תמיכה למי שמתמודד עם אובדן ואבל. יחד נעבור את התהליך הקשה הזה.',
      category: 'grief',
      type: 'public',
      memberCount: 78,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      tags: ['אבל', 'אובדן', 'תמיכה רגשית'],
      meetingSchedule: {
        day: 'רביעי',
        time: '18:30',
        frequency: 'weekly'
      },
      onlineStatus: 'offline',
      rating: 4.6,
      language: 'hebrew'
    },
    {
      id: 'group-8',
      name: 'ניהול מתח בעבודה',
      description: 'קבוצה לעובדים המתמודדים עם מתח, לחץ ושחיקה בסביבת העבודה.',
      category: 'stress',
      type: 'public',
      memberCount: 145,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      tags: ['מתח', 'עבודה', 'איזון'],
      meetingSchedule: {
        day: 'ראשון',
        time: '12:00',
        frequency: 'weekly'
      },
      onlineStatus: 'scheduled',
      rating: 4.3,
      language: 'hebrew'
    },
    {
      id: 'group-9',
      name: 'צעירים במשבר',
      description: 'קבוצת תמיכה לצעירים בגילאי 18-25 המתמודדים עם אתגרי המעבר לבגרות.',
      category: 'general',
      type: 'public',
      memberCount: 92,
      isJoined: true,
      isModerator: false,
      lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      tags: ['צעירים', 'מעבר לבגרות', 'זהות'],
      meetingSchedule: {
        day: 'חמישי',
        time: '21:00',
        frequency: 'weekly'
      },
      onlineStatus: 'online',
      rating: 4.7,
      language: 'hebrew'
    },
    {
      id: 'group-10',
      name: 'English Support Group',
      description: 'A supportive community for English speakers dealing with mental health challenges.',
      category: 'general',
      type: 'public',
      memberCount: 234,
      isJoined: false,
      isModerator: false,
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      tags: ['English', 'International', 'Support'],
      meetingSchedule: {
        day: 'Saturday',
        time: '15:00',
        frequency: 'weekly'
      },
      onlineStatus: 'scheduled',
      rating: 4.5,
      language: 'english'
    }
  ];
}

// GET /api/support-groups - Get all support groups
export async function GET() {
  try {
    const groups = generateSupportGroups();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: groups,
      metadata: {
        total: groups.length,
        joined: groups.filter(g => g.isJoined).length,
        byCategory: groups.reduce((acc, g) => {
          acc[g.category] = (acc[g.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byType: groups.reduce((acc, g) => {
          acc[g.type] = (acc[g.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        totalMembers: groups.reduce((sum, g) => sum + g.memberCount, 0),
        averageRating: groups.reduce((sum, g) => sum + g.rating, 0) / groups.length,
      },
      message: 'Support groups loaded successfully'
    });
  } catch (error) {
    console.error('Error loading support groups:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load support groups',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// POST /api/support-groups - Create new support group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newGroup: SupportGroup = {
      id: `group-${Date.now()}`,
      name: body.name || 'קבוצה חדשה',
      description: body.description || 'תיאור הקבוצה',
      category: body.category || 'general',
      type: body.type || 'public',
      memberCount: 1, // Creator is the first member
      isJoined: true, // Creator automatically joins
      isModerator: true, // Creator is the moderator
      lastActivity: new Date().toISOString(),
      tags: body.tags || [],
      meetingSchedule: body.meetingSchedule,
      onlineStatus: 'online',
      rating: 5.0, // New groups start with perfect rating
      language: body.language || 'hebrew'
    };

    console.log('New support group created:', newGroup);

    return NextResponse.json({
      success: true,
      data: newGroup,
      message: 'Support group created successfully'
    });
  } catch (error) {
    console.error('Error creating support group:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create support group',
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}