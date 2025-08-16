/**
 * בדיקות אינטגרציה מקיפות - אבטחה ותיאום מסד נתונים
 * קובץ זה מכיל בדיקות שמשלבות את כל המערכות יחד
 */

import { prisma } from '@/lib/prisma';
import { runAllSecurityTests } from './security-tests';
import { runAllDatabaseSyncTests } from './database-sync-tests';

// משתמשי בדיקה לאינטגרציה
const integrationTestUsers = [
  {
    id: 'integration-user-1',
    email: 'integration1@example.com',
    name: 'משתמש אינטגרציה 1',
  },
  {
    id: 'integration-user-2',
    email: 'integration2@example.com',
    name: 'משתמש אינטגרציה 2',
  },
];

// נתוני בדיקה לאינטגרציה
const integrationTestData = {
  'integration-user-1': {
    moods: [
      { moodValue: 9, notes: 'יום מושלם!', date: new Date() },
      { moodValue: 8, notes: 'מעולה', date: new Date(Date.now() - 86400000) },
    ],
    insights: [
      {
        type: 'celebration',
        title: 'הישג גדול!',
        description: 'מצב הרוח שלך מעולה',
        priority: 'high',
      },
    ],
    goals: [
      {
        title: 'שמירה על מצב רוח גבוה',
        description: 'לשמור על מצב רוח 8+',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 30 * 86400000),
      },
    ],
  },
  'integration-user-2': {
    moods: [
      { moodValue: 6, notes: 'בסדר', date: new Date() },
      { moodValue: 7, notes: 'טוב', date: new Date(Date.now() - 86400000) },
    ],
    insights: [
      {
        type: 'recommendation',
        title: 'המלצה לשיפור',
        description: 'נסה פעילות גופנית',
        priority: 'medium',
      },
    ],
    goals: [
      {
        title: 'שיפור מצב רוח',
        description: 'להגיע למצב רוח 7+',
        category: 'mental-health',
        targetDate: new Date(Date.now() + 21 * 86400000),
      },
    ],
  },
};

/**
 * בדיקה 1: אינטגרציה מלאה של המערכת
 */
export async function testFullSystemIntegration() {
  console.log('🧪 בדיקה 1: אינטגרציה מלאה של המערכת...');

  try {
    let allTestsPassed = true;

    // יצירת משתמשי בדיקה
    for (const user of integrationTestUsers) {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
      console.log(`✅ משתמש אינטגרציה נוצר: ${createdUser.email}`);
    }

    // יצירת נתונים לכל משתמש
    for (const [userId, data] of Object.entries(integrationTestData)) {
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

      console.log(`✅ נתוני אינטגרציה נוצרו עבור משתמש: ${userId}`);
    }

    // בדיקת הפרדת נתונים
    for (const user of integrationTestUsers) {
      const userMoods = await prisma.moodEntry.findMany({
        where: { userId: user.id },
      });

      const userInsights = await prisma.insight.findMany({
        where: { userId: user.id },
      });

      const userGoals = await prisma.goal.findMany({
        where: { userId: user.id },
      });

      // בדיקה שכל הנתונים שייכים למשתמש הנכון
      const allMoodsBelongToUser = userMoods.every(
        (mood) => mood.userId === user.id
      );
      const allInsightsBelongToUser = userInsights.every(
        (insight) => insight.userId === user.id
      );
      const allGoalsBelongToUser = userGoals.every(
        (goal) => goal.userId === user.id
      );

      if (
        !allMoodsBelongToUser ||
        !allInsightsBelongToUser ||
        !allGoalsBelongToUser
      ) {
        console.error(`❌ הפרדת נתונים לא עובדת עבור משתמש ${user.id}`);
        allTestsPassed = false;
      }

      // בדיקה שמספר הנתונים נכון
      const expectedMoodCount = integrationTestData[user.id].moods.length;
      const expectedInsightCount = integrationTestData[user.id].insights.length;
      const expectedGoalCount = integrationTestData[user.id].goals.length;

      if (
        userMoods.length !== expectedMoodCount ||
        userInsights.length !== expectedInsightCount ||
        userGoals.length !== expectedGoalCount
      ) {
        console.error(`❌ מספר נתונים שגוי עבור משתמש ${user.id}`);
        allTestsPassed = false;
      }
    }

    if (allTestsPassed) {
      console.log('✅ אינטגרציה מלאה עובדת כראוי');
    } else {
      console.log('❌ יש בעיות באינטגרציה');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת אינטגרציה מלאה:', error);
    return false;
  }
}

/**
 * בדיקה 2: זרימת נתונים מלאה
 */
export async function testCompleteDataFlow() {
  console.log('🧪 בדיקה 2: זרימת נתונים מלאה...');

  try {
    let allTestsPassed = true;

    // בדיקת זרימת נתונים מלאה
    for (const user of integrationTestUsers) {
      // 1. בדיקת משתמש קיים
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) {
        console.error(`❌ משתמש ${user.id} לא נמצא במסד הנתונים`);
        allTestsPassed = false;
        continue;
      }

      // 2. בדיקת mood entries
      const userMoods = await prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
      });

      if (userMoods.length === 0) {
        console.error(`❌ אין mood entries למשתמש ${user.id}`);
        allTestsPassed = false;
      }

      // 3. בדיקת insights
      const userInsights = await prisma.insight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (userInsights.length === 0) {
        console.error(`❌ אין insights למשתמש ${user.id}`);
        allTestsPassed = false;
      }

      // 4. בדיקת goals
      const userGoals = await prisma.goal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (userGoals.length === 0) {
        console.error(`❌ אין goals למשתמש ${user.id}`);
        allTestsPassed = false;
      }

      // 5. בדיקת קשרים בין הנתונים
      const userWithRelations = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          moodEntries: true,
          insights: true,
          goals: true,
        },
      });

      if (!userWithRelations) {
        console.error(`❌ לא ניתן לטעון קשרים עבור משתמש ${user.id}`);
        allTestsPassed = false;
        continue;
      }

      // בדיקה שכל הקשרים נכונים
      if (
        userWithRelations.moodEntries.length !== userMoods.length ||
        userWithRelations.insights.length !== userInsights.length ||
        userWithRelations.goals.length !== userGoals.length
      ) {
        console.error(`❌ קשרים שגויים עבור משתמש ${user.id}`);
        allTestsPassed = false;
      }
    }

    if (allTestsPassed) {
      console.log('✅ זרימת נתונים מלאה עובדת כראוי');
    } else {
      console.log('❌ יש בעיות בזרימת נתונים');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת זרימת נתונים מלאה:', error);
    return false;
  }
}

/**
 * בדיקה 3: ביצועים תחת עומס
 */
export async function testPerformanceUnderLoad() {
  console.log('🧪 בדיקה 3: ביצועים תחת עומס...');

  try {
    let allTestsPassed = true;

    // בדיקת ביצועים תחת עומס
    const startTime = Date.now();

    // יצירת 10 משתמשים עם נתונים
    const loadTestUsers = [];
    for (let i = 0; i < 10; i++) {
      const userId = `load-test-user-${i}`;
      const email = `loadtest${i}@example.com`;

      loadTestUsers.push({ id: userId, email, name: `משתמש עומס ${i}` });

      // יצירת משתמש
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: { id: userId, email, name: `משתמש עומס ${i}` },
      });

      // יצירת 5 mood entries לכל משתמש
      for (let j = 0; j < 5; j++) {
        await prisma.moodEntry.create({
          data: {
            userId,
            moodValue: Math.floor(Math.random() * 10) + 1,
            notes: `מבחן עומס ${j}`,
            date: new Date(Date.now() - j * 86400000),
          },
        });
      }

      // יצירת 3 insights לכל משתמש
      for (let j = 0; j < 3; j++) {
        await prisma.insight.create({
          data: {
            userId,
            type: 'recommendation',
            title: `תובנת עומס ${j}`,
            description: `תובנה למבחן עומס ${j}`,
            priority: 'medium',
            actionable: false,
          },
        });
      }
    }

    // בדיקת ביצועי סינון תחת עומס
    for (const user of loadTestUsers) {
      const userMoods = await prisma.moodEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 10,
      });

      if (userMoods.length === 0) {
        console.error(`❌ אין mood entries למשתמש עומס ${user.id}`);
        allTestsPassed = false;
      }

      // בדיקה שכל הנתונים שייכים למשתמש הנכון
      if (userMoods.some((mood) => mood.userId !== user.id)) {
        console.error(`❌ סינון שגוי תחת עומס עבור משתמש ${user.id}`);
        allTestsPassed = false;
      }
    }

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`⏱️  זמן ביצוע תחת עומס: ${executionTime}ms`);

    // בדיקת ביצועים (פחות מ-5 שניות)
    if (executionTime > 5000) {
      console.warn('⚠️  זמן ביצוע גבוה תחת עומס');
    }

    // ניקוי נתוני עומס
    for (const user of loadTestUsers) {
      await prisma.moodEntry.deleteMany({ where: { userId: user.id } });
      await prisma.insight.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }

    if (allTestsPassed) {
      console.log('✅ ביצועים תחת עומס תקינים');
    } else {
      console.log('❌ יש בעיות בביצועים תחת עומס');
    }

    return allTestsPassed;
  } catch (error) {
    console.error('❌ שגיאה בבדיקת ביצועים תחת עומס:', error);
    return false;
  }
}

/**
 * בדיקה 4: בדיקה מקיפה של כל המערכת
 */
export async function runAllIntegrationTests() {
  console.log('🚀 מתחיל בדיקות אינטגרציה מקיפות...\n');

  const results = {
    fullSystemIntegration: false,
    completeDataFlow: false,
    performanceUnderLoad: false,
  };

  try {
    // הרצת בדיקות אבטחה
    console.log('🔒 מתחיל בדיקות אבטחה...');
    const securityResults = await runAllSecurityTests();

    // הרצת בדיקות תיאום מסד נתונים
    console.log('\n🗄️  מתחיל בדיקות תיאום מסד נתונים...');
    const databaseResults = await runAllDatabaseSyncTests();

    // הרצת בדיקות אינטגרציה
    console.log('\n🔗 מתחיל בדיקות אינטגרציה...');
    results.fullSystemIntegration = await testFullSystemIntegration();
    results.completeDataFlow = await testCompleteDataFlow();
    results.performanceUnderLoad = await testPerformanceUnderLoad();

    // חישוב ציון כללי
    const allSecurityTestsPassed =
      Object.values(securityResults).every(Boolean);
    const allDatabaseTestsPassed =
      Object.values(databaseResults).every(Boolean);
    const allIntegrationTestsPassed = Object.values(results).every(Boolean);

    const totalTests = 3; // אבטחה, מסד נתונים, אינטגרציה
    let passedCategories = 0;

    if (allSecurityTestsPassed) passedCategories++;
    if (allDatabaseTestsPassed) passedCategories++;
    if (allIntegrationTestsPassed) passedCategories++;

    const overallScore = (passedCategories / totalTests) * 100;

    console.log('\n📊 תוצאות בדיקות אינטגרציה מקיפות:');
    console.log('=' * 70);

    console.log('🔒 בדיקות אבטחה:');
    for (const [testName, result] of Object.entries(securityResults)) {
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${testName}`);
    }

    console.log('\n🗄️  בדיקות תיאום מסד נתונים:');
    for (const [testName, result] of Object.entries(databaseResults)) {
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${testName}`);
    }

    console.log('\n🔗 בדיקות אינטגרציה:');
    for (const [testName, result] of Object.entries(results)) {
      const status = result ? '✅' : '❌';
      console.log(`  ${status} ${testName}`);
    }

    console.log('=' * 70);
    console.log(`📈 ציון כללי: ${overallScore.toFixed(1)}%`);
    console.log(`✅ קטגוריות שעברו: ${passedCategories}/${totalTests}`);

    if (overallScore === 100) {
      console.log('\n🎉 מעולה! כל המערכת עובדת ב-100%!');
      console.log('🔒 אבטחה מושלמת');
      console.log('🗄️  תיאום מסד נתונים מושלם');
      console.log('🔗 אינטגרציה מושלמת');
      console.log('✅ הפרדת מידע אישי עובדת בצורה מושלמת!');
    } else {
      console.log('\n⚠️  יש בעיות במערכת');
      console.log(`📝 נדרשות ${100 - overallScore} נקודות נוספות`);
    }

    return {
      security: securityResults,
      database: databaseResults,
      integration: results,
      overallScore,
    };
  } catch (error) {
    console.error('❌ שגיאה בבדיקות אינטגרציה:', error);
    return {
      security: {},
      database: {},
      integration: results,
      overallScore: 0,
    };
  } finally {
    // ניקוי נתוני בדיקה
    await cleanupIntegrationTestData();
  }
}

/**
 * ניקוי נתוני בדיקת אינטגרציה
 */
async function cleanupIntegrationTestData() {
  try {
    console.log('🧹 מנקה נתוני בדיקת אינטגרציה...');

    // מחיקת כל הנתונים של משתמשי האינטגרציה
    for (const user of integrationTestUsers) {
      await prisma.moodEntry.deleteMany({
        where: { userId: user.id },
      });

      await prisma.insight.deleteMany({
        where: { userId: user.id },
      });

      await prisma.goal.deleteMany({
        where: { userId: user.id },
      });

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
  testFullSystemIntegration,
  testCompleteDataFlow,
  testPerformanceUnderLoad,
  runAllIntegrationTests,
};

