# 🗄️ הגדרת מסד נתונים PostgreSQL

## אפשרויות התקנה

### 🐳 אפשרות 1: Docker (מומלץ - הכי מהיר)

```bash
# הפעל PostgreSQL עם Docker
docker-compose up -d postgres

# או ללא docker-compose:
docker run --name mental-health-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mental_health_tracker \
  -p 5432:5432 \
  -d postgres:15
```

### 💻 אפשרות 2: התקנה מקומית

1. הורד PostgreSQL: https://www.postgresql.org/download/
2. התקן עם הגדרות ברירת מחדל
3. צור מסד נתונים:
```sql
CREATE DATABASE mental_health_tracker;
```

### ☁️ אפשרות 3: שירותי ענן (חינם)

**Supabase:**
1. הירשם: https://supabase.com
2. צור פרויקט חדש
3. העתק את DATABASE_URL

**Railway:**
1. הירשם: https://railway.app  
2. צור PostgreSQL database
3. העתק את DATABASE_URL

## הגדרת המערכת

### 1. עדכן משתני סביבה
עדכן את `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mental_health_tracker"
```

### 2. הפעל את הסקריפט האוטומטי
```bash
# Windows
setup-database.bat

# או ידנית:
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

### 3. בדוק שהכל עובד
```bash
# פתח Prisma Studio
npm run db:studio

# הפעל את השרת
npm run dev
```

## פקודות שימושיות

```bash
# צפייה במסד הנתונים
npm run db:studio

# איפוס מסד נתונים
npm run db:reset

# יצירת migration חדש
npx prisma migrate dev --name "description"

# עדכון הקליינט לאחר שינויים בסכמה
npm run db:generate
```

## פתרון בעיות

### שגיאת חיבור
- ודא ש-PostgreSQL רץ על פורט 5432
- בדוק את הסיסמה ב-DATABASE_URL
- ודא שמסד הנתונים קיים

### Docker לא עובד
```bash
# בדוק שDocker רץ
docker --version

# הפעל מחדש
docker-compose down
docker-compose up -d postgres
```

### שגיאות Prisma
```bash
# נקה ויצור מחדש
npx prisma migrate reset --force
npx prisma generate
npm run db:seed
```

## מבנה מסד הנתונים

המערכת כוללת:
- **Users** - משתמשים
- **MoodEntries** - רשומות מצב רוח
- **Insights** - תובנות אישיות  
- **Goals** - מטרות אישיות
- **JournalEntries** - רשומות יומן
- **BreathingSessions** - סשני נשימה

## נתונים לדמו

המערכת מגיעה עם נתוני דמו:
- משתמש: `demo@example.com`
- 14 ימים של רשומות מצב רוח
- תובנות ומטרות לדוגמה

## הצעדים הבאים

לאחר הגדרת מסד הנתונים:
1. ✅ הפעל את השרת: `npm run dev`
2. ✅ היכנס עם חשבון Auth0
3. ✅ בדוק שהנתונים נשמרים
4. 🚀 התחל לפתח תכונות חדשות!