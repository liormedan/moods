# מדריך הגדרת Firebase עבור Moods Dashboard

## סקירה כללית

מסמך זה מכיל הוראות מפורטות להגדרת Firebase עבור אפליקציית Moods Dashboard - מעקב בריאות נפשית.

## שלב 1: יצירת פרויקט Firebase

### 1.1 גישה ל-Firebase Console
1. עבור ל-[Firebase Console](https://console.firebase.google.com/)
2. התחבר עם חשבון Google שלך
3. לחץ על "Create a project" או "צור פרויקט"

### 1.2 הגדרת הפרויקט
1. **שם הפרויקט**: `moods-dashboard` (או שם אחר לבחירתך)
2. **הפעלת Google Analytics**: מומלץ להפעיל לניתוח שימוש
3. **קבלת תנאי השימוש**: קרא וקבל את תנאי השימוש

### 1.3 הגדרת Analytics (אופציונלי)
1. בחר חשבון Google Analytics קיים או צור חדש
2. בחר הגדרות ברירת מחדל
3. לחץ על "Create project"

## שלב 2: הגדרת Authentication

### 2.1 הפעלת Authentication
1. בתפריט הצד השמאלי, לחץ על "Authentication"
2. לחץ על "Get started"
3. בחר את לשונית "Sign-in method"

### 2.2 הגדרת Email/Password
1. לחץ על "Email/Password"
2. הפעל את האפשרות "Enable"
3. הפעל את האפשרות "Email link (passwordless sign-in)" אם תרצה
4. לחץ על "Save"

### 2.3 הגדרות נוספות (אופציונלי)
- **Google Sign-in**: להתחברות עם Google
- **Facebook Sign-in**: להתחברות עם Facebook
- **Phone Number**: להתחברות עם מספר טלפון

## שלב 3: הגדרת Firestore Database

### 3.1 יצירת מסד נתונים
1. בתפריט הצד השמאלי, לחץ על "Firestore Database"
2. לחץ על "Create database"
3. בחר "Start in test mode" (לפיתוח) או "Start in production mode" (לפרודקשן)

### 3.2 בחירת מיקום
1. בחר מיקום גיאוגרפי קרוב למשתמשים שלך
2. לחץ על "Done"

### 3.3 הגדרת כללי אבטחה
1. עבור ללשונית "Rules"
2. החלף את הכללים הקיימים עם הכללים הבאים:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mood entries - users can only access their own
    match /mood_entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Goals - users can only access their own
    match /goals/{goalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Journal entries - users can only access their own
    match /journal_entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Insights - users can only access their own
    match /insights/{insightId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Progress reports - users can only access their own
    match /progress_reports/{reportId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Breathing sessions - users can only access their own
    match /breathing_sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Support groups - public groups can be read by anyone, private groups only by members
    match /support_groups/{groupId} {
      allow read: if resource.data.isPrivate == false || 
                   (request.auth != null && 
                    (resource.data.members[request.auth.uid] != null || 
                     resource.data.admins[request.auth.uid] != null));
      allow write: if request.auth != null && 
                   (resource.data.admins[request.auth.uid] != null || 
                    resource.data.creatorId == request.auth.uid);
    }
    
    // Notifications - users can only access their own
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Therapists - users can only access their own
    match /therapists/{therapistId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Resources - users can only access their own
    match /resources/{resourceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Calendar events - users can only access their own
    match /calendar_events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## שלב 4: הגדרת Storage (אופציונלי)

### 4.1 יצירת Storage Bucket
1. בתפריט הצד השמאלי, לחץ על "Storage"
2. לחץ על "Get started"
3. בחר "Start in test mode" או "Start in production mode"

### 4.2 הגדרת כללי אבטחה
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## שלב 5: קבלת פרטי התחברות

### 5.1 הגדרות הפרויקט
1. לחץ על סמל ההגדרות (⚙️) ליד "Project Overview"
2. בחר "Project settings"

### 5.2 פרטי התחברות
1. גלול למטה לסעיף "Your apps"
2. לחץ על סמל האינטרנט (</>) ליצירת אפליקציית Web
3. תן שם לאפליקציה: `moods-dashboard-web`
4. לחץ על "Register app"
5. העתק את פרטי התצורה:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## שלב 6: הגדרת משתני סביבה

### 6.1 יצירת קובץ .env.local
צור קובץ `.env.local` בתיקיית הפרויקט:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 6.2 הוספה ל-.gitignore
וודא שקובץ `.env.local` נמצא ב-.gitignore:

```gitignore
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## שלב 7: התקנת Firebase CLI (אופציונלי)

### 7.1 התקנה
```bash
npm install -g firebase-tools
```

### 7.2 התחברות
```bash
firebase login
```

### 7.3 אתחול הפרויקט
```bash
firebase init
```

## שלב 8: הגדרת Firebase Emulators (לפיתוח)

### 8.1 התקנת Emulators
```bash
firebase init emulators
```

### 8.2 הפעלת Emulators
```bash
firebase emulators:start
```

### 8.3 הגדרת פורטים
- Authentication: 9099
- Firestore: 8080
- Storage: 9199

## שלב 9: בדיקת ההגדרה

### 9.1 בדיקת Authentication
1. הפעל את האפליקציה
2. נסה ליצור משתמש חדש
3. נסה להתחבר עם המשתמש

### 9.2 בדיקת Firestore
1. צור רשומת מצב רוח
2. בדוק שהיא נשמרת ב-Firestore Console
3. בדוק שהכללי אבטחה עובדים

### 9.3 בדיקת Storage (אם הוגדר)
1. נסה להעלות תמונת פרופיל
2. בדוק שהיא נשמרת ב-Storage Console

## שלב 10: הגדרות נוספות

### 10.1 הגדרת Custom Claims
למשתמשים עם הרשאות מיוחדות:

```javascript
// ב-Firebase Functions או Admin SDK
admin.auth().setCustomUserClaims(uid, {
  role: 'admin',
  permissions: ['read:all', 'write:all']
});
```

### 10.2 הגדרת Triggers
לפעולות אוטומטיות:

```javascript
// Firestore Triggers
exports.onMoodEntryCreated = functions.firestore
  .document('mood_entries/{entryId}')
  .onCreate((snap, context) => {
    // לוגיקה אוטומטית
  });
```

### 10.3 הגדרת Indexes
לשאילתות מורכבות:

```javascript
// ב-Firestore Console
// Collections > mood_entries > Indexes
// הוסף אינדקס על: userId + date (Descending)
```

## פתרון בעיות נפוצות

### בעיה: "Firebase App named '[DEFAULT]' already exists"
**פתרון**: וודא שאתה לא מפעיל את `initializeApp` יותר מפעם אחת.

### בעיה: "Missing or insufficient permissions"
**פתרון**: בדוק את כללי האבטחה ב-Firestore Rules.

### בעיה: "auth/network-request-failed"
**פתרון**: בדוק את חיבור האינטרנט והגדרות הרשת.

### בעיה: "Firebase: Error (auth/invalid-api-key)"
**פתרון**: וודא שה-API Key נכון ב-.env.local.

## משאבים נוספים

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-modeling)

## תמיכה

אם אתה נתקל בבעיות:
1. בדוק את ה-Console של הדפדפן
2. בדוק את Firebase Console
3. בדוק את כללי האבטחה
4. פנה לקהילת Firebase

---

**הערה**: וודא שאתה לא חושף את פרטי Firebase שלך בפומבי. השתמש תמיד במשתני סביבה לפרטים רגישים.
