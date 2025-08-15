# מדריך הגדרת Auth0 עבור Mental Health Tracker

## סקירה כללית

מסמך זה מכיל הוראות מפורטות להגדרת Auth0 עבור אפליקציית Mental Health Tracker.

## שלב 1: יצירת חשבון Auth0

### 1.1 הרשמה ל-Auth0

1. עבור ל-[Auth0.com](https://auth0.com/)
2. לחץ על "Sign Up" או "Get Started"
3. צור חשבון חדש או התחבר עם Google/GitHub

### 1.2 יצירת Tenant

1. בחר שם ל-Tenant שלך (לדוגמה: `mental-health-tracker`)
2. בחר אזור גיאוגרפי (מומלץ: US או EU)
3. לחץ על "Create"

## שלב 2: הגדרת Application

### 2.1 יצירת Application חדש

1. בדשבורד של Auth0, לך ל-"Applications"
2. לחץ על "Create Application"
3. תן שם: `Mental Health Tracker`
4. בחר "Regular Web Applications"
5. לחץ על "Create"

### 2.2 הגדרת URLs

בלשונית "Settings" של האפליקציה:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback/auth0,
https://your-domain.vercel.app/api/auth/callback/auth0
```

**Allowed Logout URLs:**
```
http://localhost:3000,
https://your-domain.vercel.app
```

**Allowed Web Origins:**
```
http://localhost:3000,
https://your-domain.vercel.app
```

### 2.3 העתקת פרטי התחברות

העתק את הפרטים הבאים:
- **Domain**: `your-tenant.auth0.com`
- **Client ID**: `your-client-id`
- **Client Secret**: `your-client-secret`

## שלב 3: הגדרת משתני סביבה

### 3.1 עדכון .env.local

```bash
# Auth0 Configuration
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_ISSUER=https://your-tenant.auth0.com
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=your-random-secret-key

# NextAuth.js (for compatibility)
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3.2 יצירת Secret Key

יצור מפתח סודי חזק:
```bash
openssl rand -base64 32
```

## שלב 4: הגדרות Auth0 מתקדמות

### 4.1 הגדרת User Profile

1. לך ל-"User Management" > "Users"
2. הגדר שדות נוספים אם נדרש
3. הגדר תמונות פרופיל ברירת מחדל

### 4.2 הגדרת Social Connections (אופציונלי)

1. לך ל-"Authentication" > "Social"
2. הפעל Google, Facebook, או ספקים אחרים
3. הגדר Client ID ו-Secret עבור כל ספק

### 4.3 הגדרת Rules (אופציונלי)

יצור Rules להוספת מידע נוסף למשתמשים:

```javascript
function addUserMetadata(user, context, callback) {
  // Add custom claims
  const namespace = 'https://mental-health-tracker.com/';
  context.idToken[namespace + 'user_metadata'] = user.user_metadata;
  context.idToken[namespace + 'app_metadata'] = user.app_metadata;
  
  callback(null, user, context);
}
```

## שלב 5: הגדרת Vercel (לפרודקשן)

### 5.1 הגדרת Environment Variables ב-Vercel

1. לך לפרויקט ב-Vercel Dashboard
2. לך ל-"Settings" > "Environment Variables"
3. הוסף את המשתנים הבאים:

```
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_ISSUER=https://your-tenant.auth0.com
AUTH0_BASE_URL=https://your-domain.vercel.app
AUTH0_SECRET=your-random-secret-key
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 5.2 עדכון Callback URLs

חזור ל-Auth0 Dashboard ועדכן את ה-URLs עם הדומיין האמיתי של Vercel.

## שלב 6: בדיקת ההגדרה

### 6.1 בדיקה מקומית

1. הפעל את השרת המקומי:
```bash
npm run dev
```

2. לך ל-`http://localhost:3000/auth/signin`
3. נסה להתחבר עם Auth0

### 6.2 בדיקה בפרודקשן

1. פרסם ל-Vercel:
```bash
vercel --prod
```

2. בדוק שההתחברות עובדת בדומיין החי

## שלב 7: הגדרות אבטחה

### 7.1 הגדרת Password Policy

1. לך ל-"Security" > "Attack Protection"
2. הגדר מדיניות סיסמאות חזקה
3. הפעל Brute Force Protection

### 7.2 הגדרת MFA (אופציונלי)

1. לך ל-"Security" > "Multi-factor Auth"
2. הפעל SMS או Authenticator App
3. הגדר מתי לדרוש MFA

## פתרון בעיות נפוצות

### בעיה: "Invalid Callback URL"

**פתרון**: וודא שה-Callback URL מוגדר נכון ב-Auth0 Dashboard.

### בעיה: "Client authentication failed"

**פתרון**: בדוק שה-Client Secret נכון במשתני הסביבה.

### בעיה: "CSRF token mismatch"

**פתרון**: וודא שה-AUTH0_SECRET מוגדר ויציב.

## משאבים נוספים

- [Auth0 Documentation](https://auth0.com/docs)
- [NextAuth.js Auth0 Provider](https://next-auth.js.org/providers/auth0)
- [Auth0 Security Best Practices](https://auth0.com/docs/security)

## תמיכה

אם אתה נתקל בבעיות:
1. בדוק את הלוגים ב-Auth0 Dashboard
2. בדוק את הקונסול של הדפדפן
3. פנה לתמיכה של Auth0

---

**הערה**: שמור על פרטי ההתחברות שלך בסוד ואל תחשוף אותם בקוד או ב-Git.