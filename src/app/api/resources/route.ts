import { NextRequest, NextResponse } from 'next/server';

// Mock resources data - in a real app, this would come from a database
const resources = [
  {
    id: '1',
    title: 'מדריך להתמודדות עם חרדה יומיומית',
    description:
      'מדריך מקיף עם טכניקות מעשיות להתמודדות עם חרדה, כולל תרגילי נשימה, מדיטציה וכלים קוגניטיביים. המדריך כולל 15 פרקים עם תרגילים מעשיים.',
    type: 'article',
    category: 'anxiety',
    url: 'https://www.health.gov.il/subjects/mental_health/anxiety',
    author: 'ד"ר יעל כהן, פסיכולוגית קלינית',
    tags: ['חרדה', 'טכניקות התמודדות', 'תרגילי נשימה', 'מדיטציה', 'CBT'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-08-01',
    featured: true,
    rating: 4.8,
    views: 15420,
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'סדרת וידאו: יסודות המיינדפולנס',
    description:
      'סדרה של 10 סרטונים קצרים המסבירים ומלמדים את יסודות המיינדפולנס למתחילים. כל סרטון מתמקד בטכניקה אחרת ומלווה בתרגילים מעשיים.',
    type: 'video',
    category: 'general',
    url: 'https://www.youtube.com/playlist?list=PLmindfulness123',
    duration: '2 שעות (10 סרטונים)',
    tags: ['מיינדפולנס', 'מדיטציה', 'הרגעה', 'מתחילים', 'וידאו'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-15',
    featured: true,
    rating: 4.9,
    views: 8750,
    difficulty: 'beginner',
  },
  {
    id: '3',
    title: 'פודקאסט: בריאות הנפש בישראל',
    description:
      'פודקאסט שבועי העוסק בנושאי בריאות הנפש, עם אורחים מומחים ודיונים על נושאים אקטואליים. כל פרק מתמקד בנושא אחר ומספק כלים מעשיים.',
    type: 'podcast',
    category: 'general',
    url: 'https://open.spotify.com/show/mental-health-israel',
    duration: '45 דקות ממוצע',
    tags: ['בריאות נפש', 'ישראל', 'מומחים', 'שבועי', 'פודקאסט'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-08-10',
    featured: false,
    rating: 4.6,
    views: 12300,
    difficulty: 'intermediate',
  },
  {
    id: '4',
    title: 'אפליקציית מדיטציה מונחית - שקט',
    description:
      'אפליקציה עם עשרות מדיטציות מונחות בעברית, מתאימה למתחילים ומתקדמים. כוללת תרגילי נשימה, סקירת גוף, ומדיטציות לשינה.',
    type: 'app',
    category: 'general',
    url: 'https://play.google.com/store/apps/details?id=meditation.shaket',
    tags: ['מדיטציה', 'אפליקציה', 'מונחה', 'עברית', 'שינה'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-06-20',
    featured: false,
    rating: 4.4,
    views: 5600,
    difficulty: 'beginner',
  },
  {
    id: '5',
    title: 'קו חירום לבריאות הנפש - ער"ן',
    description:
      'קו חירום 24/7 המספק תמיכה מיידית במצבי משבר נפשי. צוות מקצועי זמין בכל שעה לשיחה אנונימית וחינמית.',
    type: 'contact',
    category: 'crisis',
    url: 'tel:1201',
    tags: ['חירום', 'משבר', 'תמיכה מיידית', '24/7', 'ער"ן'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-01-01',
    featured: true,
    rating: 4.9,
    views: 25000,
    difficulty: 'all',
  },
  {
    id: '6',
    title: 'ספר: "הדרך לרווחה נפשית"',
    description:
      'ספר מקיף המשלב תיאוריה מערבית עם חכמה מזרחית, כולל תרגילים מעשיים לשיפור הרווחה הנפשית. 300 עמודים עם 50 תרגילים מעשיים.',
    type: 'book',
    category: 'self-help',
    url: 'https://www.steimatzky.co.il/book/wellness-path',
    author: "פרופ' דוד לוי, פסיכיאטר ומחבר",
    tags: ['ספר', 'רווחה נפשית', 'תרגילים', 'תיאוריה', 'מעשי'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-05-10',
    featured: false,
    rating: 4.7,
    views: 3200,
    difficulty: 'intermediate',
  },
  {
    id: '7',
    title: 'כלי מעקב מצב רוח דיגיטלי - MoodPath',
    description:
      'כלי אינטראקטיבי למעקב אחרי מצב הרוח, זיהוי דפוסים והמלצות מותאמות אישית. כולל גרפים מתקדמים וניתוח מגמות.',
    type: 'tool',
    category: 'self-help',
    url: 'https://moodpath.com/he',
    tags: ['מעקב מצב רוח', 'דפוסים', 'המלצות', 'אינטראקטיבי', 'ניתוח'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-30',
    featured: false,
    rating: 4.3,
    views: 7800,
    difficulty: 'beginner',
  },
  {
    id: '8',
    title: 'סדנה: התמודדות עם לחץ בעבודה',
    description:
      'סדנה מעשית בת 3 שעות על טכניקות להתמודדות עם לחץ בעבודה ושיפור האיזון בין עבודה לחיים. כוללת כלים מעשיים וחומרי עזר.',
    type: 'event',
    category: 'professional',
    url: 'https://www.eventbrite.com/e/work-stress-workshop',
    duration: '3 שעות',
    tags: ['סדנה', 'לחץ בעבודה', 'איזון', 'טכניקות', 'מעשי'],
    isFree: false,
    language: 'hebrew',
    lastUpdated: '2025-08-05',
    featured: true,
    rating: 4.8,
    views: 2100,
    difficulty: 'intermediate',
  },
  {
    id: '9',
    title: 'מדריך להורים: תמיכה בילדים עם חרדה',
    description:
      'מדריך מקיף להורים על איך לזהות ולתמוך בילדים הסובלים מחרדה. כולל טכניקות תקשורת, משחקים טיפוליים ומתי לפנות לעזרה מקצועית.',
    type: 'article',
    category: 'family',
    url: 'https://www.clalit.co.il/he/your_health/family/children/anxiety-guide',
    author: 'ד"ר מירי שמש, פסיכולוגית ילדים',
    tags: ['הורים', 'ילדים', 'חרדה', 'תמיכה', 'משפחה'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-20',
    featured: false,
    rating: 4.6,
    views: 9500,
    difficulty: 'beginner',
  },
  {
    id: '10',
    title: 'אפליקציית CBT - MindShift',
    description:
      'אפליקציה המבוססת על טיפול קוגניטיבי התנהגותי (CBT) לטיפול בחרדה ודיכאון. כוללת תרגילים יומיים, מעקב מצב רוח וכלים להתמודדות.',
    type: 'app',
    category: 'anxiety',
    url: 'https://www.anxietybc.com/mindshift-app',
    tags: ['CBT', 'חרדה', 'דיכאון', 'אפליקציה', 'טיפול'],
    isFree: true,
    language: 'english',
    lastUpdated: '2025-06-15',
    featured: false,
    rating: 4.5,
    views: 4300,
    difficulty: 'intermediate',
  },
  {
    id: '11',
    title: 'קבוצת תמיכה אונליין - "יחד נתגבר"',
    description:
      'קבוצת תמיכה וירטואלית הפועלת פעמיים בשבוע, מיועדת לאנשים המתמודדים עם דיכאון וחרדה. מונחית על ידי פסיכולוג מוסמך.',
    type: 'event',
    category: 'depression',
    url: 'https://www.zoom.us/j/supportgroup123',
    duration: '90 דקות',
    tags: ['קבוצת תמיכה', 'אונליין', 'דיכאון', 'חרדה', 'קהילה'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-08-12',
    featured: true,
    rating: 4.7,
    views: 1800,
    difficulty: 'all',
  },
  {
    id: '12',
    title: 'מדריך לנוער: התמודדות עם לחץ חברתי',
    description:
      'מדריך מיוחד לבני נוער על התמודדות עם לחץ חברתי, בעיות דימוי עצמי ובניית ביטחון עצמי. כתוב בשפה נגישה ומותאמת לגילאים 13-18.',
    type: 'article',
    category: 'youth',
    url: 'https://www.youth-mental-health.org.il/social-pressure',
    author: 'צוות מרכז הנוער לבריאות הנפש',
    tags: ['נוער', 'לחץ חברתי', 'ביטחון עצמי', 'דימוי עצמי', 'מתבגרים'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-25',
    featured: false,
    rating: 4.4,
    views: 6700,
    difficulty: 'beginner',
  },
  {
    id: '13',
    title: 'פודקאסט: "נפש בריאה" - פרקים בערבית',
    description:
      'פודקאסט בערבית העוסק בנושאי בריאות הנפש בחברה הערבית. מתמקד בנושאים תרבותיים ייחודיים ומספק כלים מותאמים תרבותית.',
    type: 'podcast',
    category: 'general',
    url: 'https://open.spotify.com/show/nafas-saliha',
    duration: '30 דקות ממוצע',
    tags: ['ערבית', 'תרבות', 'בריאות נפש', 'קהילה', 'פודקאסט'],
    isFree: true,
    language: 'arabic',
    lastUpdated: '2025-08-08',
    featured: false,
    rating: 4.5,
    views: 2900,
    difficulty: 'beginner',
  },
  {
    id: '14',
    title: 'מרכז משבר טלפוני לנוער - "נטל"',
    description:
      'קו טלפון מיוחד לנוער ומתבגרים במצבי משבר. פועל בשעות אחר הצהריים והערב, מאויש בצוות מיומן בעבודה עם נוער.',
    type: 'contact',
    category: 'youth',
    url: 'tel:1800-250-250',
    tags: ['נוער', 'משבר', 'טלפון', 'תמיכה', 'מתבגרים'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-01-01',
    featured: true,
    rating: 4.8,
    views: 8900,
    difficulty: 'all',
  },
  {
    id: '15',
    title: 'כלי הערכה עצמית לדיכאון - PHQ-9',
    description:
      'שאלון מקצועי להערכה עצמית של רמת הדיכאון. כולל הסבר על התוצאות והמלצות לצעדים הבאים. מבוסס על כלי קליני מוכר.',
    type: 'tool',
    category: 'depression',
    url: 'https://www.depression-assessment.org.il/phq9',
    tags: ['הערכה עצמית', 'דיכאון', 'שאלון', 'PHQ-9', 'אבחון'],
    isFree: true,
    language: 'hebrew',
    lastUpdated: '2025-07-10',
    featured: false,
    rating: 4.2,
    views: 11200,
    difficulty: 'beginner',
  },
];

// GET /api/resources - Get resources with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const language = searchParams.get('language');
    const isFree = searchParams.get('isFree');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredResources = [...resources];

    // Apply filters
    if (category && category !== 'all') {
      filteredResources = filteredResources.filter(
        (r) => r.category === category
      );
    }

    if (type && type !== 'all') {
      filteredResources = filteredResources.filter((r) => r.type === type);
    }

    if (language && language !== 'all') {
      filteredResources = filteredResources.filter(
        (r) => r.language === language
      );
    }

    if (isFree === 'true') {
      filteredResources = filteredResources.filter((r) => r.isFree);
    }

    if (featured === 'true') {
      filteredResources = filteredResources.filter((r) => r.featured);
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredResources = filteredResources.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          (r.author && r.author.toLowerCase().includes(searchLower))
      );
    }

    // Sort by featured first, then by views
    filteredResources.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.views || 0) - (a.views || 0);
    });

    // Apply pagination
    const paginatedResources = filteredResources.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: filteredResources.length,
      byCategory: resources.reduce(
        (acc, r) => {
          acc[r.category] = (acc[r.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      byType: resources.reduce(
        (acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      byLanguage: resources.reduce(
        (acc, r) => {
          acc[r.language] = (acc[r.language] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      freeResources: resources.filter((r) => r.isFree).length,
      featuredResources: resources.filter((r) => r.featured).length,
    };

    return NextResponse.json({
      data: paginatedResources,
      pagination: {
        total: filteredResources.length,
        limit,
        offset,
        hasMore: offset + limit < filteredResources.length,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Add a new resource (for admin use)
export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd check for admin permissions here
    const body = await request.json();

    const newResource = {
      id: Date.now().toString(),
      ...body,
      lastUpdated: new Date().toISOString().split('T')[0],
      views: 0,
      rating: 0,
    };

    // In a real app, you'd save to database here
    resources.push(newResource);

    return NextResponse.json(
      {
        message: 'Resource added successfully',
        data: newResource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

