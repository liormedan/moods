/**
 * בדיקות תיאום מסד נתונים - הפרדת מידע אישי
 * קובץ זה מכיל בדיקות לבדוק שכל הנתונים מסונכים נכון בין המשתמשים
 */

import { prisma } from '@/lib/prisma';

// משתמשי בדיקה
const testUsers = [
  {
    id: 'test-user-1',
    email: 'test1@example.com',
    name: 'משתמש בדיקה 1',
  },
  {
    id: 'test-user-2',
    email: 'test2@example.com',
    name: 'משתמש בדיקה 2',
  },
  {
    id: 'test-user-3',
    email: 'test3@example.com',
    name: 'משתמש בדיקה 3',
  },
];

// נתוני בדיקה לכל משתמש
const testData = {
  'test-user-1': {
    moods: [
      { moodValue: 8, notes: 'יום נהדר!', date: new Date() },
      {
        moodValue: 7,
        notes: 'בסדר גמור',
        date: new Date(Date.now() - 86400000),
      },
      {
        moodValue: 9,
        notes: 'מצוין!',
        date: new Date(Date.now() - 2 * 86400000),
      },
    ],
    insights: [
      {
        type: 'celebration',
        title: 'הישג!',
        description: 'מצב הרוח שלך מעולה השבוע',
        priority: 'high',
      },
      {
        type: 'recommendation',
        title: 'המלצה',
        description: 'המשך בפעילות הגופנית',
        priority: 'medium',
      },
    ],
    goals: [
      {
        title: 'שיפור מצב רוח',
        description: 'להגיע למצב רוח 8+',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 30 * 86400000),
      },
    ],
  },
  'test-user-2': {
    moods: [
      { moodValue: 6, notes: 'בסדר', date: new Date() },
      { moodValue: 5, notes: 'לא רע', date: new Date(Date.now() - 86400000) },
    ],
    insights: [
      {
        type: 'pattern',
        title: 'דפוס זוהה',
        description: 'מצב הרוח שלך יציב',
        priority: 'low',
      },
    ],
    goals: [
      {
        title: 'יציבות',
        description: 'לשמור על יציבות במצב רוח',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 14 * 86400000),
      },
    ],
  },
  'test-user-3': {
    moods: [
      { moodValue: 4, notes: 'עצוב', date: new Date() },
      { moodValue: 3, notes: 'לא טוב', date: new Date(Date.now() - 86400000) },
    ],
    insights: [
      {
        type: 'warning',
        title: 'אזהרה',
        description: 'מצב הרוח שלך נמוך',
        priority: 'high',
      },
    ],
    goals: [
      {
        title: 'שיפור',
        description: 'לשפר את מצב הרוח',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 7 * 86400000),
      },
    ],
  },
};

/**
 * בדיקה 1: יצירת משתמשים ונתונים
 */
export async function testUserAndDataCreation() {
  console.log('🧪 בדיקה 1: יצירת משתמשים ונתונים...');

  try {
    // יצירת משתמשי בדיקה
    for (const user of testUsers) {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      console.log(`✅ משתמש נוצר: ${createdUser.email}`);
    }

    // יצירת נתונים לכל משתמש
    for (const [userId, data] of Object.entries(testData)) {
      // יצירת mood entries
      for (const mood of data.moods) {
        await prisma.moodEntry.create({
          data: {
            userId,
            moodValue: mood.moodValue,
            notes: mood.notes,
            date: mood.date,
          },
        });
      }

      // יצירת insights
      for (const insight of data.insights) {
        await prisma.insight.create({
          data: {
            userId,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            priority: insight.priority,
            actionable: false,
          },
        });
      }

      // יצירת goals
      for (const goal of data.goals) {
        await prisma.goal.create({
          data: {
            userId,
            title: goal.title,
            description: goal.description,
            category: goal.category,
            targetDate: goal.targetDate,
            progress: 0,
            status: 'not-started',
            priority: 'medium',
          },
        });
      }

      console.log(`✅ נתונים נוצרו עבור משתמש: ${userId}`);
    }

    console.log('✅ כל המשתמשים והנתונים נוצרו בהצלחה');
    return true;
  } catch (error) {
    console.error('❌ שגיאה ביצירת משתמשים ונתונים:', error);
    return false;
  }
}

/**
 * בדיקה 2: הפרדת נתונים בין משתמשים
 */
export async function testDataIsolation() {
  console.log('🧪 בדיקה 2: הפרדת נתונים בין משתמשים...');

  try {
    let allTestsPassed = true;

    // בדיקת הפרדת mood entries
    for (const user of testUsers) {
      const userMoods = await prisma.moodEntry.findMany({
        where: { userId: user.id },
      });

      // בדיקה שכל הנתונים שייכים למשתמש הנכון
      const allMoodsBelongToUser = userMoods.every(
        (mood) => mood.userId === user.id
      );
      if (!allMoodsBelongToUser) {
        console.error(`❌ משתמש ${user.email} רואה mood entries שלא שלו`);
        allTestsPassed = false;
      }

      // בדיקה שמספר הנתונים נכון
      const expectedMoodCount = testData[user.id].moods.length;
      if (userMoods.length !== expectedMoodCount) {
        console.error(
          `❌ משתמש ${user.email} רואה ${userMoods.length} moods במקום ${expectedMoodCount}`
        );
        allTestsPassed = false;
      }
    }

    // בדיקת הפרדת insights
    for (const user of testUsers) {
      const userInsights = await prisma.insight.findMany({
        where: { userId: user.id },
      });

      const allInsightsBelongToUser = userInsights.every(
        (insight) => insight.userId === user.id
      );
      if (!allInsightsBelongToUser) {
        console.error(`❌ משתמש ${user.email} רואה insights שלא שלו`);
        allTestsPassed = false;
      }

      const expectedInsightCount = testData[user.id].insights.length;
      if (userInsights.length !== expectedInsightCount) {
        console.error(
          `❌ משתמש ${user.email} רואה ${userInsights.length} insights במקום ${expectedInsightCount}`
        );
        allTestsPassed = false;
      }
    }

    // בדיקת הפרדת goals
    for (const user of testUsers) {
      const userGoals = await prisma.goal.findMany({
        where: { userId: user.id },
      });

      const allGoalsBelongToUser = userGoals.every(
        (goal) => goal.userId === user.id
      );
      if (!allGoalsBelongToUser) {
        console.error(`❌ משתמש ${user.email} רואה goals שלא שלו`);
        allTestsPassed = false;
      }

      const expectedGoalCount = testData[user.id].goals.length;
      if (userGoals.length !== expectedGoalCount) {
        console.error(
          `❌ משתמש ${user.email} רואה ${userGoals.length} goals במקום ${expectedGoalCount}`
        );
        allTestsPassed = false;
      }
    }

    if (allTestsPassed) {
      console.log(
        '✅ הפרדת נתונים עובדת כראוי - כל משתמש רואה רק את הנתונים שלו'
      );
    } else {
      console.log('❌ יש בעיות בהפרדת נתונים');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת הפרדת נתונים:', error);
    return false;
  }
}

/**
 * בדיקה 3: עקביות נתונים
 */
export async function testDataConsistency() {
  console.log('🧪 בדיקה 3: עקביות נתונים...');

  try {
    let allTestsPassed = true;

    // בדיקה שכל הנתונים קיימים במסד הנתונים
    const totalUsers = await prisma.user.count();
    const totalMoods = await prisma.moodEntry.count();
    const totalInsights = await prisma.insight.count();
    const totalGoals = await prisma.goal.count();

    const expectedUsers = testUsers.length;
    const expectedMoods = Object.values(testData).reduce(
      (sum, data) => sum + data.moods.length,
      0
    );
    const expectedInsights = Object.values(testData).reduce(
      (sum, data) => sum + data.insights.length,
      0
    );
    const expectedGoals = Object.values(testData).reduce(
      (sum, data) => sum + data.goals.length,
      0
    );

    // בדיקת מספר משתמשים
    if (totalUsers < expectedUsers) {
      console.error(`❌ חסרים משתמשים: ${totalUsers} במקום ${expectedUsers}`);
      allTestsPassed = false;
    }

    // בדיקת מספר mood entries
    if (totalMoods < expectedMoods) {
      console.error(
        `❌ חסרים mood entries: ${totalMoods} במקום ${expectedMoods}`
      );
      allTestsPassed = false;
    }

    // בדיקת מספר insights
    if (totalInsights < expectedInsights) {
      console.error(
        `❌ חסרים insights: ${totalInsights} במקום ${expectedInsights}`
      );
      allTestsPassed = false;
    }

    // בדיקת מספר goals
    if (totalGoals < expectedGoals) {
      console.error(`❌ חסרים goals: ${totalGoals} במקום ${expectedGoals}`);
      allTestsPassed = false;
    }

    // בדיקת קשרים בין טבלאות
    for (const user of testUsers) {
      const userInDB = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          moodEntries: true,
          insights: true,
          goals: true,
        },
      });

      if (!userInDB) {
        console.error(`❌ משתמש ${user.id} לא נמצא במסד הנתונים`);
        allTestsPassed = false;
        continue;
      }

      // בדיקה שכל הקשרים נכונים
      if (userInDB.moodEntries.length !== testData[user.id].moods.length) {
        console.error(
          `❌ קשרים שגויים עבור משתמש ${user.id}: ${userInDB.moodEntries.length} moods במקום ${testData[user.id].moods.length}`
        );
        allTestsPassed = false;
      }

      if (userInDB.insights.length !== testData[user.id].insights.length) {
        console.error(
          `❌ קשרים שגויים עבור משתמש ${user.id}: ${userInDB.insights.length} insights במקום ${testData[user.id].insights.length}`
        );
        allTestsPassed = false;
      }

      if (userInDB.goals.length !== testData[user.id].goals.length) {
        console.error(
          `❌ קשרים שגויים עבור משתמש ${user.id}: ${userInDB.goals.length} goals במקום ${testData[user.id].goals.length}`
        );
        allTestsPassed = false;
      }
    }

    if (allTestsPassed) {
      console.log('✅ עקביות נתונים תקינה - כל הנתונים קיימים והקשרים נכונים');
    } else {
      console.log('❌ יש בעיות בעקביות נתונים');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת עקביות נתונים:', error);
    return false;
  }
}

/**
 * בדיקה 4: ביצועים וסינון
 */
export async function testPerformanceAndFiltering() {
  console.log('🧪 בדיקה 4: ביצועים וסינון...');

  try {
    let allTestsPassed = true;

    // בדיקת ביצועי סינון לפי משתמש
    const startTime = Date.now();

    for (const user of testUsers) {
      // בדיקת mood entries
      const userMoods = await prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 10,
      });

      // בדיקת insights
      const userInsights = await prisma.insight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      // בדיקת goals
      const userGoals = await prisma.goal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      // בדיקה שהנתונים מסוננים נכון
      if (userMoods.some((mood) => mood.userId !== user.id)) {
        console.error(`❌ סינון שגוי עבור mood entries של משתמש ${user.id}`);
        allTestsPassed = false;
      }

      if (userInsights.some((insight) => insight.userId !== user.id)) {
        console.error(`❌ סינון שגוי עבור insights של משתמש ${user.id}`);
        allTestsPassed = false;
      }

      if (userGoals.some((goal) => goal.userId !== user.id)) {
        console.error(`❌ סינון שגוי עבור goals של משתמש ${user.id}`);
        allTestsPassed = false;
      }
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`⏱️  זמן ביצוע: ${executionTime}ms`);

    if (executionTime > 1000) {
      console.warn('⚠️  זמן ביצוע גבוה - ייתכן שיש בעיות ביצועים');
    }

    if (allTestsPassed) {
      console.log('✅ ביצועים וסינון תקינים - כל הנתונים מסוננים נכון');
    } else {
      console.log('❌ יש בעיות בביצועים או בסינון');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת ביצועים וסינון:', error);
    return false;
  }
}

/**
 * בדיקה 5: בדיקה מקיפה של כל המערכת
 */
export async function runAllDatabaseSyncTests() {
  console.log('🚀 מתחיל בדיקות תיאום מסד נתונים מקיפות...\n');

  const results = {
    userCreation: false,
    dataIsolation: false,
    dataConsistency: false,
    performance: false,
  };

  try {
    // הרצת כל הבדיקות
    results.userCreation = await testUserAndDataCreation();
    results.dataIsolation = await testDataIsolation();
    results.dataConsistency = await testDataConsistency();
    results.performance = await testPerformanceAndFiltering();

    // חישוב ציון כללי
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    const score = (passedTests / totalTests) * 100;

    console.log('\n📊 תוצאות בדיקות תיאום מסד נתונים:');
    console.log('=' * 60);

    for (const [testName, result] of Object.entries(results)) {
      const status = result ? '✅' : '❌';
      const score = result ? 25 : 0;
      console.log(`${status} ${testName}: ${score} נקודות`);
    }

    console.log('=' * 60);
    console.log(`📈 ציון כללי: ${score.toFixed(1)}%`);
    console.log(`✅ בדיקות שעברו: ${passedTests}/${totalTests}`);

    if (score === 100) {
      console.log('\n🎉 מעולה! מסד הנתונים מסונכרן ב-100%!');
      console.log('🔒 כל הנתונים מופרדים נכון בין המשתמשים');
      console.log('✅ הפרדת מידע אישי עובדת בצורה מושלמת');
    } else {
      console.log('\n⚠️  יש בעיות בתיאום מסד הנתונים');
      console.log(`📝 נדרשות ${100 - score} נקודות נוספות`);
    }

    return results;
  } catch (error) {
    console.error('❌ שגיאה בבדיקות תיאום מסד נתונים:', error);
    return results;
  } finally {
    // ניקוי נתוני בדיקה
    await cleanupTestData();
  }
}

/**
 * ניקוי נתוני בדיקה
 */
async function cleanupTestData() {
  try {
    console.log('🧹 מנקה נתוני בדיקה...');

    // מחיקת כל הנתונים של משתמשי הבדיקה
    for (const user of testUsers) {
      // מחיקת mood entries
      await prisma.moodEntry.deleteMany({
        where: { userId: user.id },
      });

      // מחיקת insights
      await prisma.insight.deleteMany({
        where: { userId: user.id },
      });

      // מחיקת goals
      await prisma.goal.deleteMany({
        where: { userId: user.id },
      });

      // מחיקת המשתמש
      await prisma.user.delete({
        where: { id: user.id },
      });
    }

    console.log('✅ ניקוי הושלם');
  } catch (error) {
    console.error('שגיאה בניקוי:', error);
  }
}

// ייצוא לפימוש בקבצי בדיקה אחרים
export default {
  testUserAndDataCreation,
  testDataIsolation,
  testDataConsistency,
  testPerformanceAndFiltering,
  runAllDatabaseSyncTests,
};

