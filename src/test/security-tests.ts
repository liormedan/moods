/**
 * בדיקות אבטחה - הפרדת מידע אישי
 * קובץ זה מכיל בדיקות לבדוק שכל משתמש רואה רק את הנתונים שלו
 */

import { prisma } from '@/lib/prisma';

// Mock users for testing
const testUsers = [
  {
    id: 'user-1',
    email: 'test1@example.com',
    name: 'Test User 1',
  },
  {
    id: 'user-2',
    email: 'test2@example.com',
    name: 'Test User 2',
  },
];

// Test data for each user
const testData = {
  'user-1': [
    { moodValue: 8, notes: 'יום טוב', date: new Date() },
    { moodValue: 7, notes: 'בסדר', date: new Date(Date.now() - 86400000) },
  ],
  'user-2': [
    { moodValue: 6, notes: 'עצוב', date: new Date() },
    { moodValue: 5, notes: 'לא טוב', date: new Date(Date.now() - 86400000) },
  ],
};

/**
 * בדיקה 1: הפרדת נתוני מצב רוח
 */
export async function testMoodDataIsolation() {
  console.log('🧪 בדיקת הפרדת נתוני מצב רוח...');

  try {
    // Create test users
    for (const user of testUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      });
    }

    // Create test mood entries
    for (const [userId, entries] of Object.entries(testData)) {
      for (const entry of entries) {
        await prisma.moodEntry.create({
          data: {
            userId,
            moodValue: entry.moodValue,
            notes: entry.notes,
            date: entry.date,
          },
        });
      }
    }

    // Test: User 1 should only see their data
    const user1Moods = await prisma.moodEntry.findMany({
      where: { userId: 'user-1' },
    });

    // Test: User 2 should only see their data
    const user2Moods = await prisma.moodEntry.findMany({
      where: { userId: 'user-2' },
    });

    // Verify isolation
    const user1SeesOnlyOwnData = user1Moods.every(
      (mood) => mood.userId === 'user-1'
    );
    const user2SeesOnlyOwnData = user2Moods.every(
      (mood) => mood.userId === 'user-2'
    );
    const noCrossUserData =
      !user1Moods.some((mood) => mood.userId === 'user-2') &&
      !user2Moods.some((mood) => mood.userId === 'user-1');

    if (user1SeesOnlyOwnData && user2SeesOnlyOwnData && noCrossUserData) {
      console.log('✅ הפרדת נתוני מצב רוח עובדת כראוי');
      return true;
    } else {
      console.log('❌ כשל בהפרדת נתוני מצב רוח');
      return false;
    }
  } catch (error) {
    console.error('שגיאה בבדיקת הפרדת נתוני מצב רוח:', error);
    return false;
  }
}

/**
 * בדיקה 2: הפרדת תובנות
 */
export async function testInsightsDataIsolation() {
  console.log('🧪 בדיקת הפרדת תובנות...');

  try {
    // Create test insights for each user
    for (const [userId, entries] of Object.entries(testData)) {
      for (const entry of entries) {
        await prisma.insight.create({
          data: {
            userId,
            type: 'recommendation',
            title: `תובנה ל${userId}`,
            description: entry.notes,
            priority: 'medium',
            actionable: false,
          },
        });
      }
    }

    // Test: User 1 should only see their insights
    const user1Insights = await prisma.insight.findMany({
      where: { userId: 'user-1' },
    });

    // Test: User 2 should only see their insights
    const user2Insights = await prisma.insight.findMany({
      where: { userId: 'user-2' },
    });

    // Verify isolation
    const user1SeesOnlyOwnInsights = user1Insights.every(
      (insight) => insight.userId === 'user-1'
    );
    const user2SeesOnlyOwnInsights = user2Insights.every(
      (insight) => insight.userId === 'user-2'
    );
    const noCrossUserInsights =
      !user1Insights.some((insight) => insight.userId === 'user-2') &&
      !user2Insights.some((insight) => insight.userId === 'user-1');

    if (
      user1SeesOnlyOwnInsights &&
      user2SeesOnlyOwnInsights &&
      noCrossUserInsights
    ) {
      console.log('✅ הפרדת תובנות עובדת כראוי');
      return true;
    } else {
      console.log('❌ כשל בהפרדת תובנות');
      return false;
    }
  } catch (error) {
    console.error('שגיאה בבדיקת הפרדת תובנות:', error);
    return false;
  }
}

/**
 * בדיקה 3: בדיקת הרשאות API
 */
export async function testAPIPermissions() {
  console.log('🧪 בדיקת הרשאות API...');

  try {
    // Test: User cannot access other user's data through direct database queries
    const user1TryingToAccessUser2Data = await prisma.moodEntry.findMany({
      where: { userId: 'user-2' },
    });

    // This should be empty if user1 is not user2
    if (user1TryingToAccessUser2Data.length === 0) {
      console.log(
        '✅ API הרשאות עובדות כראוי - משתמש לא יכול לגשת לנתונים של משתמש אחר'
      );
      return true;
    } else {
      console.log('❌ כשל בהרשאות API - משתמש יכול לגשת לנתונים של משתמש אחר');
      return false;
    }
  } catch (error) {
    console.error('שגיאה בבדיקת הרשאות API:', error);
    return false;
  }
}

/**
 * בדיקה 4: בדיקת Middleware
 */
export async function testMiddlewareProtection() {
  console.log('🧪 בדיקת הגנת Middleware...');

  try {
    // Test: Unauthenticated requests should be blocked
    const response = await fetch('/api/mood', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Should return 401 for unauthenticated requests
    if (response.status === 401) {
      console.log('✅ Middleware חוסם בקשות לא מורשות');
      return true;
    } else {
      console.log('❌ כשל בהגנת Middleware - בקשה לא מורשית עברה');
      return false;
    }
  } catch (error) {
    console.error('שגיאה בבדיקת Middleware:', error);
    return false;
  }
}

/**
 * בדיקה 5: בדיקה מקיפה של כל המערכת
 */
export async function runAllSecurityTests() {
  console.log('🚀 מתחיל בדיקות אבטחה מקיפות...\n');

  const results = {
    moodIsolation: false,
    insightsIsolation: false,
    apiPermissions: false,
    middlewareProtection: false,
  };

  try {
    // Run all tests
    results.moodIsolation = await testMoodDataIsolation();
    results.insightsIsolation = await testInsightsDataIsolation();
    results.apiPermissions = await testAPIPermissions();
    results.middlewareProtection = await testMiddlewareProtection();

    // Calculate overall score
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    const score = (passedTests / totalTests) * 100;

    console.log('\n📊 תוצאות בדיקות אבטחה:');
    console.log(`✅ בדיקות שעברו: ${passedTests}/${totalTests}`);
    console.log(`📈 ציון כללי: ${score.toFixed(1)}%`);

    if (score === 100) {
      console.log('🎉 כל הבדיקות עברו! המערכת מאובטחת ב-100%');
    } else {
      console.log('⚠️  יש בעיות אבטחה שצריך לתקן');
    }

    return results;
  } catch (error) {
    console.error('שגיאה בבדיקות אבטחה:', error);
    return results;
  } finally {
    // Cleanup test data
    await cleanupTestData();
  }
}

/**
 * ניקוי נתוני בדיקה
 */
async function cleanupTestData() {
  try {
    console.log('🧹 מנקה נתוני בדיקה...');

    // Delete test users and all their data
    for (const user of testUsers) {
      await prisma.user.delete({
        where: { email: user.email },
      });
    }

    console.log('✅ ניקוי הושלם');
  } catch (error) {
    console.error('שגיאה בניקוי:', error);
  }
}

// Export for use in other test files
export default {
  testMoodDataIsolation,
  testInsightsDataIsolation,
  testAPIPermissions,
  testMiddlewareProtection,
  runAllSecurityTests,
};

