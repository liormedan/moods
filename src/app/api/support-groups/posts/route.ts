import { NextRequest, NextResponse } from 'next/server';

interface Post {
  id: string;
  groupId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
  type: 'discussion' | 'question' | 'support' | 'resource' | 'announcement';
}

// Generate demo posts
function generatePosts(): Post[] {
  const posts: Post[] = [];
  const now = new Date();

  // Sample posts from different groups
  const samplePosts = [
    {
      groupId: 'group-1',
      authorName: 'שרה כהן',
      title: 'טכניקת נשימה שעזרה לי היום',
      content:
        'רציתי לשתף איתכם טכניקה פשוטה שעזרה לי להתמודד עם התקף חרדה היום בעבודה. נשימה עמוקה של 4 שניות פנימה, החזקה ל-7 שניות, ונשיפה של 8 שניות החוצה. חזרתי על זה 5 פעמים והרגשתי הרבה יותר רגועה.',
      type: 'support' as const,
      tags: ['נשימה', 'חרדה', 'טכניקות'],
      likes: 23,
      replies: 8,
      isLiked: true,
      isPinned: false,
    },
    {
      groupId: 'group-2',
      authorName: 'דוד לוי',
      title: 'איך להתמודד עם ימים קשים?',
      content:
        'יש לי תקופה קשה במיוחד השבוע. הכל נראה אפור ואין לי מוטיבציה לכלום. איך אתם מתמודדים עם הימים האלה? יש לכם טיפים שעוזרים לכם לעבור את זה?',
      type: 'question' as const,
      tags: ['דיכאון', 'מוטיבציה', 'עזרה'],
      likes: 15,
      replies: 12,
      isLiked: false,
      isPinned: false,
    },
    {
      groupId: 'group-3',
      authorName: 'מיכל אברהם',
      title: 'משאבים מעולים להורים',
      content:
        'מצאתי כמה משאבים מצוינים שעזרו לי להבין טוב יותר את הצרכים של הילד שלי. יש כאן קישורים לספרים, מאמרים ואפילו אפליקציות שיכולות לעזור. אשמח לשתף עם כולם.',
      type: 'resource' as const,
      tags: ['משאבים', 'הורות', 'כלים'],
      likes: 31,
      replies: 6,
      isLiked: true,
      isPinned: true,
    },
    {
      groupId: 'group-6',
      title: 'תקשורת זוגית - השיעור שלמדתי',
      authorName: 'רונית גולד',
      content:
        'אחרי שנים של ויכוחים עם הבעל שלי, למדתי משהו חשוב - להקשיב באמת לפני שאני עונה. זה נשמע פשוט אבל זה שינה הכל. במקום להגיב מיד, אני נושמת עמוק ומנסה להבין מה הוא באמת מרגיש.',
      type: 'discussion' as const,
      tags: ['תקשורת', 'זוגיות', 'הקשבה'],
      likes: 18,
      replies: 9,
      isLiked: false,
      isPinned: false,
    },
    {
      groupId: 'group-9',
      authorName: 'יונתן שמיר',
      title: 'הלחץ של בחירת קריירה',
      content:
        'אני בן 22 ועדיין לא יודע מה אני רוצה לעשות בחיים. כל החברים שלי כבר יודעים בדיוק איפה הם הולכים ואני מרגיש אבוד. יש עוד מישהו שמרגיש ככה? איך אתם מתמודדים עם הלחץ הזה?',
      type: 'question' as const,
      tags: ['קריירה', 'צעירים', 'לחץ'],
      likes: 27,
      replies: 15,
      isLiked: true,
      isPinned: false,
    },
    {
      groupId: 'group-1',
      authorName: 'נועה רוזן',
      title: 'הודעה חשובה - כללי הקבוצה',
      content:
        'שלום לכולם! רציתי להזכיר את כללי הקבוצה שלנו: 1. כבוד הדדי תמיד 2. שמירה על פרטיות 3. אין עצות רפואיות 4. תמיכה ללא שיפוטיות. בואו נשמור על המרחב הבטוח שלנו יחד.',
      type: 'announcement' as const,
      tags: ['כללים', 'קהילה', 'כבוד'],
      likes: 45,
      replies: 3,
      isLiked: false,
      isPinned: true,
    },
    {
      groupId: 'group-8',
      authorName: 'אלון כץ',
      title: 'איזון עבודה-חיים בהיי-טק',
      content:
        'עובד בחברת הייטק כבר 5 שנים והלחץ הולך וגובר. השעות הארוכות משפיעות על הבריאות הנפשית שלי. מישהו מכם מצא דרכים יעילות לשמור על איזון? אשמח לשמוע על החוויות שלכם.',
      type: 'discussion' as const,
      tags: ['עבודה', 'איזון', 'הייטק'],
      likes: 22,
      replies: 11,
      isLiked: false,
      isPinned: false,
    },
    {
      groupId: 'group-4',
      authorName: 'אנונימי',
      title: 'יום 30 נקי',
      content:
        'היום מלאו לי 30 יום נקיים מההתמכרות. זה לא היה קל, היו ימים שרציתי לוותר, אבל התמיכה שלכם עזרה לי להמשיך. תודה לכל אחד ואחת מכם על החום והאהבה.',
      type: 'support' as const,
      tags: ['החלמה', 'הישג', 'תמיכה'],
      likes: 67,
      replies: 24,
      isLiked: true,
      isPinned: false,
    },
  ];

  samplePosts.forEach((post, index) => {
    const timestamp = new Date(
      now.getTime() - (index * 2 + Math.random() * 24) * 60 * 60 * 1000
    );

    posts.push({
      id: `post-${index + 1}`,
      ...post,
      timestamp: timestamp.toISOString(),
    });
  });

  return posts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// GET /api/support-groups/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    let posts = generatePosts();

    // Filter by group if specified
    if (groupId) {
      posts = posts.filter((post) => post.groupId === groupId);
    }

    // Filter by type if specified
    if (type && type !== 'all') {
      posts = posts.filter((post) => post.type === type);
    }

    // Limit results
    posts = posts.slice(0, limit);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({
      success: true,
      data: posts,
      metadata: {
        total: posts.length,
        byType: posts.reduce(
          (acc, p) => {
            acc[p.type] = (acc[p.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
        totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
        totalReplies: posts.reduce((sum, p) => sum + p.replies, 0),
        pinnedPosts: posts.filter((p) => p.isPinned).length,
      },
      message: 'Posts loaded successfully',
    });
  } catch (error) {
    console.error('Error loading posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load posts',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST /api/support-groups/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPost: Post = {
      id: `post-${Date.now()}`,
      groupId: body.groupId || 'group-1',
      authorName: body.authorName || 'משתמש אנונימי',
      title: body.title || 'פוסט חדש',
      content: body.content || 'תוכן הפוסט',
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
      isLiked: false,
      isPinned: false,
      tags: body.tags || [],
      type: body.type || 'discussion',
    };

    console.log('New post created:', newPost);

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully',
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
