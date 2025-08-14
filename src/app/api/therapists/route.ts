import { NextRequest, NextResponse } from 'next/server';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  location: string;
  isOnline: boolean;
  priceRange: string;
  availability: string[];
  bio: string;
  education: string[];
  certifications: string[];
  profileImage?: string;
  isVerified: boolean;
  responseTime: string;
}

// Generate demo therapists
function generateTherapists(): Therapist[] {
  return [
    {
      id: 'therapist-1',
      name: 'ד"ר שרה כהן',
      title: 'פסיכולוגית קלינית',
      specializations: ['חרדה', 'דיכאון', 'טראומה', 'CBT'],
      experience: 12,
      rating: 4.9,
      reviewCount: 127,
      languages: ['עברית', 'אנגלית'],
      location: 'תל אביב',
      isOnline: true,
      priceRange: '₪300-400',
      availability: ['ראשון', 'שלישי', 'חמישי'],
      bio: 'ד"ר שרה כהן היא פסיכולוגית קלינית מנוסה עם התמחות בטיפול בחרדה ודיכאון. היא מתמחה בטיפול קוגניטיבי התנהגותי (CBT) ובגישות טיפוליות מתקדמות. שרה מאמינה בגישה חמה ותומכת המותאמת לכל מטופל.',
      education: [
        'דוקטורט בפסיכולוגיה קלינית - אוניברסיטת תל אביב',
        'מגיסטר בפסיכולוגיה - האוניברסיטה העברית',
        'תואר ראשון בפסיכולוגיה - אוניברסיטת בר אילן',
      ],
      certifications: [
        'רישיון פסיכולוג קליני - משרד הבריאות',
        'הסמכה בטיפול CBT - המכון הישראלי לטיפול קוגניטיבי',
        'הסמכה בטיפול בטראומה - EMDR International',
      ],
      isVerified: true,
      responseTime: 'תוך 2 שעות',
    },
    {
      id: 'therapist-2',
      name: 'פרופ׳ דוד לוי',
      title: 'פסיכיאטר',
      specializations: ['דיכאון', 'הפרעות חרדה', 'הפרעות מצב רוח'],
      experience: 18,
      rating: 4.8,
      reviewCount: 89,
      languages: ['עברית', 'אנגלית', 'רוסית'],
      location: 'ירושלים',
      isOnline: true,
      priceRange: '₪400-500',
      availability: ['שני', 'רביעי', 'שישי'],
      bio: 'פרופ׳ דוד לוי הוא פסיכיאטר בכיר עם ניסיון רב בטיפול בהפרעות מצב רוח. הוא משלב גישות טיפוליות מתקדמות עם טיפול תרופתי כשנדרש. דוד ידוע בגישתו המקצועית והאמפתית.',
      education: [
        'התמחות בפסיכיאטריה - בית חולים הדסה',
        'דוקטורט לרפואה - האוניברסיטה העברית',
        'התמחות בנוירולוגיה - בית חולים שיבא',
      ],
      certifications: [
        'רישיון רופא מומחה בפסיכיאטריה - משרד הבריאות',
        'הסמכה בפסיכופרמקולוגיה - האגודה הישראלית לפסיכיאטריה',
        'הסמכה בטיפול בהפרעות דו-קוטביות',
      ],
      isVerified: true,
      responseTime: 'תוך 4 שעות',
    },
    {
      id: 'therapist-3',
      name: 'מיכל אברהם',
      title: 'עובדת סוציאלית קלינית',
      specializations: ['זוגיות', 'משפחה', 'התמכרויות'],
      experience: 8,
      rating: 4.7,
      reviewCount: 156,
      languages: ['עברית', 'אנגלית'],
      location: 'חיפה',
      isOnline: true,
      priceRange: '₪250-350',
      availability: ['ראשון', 'שני', 'רביעי', 'חמישי'],
      bio: 'מיכל אברהם היא עובדת סוציאלית קלינית המתמחה בטיפול זוגי ומשפחתי. היא מביאה גישה חמה ומעשית לטיפול, עם דגש על חיזוק הקשרים והתקשורת. מיכל עובדת גם עם אנשים המתמודדים עם התמכרויות.',
      education: [
        'מגיסטר בעבודה סוציאלית קלינית - אוניברסיטת חיפה',
        'תואר ראשון בעבודה סוציאלית - האוניברסיטה העברית',
        'קורס התמחות בטיפול משפחתי - המכון לטיפול משפחתי',
      ],
      certifications: [
        'רישיון עובדת סוציאלית קלינית - משרד הרווחה',
        'הסמכה בטיפול זוגי ומשפחתי - האגודה הישראלית לטיפול משפחתי',
        'הסמכה בטיפול בהתמכרויות - המרכז הלאומי להתמכרויות',
      ],
      isVerified: true,
      responseTime: 'תוך שעה',
    },
    {
      id: 'therapist-4',
      name: 'ד"ר רונית גולד',
      title: 'פסיכולוגית התפתחותית',
      specializations: ['ילדים ונוער', 'ADHD', 'קשיי למידה'],
      experience: 15,
      rating: 4.9,
      reviewCount: 203,
      languages: ['עברית', 'אנגלית', 'צרפתית'],
      location: 'רמת גן',
      isOnline: true,
      priceRange: '₪350-450',
      availability: ['שני', 'שלישי', 'רביעי'],
      bio: 'ד"ר רונית גולד מתמחה בטיפול בילדים ובני נוער. היא עובדת עם ילדים עם ADHD, קשיי למידה והפרעות התפתחותיות. רונית משלבת משחק טיפולי עם גישות מבוססות מחקר.',
      education: [
        'דוקטורט בפסיכולוגיה התפתחותית - אוניברסיטת תל אביב',
        'מגיסטר בפסיכולוגיה חינוכית - אוניברסיטת בר אילן',
        'תואר ראשון בחינוך מיוחד - האוניברסיטה העברית',
      ],
      certifications: [
        'רישיון פסיכולוג חינוכי - משרד החינוך',
        'הסמכה בטיפול ב-ADHD - המרכז הלאומי ל-ADHD',
        'הסמכה במשחק טיפולי - האגודה הישראלית למשחק טיפולי',
      ],
      isVerified: true,
      responseTime: 'תוך 3 שעות',
    },
    {
      id: 'therapist-5',
      name: 'יוסי שמיר',
      title: 'יועץ זוגי ומשפחתי',
      specializations: ['זוגיות', 'גירושין', 'משפחות מעורבות'],
      experience: 10,
      rating: 4.6,
      reviewCount: 78,
      languages: ['עברית', 'אנגלית'],
      location: 'פתח תקווה',
      isOnline: false,
      priceRange: '₪280-380',
      availability: ['ראשון', 'שלישי', 'חמישי', 'שבת'],
      bio: 'יוסי שמיר הוא יועץ זוגי ומשפחתי מנוסה. הוא מתמחה בליווי זוגות בתהליכי משבר, גירושין ובניית משפחות מעורבות. יוסי מביא גישה מעשית ותומכת לטיפול.',
      education: [
        'מגיסטר ביעוץ זוגי ומשפחתי - אוניברסיטת חיפה',
        'תואר ראשון בפסיכולוגיה - המכללה האקדמית תל אביב-יפו',
        'קורס מתקדם בגישור משפחתי - בית הדין הרבני',
      ],
      certifications: [
        'רישיון יועץ זוגי ומשפחתי - משרד הרווחה',
        'הסמכה בגישור משפחתי - לשכת עורכי הדין',
        'הסמכה בטיפול בגירושין - המכון לגישור משפחתי',
      ],
      isVerified: true,
      responseTime: 'תוך 6 שעות',
    },
    {
      id: 'therapist-6',
      name: 'ד"ר נועה רוזן',
      title: 'פסיכולוגית קלינית',
      specializations: ['טראומה', 'PTSD', 'חרדה חברתית'],
      experience: 14,
      rating: 4.8,
      reviewCount: 94,
      languages: ['עברית', 'אנגלית', 'ערבית'],
      location: 'באר שבע',
      isOnline: true,
      priceRange: '₪320-420',
      availability: ['שני', 'רביעי', 'שישי'],
      bio: 'ד"ר נועה רוזן מתמחה בטיפול בטראומה ו-PTSD. היא משתמשת בגישות טיפוליות מתקדמות כמו EMDR וטיפול בחשיפה. נועה עובדת עם חיילים, נפגעי תאונות ואנשים שעברו טראומות שונות.',
      education: [
        'דוקטורט בפסיכולוגיה קלינית - אוניברסיטת בן גוריון',
        'מגיסטר בפסיכולוגיה - אוניברסיטת אריאל',
        'תואר ראשון בפסיכולוגיה - המכללה האקדמית ספיר',
      ],
      certifications: [
        'רישיון פסיכולוג קליני - משרד הבריאות',
        'הסמכה ב-EMDR - EMDR International Association',
        'הסמכה בטיפול ב-PTSD - המרכז הלאומי לטראומה',
      ],
      isVerified: true,
      responseTime: 'תוך שעתיים',
    },
  ];
}

// GET /api/therapists - Get all therapists
export async function GET() {
  try {
    const therapists = generateTherapists();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: therapists,
      metadata: {
        total: therapists.length,
        verified: therapists.filter((t) => t.isVerified).length,
        onlineAvailable: therapists.filter((t) => t.isOnline).length,
        averageRating:
          therapists.reduce((sum, t) => sum + t.rating, 0) / therapists.length,
        specializations: [
          ...new Set(therapists.flatMap((t) => t.specializations)),
        ],
        locations: [...new Set(therapists.map((t) => t.location))],
        languages: [...new Set(therapists.flatMap((t) => t.languages))],
      },
      message: 'Therapists loaded successfully',
    });
  } catch (error) {
    console.error('Error loading therapists:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load therapists',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
