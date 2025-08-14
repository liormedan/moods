const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedGoalsData() {
  console.log('🎯 Starting goals data seeding...');

  try {
    // Clear existing goals data
    await prisma.goal.deleteMany({
      where: { userId: 'demo-user' },
    });

    // Sample goals data
    const goalsData = [
      {
        userId: 'demo-user',
        title: 'תרגול מדיטציה יומי',
        description:
          'להתחיל לתרגל מדיטציה של 10 דקות כל בוקר לשיפור מצב הרוח והפחתת חרדה',
        category: 'mental-health',
        targetDate: new Date('2025-09-30'),
        progress: 60,
        status: 'in-progress',
        priority: 'high',
        milestones: JSON.stringify([
          {
            id: '1-1',
            title: 'התקנת אפליקציית מדיטציה',
            completed: true,
            dueDate: '2025-08-05',
          },
          {
            id: '1-2',
            title: 'תרגול ראשון של 5 דקות',
            completed: true,
            dueDate: '2025-08-10',
          },
          {
            id: '1-3',
            title: 'הגעה ל-10 דקות יומי',
            completed: true,
            dueDate: '2025-08-15',
          },
          {
            id: '1-4',
            title: 'תרגול יומי במשך שבוע',
            completed: false,
            dueDate: '2025-08-25',
          },
          {
            id: '1-5',
            title: 'תרגול יומי במשך חודש',
            completed: false,
            dueDate: '2025-09-15',
          },
        ]),
        createdAt: new Date('2025-08-01'),
      },
      {
        userId: 'demo-user',
        title: 'פעילות גופנית קבועה',
        description:
          'להתחיל בפעילות גופנית 3 פעמים בשבוע לשיפור מצב הרוח והבריאות הכללית',
        category: 'physical',
        targetDate: new Date('2025-10-15'),
        progress: 40,
        status: 'in-progress',
        priority: 'medium',
        milestones: JSON.stringify([
          {
            id: '2-1',
            title: 'בחירת סוג פעילות (ריצה)',
            completed: true,
            dueDate: '2025-08-03',
          },
          {
            id: '2-2',
            title: 'פעילות ראשונה - 20 דקות',
            completed: true,
            dueDate: '2025-08-05',
          },
          {
            id: '2-3',
            title: 'פעילות שבועית - 2 פעמים',
            completed: false,
            dueDate: '2025-08-20',
          },
          {
            id: '2-4',
            title: 'הגעה ל-3 פעמים בשבוע',
            completed: false,
            dueDate: '2025-09-01',
          },
          {
            id: '2-5',
            title: 'שמירה על קביעות חודש שלם',
            completed: false,
            dueDate: '2025-10-01',
          },
        ]),
        createdAt: new Date('2025-08-05'),
      },
      {
        userId: 'demo-user',
        title: 'שיפור איכות השינה',
        description: 'להגיע ל-7-8 שעות שינה איכותית בלילה ולשפר את שגרת השינה',
        category: 'mental-health',
        targetDate: new Date('2025-09-15'),
        progress: 80,
        status: 'in-progress',
        priority: 'high',
        milestones: JSON.stringify([
          {
            id: '3-1',
            title: 'הגדרת זמן שינה קבוע (23:00)',
            completed: true,
            dueDate: '2025-07-25',
          },
          {
            id: '3-2',
            title: 'יצירת שגרת ערב מרגיעה',
            completed: true,
            dueDate: '2025-07-30',
          },
          {
            id: '3-3',
            title: 'הפחתת מסכים שעה לפני שינה',
            completed: true,
            dueDate: '2025-08-05',
          },
          {
            id: '3-4',
            title: 'הגעה ל-7 שעות שינה קבוע',
            completed: true,
            dueDate: '2025-08-10',
          },
          {
            id: '3-5',
            title: 'שמירה על איכות שינה חודש שלם',
            completed: false,
            dueDate: '2025-09-10',
          },
        ]),
        createdAt: new Date('2025-07-20'),
      },
      {
        userId: 'demo-user',
        title: 'בניית קשרים חברתיים',
        description:
          'להרחיב את המעגל החברתי ולחזק קשרים קיימים לשיפור הרווחה הנפשית',
        category: 'social',
        targetDate: new Date('2025-11-01'),
        progress: 25,
        status: 'in-progress',
        priority: 'medium',
        milestones: JSON.stringify([
          {
            id: '4-1',
            title: 'יצירת קשר עם חבר ישן',
            completed: true,
            dueDate: '2025-08-10',
          },
          {
            id: '4-2',
            title: 'הצטרפות לקבוצת תחביב',
            completed: false,
            dueDate: '2025-08-25',
          },
          {
            id: '4-3',
            title: 'ארגון מפגש חברתי',
            completed: false,
            dueDate: '2025-09-15',
          },
          {
            id: '4-4',
            title: 'השתתפות באירוע קהילתי',
            completed: false,
            dueDate: '2025-10-15',
          },
        ]),
        createdAt: new Date('2025-08-08'),
      },
      {
        userId: 'demo-user',
        title: 'למידת כישור חדש',
        description:
          'ללמוד לנגן בגיטרה כדי לשפר את הביטוי העצמי ולהוסיף פעילות מהנה לשגרה',
        category: 'personal',
        targetDate: new Date('2025-12-31'),
        progress: 15,
        status: 'in-progress',
        priority: 'low',
        milestones: JSON.stringify([
          {
            id: '5-1',
            title: 'רכישת גיטרה',
            completed: true,
            dueDate: '2025-08-12',
          },
          {
            id: '5-2',
            title: 'מציאת מורה או קורס אונליין',
            completed: false,
            dueDate: '2025-08-20',
          },
          {
            id: '5-3',
            title: 'למידת 3 אקורדים בסיסיים',
            completed: false,
            dueDate: '2025-09-15',
          },
          {
            id: '5-4',
            title: 'נגינת שיר ראשון',
            completed: false,
            dueDate: '2025-11-01',
          },
          {
            id: '5-5',
            title: 'הופעה בפני חברים',
            completed: false,
            dueDate: '2025-12-15',
          },
        ]),
        createdAt: new Date('2025-08-10'),
      },
      {
        userId: 'demo-user',
        title: 'ארגון סביבת העבודה',
        description:
          'לשפר את הפרודוקטיביות ולהפחית מתח על ידי ארגון וייעול סביבת העבודה',
        category: 'professional',
        targetDate: new Date('2025-09-01'),
        progress: 90,
        status: 'in-progress',
        priority: 'medium',
        milestones: JSON.stringify([
          {
            id: '6-1',
            title: 'ניקוי והסרת פריטים מיותרים',
            completed: true,
            dueDate: '2025-08-05',
          },
          {
            id: '6-2',
            title: 'ארגון מסמכים דיגיטליים',
            completed: true,
            dueDate: '2025-08-08',
          },
          {
            id: '6-3',
            title: 'הגדרת מערכת ארגון יומית',
            completed: true,
            dueDate: '2025-08-12',
          },
          {
            id: '6-4',
            title: 'שמירה על הארגון שבוע שלם',
            completed: false,
            dueDate: '2025-08-25',
          },
        ]),
        createdAt: new Date('2025-08-02'),
      },
      {
        userId: 'demo-user',
        title: 'הפחתת זמן מסכים',
        description:
          'להפחית את זמן השימוש במכשירים דיגיטליים לשיפור הריכוז ואיכות החיים',
        category: 'mental-health',
        targetDate: new Date('2025-10-01'),
        progress: 0,
        status: 'not-started',
        priority: 'medium',
        milestones: JSON.stringify([
          {
            id: '7-1',
            title: 'מדידת זמן מסכים נוכחי',
            completed: false,
            dueDate: '2025-08-20',
          },
          {
            id: '7-2',
            title: 'הגדרת מגבלות זמן באפליקציות',
            completed: false,
            dueDate: '2025-08-25',
          },
          {
            id: '7-3',
            title: 'הפחתה של 25% מהזמן הנוכחי',
            completed: false,
            dueDate: '2025-09-10',
          },
          {
            id: '7-4',
            title: 'הפחתה של 50% מהזמן הנוכחי',
            completed: false,
            dueDate: '2025-09-25',
          },
        ]),
        createdAt: new Date('2025-08-15'),
      },
      {
        userId: 'demo-user',
        title: 'קריאת ספרים לפיתוח אישי',
        description: 'לקרוא ספר אחד בחודש בנושא פיתוח אישי או בריאות נפשית',
        category: 'personal',
        targetDate: new Date('2025-12-31'),
        progress: 100,
        status: 'completed',
        priority: 'low',
        milestones: JSON.stringify([
          {
            id: '8-1',
            title: 'בחירת ספר ראשון',
            completed: true,
            dueDate: '2025-07-15',
          },
          {
            id: '8-2',
            title: 'קריאת הספר הראשון',
            completed: true,
            dueDate: '2025-08-01',
          },
          {
            id: '8-3',
            title: 'בחירת ספר שני',
            completed: true,
            dueDate: '2025-08-05',
          },
          {
            id: '8-4',
            title: 'קריאת הספר השני',
            completed: true,
            dueDate: '2025-08-15',
          },
        ]),
        completedAt: new Date('2025-08-15'),
        createdAt: new Date('2025-07-10'),
      },
    ];

    // Insert goals data
    for (const goalData of goalsData) {
      await prisma.goal.create({
        data: goalData,
      });
    }

    console.log(`✅ Successfully seeded ${goalsData.length} goals`);
    console.log('🎯 Goals data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding goals data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedGoalsData().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}

module.exports = { seedGoalsData };
