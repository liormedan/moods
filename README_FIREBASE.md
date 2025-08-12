# Moods Dashboard - מעקב בריאות נפשית

אפליקציה מקיפה למעקב בריאות נפשית הבנויה עם Next.js, React, TypeScript ו-Firebase.

## סקירה כללית

Moods Dashboard היא אפליקציה מתקדמת למעקב אחר מצב בריאות נפשית, המאפשרת למשתמשים:
- תיעוד יומי של מצב רוח ופעילויות
- הגדרת מטרות אישיות ומעקב אחר התקדמות
- כתיבת יומן אישי עם תגיות
- תרגילי נשימה להרגעה
- ניתוח מגמות ותובנות
- דוחות התקדמות מפורטים
- קבוצות תמיכה וקהילה
- ניהול פרטי מטפלים ומשאבים
- לוח שנה לאירועים ותזכורות

## טכנולוגיות

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod
- **State Management**: React Hooks

## התקנה והגדרה

### דרישות מקדימות
- Node.js 18+ 
- npm או yarn
- חשבון Firebase

### שלב 1: שכפול הפרויקט
```bash
git clone <repository-url>
cd mental-health-tracker
```

### שלב 2: התקנת תלויות
```bash
npm install
```

### שלב 3: הגדרת Firebase
1. עקוב אחר המדריך המפורט ב-[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. צור פרויקט Firebase חדש
3. הפעל Authentication ו-Firestore
4. העתק את פרטי התצורה

### שלב 4: הגדרת משתני סביבה
```bash
cp env.example .env.local
# ערוך את .env.local עם הפרטים שלך מ-Firebase
```

### שלב 5: הפעלת האפליקציה
```bash
npm run dev
```

האפליקציה תיפתח בכתובת [http://localhost:3000](http://localhost:3000)

## מבנה הפרויקט

```
mental-health-tracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication APIs
│   │   │   ├── mood/          # Mood tracking APIs
│   │   │   ├── goals/         # Goals management APIs
│   │   │   ├── journal/       # Journal APIs
│   │   │   ├── insights/      # Insights APIs
│   │   │   └── ...            # Other APIs
│   │   ├── dashboard/         # Dashboard pages
│   │   └── globals.css        # Global styles
│   ├── components/             # React components
│   │   ├── ui/                # UI components (Radix UI)
│   │   ├── layout/            # Layout components
│   │   ├── mood/              # Mood-related components
│   │   └── ...                # Other components
│   ├── lib/                    # Utility libraries
│   │   ├── firebase.ts        # Firebase configuration
│   │   ├── firebase-helpers.ts # Firebase utility functions
│   │   ├── firebase-auth.ts   # Authentication helpers
│   │   └── ...                # Other utilities
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── FIREBASE_SETUP.md          # Firebase setup guide
├── env.example                # Environment variables example
└── package.json               # Project dependencies
```

## תכונות עיקריות

### 🔐 אימות משתמשים
- הרשמה והתחברות עם אימייל וסיסמה
- ניהול פרופיל משתמש
- הגדרות פרטיות ואבטחה

### 📊 מעקב מצב רוח
- תיעוד יומי של מצב רוח (1-10)
- סיווג סוגי מצב רוח
- תיעוד פעילויות ומזג אוויר
- מעקב אחר שעות שינה

### 🎯 ניהול מטרות
- הגדרת מטרות אישיות
- מעקב אחר התקדמות
- אבני דרך ומועדי יעד
- קטגוריות שונות (בריאות, קריירה, אישי)

### 📝 יומן אישי
- כתיבת רשומות אישיות
- תגיות וסיווג
- הגדרות פרטיות
- חיפוש וסינון

### 🧘 תרגילי נשימה
- טכניקות שונות (4-7-8, Box, וכו')
- מעקב אחר מצב רוח לפני ואחרי
- תזכורות ותזמון

### 📈 תובנות וניתוח
- ניתוח מגמות מצב רוח
- קורלציות בין פעילויות ומצב רוח
- דוחות התקדמות שבועיים/חודשיים
- המלצות מותאמות אישית

### 👥 קהילה ותמיכה
- קבוצות תמיכה
- שיתוף אנונימי
- משאבים ומידע
- חיבור למטפלים

## API Endpoints

### Authentication
- `POST /api/auth/register` - הרשמת משתמש חדש
- `POST /api/auth/login` - התחברות משתמש
- `POST /api/auth/logout` - התנתקות

### Mood Tracking
- `POST /api/mood/save` - שמירת רשומת מצב רוח
- `GET /api/mood/history` - היסטוריית מצב רוח

### Goals
- `POST /api/goals/save` - שמירת מטרה
- `PUT /api/goals/save` - עדכון מטרה

### Journal
- `POST /api/journal/save` - שמירת רשומת יומן
- `PUT /api/journal/save` - עדכון רשומת יומן

### And more...
ראה את תיקיית `src/app/api` לכל ה-API endpoints הזמינים.

## פיתוח

### הפעלת שרת פיתוח
```bash
npm run dev
```

### בניית הפרויקט
```bash
npm run build
```

### בדיקת קוד
```bash
npm run lint
npm run lint:fix
```

### עיצוב קוד
```bash
npm run format
npm run format:check
```

### בדיקות
```bash
npm test
npm run test:watch
```

## Firebase Emulators (לפיתוח)

לפיתוח מקומי, מומלץ להשתמש ב-Firebase Emulators:

```bash
# התקנת Firebase CLI
npm install -g firebase-tools

# התחברות
firebase login

# אתחול emulators
firebase init emulators

# הפעלת emulators
firebase emulators:start
```

## פריסה (Deployment)

### Vercel (מומלץ)
1. חבר את הפרויקט ל-GitHub
2. התחבר ל-[Vercel](https://vercel.com)
3. ייבא את הפרויקט
4. הגדר את משתני הסביבה
5. פרוס!

### Netlify
1. חבר את הפרויקט ל-GitHub
2. התחבר ל-[Netlify](https://netlify.com)
3. ייבא את הפרויקט
4. הגדר את משתני הסביבה
5. פרוס!

## אבטחה

- כל הנתונים מוגנים על ידי Firebase Security Rules
- משתמשים יכולים לגשת רק לנתונים שלהם
- אימות חובה לכל הפעולות
- הגדרות פרטיות מתקדמות

## תרומה לפרויקט

1. Fork את הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit את השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## רישיון

פרויקט זה מוגן תחת רישיון MIT. ראה קובץ [LICENSE](./LICENSE) לפרטים.

## תמיכה

אם אתה נתקל בבעיות:
1. בדוק את ה-Console של הדפדפן
2. בדוק את Firebase Console
3. פתח Issue ב-GitHub
4. פנה לקהילה

## קרדיטים

- [Next.js](https://nextjs.org/) - Framework
- [React](https://reactjs.org/) - UI Library
- [Firebase](https://firebase.google.com/) - Backend Services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Recharts](https://recharts.org/) - Charts
- [Lucide](https://lucide.dev/) - Icons

---

**הערה**: זהו פרויקט חינוכי וניסיוני. לקבלת עזרה מקצועית בבריאות נפשית, פנה לאנשי מקצוע מוסמכים.
