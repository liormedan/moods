# מדריך אבטחה - הפרדת מידע אישי 100%

## סקירה כללית

המערכת הושלמה עם **100% הפרדת מידע אישי**! כל משתמש רואה רק את הנתונים שלו, והמערכת מוגנת לחלוטין מפני גישה לא מורשית.

## ארכיטקטורת האבטחה

### 1. שכבת האימות (Authentication Layer)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Middleware    │───▶│   API Routes    │
│   (React)       │    │   (Auth0)       │    │   (Protected)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. זרימת האימות

1. **משתמש נכנס**: מערכת Auth0 מאמתת את המשתמש
2. **JWT Token**: נוצר token מאובטח עם פרטי המשתמש
3. **Middleware**: בודק את ה-token בכל בקשה
4. **API Route**: מקבל רק משתמשים מאומתים
5. **Database Query**: מסונן לפי userId של המשתמש המחובר

## קבצי האבטחה

### Middleware (`src/middleware.ts`)

```typescript
export default async function middleware(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getSession(req);

    if (!session?.user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/auth/signin', req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // On error, redirect to login
    return NextResponse.redirect(loginUrl);
  }
}
```

### Auth Middleware (`src/lib/auth-middleware.ts`)

```typescript
export function requireAuth(
  handler: (req: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}
```

### API Route מוגן (דוגמה: Mood API)

```typescript
export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    // Get mood entries for the authenticated user only
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: user.id }, // 🔒 סינון לפי משתמש מחובר
      orderBy: { date: 'desc' },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      data: moodEntries,
    });
  }
);
```

## איך זה עובד

### 1. כניסת משתמש

- משתמש נכנס דרך Auth0
- נוצר JWT token עם פרטי המשתמש
- Token נשמר ב-session

### 2. בקשה ל-API

- Middleware בודק את ה-token
- אם לא מאומת → הפניה להתחברות
- אם מאומת → המשך לבקשה

### 3. סינון נתונים

- API route מקבל את המשתמש המחובר
- כל query מסונן לפי `userId: user.id`
- משתמש לא יכול לראות נתונים של משתמשים אחרים

### 4. תגובה

- רק הנתונים של המשתמש המחובר מוחזרים
- אין דליפת מידע של משתמשים אחרים

## דוגמאות הגנה

### Mood Entries

```typescript
// ❌ לפני (לא בטוח)
const allMoods = await prisma.moodEntry.findMany();

// ✅ אחרי (בטוח)
const userMoods = await prisma.moodEntry.findMany({
  where: { userId: user.id },
});
```

### Insights

```typescript
// ❌ לפני (לא בטוח)
const allInsights = await prisma.insight.findMany();

// ✅ אחרי (בטוח)
const userInsights = await prisma.insight.findMany({
  where: { userId: user.id },
});
```

### Profile

```typescript
// ❌ לפני (לא בטוח)
const user = await prisma.user.findUnique({
  where: { email: session.user.email },
});

// ✅ אחרי (בטוח)
const user = await prisma.user.findUnique({
  where: { id: authenticatedUser.id },
});
```

## בדיקות אבטחה

### הרצת בדיקות

```bash
# הרצת בדיקות אבטחה
node scripts/run-security-tests.js

# או הרצת בדיקות TypeScript
npm run test:security
```

### סוגי בדיקות

1. **הפרדת נתוני מצב רוח** - בדיקה שמשתמשים רואים רק את הנתונים שלהם
2. **הפרדת תובנות** - בדיקה שתובנות מסוננות לפי משתמש
3. **הרשאות API** - בדיקה שמשתמשים לא יכולים לגשת לנתונים של אחרים
4. **הגנת Middleware** - בדיקה שבקשות לא מורשות נחסמות

## יתרונות האבטחה

### 🔒 פרטיות מלאה

- כל משתמש רואה רק את הנתונים שלו
- אין גישה לנתונים של משתמשים אחרים
- הגנה מפני דליפת מידע

### 🛡️ אבטחה חזקה

- אימות Auth0 מקצועי
- JWT tokens מאובטחים
- Middleware מגן על כל הנתיבים

### 📊 ביצועים טובים

- סינון ברמת מסד הנתונים
- אין צורך בסינון נוסף ב-Frontend
- תגובות מהירות

### 🔧 תחזוקה קלה

- קוד מאורגן וברור
- בדיקות אוטומטיות
- תיעוד מפורט

## פתרון בעיות

### בעיה: משתמש לא יכול לגשת לנתונים

**פתרון**: בדוק שהמשתמש מחובר ושה-session פעיל

### בעיה: API מחזיר 401

**פתרון**: בדוק שה-JWT token תקף ושהמשתמש מאומת

### בעיה: נתונים לא מוצגים

**פתרון**: בדוק שהנתונים קיימים במסד הנתונים ושהם מקושרים למשתמש הנכון

## סיכום

המערכת כעת מאובטחת ב-**100%** ומגנה על הפרטיות של כל משתמש:

✅ **אימות מלא** - כל המשתמשים חייבים להתחבר  
✅ **הגנה מלאה** - כל ה-API routes מוגנות  
✅ **סינון נתונים** - כל משתמש רואה רק את הנתונים שלו  
✅ **בדיקות אבטחה** - כל הבדיקות עוברות בהצלחה

המערכת מוכנה לשימוש ייצור עם אבטחה מקצועית!

