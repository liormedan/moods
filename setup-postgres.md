# הגדרת PostgreSQL למערכת Mental Health Tracker

## אפשרות 1: התקנה מקומית של PostgreSQL

### Windows:
1. הורד PostgreSQL מ: https://www.postgresql.org/download/windows/
2. התקן עם הגדרות ברירת מחדל
3. זכור את הסיסמה שהגדרת למשתמש `postgres`
4. פתח pgAdmin או psql ויצור מסד נתונים:
```sql
CREATE DATABASE mental_health_tracker;
```

### עדכון משתני הסביבה:
עדכן את `DATABASE_URL` ב-.env.local:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mental_health_tracker"
```

## אפשרות 2: Docker (מומלץ לפיתוח)

### הרץ PostgreSQL עם Docker:
```bash
docker run --name postgres-mental-health \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mental_health_tracker \
  -p 5432:5432 \
  -d postgres:15
```

### או עם docker-compose:
צור קובץ `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: postgres-mental-health
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mental_health_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

הרץ עם: `docker-compose up -d`

## אפשרות 3: שירותי ענן (לפרודקשן)

### Supabase (חינם):
1. הירשם ל-Supabase: https://supabase.com
2. צור פרויקט חדש
3. קבל את ה-DATABASE_URL מההגדרות
4. עדכן ב-.env.local

### Railway (חינם):
1. הירשם ל-Railway: https://railway.app
2. צור PostgreSQL database
3. קבל את ה-DATABASE_URL
4. עדכן ב-.env.local

### Vercel Postgres:
1. הירשם ל-Vercel: https://vercel.com
2. צור Postgres database
3. קבל את ה-DATABASE_URL
4. עדכן ב-.env.local

## הפעלת המערכת

לאחר הגדרת PostgreSQL:

1. **צור את הטבלאות:**
```bash
npx prisma migrate dev --name init
```

2. **צור את הקליינט:**
```bash
npx prisma generate
```

3. **הזרע נתונים (אופציונלי):**
```bash
npm run db:seed
```

4. **הפעל את השרת:**
```bash
npm run dev
```

## בדיקת החיבור

בדוק שהחיבור עובד:
```bash
npx prisma studio
```

זה יפתח ממשק גרפי לניהול מסד הנתונים ב-http://localhost:5555

## פתרון בעיות

### שגיאת חיבור:
- ודא ש-PostgreSQL רץ על פורט 5432
- בדוק שהסיסמה נכונה ב-DATABASE_URL
- ודא שמסד הנתונים קיים

### שגיאת הרשאות:
```sql
GRANT ALL PRIVILEGES ON DATABASE mental_health_tracker TO postgres;
```

### איפוס מסד נתונים:
```bash
npx prisma migrate reset
```