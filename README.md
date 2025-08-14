# Mental Health Tracker 🧠💚

אפליקציית מעקב בריאות נפשית מתקדמת הבנויה עם Next.js 15, React 19, ו-TypeScript.

## ✨ תכונות עיקריות

### 📊 מעקב ובקרה
- **מעקב מצב רוח יומי** - תיעוד מצב רוח עם הערות ואנליטיקה
- **אנליטיקה מתקדמת** - גרפים אינטראקטיביים ומגמות
- **דוחות התקדמות** - ניתוח מקיף של הנתונים
- **לוח שנה אישי** - תצוגת מצב רוח ואירועים

### 🧘‍♀️ כלים טיפוליים
- **יומן אישי** - כתיבה טיפולית עם תבניות מובנות
- **תרגילי נשימה** - 6 תרגילים מתקדמים עם הדרכה
- **מטרות אישיות** - מעקב SMART goals עם אבני דרך
- **תובנות AI** - ניתוח חכם והמלצות מותאמות

### 👥 קהילה ותמיכה
- **קבוצות תמיכה** - פורומים וקהילות מקוונות
- **משאבי עזרה** - מאגר מידע מקיף
- **יצירת קשר עם מטפלים** - מערכת תיאום פגישות

### ⚙️ ניהול ואבטחה
- **פרופיל אישי** - ניהול נתונים אישיים
- **התראות חכמות** - תזכורות מותאמות אישית
- **פרטיות ואבטחה** - בקרת נתונים מתקדמת
- **הגדרות מתקדמות** - התאמה אישית מלאה

## 🚀 התחלה מהירה

### דרישות מערכת
- Node.js 18+ 
- npm או yarn
- PostgreSQL (או Prisma Cloud)

### התקנה

1. **שכפול הפרויקט**
```bash
git clone <repository-url>
cd mental-health-tracker
```

2. **התקנת תלויות**
```bash
npm install
```

3. **הגדרת משתני סביבה**
```bash
cp .env.example .env
```
ערוך את קובץ `.env` עם הנתונים שלך.

4. **אתחול מסד הנתונים**
```bash
npx prisma generate
npx prisma db push
npm run db:init
```

5. **הפעלת השרת**
```bash
npm run dev
```

6. **גישה לאפליקציה**
פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

### 🔑 כניסה לחשבון דמו
- **אימייל**: `demo@example.com`
- **סיסמה**: `demo123`

## 🏗️ מבנה הפרויקט

```
mental-health-tracker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # דפי אימות
│   │   └── dashboard/         # דפי הדאשבורד
│   ├── components/            # קומפוננטים נשמרים
│   │   ├── ui/               # קומפוננטי UI בסיסיים
│   │   └── auth/             # קומפוננטי אימות
│   ├── lib/                   # ספריות עזר
│   └── types/                 # הגדרות TypeScript
├── prisma/                    # מסד נתונים
├── scripts/                   # סקריפטי עזר
└── public/                    # קבצים סטטיים
```

## 🛠️ טכנולוגיות

### Frontend
- **Next.js 15** - React Framework עם App Router
- **React 19** - ספריית UI מתקדמת
- **TypeScript** - טיפוסים סטטיים
- **Tailwind CSS** - עיצוב מתקדם
- **Recharts** - גרפים אינטראקטיביים
- **Lucide React** - אייקונים מודרניים

### Backend
- **Next.js API Routes** - API מובנה
- **NextAuth.js** - מערכת אימות
- **Prisma** - ORM מתקדם
- **PostgreSQL** - מסד נתונים יחסי
- **bcryptjs** - הצפנת סיסמאות

### כלי פיתוח
- **ESLint** - בדיקת קוד
- **Prettier** - עיצוב קוד
- **Jest** - בדיקות יחידה
- **TypeScript** - בדיקת טיפוסים

## 📱 תכונות מתקדמות

### 🎨 עיצוב ו-UX
- **רספונסיבי מלא** - עובד על כל המכשירים
- **דארק מוד** - תמיכה בערכות נושא
- **אנימציות חלקות** - מעברים מתקדמים
- **נגישות** - תמיכה בקוראי מסך
- **RTL** - תמיכה מלאה בעברית

### 🔒 אבטחה
- **הצפנת סיסמאות** - bcrypt עם salt
- **JWT Tokens** - אימות מאובטח
- **CSRF Protection** - הגנה מפני התקפות
- **Rate Limiting** - הגבלת בקשות
- **Input Validation** - ולידציה מקיפה

### 📊 ביצועים
- **Server-Side Rendering** - טעינה מהירה
- **Static Generation** - אופטימיזציה אוטומטית
- **Image Optimization** - דחיסת תמונות
- **Code Splitting** - חלוקת קוד חכמה
- **Caching** - מטמון מתקדם

## 🧪 בדיקות

```bash
# הרצת כל הבדיקות
npm test

# בדיקות במצב watch
npm run test:watch

# בדיקת lint
npm run lint

# תיקון lint אוטומטי
npm run lint:fix
```

## 📦 פריסה

### Vercel (מומלץ)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t mental-health-tracker .
docker run -p 3000:3000 mental-health-tracker
```

## 🤝 תרומה

1. Fork הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'Add amazing feature'`)
4. Push ל-branch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📄 רישיון

הפרויקט מוגן תחת רישיון MIT. ראה `LICENSE` לפרטים נוספים.

## 🆘 תמיכה

- **תיעוד**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **דיונים**: [GitHub Discussions](link-to-discussions)
- **אימייל**: support@example.com

## 🎯 מפת דרכים

- [ ] אפליקציה מקורית (React Native)
- [ ] אינטגרציה עם Apple Health / Google Fit
- [ ] בוט צ'אט AI מתקדם
- [ ] אנליטיקה מתקדמת עם ML
- [ ] תמיכה בשפות נוספות
- [ ] PWA מתקדם עם offline support

---

**נבנה עם ❤️ בישראל**